import { db } from "./db";
import { favorites, userReviews } from "./db/schema";
import { eq, and } from "drizzle-orm";

export type UserReview = {
  articleId: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export async function getFavorites(userId: string): Promise<string[]> {
  const rows = await db
    .select({ articleId: favorites.articleId })
    .from(favorites)
    .where(eq(favorites.userId, userId));
  return rows.map((r) => r.articleId);
}

export async function isFavorite(userId: string, articleId: string): Promise<boolean> {
  const rows = await db
    .select({ articleId: favorites.articleId })
    .from(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.articleId, articleId)));
  return rows.length > 0;
}

export async function toggleFavorite(userId: string, articleId: string): Promise<boolean> {
  const existing = await db
    .select()
    .from(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.articleId, articleId)));
  if (existing.length > 0) {
    await db
      .delete(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.articleId, articleId)));
    return false;
  }
  await db.insert(favorites).values({ userId, articleId });
  return true;
}

export async function getUserReviews(userId: string): Promise<UserReview[]> {
  const rows = await db
    .select()
    .from(userReviews)
    .where(eq(userReviews.userId, userId));
  return rows.map((r) => ({
    articleId: r.articleId,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt.toISOString(),
  }));
}

export async function getUserReviewForArticle(
  userId: string,
  articleId: string
): Promise<UserReview | undefined> {
  const rows = await db
    .select()
    .from(userReviews)
    .where(and(eq(userReviews.userId, userId), eq(userReviews.articleId, articleId)));
  if (rows.length === 0) return undefined;
  const r = rows[0];
  return {
    articleId: r.articleId,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt.toISOString(),
  };
}

export async function upsertUserReview(
  userId: string,
  articleId: string,
  rating: number,
  comment: string
): Promise<void> {
  const now = new Date();
  await db
    .insert(userReviews)
    .values({ userId, articleId, rating, comment, createdAt: now, updatedAt: now })
    .onConflictDoUpdate({
      target: [userReviews.userId, userReviews.articleId],
      set: { rating, comment, updatedAt: now },
    });
}

export async function deleteUserReview(userId: string, articleId: string): Promise<void> {
  await db
    .delete(userReviews)
    .where(and(eq(userReviews.userId, userId), eq(userReviews.articleId, articleId)));
}

export async function getUserStats(userId: string) {
  const [favRows, reviewRows] = await Promise.all([
    db
      .select({ articleId: favorites.articleId })
      .from(favorites)
      .where(eq(favorites.userId, userId)),
    db
      .select({ articleId: userReviews.articleId, comment: userReviews.comment })
      .from(userReviews)
      .where(eq(userReviews.userId, userId)),
  ]);
  return {
    favorites: favRows.length,
    reviews: reviewRows.length,
    comments: reviewRows.filter((r) => r.comment.trim().length > 0).length,
  };
}
