import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Search, BookOpen } from "lucide-react";
import { getDictionary, hasLocale } from "../dictionaries";
import { getArticles } from "@/lib/mock-articles";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";

type Props = PageProps<"/[lang]/search"> & { searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { lang } = await params;
  const { q } = await searchParams;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: q ? `"${q}" — ${dict.search.title} — Carsbybran` : `${dict.search.title} — Carsbybran`,
    robots: { index: false, follow: false },
  };
}

export default async function SearchPage({ params, searchParams }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const { q = "" } = await searchParams;
  const dict = await getDictionary(lang);
  const isEs = lang === "es-MX";
  const query = q.trim().toLowerCase();

  const allArticles = query ? await getArticles() : [];
  const results = allArticles.filter((a) => {
    if (a.status !== "published") return false;
    const title = (isEs ? a.titleEs : a.titleEn).toLowerCase();
    const excerpt = (isEs ? a.excerptEs : a.excerptEn).toLowerCase();
    const tags = a.tags.join(" ").toLowerCase();
    return title.includes(query) || excerpt.includes(query) || tags.includes(query);
  });

  const resultCount =
    results.length === 1 ? dict.search.resultSingular : dict.search.resultPlural;

  return (
    <>
      <Navbar lang={lang} dict={dict.nav} />
      <main className="flex-1 container mx-auto max-w-4xl px-4 md:px-8 py-10 space-y-8">

        <div className="space-y-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Search className="size-6" />
            {dict.search.title}
          </h1>
          {query && (
            <p className="text-sm text-muted-foreground">
              {results.length} {resultCount}{" "}
              <span className="font-medium text-foreground">&ldquo;{q}&rdquo;</span>
            </p>
          )}
        </div>

        {!query ? (
          <p className="text-muted-foreground">{dict.search.emptyPrompt}</p>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <BookOpen className="size-10 text-muted-foreground/30" />
            <p className="text-muted-foreground">
              {dict.search.noResults} &ldquo;{q}&rdquo;.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {results.map((article) => (
              <Link
                key={article.id}
                href={`/${lang}/reviews/${article.slug}`}
                className="group flex gap-4 py-5 hover:bg-muted/30 rounded-lg px-2 -mx-2 transition-colors"
              >
                {article.coverImage && (
                  <div className="relative size-20 rounded-lg overflow-hidden shrink-0 hidden sm:block">
                    <Image
                      src={article.coverImage}
                      alt={isEs ? article.titleEs : article.titleEn}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0 space-y-1.5">
                  <Badge variant="outline" className="text-xs capitalize">
                    {article.category}
                  </Badge>
                  <h2 className="font-semibold leading-snug group-hover:text-primary transition-colors">
                    {isEs ? article.titleEs : article.titleEn}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {isEs ? article.excerptEs : article.excerptEn}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {article.tags.map((tag) => (
                      <span key={tag} className="text-xs text-muted-foreground">
                        #{tag}
                      </span>
                    ))}
                  </div>
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
