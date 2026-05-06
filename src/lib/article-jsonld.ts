import type { Article, ArticleRatings, ArticleSpecs } from "@/lib/definitions";
import { AUTHOR_NAME, BASE_URL, SITE_NAME } from "@/lib/seo";

const RATING_KEYS: (keyof ArticleRatings)[] = [
  "performance",
  "comfort",
  "technology",
  "value",
  "design",
  "safety",
];

/** Promedio editorial 1–10 a partir de los ejes rellenados en el CMS. */
export function averageEditorialRatings(ratings: Partial<ArticleRatings> | undefined): number | null {
  if (!ratings) return null;
  const vals = RATING_KEYS.map((k) => ratings[k]).filter(
    (v): v is number => typeof v === "number" && !Number.isNaN(v)
  );
  if (vals.length === 0) return null;
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
}

function yearFromTitle(title: string): string | undefined {
  const m = title.match(/\b(20[0-9]{2}|19[0-9]{2})\b/);
  return m?.[1];
}

function absoluteImage(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${BASE_URL}${path}`;
}

function specsToAdditionalProperty(specs: Partial<ArticleSpecs> | undefined): object[] {
  if (!specs) return [];
  const pairs: [string, string][] = [
    ["Motor", specs.engine],
    ["Cilindraje / desplazamiento", specs.displacement],
    ["Potencia", specs.power],
    ["Par", specs.torque],
    ["Transmisión", specs.transmission],
    ["Tracción", specs.drivetrain],
    ["0–100 km/h", specs.zeroToHundred],
    ["Velocidad máxima", specs.topSpeed],
    ["Consumo", specs.fuelConsumption],
    ["Combustible", specs.fuelType],
  ].filter(([, v]) => typeof v === "string" && v.trim().length > 0) as [string, string][];

  return pairs.map(([name, value]) => ({
    "@type": "PropertyValue",
    name,
    value: value.trim(),
  }));
}

export type ArticleJsonLdInput = {
  article: Article;
  lang: string;
  title: string;
  excerpt: string;
};

/**
 * Un único grafo Schema.org: WebPage + Article + Car + Review (+ BreadcrumbList).
 * Pensado para reseñas editoriales bilingües; URLs absolutas para crawlers.
 */
export function buildArticlePageJsonLd({
  article,
  lang,
  title,
  excerpt,
}: ArticleJsonLdInput): Record<string, unknown> {
  const pageUrl = `${BASE_URL}/${lang}/reviews/${article.slug}`;
  const vehicleId = `${pageUrl}#vehicle`;
  const articleId = `${pageUrl}#article`;
  const reviewId = `${pageUrl}#editorial-review`;

  const img = absoluteImage(article.coverImage);
  const avg = averageEditorialRatings(article.ratings);
  const year = yearFromTitle(title);
  const extraProps = specsToAdditionalProperty(article.specs);

  const vehicle: Record<string, unknown> = {
    "@type": "Car",
    "@id": vehicleId,
    name: title,
    description: excerpt,
    url: pageUrl,
  };

  if (img) vehicle.image = img;

  if (year) {
    vehicle.model = title.replace(/\s*\(?\s*\d{4}\s*\)?\s*:.*$/u, "").trim() || title;
    vehicle.vehicleModelDate = `${year}-01-01`;
  }

  if (extraProps.length > 0) {
    vehicle.additionalProperty = extraProps;
  }

  const graph: Record<string, unknown>[] = [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${BASE_URL}/${lang}`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Reviews",
          item: `${BASE_URL}/${lang}/reviews`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: title,
          item: pageUrl,
        },
      ],
    },
    vehicle,
    {
      "@type": "Article",
      "@id": articleId,
      headline: title,
      description: excerpt,
      ...(img ? { image: [img] } : {}),
      datePublished: article.createdAt,
      dateModified: article.updatedAt,
      author: { "@type": "Person", name: AUTHOR_NAME, url: BASE_URL },
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        url: BASE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${BASE_URL}/images/site/carsbybran-logo-light.svg`,
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": pageUrl,
      },
      about: { "@id": vehicleId },
      inLanguage: lang,
      articleSection: article.category,
      ...(article.tags?.length ? { keywords: article.tags.join(", ") } : {}),
      url: pageUrl,
    },
  ];

  if (avg !== null) {
    graph.push({
      "@type": "Review",
      "@id": reviewId,
      itemReviewed: { "@id": vehicleId },
      author: { "@type": "Person", name: AUTHOR_NAME, url: BASE_URL },
      datePublished: article.createdAt,
      reviewBody: excerpt,
      reviewRating: {
        "@type": "Rating",
        ratingValue: avg,
        bestRating: 10,
        worstRating: 1,
      },
      name: title,
      url: pageUrl,
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
