import type { Article, ArticleProsCons, ArticleVersion } from "./definitions";

function hasVersionRows(v?: ArticleVersion[]): boolean {
  return !!v?.some(
    (x) => x.name.trim() || x.highlights.trim() || x.priceMin.trim() || x.priceMax.trim()
  );
}

function hasProsConsContent(pc?: ArticleProsCons): boolean {
  if (!pc) return false;
  return [...pc.pros, ...pc.cons].some((x) => x.text.trim().length > 0);
}

/** Versiones y precios a mostrar según idioma de la ruta (EN usa `versionsEn` si tiene datos). */
export function articleVersionsForLang(
  article: Article,
  lang: string
): ArticleVersion[] | undefined {
  const isEs = lang === "es-MX";
  if (isEs) {
    return hasVersionRows(article.versions) ? article.versions : undefined;
  }
  if (hasVersionRows(article.versionsEn)) return article.versionsEn;
  return hasVersionRows(article.versions) ? article.versions : undefined;
}

/** Pros/contras según idioma (`prosConsEn` en EN si existe). */
export function articleProsConsForLang(
  article: Article,
  lang: string
): ArticleProsCons | undefined {
  const isEs = lang === "es-MX";
  if (isEs) {
    return hasProsConsContent(article.prosCons) ? article.prosCons : undefined;
  }
  if (hasProsConsContent(article.prosConsEn)) return article.prosConsEn;
  if (hasProsConsContent(article.prosCons)) return article.prosCons;
  return undefined;
}
