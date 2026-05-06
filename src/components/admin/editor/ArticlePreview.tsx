import type { Article, ArticleRatings } from "@/lib/definitions";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn, formatPriceMx } from "@/lib/utils";
import { parseArticleMarkdown, splitArticleSections } from "@/lib/article-markdown";
import { articleProsConsForLang, articleVersionsForLang } from "@/lib/article-locale";
import { ThumbsUp, ThumbsDown, PlayCircle } from "lucide-react";

type Props = { article: Article; lang?: "es" | "en" };

export function ArticlePreview({ article, lang = "es" }: Props) {
  const isEs = lang === "es";
  const title = isEs ? article.titleEs : article.titleEn;
  const excerpt = isEs ? article.excerptEs : article.excerptEn;
  const content = isEs ? article.contentEs : article.contentEn;
  const locale = isEs ? "es-MX" : "en-US";
  const sections = splitArticleSections(content);
  const routeLang = lang === "es" ? "es-MX" : "en-US";
  const versionsForPreview = articleVersionsForLang(article, routeLang);
  const prosConsForPreview = articleProsConsForLang(article, routeLang);

  return (
    <article className="max-w-2xl mx-auto flex flex-col gap-12 lg:gap-14 pb-16">

      {/* ── Header ── */}
      <header className="space-y-4 pb-10 border-b border-border/60">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="capitalize text-xs">{article.category}</Badge>
          <span className="text-xs text-muted-foreground">
            {new Date(article.updatedAt).toLocaleDateString(locale, { dateStyle: "long" })}
          </span>
        </div>
        <h1 className="text-3xl font-bold leading-tight tracking-tight">{title}</h1>
        {excerpt && <p className="text-lg text-muted-foreground leading-relaxed">{excerpt}</p>}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">#{tag}</Badge>
            ))}
          </div>
        )}
      </header>

      {/* ── Cover image ── */}
      {article.coverImage && (
        <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={article.coverImage} alt={title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* ── Ad: Top ── */}
      <AdSlot position="top" label="728×90" />

      {/* ── Ratings summary ── */}
      {article.ratings && Object.keys(article.ratings).length > 0 && (
        <RatingsBlock ratings={article.ratings} lang={lang} />
      )}

      {/* ── Article body with mid-ad ── */}
      <div className="flex flex-col gap-0">
        {sections.map((section, i) => (
          <section
            key={i}
            className={cn(
              "scroll-mt-28",
              i > 0 && "mt-12 pt-12 border-t border-border/70"
            )}
          >
            <div
              className="article-prose prose prose-sm md:prose-base dark:prose-invert max-w-none
                prose-headings:font-bold prose-headings:tracking-tight
                prose-h2:text-xl prose-h2:mt-0 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-border/50
                prose-h3:text-lg prose-h3:mt-10 prose-h3:mb-4
                prose-p:my-5 prose-p:leading-[1.8] prose-p:text-foreground/90
                prose-strong:text-foreground prose-a:text-primary
                prose-img:rounded-xl prose-img:shadow-sm prose-img:my-8
                prose-ul:my-6 prose-li:my-1"
              dangerouslySetInnerHTML={{ __html: parseArticleMarkdown(section) }}
            />
            {i === Math.floor(sections.length / 3) && sections.length > 2 && (
              <div className="my-10"><AdSlot position="mid" label="336×280" /></div>
            )}
          </section>
        ))}
      </div>

      {/* ── Specs ── */}
      {article.specs && Object.values(article.specs).some(Boolean) && (
        <SpecsBlock specs={article.specs} lang={lang} />
      )}

      {/* ── Versions & prices ── */}
      {versionsForPreview && versionsForPreview.length > 0 && (
        <VersionsBlock versions={versionsForPreview} lang={lang} />
      )}

      {/* ── Gallery ── */}
      {article.gallery && article.gallery.length > 0 && (
        <GalleryBlock images={article.gallery} title={title} lang={lang} />
      )}

      {/* ── Video ── */}
      {article.videoUrl && <VideoBlock url={article.videoUrl} lang={lang} />}

      {/* ── Pros / Cons ── */}
      {prosConsForPreview && (
        <ProsConsBlock prosCons={prosConsForPreview} lang={lang} />
      )}

      <Separator className="my-2" />

      {/* ── Ad: Bottom ── */}
      <AdSlot position="bottom" label="728×90" />

      {/* ── Author ── */}
      <footer className="flex items-center gap-3 pt-6 mt-2 border-t border-border/60">
        <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold">B</div>
        <div>
          <p className="text-sm font-medium">Brandon Garcia</p>
          <p className="text-xs text-muted-foreground">carsbybran.com</p>
        </div>
      </footer>

      <AdSlot position="sidebar" label="300×250" />
    </article>
  );
}

// ── Block components ─────────────────────────────────────────────────────────

function RatingsBlock({ ratings, lang }: { ratings: Partial<ArticleRatings>; lang: "es" | "en" }) {
  const labels: Record<keyof ArticleRatings, { es: string; en: string }> = {
    performance: { es: "Desempeño", en: "Performance" },
    comfort:     { es: "Confort",   en: "Comfort" },
    technology:  { es: "Tecnología",en: "Technology" },
    value:       { es: "Precio/Valor", en: "Value" },
    design:      { es: "Diseño",    en: "Design" },
    safety:      { es: "Seguridad", en: "Safety" },
  };
  const entries = Object.entries(ratings) as [keyof ArticleRatings, number][];
  const avg = (entries.reduce((s, [, v]) => s + v, 0) / entries.length).toFixed(1);

  function barColor(n: number) {
    if (n >= 8) return "bg-emerald-500";
    if (n >= 6) return "bg-amber-400";
    return "bg-red-500";
  }

  return (
    <section className="rounded-xl border bg-card p-6 md:p-7 space-y-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="text-5xl font-bold tabular-nums text-primary">{avg}</div>
        <div>
          <p className="font-semibold">{lang === "es" ? "Puntuación general" : "Overall Score"}</p>
          <p className="text-xs text-muted-foreground">{lang === "es" ? "Sobre 10 puntos" : "Out of 10"}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {entries.map(([key, val]) => (
          <div key={key} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{labels[key][lang]}</span>
              <span className="font-semibold tabular-nums">{val}</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className={cn("h-full rounded-full", barColor(val))} style={{ width: `${val * 10}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SpecsBlock({ specs, lang }: { specs: Article["specs"]; lang: "es" | "en" }) {
  if (!specs) return null;
  const labels: Record<string, { es: string; en: string }> = {
    engine:         { es: "Motor",            en: "Engine" },
    displacement:   { es: "Cilindrada",       en: "Displacement" },
    power:          { es: "Potencia",         en: "Power" },
    torque:         { es: "Torque",           en: "Torque" },
    transmission:   { es: "Transmisión",      en: "Transmission" },
    drivetrain:     { es: "Tracción",         en: "Drivetrain" },
    zeroToHundred:  { es: "0–100 km/h",       en: "0–62 mph" },
    topSpeed:       { es: "Vel. máxima",      en: "Top speed" },
    fuelConsumption:{ es: "Consumo",          en: "Fuel economy" },
    fuelType:       { es: "Combustible",      en: "Fuel type" },
    length:         { es: "Largo",            en: "Length" },
    width:          { es: "Ancho",            en: "Width" },
    height:         { es: "Alto",             en: "Height" },
    wheelbase:      { es: "Entre ejes",       en: "Wheelbase" },
    weight:         { es: "Peso",             en: "Weight" },
    trunkCapacity:  { es: "Cajuela",          en: "Trunk" },
    safetyRating:   { es: "Seguridad",        en: "Safety rating" },
    warranty:       { es: "Garantía",         en: "Warranty" },
    infotainment:   { es: "Infotainment",     en: "Infotainment" },
    driverAssist:   { es: "Asistencias",      en: "Driver assist" },
  };
  const entries = Object.entries(specs).filter(([, v]) => v) as [string, string][];

  return (
    <section className="rounded-xl border bg-card overflow-hidden shadow-sm">
      <div className="px-5 py-3.5 border-b bg-muted/50">
        <h2 className="font-semibold text-sm md:text-base tracking-tight">{lang === "es" ? "🔧 Ficha técnica" : "🔧 Specifications"}</h2>
      </div>
      <div className="divide-y">
        {entries.map(([key, val]) => (
          <div key={key} className="flex items-center px-5 py-2.5 text-sm hover:bg-muted/30 transition-colors">
            <span className="text-muted-foreground w-40 shrink-0">
              {labels[key]?.[lang] ?? key}
            </span>
            <span className="font-medium">{val}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function VersionsBlock({ versions, lang }: { versions: NonNullable<Article["versions"]>; lang: "es" | "en" }) {
  const t = lang === "es"
    ? { title: "📊 Versiones y precios", version: "Versión", from: "Desde", to: "Hasta", highlights: "Equipamiento" }
    : { title: "📊 Versions & pricing", version: "Version", from: "From", to: "To", highlights: "Highlights" };

  return (
    <section className="rounded-xl border bg-card overflow-hidden shadow-sm">
      <div className="px-5 py-3.5 border-b bg-muted/50">
        <h2 className="font-semibold text-sm md:text-base tracking-tight">{t.title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/30">
            <tr>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{t.version}</th>
              <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">{t.from}</th>
              <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">{t.to}</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{t.highlights}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {versions.map((v, i) => (
              <tr key={i} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 font-semibold">{v.name}</td>
                <td className="px-4 py-3 text-right tabular-nums text-emerald-600 dark:text-emerald-400 font-medium">
                  {v.priceMin ? `$${formatPriceMx(v.priceMin)}` : "—"}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-emerald-600 dark:text-emerald-400 font-medium">
                  {v.priceMax ? `$${formatPriceMx(v.priceMax)}` : "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{v.highlights}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ProsConsBlock({ prosCons, lang }: { prosCons: NonNullable<Article["prosCons"]>; lang: "es" | "en" }) {
  const t = lang === "es"
    ? { pros: "✅ Ventajas", cons: "❌ Desventajas" }
    : { pros: "✅ Pros", cons: "❌ Cons" };

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 pt-2">
      {(["pros", "cons"] as const).map((type) => {
        const isPro = type === "pros";
        const items = prosCons[type].filter((i) => i.text);
        if (!items.length) return null;
        return (
          <div key={type} className={cn("rounded-xl border p-5 md:p-6 space-y-3 shadow-sm", isPro ? "border-emerald-500/30 bg-emerald-500/5" : "border-red-500/30 bg-red-500/5")}>
            <h3 className={cn("font-semibold text-sm flex items-center gap-2", isPro ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
              {isPro ? <ThumbsUp className="size-4" /> : <ThumbsDown className="size-4" />}
              {t[type]}
            </h3>
            <ul className="space-y-1.5">
              {items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className={cn("mt-1.5 size-1.5 rounded-full shrink-0", isPro ? "bg-emerald-500" : "bg-red-500")} />
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </section>
  );
}

function GalleryBlock({ images, title, lang }: { images: NonNullable<Article["gallery"]>; title: string; lang: "es" | "en" }) {
  const galleryTitle = lang === "es" ? "Galería" : "Gallery";
  return (
    <section className="rounded-xl border bg-card overflow-hidden shadow-sm">
      <div className="px-5 py-3.5 border-b bg-muted/50">
        <h2 className="font-semibold text-sm md:text-base tracking-tight">🖼️ {galleryTitle}</h2>
      </div>
      <div className="p-4 md:p-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((img, i) => (
          <figure key={i} className="rounded-lg overflow-hidden bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt={img.caption || `${title} ${i + 1}`} className="w-full aspect-video object-cover hover:scale-105 transition-transform duration-300" />
            {img.caption && (
              <figcaption className="px-2 py-1 text-xs text-muted-foreground">{img.caption}</figcaption>
            )}
          </figure>
        ))}
      </div>
      </div>
    </section>
  );
}

function VideoBlock({ url, lang }: { url: string; lang: "es" | "en" }) {
  const id = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)?.[1];
  if (!id) return null;
  const label = lang === "es" ? "Video" : "Video";
  return (
    <section className="rounded-xl border bg-card overflow-hidden shadow-sm">
      <div className="px-5 py-3.5 border-b bg-muted/50 flex items-center gap-2">
        <PlayCircle className="size-4 text-red-500 shrink-0" />
        <h2 className="font-semibold text-sm md:text-base tracking-tight">{label}</h2>
      </div>
      <div className="p-3 md:p-4">
      <div className="rounded-lg overflow-hidden border aspect-video bg-muted">
        <iframe
          src={`https://www.youtube.com/embed/${id}`}
          title="Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
      </div>
    </section>
  );
}

function AdSlot({ position, label }: { position: "top" | "mid" | "bottom" | "sidebar"; label: string }) {
  const sizes = { top: "h-20 w-full", mid: "h-36 w-full max-w-sm mx-auto", bottom: "h-20 w-full", sidebar: "h-64 w-full max-w-xs mx-auto" };
  return (
    <div className={cn("border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-1 bg-muted/30 text-muted-foreground", sizes[position])}>
      <span className="text-[10px] uppercase tracking-widest font-medium opacity-60">Google AdSense</span>
      <span className="text-xs font-mono opacity-50">{label}</span>
    </div>
  );
}

