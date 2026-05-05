import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, Tag, PlayCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import { getDictionary, hasLocale } from "../../dictionaries";
import { getArticleBySlug, getRelatedArticles } from "@/lib/mock-articles";
import { getSession } from "@/lib/session";
import { isFavorite, getUserReviewForArticle } from "@/lib/mock-user-data";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FavoriteButton } from "@/components/reviews/FavoriteButton";
import { UserReviewSection } from "@/components/reviews/UserReviewSection";
import { AdSlot } from "@/components/ads/AdSlot";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Article, ArticleRatings } from "@/lib/definitions";
import { cn } from "@/lib/utils";

type Props = PageProps<"/[lang]/reviews/[slug]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Not found" };
  const isEs = lang === "es-MX";
  return {
    title: isEs ? article.titleEs : article.titleEn,
    description: isEs ? article.excerptEs : article.excerptEn,
    openGraph: {
      title: isEs ? article.titleEs : article.titleEn,
      description: isEs ? article.excerptEs : article.excerptEn,
      images: article.coverImage ? [{ url: article.coverImage }] : [],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const dict = await getDictionary(lang);
  const session = await getSession();
  const isEs = lang === "es-MX";

  const title = isEs ? article.titleEs : article.titleEn;
  const excerpt = isEs ? article.excerptEs : article.excerptEn;
  const content = isEs ? article.contentEs : article.contentEn;
  const locale = isEs ? "es-MX" : "en-US";

  const [favorited, existingReviewRaw, related] = await Promise.all([
    session ? isFavorite(session.userId, article.id) : Promise.resolve(false),
    session ? getUserReviewForArticle(session.userId, article.id) : Promise.resolve(undefined),
    getRelatedArticles(article.id),
  ]);
  const existingReview = existingReviewRaw ?? null;

  return (
    <>
      <Navbar lang={lang} dict={dict.nav} />

      <main className="flex-1">
        {/* ── Hero cover ── */}
        {article.coverImage && (
          <div className="relative w-full aspect-21/9 max-h-[480px] overflow-hidden bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.coverImage}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent" />
          </div>
        )}

        <div className="container mx-auto max-w-7xl px-4 md:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">

            {/* ── Main column ── */}
            <div className="min-w-0 space-y-8">

              {/* Article header */}
              <header className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="capitalize text-xs">
                    {article.category}
                  </Badge>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="size-3" />
                    {new Date(article.updatedAt).toLocaleDateString(locale, { dateStyle: "long" })}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3" />
                    5 {dict.article.minRead}
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight">
                  {title}
                </h1>

                {excerpt && (
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {excerpt}
                  </p>
                )}

                <div className="flex items-center justify-between flex-wrap gap-3">
                  {article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <Tag className="size-3 text-muted-foreground" />
                      {article.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {session ? (
                    <FavoriteButton
                      articleId={article.id}
                      lang={lang}
                      initialFavorited={favorited}
                      labels={{ save: dict.article.save, saved: dict.article.saved }}
                    />
                  ) : (
                    <Link
                      href={`/${lang}/login`}
                      className="text-xs text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
                    >
                      {dict.article.loginToSave}
                    </Link>
                  )}
                </div>
              </header>

              {/* Ad: leaderboard */}
              <div className="flex justify-center">
                <AdSlot format="leaderboard" label={dict.article.advertisement} />
              </div>

              {/* Ratings block */}
              {article.ratings && Object.keys(article.ratings).length > 0 && (
                <RatingsBlock ratings={article.ratings} lang={lang} dict={dict.article} />
              )}

              {/* Article body */}
              <ArticleBody content={content} lang={lang} adLabel={dict.article.advertisement} />

              {/* Specs */}
              {article.specs && Object.values(article.specs).some(Boolean) && (
                <SpecsBlock specs={article.specs} lang={lang} dict={dict.article} />
              )}

              {/* Versions & prices */}
              {article.versions && article.versions.length > 0 && (
                <VersionsBlock versions={article.versions} lang={lang} dict={dict.article} />
              )}

              {/* Gallery */}
              {article.gallery && article.gallery.length > 0 && (
                <GalleryBlock images={article.gallery} title={title} />
              )}

              {/* Video */}
              {article.videoUrl && <VideoBlock url={article.videoUrl} dict={dict.article} />}

              {/* Pros / Cons */}
              {article.prosCons && (
                <ProsConsBlock prosCons={article.prosCons} dict={dict.article} />
              )}

              {/* Ad: bottom */}
              <div className="flex justify-center">
                <AdSlot format="leaderboard" label={dict.article.advertisement} />
              </div>

              {/* Author */}
              <footer className="flex items-center gap-3 pt-2">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold">
                  B
                </div>
                <div>
                  <p className="text-sm font-medium">Brandon Garcia</p>
                  <p className="text-xs text-muted-foreground">carsbybran.com</p>
                </div>
              </footer>

              {/* User review section */}
              <UserReviewSection
                articleId={article.id}
                lang={lang}
                existingReview={existingReview}
                isLoggedIn={!!session}
                dict={dict.article}
              />
            </div>

            {/* ── Sidebar ── */}
            <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">

              {/* Ratings summary (compact) */}
              {article.ratings && Object.keys(article.ratings).length > 0 && (
                <RatingsSummaryCard ratings={article.ratings} lang={lang} dict={dict.article} />
              )}

              {/* Ad slot */}
              <AdSlot format="rectangle" label={dict.article.advertisement} />

              {/* Related articles */}
              {related.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    {dict.article.relatedTitle}
                  </h3>
                  <div className="space-y-3">
                    {related.map((rel) => (
                      <Link
                        key={rel.id}
                        href={`/${lang}/reviews/${rel.slug}`}
                        className="flex gap-3 group"
                      >
                        {rel.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={rel.coverImage}
                            alt={isEs ? rel.titleEs : rel.titleEn}
                            className="size-16 rounded-lg object-cover shrink-0"
                          />
                        ) : (
                          <div className="size-16 rounded-lg bg-muted shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                            {isEs ? rel.titleEs : rel.titleEn}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 capitalize">
                            {rel.category}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>

      <Footer lang={lang} dict={dict.footer} />
    </>
  );
}

// ── Inline block components ───────────────────────────────────────────────────

function ArticleBody({ content, lang, adLabel }: { content: string; lang: string; adLabel: string }) {
  const sections = content.split(/(?=^## )/m).filter(Boolean);
  const midIndex = Math.floor(sections.length / 3);

  return (
    <div className="space-y-4">
      {sections.map((section, i) => (
        <div key={i}>
          <div
            className="prose prose-sm md:prose-base dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3 prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(section) }}
          />
          {i === midIndex && sections.length > 2 && (
            <div className="my-6 flex justify-center">
              <AdSlot format="rectangle" label={adLabel} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function RatingsBlock({
  ratings,
  dict,
}: {
  ratings: Partial<ArticleRatings>;
  lang: string;
  dict: { overallScore: string; outOf: string; ratingLabels: Record<string, string> };
}) {
  const entries = Object.entries(ratings) as [keyof ArticleRatings, number][];
  const avg = (entries.reduce((s, [, v]) => s + v, 0) / entries.length).toFixed(1);

  return (
    <section className="rounded-xl border bg-card p-5 space-y-4">
      <div className="flex items-center gap-4">
        <div className="text-5xl font-bold tabular-nums text-primary">{avg}</div>
        <div>
          <p className="font-semibold">{dict.overallScore}</p>
          <p className="text-xs text-muted-foreground">{dict.outOf}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {entries.map(([key, val]) => (
          <div key={key} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{dict.ratingLabels?.[key] ?? key}</span>
              <span className="font-semibold tabular-nums">{val}</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={cn("h-full rounded-full", val >= 8 ? "bg-emerald-500" : val >= 6 ? "bg-amber-400" : "bg-red-500")}
                style={{ width: `${val * 10}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function RatingsSummaryCard({
  ratings,
  dict,
}: {
  ratings: Partial<ArticleRatings>;
  lang: string;
  dict: { overallScore: string; outOf: string };
}) {
  const entries = Object.entries(ratings) as [keyof ArticleRatings, number][];
  const avg = (entries.reduce((s, [, v]) => s + v, 0) / entries.length).toFixed(1);
  const score = parseFloat(avg);

  return (
    <div className="rounded-xl border bg-card p-4 text-center space-y-1">
      <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
        {dict.overallScore}
      </p>
      <p className={cn("text-6xl font-bold tabular-nums", score >= 8 ? "text-emerald-500" : score >= 6 ? "text-amber-500" : "text-red-500")}>
        {avg}
      </p>
      <p className="text-xs text-muted-foreground">{dict.outOf}</p>
    </div>
  );
}

function SpecsBlock({
  specs,
  lang,
  dict,
}: {
  specs: Article["specs"];
  lang: string;
  dict: { specsTitle: string };
}) {
  if (!specs) return null;
  const isEs = lang === "es-MX";
  const labels: Record<string, { es: string; en: string }> = {
    engine:          { es: "Motor",          en: "Engine" },
    displacement:    { es: "Cilindrada",     en: "Displacement" },
    power:           { es: "Potencia",       en: "Power" },
    torque:          { es: "Torque",         en: "Torque" },
    transmission:    { es: "Transmisión",    en: "Transmission" },
    drivetrain:      { es: "Tracción",       en: "Drivetrain" },
    zeroToHundred:   { es: "0–100 km/h",     en: "0–62 mph" },
    topSpeed:        { es: "Vel. máxima",    en: "Top speed" },
    fuelConsumption: { es: "Consumo",        en: "Fuel economy" },
    fuelType:        { es: "Combustible",    en: "Fuel type" },
    length:          { es: "Largo",          en: "Length" },
    width:           { es: "Ancho",          en: "Width" },
    height:          { es: "Alto",           en: "Height" },
    wheelbase:       { es: "Entre ejes",     en: "Wheelbase" },
    weight:          { es: "Peso",           en: "Weight" },
    trunkCapacity:   { es: "Cajuela",        en: "Trunk" },
    safetyRating:    { es: "Seguridad",      en: "Safety rating" },
    warranty:        { es: "Garantía",       en: "Warranty" },
    infotainment:    { es: "Infotainment",   en: "Infotainment" },
    driverAssist:    { es: "Asistencias",    en: "Driver assist" },
  };
  const entries = Object.entries(specs).filter(([, v]) => v) as [string, string][];

  return (
    <section className="rounded-xl border bg-card overflow-hidden">
      <div className="px-5 py-3 border-b bg-muted/40">
        <h2 className="font-semibold text-sm">🔧 {dict.specsTitle}</h2>
      </div>
      <div className="divide-y">
        {entries.map(([key, val]) => (
          <div key={key} className="flex items-center px-5 py-2.5 text-sm hover:bg-muted/30 transition-colors">
            <span className="text-muted-foreground w-40 shrink-0">
              {labels[key]?.[isEs ? "es" : "en"] ?? key}
            </span>
            <span className="font-medium">{val}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function VersionsBlock({
  versions,
  dict,
}: {
  versions: NonNullable<Article["versions"]>;
  lang: string;
  dict: { versionsTitle: string; versionCol: string; priceFrom: string; priceTo: string; highlights: string };
}) {
  const t = {
    title: dict.versionsTitle,
    version: dict.versionCol,
    from: dict.priceFrom,
    to: dict.priceTo,
    highlights: dict.highlights,
  };

  return (
    <section className="rounded-xl border bg-card overflow-hidden">
      <div className="px-5 py-3 border-b bg-muted/40">
        <h2 className="font-semibold text-sm">📊 {t.title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/30">
            <tr>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{t.version}</th>
              <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">{t.from}</th>
              <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">{t.to}</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground hidden md:table-cell">{t.highlights}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {versions.map((v, i) => (
              <tr key={i} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 font-semibold">{v.name}</td>
                <td className="px-4 py-3 text-right tabular-nums text-emerald-600 dark:text-emerald-400 font-medium">
                  {v.priceMin ? `$${v.priceMin}` : "—"}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-emerald-600 dark:text-emerald-400 font-medium">
                  {v.priceMax ? `$${v.priceMax}` : "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{v.highlights}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function GalleryBlock({
  images,
  title,
}: {
  images: NonNullable<Article["gallery"]>;
  title: string;
}) {
  return (
    <section className="space-y-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {images.map((img, i) => (
          <figure key={i} className="rounded-lg overflow-hidden bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt={img.caption || `${title} ${i + 1}`}
              className="w-full aspect-video object-cover hover:scale-105 transition-transform duration-300"
            />
            {img.caption && (
              <figcaption className="px-2 py-1 text-xs text-muted-foreground">
                {img.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}

function VideoBlock({ url, dict }: { url: string; dict: { videoLabel: string } }) {
  const id = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)?.[1];
  if (!id) return null;
  return (
    <section className="space-y-2">
      <div className="flex items-center gap-1.5 text-sm font-semibold">
        <PlayCircle className="size-4 text-red-500" />
        {dict.videoLabel}
      </div>
      <div className="rounded-xl overflow-hidden border aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${id}`}
          title="Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    </section>
  );
}

function ProsConsBlock({
  prosCons,
  dict,
}: {
  prosCons: NonNullable<Article["prosCons"]>;
  dict: { pros: string; cons: string };
}) {
  const t = { pros: dict.pros, cons: dict.cons };

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {(["pros", "cons"] as const).map((type) => {
        const isPro = type === "pros";
        const items = prosCons[type].filter((i) => i.text);
        if (!items.length) return null;
        return (
          <div
            key={type}
            className={cn(
              "rounded-xl border p-4 space-y-2",
              isPro
                ? "border-emerald-500/30 bg-emerald-500/5"
                : "border-red-500/30 bg-red-500/5"
            )}
          >
            <h3
              className={cn(
                "font-semibold text-sm flex items-center gap-2",
                isPro
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400"
              )}
            >
              {isPro ? <ThumbsUp className="size-4" /> : <ThumbsDown className="size-4" />}
              {t[type]}
            </h3>
            <ul className="space-y-1.5">
              {items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span
                    className={cn(
                      "mt-1.5 size-1.5 rounded-full shrink-0",
                      isPro ? "bg-emerald-500" : "bg-red-500"
                    )}
                  />
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

// ── Helpers ──────────────────────────────────────────────────────────────────

function parseMarkdown(md: string): string {
  return md
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/_(.+?)_/g, "<em>$1</em>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/\n{2,}/g, "</p><p>");
}
