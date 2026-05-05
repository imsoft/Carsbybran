import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";
import { getDictionary, hasLocale } from "../../dictionaries";
import { getArticles } from "@/lib/mock-articles";
import { brands } from "@/lib/mock-data";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { pageMeta } from "@/lib/seo";

type Props = PageProps<"/[lang]/brands/[slug]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const brand = brands.find((b) => b.slug === slug);
  if (!brand) return { title: "Not found" };
  const dict = await getDictionary(lang);
  const title = `${brand.name} ${dict.brands.reviewPlural} — Carsbybran`;
  return {
    title,
    ...pageMeta(lang, `/brands/${slug}`, title, dict.meta.description),
  };
}

export default async function BrandPage({ params }: Props) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const brand = brands.find((b) => b.slug === slug);
  if (!brand) notFound();

  const dict = await getDictionary(lang);
  const isEs = lang === "es-MX";

  const articles = (await getArticles()).filter(
    (a) => a.status === "published" && a.tags.includes(slug)
  );

  const reviewCount =
    articles.length === 1 ? dict.brands.reviewSingular : dict.brands.reviewPlural;

  return (
    <>
      <Navbar lang={lang} dict={dict.nav} />
      <main className="flex-1 container mx-auto max-w-7xl px-4 md:px-8 py-10">

        <div className="mb-8 space-y-4">
          <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
            <Link href={`/${lang}/brands`}>
              <ArrowLeft className="size-4 mr-1.5" />
              {dict.brands.allBrands}
            </Link>
          </Button>

          <div>
            <h1 className="text-3xl font-bold">{brand.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {articles.length} {reviewCount}
            </p>
          </div>
        </div>

        {articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <BookOpen className="size-12 text-muted-foreground/30" />
            <p className="text-muted-foreground">{dict.brands.noReviews}</p>
            <Button asChild variant="outline" size="sm">
              <Link href={`/${lang}/reviews`}>{dict.brands.browseAll}</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/${lang}/reviews/${article.slug}`}
                className="group flex flex-col rounded-xl border bg-card overflow-hidden hover:shadow-md transition-shadow"
              >
                {article.coverImage ? (
                  <div className="relative aspect-video w-full overflow-hidden">
                    <Image
                      src={article.coverImage}
                      alt={isEs ? article.titleEs : article.titleEn}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <BookOpen className="size-8 text-muted-foreground/30" />
                  </div>
                )}
                <div className="flex flex-col gap-2 p-4 flex-1">
                  <Badge variant="outline" className="w-fit capitalize text-xs">
                    {article.category}
                  </Badge>
                  <h2 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {isEs ? article.titleEs : article.titleEn}
                  </h2>
                  <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
                    {isEs ? article.excerptEs : article.excerptEn}
                  </p>
                  {article.ratings && Object.keys(article.ratings).length > 0 && (
                    <div className="pt-2 border-t text-xs font-semibold text-primary">
                      {(
                        Object.values(article.ratings).reduce((a, b) => a + b, 0) /
                        Object.values(article.ratings).length
                      ).toFixed(1)}
                      {" / 10"}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer lang={lang} dict={dict.footer} />
    </>
  );
}
