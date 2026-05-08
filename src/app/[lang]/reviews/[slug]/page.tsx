import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, Clock, Tag, PlayCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import { getDictionary, hasLocale } from "../../dictionaries";
import {
  getArticleBySlug,
  getRelatedArticles,
  incrementArticleViews,
} from "@/lib/mock-articles";
import { pageAlternates, ogImages, BASE_URL, SITE_NAME, TWITTER_HANDLE, AUTHOR_NAME } from "@/lib/seo";
import { buildArticlePageJsonLd } from "@/lib/article-jsonld";
import { getSession } from "@/lib/session";
import { isFavorite, getUserReviewForArticle } from "@/lib/mock-user-data";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FavoriteButton } from "@/components/reviews/FavoriteButton";
import { UserReviewSection } from "@/components/reviews/UserReviewSection";
import { AdSlot } from "@/components/ads/AdSlot";
import { Badge } from "@/components/ui/badge";
import type { Article, ArticleRatings } from "@/lib/definitions";
import { cn, formatPriceMx } from "@/lib/utils";
import { parseArticleMarkdown, splitArticleSections } from "@/lib/article-markdown";
import { articleProsConsForLang, articleVersionsForLang } from "@/lib/article-locale";

type Props = PageProps<"/[lang]/reviews/[slug]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Not found" };
  const isEs = lang === "es-MX";
  const title = isEs ? article.titleEs : article.titleEn;
  const description = isEs ? article.excerptEs : article.excerptEn;
  const locale = isEs ? "es_MX" : "en_US";
  return {
    title,
    description,
    alternates: pageAlternates(lang, `/reviews/${slug}`),
    openGraph: {
      type: "article",
      title,
      description,
      url: `${BASE_URL}/${lang}/reviews/${slug}`,
      siteName: SITE_NAME,
      locale,
      publishedTime: article.createdAt,
      modifiedTime: article.updatedAt,
      authors: [AUTHOR_NAME],
      section: article.category,
      tags: article.tags,
      images: ogImages(article.coverImage, title),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: TWITTER_HANDLE,
      ...(article.coverImage ? { images: [article.coverImage] } : {}),
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  await incrementArticleViews(article.id);

  const dict = await getDictionary(lang);
  const session = await getSession();
  const isEs = lang === "es-MX";

  const title = isEs ? article.titleEs : article.titleEn;
  const excerpt = isEs ? article.excerptEs : article.excerptEn;
  const content = isEs ? article.contentEs : article.contentEn;
  const locale = isEs ? "es-MX" : "en-US";
  const versionsForPage = articleVersionsForLang(article, lang);
  const prosConsForPage = articleProsConsForLang(article, lang);

  const [favorited, existingReviewRaw, related] = await Promise.all([
    session ? isFavorite(session.userId, article.id) : Promise.resolve(false),
    session ? getUserReviewForArticle(session.userId, article.id) : Promise.resolve(undefined),
    getRelatedArticles(article.id),
  ]);
  const existingReview = existingReviewRaw ?? null;

  const jsonLd = buildArticlePageJsonLd({ article, lang, title, excerpt });
  const jsonLdHtml = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml }} />
      <Navbar lang={lang} dict={dict.nav} />

      <main className="flex-1">
        {/* ── Hero cover ── */}
        {article.coverImage && (
          <div className="relative w-full aspect-21/9 max-h-[480px] overflow-hidden bg-muted">
            <Image
              src={article.coverImage}
              alt={title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent" />
          </div>
        )}

        <div className="container mx-auto max-w-7xl px-4 md:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">

            {/* ── Main column ── */}
            <article className="min-w-0 flex flex-col gap-12 lg:gap-16">

              {/* Article header */}
              <header className="space-y-4 pb-10 border-b border-border/60">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="capitalize text-xs">
                    {article.category}
                  </Badge>
                  <time dateTime={article.updatedAt} className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="size-3" />
                    {new Date(article.updatedAt).toLocaleDateString(locale, { dateStyle: "long" })}
                  </time>
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
              <div className="flex justify-center py-2">
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
              {versionsForPage && versionsForPage.length > 0 && (
                <VersionsBlock versions={versionsForPage} lang={lang} dict={dict.article} />
              )}

              {/* Gallery */}
              {article.gallery && article.gallery.length > 0 && (
                <GalleryBlock images={article.gallery} title={title} lang={lang} />
              )}

              {/* Video */}
              {article.videoUrl && <VideoBlock url={article.videoUrl} dict={dict.article} />}

              {/* Pros / Cons */}
              {prosConsForPage && (
                <ProsConsBlock prosCons={prosConsForPage} dict={dict.article} />
              )}

              {/* Ad: bottom */}
              <div className="flex justify-center py-2">
                <AdSlot format="leaderboard" label={dict.article.advertisement} />
              </div>

              {/* Author */}
              <footer className="flex items-center gap-3 pt-6 mt-2 border-t border-border/60">
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
            </article>

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
                          <div className="relative size-16 rounded-lg overflow-hidden shrink-0">
                            <Image
                              src={rel.coverImage}
                              alt={isEs ? rel.titleEs : rel.titleEn}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>
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

function ArticleBody({ content, adLabel }: { content: string; lang?: string; adLabel: string }) {
  const sections = splitArticleSections(content);
  const midIndex = Math.floor(sections.length / 3);

  return (
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
            className="article-prose prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none
              prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
              prose-h2:text-xl md:prose-h2:text-2xl prose-h2:mt-0 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-border/50
              prose-h3:text-lg prose-h3:mt-10 prose-h3:mb-4
              prose-p:my-5 prose-p:leading-[1.8] prose-p:text-foreground/90
              prose-strong:text-foreground prose-a:text-primary
              prose-img:rounded-xl prose-img:shadow-sm prose-img:my-8
              prose-ul:my-6 prose-li:my-1"
            dangerouslySetInnerHTML={{ __html: parseArticleMarkdown(section) }}
          />
          {i === midIndex && sections.length > 2 && (
            <div className="my-10 flex justify-center">
              <AdSlot format="rectangle" label={adLabel} />
            </div>
          )}
        </section>
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
    <section className="rounded-xl border bg-card p-6 md:p-7 space-y-5 shadow-sm">
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
    <section className="rounded-xl border bg-card overflow-hidden shadow-sm">
      <div className="px-5 py-3.5 border-b bg-muted/50">
        <h2 className="font-semibold text-sm md:text-base tracking-tight">🔧 {dict.specsTitle}</h2>
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
    <section className="rounded-xl border bg-card overflow-hidden shadow-sm">
      <div className="px-5 py-3.5 border-b bg-muted/50">
        <h2 className="font-semibold text-sm md:text-base tracking-tight">📊 {t.title}</h2>
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
                  {v.priceMin ? `$${formatPriceMx(v.priceMin)}` : "—"}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-emerald-600 dark:text-emerald-400 font-medium">
                  {v.priceMax ? `$${formatPriceMx(v.priceMax)}` : "—"}
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
  lang,
}: {
  images: NonNullable<Article["gallery"]>;
  title: string;
  lang: string;
}) {
  const isEs = lang === "es-MX";
  const galleryTitle = isEs ? "Galería" : "Gallery";
  return (
    <section className="rounded-xl border bg-card overflow-hidden shadow-sm">
      <div className="px-5 py-3.5 border-b bg-muted/50">
        <h2 className="font-semibold text-sm md:text-base tracking-tight">🖼️ {galleryTitle}</h2>
      </div>
      <div className="p-4 md:p-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((img, i) => (
          <figure key={i} className="rounded-lg overflow-hidden bg-muted">
            <div className="relative aspect-video">
              <Image
                src={img.url}
                alt={img.caption || `${title} ${i + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            {img.caption && (
              <figcaption className="px-2 py-1 text-xs text-muted-foreground">
                {img.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
      </div>
    </section>
  );
}

function VideoBlock({ url, dict }: { url: string; dict: { videoLabel: string } }) {
  const id = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)?.[1];
  if (!id) return null;
  return (
    <section className="rounded-xl border bg-card overflow-hidden shadow-sm">
      <div className="px-5 py-3.5 border-b bg-muted/50 flex items-center gap-2">
        <PlayCircle className="size-4 text-red-500 shrink-0" />
        <h2 className="font-semibold text-sm md:text-base tracking-tight">{dict.videoLabel}</h2>
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

function ProsConsBlock({
  prosCons,
  dict,
}: {
  prosCons: NonNullable<Article["prosCons"]>;
  dict: { pros: string; cons: string };
}) {
  const t = { pros: dict.pros, cons: dict.cons };

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 pt-2">
      {(["pros", "cons"] as const).map((type) => {
        const isPro = type === "pros";
        const items = prosCons[type].filter((i) => i.text);
        if (!items.length) return null;
        return (
          <div
            key={type}
            className={cn(
              "rounded-xl border p-5 md:p-6 space-y-3 shadow-sm",
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

