"use server";

import type { ArticleProsCons, ArticleVersion } from "@/lib/definitions";
import { verifySession } from "@/lib/session";

const TRANSLATE_URL = "https://translation.googleapis.com/language/translate/v2";

const MAX_CHUNK = 4500;

type BatchOk = { ok: true; texts: string[] };
type BatchErr = { ok: false; error: string };

async function translateSegments(
  segments: string[],
  source: string,
  target: string
): Promise<BatchOk | BatchErr> {
  const trimmed = segments.map((s) => s.replace(/\r\n/g, "\n"));
  const nonEmpty = trimmed.some((s) => s.trim().length > 0);
  if (!nonEmpty) return { ok: true, texts: trimmed };

  const key = process.env.GOOGLE_TRANSLATE_API_KEY?.trim();
  if (!key) {
    return {
      ok: false,
      error:
        "Falta GOOGLE_TRANSLATE_API_KEY en el servidor (Google Cloud → Translation API → credencial).",
    };
  }

  const res = await fetch(`${TRANSLATE_URL}?key=${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      q: trimmed.map((s) => (s.trim() === "" ? " " : s)),
      source,
      target,
      format: "text",
    }),
  });

  const raw = await res.text();
  if (!res.ok) {
    return {
      ok: false,
      error: `Google Translate (${res.status}): ${raw.slice(0, 280)}`,
    };
  }

  let data: { data?: { translations?: { translatedText: string }[] }; error?: { message: string } };
  try {
    data = JSON.parse(raw) as typeof data;
  } catch {
    return { ok: false, error: "Respuesta inválida del traductor." };
  }

  if (data.error?.message) return { ok: false, error: data.error.message };

  const out = data.data?.translations?.map((t) => t.translatedText ?? "") ?? [];
  if (out.length !== trimmed.length) {
    return { ok: false, error: "Respuesta incompleta del traductor." };
  }

  return { ok: true, texts: out };
}

/** Parte el markdown en trozos bajo el límite práctico de la API */
function splitLongText(text: string): string[] {
  const t = text.replace(/\r\n/g, "\n").trimEnd();
  if (t.length <= MAX_CHUNK) return t ? [t] : [""];

  const paras = t.split(/\n\n+/);
  const chunks: string[] = [];
  let buf = "";

  const flush = () => {
    if (buf.trim()) chunks.push(buf);
    buf = "";
  };

  for (const p of paras) {
    const sep = buf ? "\n\n" : "";
    const candidate = buf + sep + p;
    if (candidate.length <= MAX_CHUNK) {
      buf = candidate;
      continue;
    }
    flush();
    if (p.length <= MAX_CHUNK) {
      buf = p;
    } else {
      let rest = p;
      while (rest.length > MAX_CHUNK) {
        chunks.push(rest.slice(0, MAX_CHUNK));
        rest = rest.slice(MAX_CHUNK);
      }
      buf = rest;
    }
  }
  flush();
  if (buf.trim()) chunks.push(buf);

  return chunks.length ? chunks : [""];
}

async function translateVersionsBetween(
  versions: ArticleVersion[],
  source: "es" | "en",
  target: "en" | "es"
): Promise<{ ok: true; versions: ArticleVersion[] } | BatchErr> {
  if (versions.length === 0) return { ok: true, versions: [] };
  const names = versions.map((v) => (v.name.trim() ? v.name : " "));
  const highlights = versions.map((v) => (v.highlights.trim() ? v.highlights : " "));
  const nr = await translateSegments(names, source, target);
  if (!nr.ok) return nr;
  const hr = await translateSegments(highlights, source, target);
  if (!hr.ok) return hr;
  return {
    ok: true,
    versions: versions.map((v, i) => ({
      ...v,
      name: (nr.texts[i] ?? "").trim(),
      highlights: (hr.texts[i] ?? "").trim(),
    })),
  };
}

async function translateProsConsBetween(
  pc: ArticleProsCons,
  source: "es" | "en",
  target: "en" | "es"
): Promise<{ ok: true; prosCons: ArticleProsCons } | BatchErr> {
  const prosTexts = pc.pros.map((p) => (p.text.trim() ? p.text : " "));
  const consTexts = pc.cons.map((c) => (c.text.trim() ? c.text : " "));
  const pr = await translateSegments(prosTexts, source, target);
  if (!pr.ok) return pr;
  const cr = await translateSegments(consTexts, source, target);
  if (!cr.ok) return cr;
  return {
    ok: true,
    prosCons: {
      pros: pr.texts.map((t) => ({ text: (t ?? "").trim() })),
      cons: cr.texts.map((t) => ({ text: (t ?? "").trim() })),
    },
  };
}

function hasProsConsText(pc?: ArticleProsCons): boolean {
  if (!pc) return false;
  return [...pc.pros, ...pc.cons].some((x) => x.text.trim().length > 0);
}

function hasVersionsText(v?: ArticleVersion[]): boolean {
  return !!v?.some((x) => x.name.trim() || x.highlights.trim());
}

export async function translateVersionsEsToEn(
  versions: ArticleVersion[]
): Promise<{ ok: true; versions: ArticleVersion[] } | { ok: false; error: string }> {
  await verifySession();
  if (!hasVersionsText(versions)) {
    return { ok: false, error: "Rellena al menos nombre o equipamiento en una versión." };
  }
  return translateVersionsBetween(versions, "es", "en");
}

export async function translateVersionsEnToEs(
  versions: ArticleVersion[]
): Promise<{ ok: true; versions: ArticleVersion[] } | { ok: false; error: string }> {
  await verifySession();
  if (!hasVersionsText(versions)) {
    return {
      ok: false,
      error: "Rellena al menos nombre o equipamiento en una versión (en inglés).",
    };
  }
  return translateVersionsBetween(versions, "en", "es");
}

export async function translateProsConsEsToEn(
  pc: ArticleProsCons
): Promise<{ ok: true; prosCons: ArticleProsCons } | { ok: false; error: string }> {
  await verifySession();
  if (!hasProsConsText(pc)) {
    return { ok: false, error: "Añade al menos una ventaja o desventaja en español." };
  }
  return translateProsConsBetween(pc, "es", "en");
}

export async function translateProsConsEnToEs(
  pc: ArticleProsCons
): Promise<{ ok: true; prosCons: ArticleProsCons } | { ok: false; error: string }> {
  await verifySession();
  if (!hasProsConsText(pc)) {
    return {
      ok: false,
      error: "Añade al menos una ventaja o desventaja en inglés.",
    };
  }
  return translateProsConsBetween(pc, "en", "es");
}

export async function translateEsToEn(input: {
  titleEs: string;
  excerptEs: string;
  contentEs: string;
  versions?: ArticleVersion[];
  prosCons?: ArticleProsCons;
}): Promise<
  | {
      ok: true;
      titleEn: string;
      excerptEn: string;
      contentEn: string;
      versionsEn?: ArticleVersion[];
      prosConsEn?: ArticleProsCons;
    }
  | { ok: false; error: string }
> {
  await verifySession();

  const title = input.titleEs.trim();
  const excerpt = input.excerptEs.trim();
  const body = input.contentEs.trim();

  const hasSomething =
    !!title ||
    !!excerpt ||
    !!body ||
    hasVersionsText(input.versions) ||
    hasProsConsText(input.prosCons);

  if (!hasSomething) {
    return {
      ok: false,
      error:
        "Escribe algo en español: título, resumen, contenido, versiones o pros/contras.",
    };
  }

  let titleEn = "";
  if (title) {
    const titleR = await translateSegments([title], "es", "en");
    if (!titleR.ok) return titleR;
    titleEn = (titleR.texts[0] ?? "").trim();
  }

  let excerptEn = "";
  if (excerpt) {
    const excerptR = await translateSegments([excerpt], "es", "en");
    if (!excerptR.ok) return excerptR;
    excerptEn = (excerptR.texts[0] ?? "").trim();
    if (excerptEn.length > 300) excerptEn = excerptEn.slice(0, 297) + "…";
  }

  let contentEn = "";
  if (body) {
    const parts = splitLongText(body);
    const translatedParts: string[] = [];
    for (const part of parts) {
      const r = await translateSegments([part || " "], "es", "en");
      if (!r.ok) return r;
      translatedParts.push(r.texts[0] ?? "");
    }
    contentEn = translatedParts.join("\n\n").trim();
  }

  let versionsEn: ArticleVersion[] | undefined;
  if (input.versions?.length && hasVersionsText(input.versions)) {
    const vr = await translateVersionsBetween(input.versions, "es", "en");
    if (!vr.ok) return vr;
    versionsEn = vr.versions;
  }

  let prosConsEn: ArticleProsCons | undefined;
  if (input.prosCons && hasProsConsText(input.prosCons)) {
    const pr = await translateProsConsBetween(input.prosCons, "es", "en");
    if (!pr.ok) return pr;
    prosConsEn = pr.prosCons;
  }

  return {
    ok: true,
    titleEn,
    excerptEn,
    contentEn,
    ...(versionsEn !== undefined ? { versionsEn } : {}),
    ...(prosConsEn !== undefined ? { prosConsEn } : {}),
  };
}

export async function translateEnToEs(input: {
  titleEn: string;
  excerptEn: string;
  contentEn: string;
  versions?: ArticleVersion[];
  prosCons?: ArticleProsCons;
}): Promise<
  | {
      ok: true;
      titleEs: string;
      excerptEs: string;
      contentEs: string;
      versionsEs?: ArticleVersion[];
      prosConsEs?: ArticleProsCons;
    }
  | { ok: false; error: string }
> {
  await verifySession();

  const title = input.titleEn.trim();
  const excerpt = input.excerptEn.trim();
  const body = input.contentEn.trim();

  const hasSomething =
    !!title ||
    !!excerpt ||
    !!body ||
    hasVersionsText(input.versions) ||
    hasProsConsText(input.prosCons);

  if (!hasSomething) {
    return {
      ok: false,
      error:
        "Write something in English: title, excerpt, body, versions, or pros/cons.",
    };
  }

  let titleEs = "";
  if (title) {
    const titleR = await translateSegments([title], "en", "es");
    if (!titleR.ok) return titleR;
    titleEs = (titleR.texts[0] ?? "").trim();
  }

  let excerptEs = "";
  if (excerpt) {
    const excerptR = await translateSegments([excerpt], "en", "es");
    if (!excerptR.ok) return excerptR;
    excerptEs = (excerptR.texts[0] ?? "").trim();
    if (excerptEs.length > 300) excerptEs = excerptEs.slice(0, 297) + "…";
  }

  let contentEs = "";
  if (body) {
    const parts = splitLongText(body);
    const translatedParts: string[] = [];
    for (const part of parts) {
      const r = await translateSegments([part || " "], "en", "es");
      if (!r.ok) return r;
      translatedParts.push(r.texts[0] ?? "");
    }
    contentEs = translatedParts.join("\n\n").trim();
  }

  let versionsEs: ArticleVersion[] | undefined;
  if (input.versions?.length && hasVersionsText(input.versions)) {
    const vr = await translateVersionsBetween(input.versions, "en", "es");
    if (!vr.ok) return vr;
    versionsEs = vr.versions;
  }

  let prosConsEs: ArticleProsCons | undefined;
  if (input.prosCons && hasProsConsText(input.prosCons)) {
    const pr = await translateProsConsBetween(input.prosCons, "en", "es");
    if (!pr.ok) return pr;
    prosConsEs = pr.prosCons;
  }

  return {
    ok: true,
    titleEs,
    excerptEs,
    contentEs,
    ...(versionsEs !== undefined ? { versionsEs } : {}),
    ...(prosConsEs !== undefined ? { prosConsEs } : {}),
  };
}
