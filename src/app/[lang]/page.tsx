import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "./dictionaries";
import { pageMeta } from "@/lib/seo";
import {
  featuredReview,
  reviews,
  topRatedReviews,
  brands,
} from "@/lib/mock-data";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { ReviewGrid } from "@/components/home/ReviewGrid";
import { Sidebar } from "@/components/home/Sidebar";
import { BrandFilter } from "@/components/home/BrandFilter";
import { AdSlot } from "@/components/ads/AdSlot";
import { getSession } from "@/lib/session";
import { getFavorites } from "@/lib/mock-user-data";
import { getArticleById } from "@/lib/mock-articles";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    ...pageMeta(lang, "", dict.meta.title, dict.meta.description),
  };
}

export default async function HomePage({
  params,
}: PageProps<"/[lang]">) {
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

      <main className="flex-1">
        {/* Hero — featured review, full width */}
        <Hero review={featuredReview} lang={lang} dict={dict.home} />

        {/* Ad Slot 1 — Leaderboard (728×90) after hero, high-intent position */}
        <div className="flex justify-center border-b border-border bg-muted/20 px-4 py-5">
          <AdSlot format="leaderboard" label={dict.home.advertisement} />
        </div>

        {/* Main content: review grid + sticky sidebar */}
        <div className="container mx-auto max-w-7xl px-4 py-10 md:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_300px]">
            <ReviewGrid
              reviews={reviews}
              lang={lang}
              dict={{
                latestReviews: dict.home.latestReviews,
                seeAll: dict.home.seeAll,
                advertisement: dict.home.advertisement,
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

            {/* Sticky sidebar wrapper */}
            <div className="lg:sticky lg:top-20 lg:self-start">
              <Sidebar
                topReviews={topRatedReviews}
                lang={lang}
                dict={{
                  topRated: dict.sidebar.topRated,
                  readMore: dict.sidebar.readMore,
                  advertisement: dict.home.advertisement,
                }}
              />
            </div>
          </div>
        </div>

        {/* Ad Slot 5 — Leaderboard between sections (natural content break) */}
        <div className="flex justify-center border-y border-border bg-muted/20 px-4 py-6">
          <AdSlot format="leaderboard" label={dict.home.advertisement} />
        </div>

        {/* Brand filter section */}
        <div className="container mx-auto max-w-7xl px-4 py-12 md:px-8">
          <BrandFilter brands={brands} lang={lang} dict={dict.brands} />
        </div>
      </main>

      <Footer lang={lang} dict={dict.footer} />
    </>
  );
}
