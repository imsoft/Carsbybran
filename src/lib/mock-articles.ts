import "server-only";
import type { Article, ArticleStatus } from "./definitions";
import { db } from "./db";
import { articles as articlesTable } from "./db/schema";
import { eq, ne, sql } from "drizzle-orm";

function toArticle(row: typeof articlesTable.$inferSelect): Article {
  return {
    id: row.id,
    slug: row.slug,
    status: row.status as ArticleStatus,
    titleEs: row.titleEs,
    titleEn: row.titleEn,
    excerptEs: row.excerptEs,
    excerptEn: row.excerptEn,
    contentEs: row.contentEs,
    contentEn: row.contentEn,
    coverImage: row.coverImage ?? undefined,
    category: row.category,
    tags: row.tags,
    views: row.views,
    specs: (row.specs as Article["specs"]) ?? undefined,
    versions: (row.versions as Article["versions"]) ?? undefined,
    versionsEn: (row.versionsEn as Article["versionsEn"]) ?? undefined,
    ratings: (row.ratings as Article["ratings"]) ?? undefined,
    prosCons: (row.prosCons as Article["prosCons"]) ?? undefined,
    prosConsEn: (row.prosConsEn as Article["prosConsEn"]) ?? undefined,
    gallery: (row.gallery as Article["gallery"]) ?? undefined,
    videoUrl: row.videoUrl ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function getArticles(): Promise<Article[]> {
  const rows = await db.select().from(articlesTable);
  return rows.map(toArticle);
}

export async function getArticleById(
  id: string
): Promise<Article | undefined> {
  const rows = await db
    .select()
    .from(articlesTable)
    .where(eq(articlesTable.id, id));
  return rows[0] ? toArticle(rows[0]) : undefined;
}

export async function getArticleBySlug(
  slug: string
): Promise<Article | undefined> {
  const rows = await db
    .select()
    .from(articlesTable)
    .where(eq(articlesTable.slug, slug));
  const article = rows[0] ? toArticle(rows[0]) : undefined;
  return article?.status === "published" ? article : undefined;
}

export async function getRelatedArticles(
  id: string,
  limit = 3
): Promise<Article[]> {
  const rows = await db
    .select()
    .from(articlesTable)
    .where(ne(articlesTable.id, id));
  return rows
    .map(toArticle)
    .filter((a) => a.status === "published")
    .slice(0, limit);
}

export async function getArticleStats() {
  const rows = await db.select().from(articlesTable);
  const all = rows.map(toArticle);
  return {
    total: all.length,
    published: all.filter((a) => a.status === "published").length,
    drafts: all.filter((a) => a.status === "draft").length,
    totalViews: all.reduce((sum, a) => sum + a.views, 0),
  };
}

/** Incrementa vistas del artículo de forma atómica. */
export async function incrementArticleViews(articleId: string): Promise<void> {
  await db
    .update(articlesTable)
    .set({ views: sql`${articlesTable.views} + 1` })
    .where(eq(articlesTable.id, articleId));
}
