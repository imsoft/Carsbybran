"use server";

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

export async function translateEsToEn(input: {
  titleEs: string;
  excerptEs: string;
  contentEs: string;
}): Promise<
  | { ok: true; titleEn: string; excerptEn: string; contentEn: string }
  | { ok: false; error: string }
> {
  await verifySession();

  const title = input.titleEs.trim();
  const excerpt = input.excerptEs.trim();
  const body = input.contentEs.trim();

  if (!title && !excerpt && !body) {
    return { ok: false, error: "Escribe primero título, resumen o contenido en español." };
  }

  const titleR = await translateSegments([title || " "], "es", "en");
  if (!titleR.ok) return titleR;

  const excerptR = await translateSegments([excerpt || " "], "es", "en");
  if (!excerptR.ok) return excerptR;

  const parts = splitLongText(body);
  const translatedParts: string[] = [];

  for (const part of parts) {
    const r = await translateSegments([part || " "], "es", "en");
    if (!r.ok) return r;
    translatedParts.push(r.texts[0] ?? "");
  }

  const contentEn = translatedParts.join("\n\n").trim();

  let excerptEn = (excerptR.texts[0] ?? "").trim();
  if (excerptEn.length > 300) excerptEn = excerptEn.slice(0, 297) + "…";

  return {
    ok: true,
    titleEn: (titleR.texts[0] ?? "").trim(),
    excerptEn,
    contentEn,
  };
}

export async function translateEnToEs(input: {
  titleEn: string;
  excerptEn: string;
  contentEn: string;
}): Promise<
  | { ok: true; titleEs: string; excerptEs: string; contentEs: string }
  | { ok: false; error: string }
> {
  await verifySession();

  const title = input.titleEn.trim();
  const excerpt = input.excerptEn.trim();
  const body = input.contentEn.trim();

  if (!title && !excerpt && !body) {
    return { ok: false, error: "Escribe primero título, resumen o contenido en inglés." };
  }

  const titleR = await translateSegments([title || " "], "en", "es");
  if (!titleR.ok) return titleR;

  const excerptR = await translateSegments([excerpt || " "], "en", "es");
  if (!excerptR.ok) return excerptR;

  const parts = splitLongText(body);
  const translatedParts: string[] = [];

  for (const part of parts) {
    const r = await translateSegments([part || " "], "en", "es");
    if (!r.ok) return r;
    translatedParts.push(r.texts[0] ?? "");
  }

  const contentEs = translatedParts.join("\n\n").trim();

  let excerptEs = (excerptR.texts[0] ?? "").trim();
  if (excerptEs.length > 300) excerptEs = excerptEs.slice(0, 297) + "…";

  return {
    ok: true,
    titleEs: (titleR.texts[0] ?? "").trim(),
    excerptEs,
    contentEs,
  };
}
