import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getDictionary, hasLocale } from "../dictionaries";
import { getSession } from "@/lib/session";
import { getFavorites } from "@/lib/mock-user-data";
import { getArticleById } from "@/lib/mock-articles";
import { toggleFavoriteAction } from "@/app/actions/user";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, BookOpen } from "lucide-react";

export async function generateMetadata({ params }: PageProps<"/[lang]/favorites">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: `${dict.favorites.title} — Carsbybran`, robots: { index: false, follow: false } };
}

export default async function FavoritesPage({ params }: PageProps<"/[lang]/favorites">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const session = await getSession();

  const favoriteIds = session ? await getFavorites(session.userId) : [];
  const articleResults = await Promise.all(favoriteIds.map((id) => getArticleById(id)));
  const articles = articleResults.filter(Boolean) as NonNullable<Awaited<ReturnType<typeof getArticleById>>>[];

  const isEs = lang === "es-MX";

  return (
    <>
      <Navbar lang={lang} dict={dict.nav} />
      <main className="container mx-auto max-w-4xl px-4 py-12 space-y-8">

        <div className="space-y-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Heart className="size-6 text-accent fill-accent" />
            {dict.favorites.title}
          </h1>
          <p className="text-sm text-muted-foreground">{dict.favorites.subtitle}</p>
        </div>

        {articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <Heart className="size-12 text-muted-foreground/30" />
            <p className="text-muted-foreground">{dict.favorites.empty}</p>
            <Button asChild variant="outline">
              <Link href={`/${lang}/reviews`}>{dict.favorites.emptyCta}</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {articles.map((article) => (
              <div key={article.id} className="group relative flex flex-col border rounded-xl overflow-hidden bg-card hover:shadow-md transition-shadow">
                {/* Cover */}
                {article.coverImage ? (
                  <div className="relative aspect-video w-full">
                    <Image
                      src={article.coverImage}
                      alt={isEs ? article.titleEs : article.titleEn}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover"
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
                  <h2 className="font-semibold text-sm leading-snug line-clamp-2">
                    {isEs ? article.titleEs : article.titleEn}
                  </h2>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {isEs ? article.excerptEs : article.excerptEn}
                  </p>

                  <div className="mt-auto flex items-center gap-2 pt-3 border-t">
                    <Button asChild size="sm" variant="outline" className="flex-1 text-xs">
                      <Link href={`/${lang}/reviews/${article.slug}`}>{dict.card.readMore}</Link>
                    </Button>
                    <form action={toggleFavoriteAction.bind(null, article.id, lang)}>
                      <Button
                        type="submit"
                        size="icon"
                        variant="ghost"
                        className="size-8 text-accent hover:text-destructive"
                        title={dict.favorites.remove}
                      >
                        <Heart className="size-4 fill-current" />
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>
      <Footer lang={lang} dict={dict.footer} />
    </>
  );
}
