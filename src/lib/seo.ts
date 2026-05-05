export const BASE_URL = "https://carsbybran.com";
export const SITE_NAME = "Carsbybran";
export const TWITTER_HANDLE = "@carsbybran";
export const AUTHOR_NAME = "Brandon Garcia";

export function pageAlternates(lang: string, path: string) {
  return {
    canonical: `${BASE_URL}/${lang}${path}`,
    languages: {
      "en-US": `${BASE_URL}/en-US${path}`,
      "es-MX": `${BASE_URL}/es-MX${path}`,
      "x-default": `${BASE_URL}/en-US${path}`,
    },
  };
}

export function ogImages(url?: string | null, alt = SITE_NAME) {
  if (!url) return [];
  return [{ url, width: 1200, height: 630, alt }];
}

export function pageMeta(
  lang: string,
  path: string,
  title: string,
  description: string,
  image?: string | null
) {
  const locale = lang === "es-MX" ? "es_MX" : "en_US";
  return {
    alternates: pageAlternates(lang, path),
    openGraph: {
      type: "website" as const,
      title,
      description,
      url: `${BASE_URL}/${lang}${path}`,
      siteName: SITE_NAME,
      locale,
      ...(image ? { images: ogImages(image, title) } : {}),
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      creator: TWITTER_HANDLE,
      ...(image ? { images: [image] } : {}),
    },
  };
}
