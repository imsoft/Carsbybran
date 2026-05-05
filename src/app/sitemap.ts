import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/mock-articles";

const BASE_URL = "https://carsbybran.com";
const locales = ["en-US", "es-MX"] as const;
const now = new Date();

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
    { url: `${BASE_URL}/${lang}`, changeFrequency: "weekly" as const, priority: 1.0, lastModified: now },
    { url: `${BASE_URL}/${lang}/reviews`, changeFrequency: "weekly" as const, priority: 0.9, lastModified: now },
    { url: `${BASE_URL}/${lang}/brands`, changeFrequency: "weekly" as const, priority: 0.7, lastModified: now },
    { url: `${BASE_URL}/${lang}/comparisons`, changeFrequency: "weekly" as const, priority: 0.7, lastModified: now },
    { url: `${BASE_URL}/${lang}/about`, changeFrequency: "monthly" as const, priority: 0.5, lastModified: now },
    { url: `${BASE_URL}/${lang}/contact`, changeFrequency: "monthly" as const, priority: 0.4, lastModified: now },
  ]);

  return [...staticUrls, ...articleUrls];
}
