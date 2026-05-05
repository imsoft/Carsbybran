import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/mock-articles";

const BASE_URL = "https://carsbybran.com";
const locales = ["en-US", "es-MX"] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const published = (await getArticles()).filter((a) => a.status === "published");

  const articleUrls: MetadataRoute.Sitemap = published.flatMap((a) =>
    locales.map((lang) => ({
      url: `${BASE_URL}/${lang}/reviews/${a.slug}`,
      lastModified: new Date(a.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  );

  const staticUrls: MetadataRoute.Sitemap = locales.flatMap((lang) => [
    { url: `${BASE_URL}/${lang}`, changeFrequency: "daily" as const, priority: 1 },
    { url: `${BASE_URL}/${lang}/reviews`, changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${BASE_URL}/${lang}/brands`, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${BASE_URL}/${lang}/comparisons`, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${BASE_URL}/${lang}/about`, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${BASE_URL}/${lang}/contact`, changeFrequency: "monthly" as const, priority: 0.4 },
  ]);

  return [...staticUrls, ...articleUrls];
}
