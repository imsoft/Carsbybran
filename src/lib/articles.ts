import "server-only";
import { getArticles } from "./mock-articles";
import type { Article } from "./definitions";

export type Review = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: "SUV" | "Sedan" | "Sports" | "Electric" | "Luxury" | "Pickup";
  brand: string;
  model: string;
  year: number;
  rating: number;
  readTime: number;
  publishedAt: string;
  author: { name: string; avatar: string };
};

export type Brand = { name: string; slug: string; count: number };

export type Comparison = {
  id: string;
  slug: string;
  car1: Review;
  car2: Review;
  winner: "car1" | "car2" | "tie";
  verdict: string;
  car1Pros: string[];
  car2Pros: string[];
  publishedAt: string;
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80";

const BRAND_NAMES: Record<string, string> = {
  bmw: "BMW",
  gmc: "GMC",
  vw: "VW",
  kia: "KIA",
  suv: "SUV",
};

function slugToName(slug: string): string {
  return (
    BRAND_NAMES[slug.toLowerCase()] ??
    slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  );
}

function avgRating(article: Article): number {
  if (!article.ratings) return 0;
  const vals = Object.values(article.ratings as Record<string, number>);
  if (!vals.length) return 0;
  return parseFloat(
    (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1)
  );
}

export function toReview(article: Article, lang: string): Review {
  const isEs = lang === "es-MX";
  const content = isEs ? article.contentEs : article.contentEn;
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  return {
    id: article.id,
    slug: article.slug,
    title: isEs ? article.titleEs : article.titleEn,
    excerpt: isEs ? article.excerptEs : article.excerptEn,
    coverImage: article.coverImage ?? FALLBACK_IMAGE,
    category: article.category as Review["category"],
    brand: slugToName(article.tags[0] ?? ""),
    model: "",
    year: new Date(article.createdAt).getFullYear(),
    rating: avgRating(article),
    readTime: Math.max(1, Math.round(wordCount / 200)),
    publishedAt: article.createdAt,
    author: { name: "Brandon Garcia", avatar: "" },
  };
}

export async function getFeaturedArticle(lang: string): Promise<Review | null> {
  const all = await getArticles();
  const first = all.find((a) => a.status === "published");
  return first ? toReview(first, lang) : null;
}

export async function getLatestArticles(
  lang: string,
  limit = 9
): Promise<Review[]> {
  const all = await getArticles();
  return all
    .filter((a) => a.status === "published")
    .slice(0, limit)
    .map((a) => toReview(a, lang));
}

export async function getTopRatedArticles(
  lang: string,
  limit = 5
): Promise<Review[]> {
  const all = await getArticles();
  return all
    .filter(
      (a) =>
        a.status === "published" &&
        a.ratings &&
        Object.keys(a.ratings).length > 0
    )
    .sort((a, b) => avgRating(b) - avgRating(a))
    .slice(0, limit)
    .map((a) => toReview(a, lang));
}

export async function getAllPublishedArticles(lang: string): Promise<Review[]> {
  const all = await getArticles();
  return all
    .filter((a) => a.status === "published")
    .map((a) => toReview(a, lang));
}

export async function getBrands(): Promise<Brand[]> {
  const all = await getArticles();
  const counts: Record<string, number> = {};
  for (const a of all) {
    if (a.status !== "published") continue;
    for (const tag of a.tags) {
      counts[tag] = (counts[tag] ?? 0) + 1;
    }
  }
  return Object.entries(counts)
    .map(([slug, count]) => ({ slug, name: slugToName(slug), count }))
    .sort((a, b) => b.count - a.count);
}
