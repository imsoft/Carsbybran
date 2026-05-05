import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import { pageMeta } from "@/lib/seo";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ReviewFilters } from "@/components/reviews/ReviewFilters";
import { allReviews } from "@/lib/mock-data";
import { getSession } from "@/lib/session";
import { getFavorites } from "@/lib/mock-user-data";
import { getArticleById } from "@/lib/mock-articles";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const title = `${dict.reviews.title} — Carsbybran`;
  return {
    title,
    description: dict.meta.description,
    ...pageMeta(lang, "/reviews", title, dict.meta.description),
  };
}

export default async function ReviewsPage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const session = await getSession();
  const favoriteIds = session ? await getFavorites(session.userId) : [];
  const favoriteArticles = await Promise.all(favoriteIds.map((id) => getArticleById(id)));
  const favoriteSlugs = favoriteArticles
    .filter((article): article is NonNullable<typeof article> => Boolean(article))
    .map((article) => article.slug);

  return (
    <>
      <Navbar lang={lang} dict={dict.nav} />
      <main className="flex-1 container mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {dict.reviews.title}
          </h1>
        </div>
        <ReviewFilters
          reviews={allReviews}
          lang={lang}
          dict={{
            ...dict.reviews,
            card: {
              ...dict.card,
              save: dict.article.save,
              saved: dict.article.saved,
              loginToSave: dict.article.loginToSave,
            },
          }}
          canFavorite={Boolean(session)}
          favoriteSlugs={favoriteSlugs}
        />
      </main>
      <Footer lang={lang} dict={dict.footer} />
    </>
  );
}
