"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, CircleCheck, CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Article, ArticleRatings, ArticleSpecs } from "@/lib/definitions";
import { Button } from "@/components/ui/button";

type Props = {
  titleEs: string;
  excerptEs: string;
  contentMd: string;
  article?: Article;
};

function specsHasMinimum(specs?: Partial<ArticleSpecs>): boolean {
  if (!specs) return false;
  const keys: (keyof ArticleSpecs)[] = ["engine", "power", "transmission"];
  return keys.some((k) => typeof specs[k] === "string" && specs[k]!.trim().length > 0);
}

function ratingsHasMinimum(ratings?: Partial<ArticleRatings>): boolean {
  if (!ratings) return false;
  const vals = Object.values(ratings).filter((v) => typeof v === "number");
  return vals.length >= 3;
}

function countH2(md: string): number {
  const m = md.match(/^## .+$/gm);
  return m?.length ?? 0;
}

function hasVerdictSection(md: string): boolean {
  const lower = md.toLowerCase();
  return (
    /^##\s*(veredicto|conclusión|conclusion)/im.test(md) ||
    lower.includes("## veredicto") ||
    lower.includes("## conclusión") ||
    lower.includes("## conclusion")
  );
}

export function SeoAioChecklist({ titleEs, excerptEs, contentMd, article }: Props) {
  const [open, setOpen] = useState(true);

  const items = useMemo(() => {
    const titleOk = titleEs.trim().length >= 12;
    const excerptOk =
      excerptEs.trim().length >= 50 && excerptEs.trim().length <= 300;
    const bodyOk = contentMd.trim().length >= 400;
    const sectionsOk = countH2(contentMd) >= 2;
    const verdictOk = hasVerdictSection(contentMd);
    const specsOk = specsHasMinimum(article?.specs);
    const ratingsOk = ratingsHasMinimum(article?.ratings);

    return [
      {
        ok: titleOk,
        label: "Título claro (≥12 caracteres) — será el H1 público",
      },
      {
        ok: excerptOk,
        label: "Resumen (50–300 caracteres) para meta description y snippets",
      },
      {
        ok: bodyOk,
        label: "Cuerpo sustancial (≥400 caracteres) para SEO y citas en IA",
      },
      {
        ok: sectionsOk,
        label: "Al menos 2 secciones `##` (Introducción, Conducción, etc.)",
      },
      {
        ok: verdictOk,
        label: "Bloque final `## Veredicto` o `## Conclusión` (mejor para IA)",
      },
      {
        ok: specsOk,
        label: "Ficha técnica con motor / potencia / transmisión (schema Product)",
      },
      {
        ok: ratingsOk,
        label: "Calificaciones (≥3 ejes) para Review en JSON-LD",
      },
    ];
  }, [titleEs, excerptEs, contentMd, article?.specs, article?.ratings]);

  const done = items.filter((i) => i.ok).length;
  const total = items.length;

  return (
    <div className="rounded-xl border border-border bg-muted/30 overflow-hidden">
      <Button
        type="button"
        variant="ghost"
        className="flex w-full items-center justify-between rounded-none px-4 py-3 h-auto hover:bg-muted/60"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-foreground">
          SEO & contenido citável (Google + IA)
        </span>
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          {done}/{total}
          {open ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
        </span>
      </Button>
      {open && (
        <div className="border-t border-border px-4 py-3 space-y-2">
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.label} className="flex gap-2 text-sm leading-snug">
                {item.ok ? (
                  <CircleCheck className="size-4 shrink-0 text-emerald-600 mt-0.5" aria-hidden />
                ) : (
                  <CircleAlert className="size-4 shrink-0 text-amber-600 mt-0.5" aria-hidden />
                )}
                <span className={cn(!item.ok && "text-muted-foreground")}>{item.label}</span>
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-muted-foreground pt-2 border-t border-border">
            Tras publicar: usa{" "}
            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Google Search Console
            </a>{" "}
            para cobertura e indexación.
          </p>
        </div>
      )}
    </div>
  );
}
