"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/session";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createSession } from "@/lib/session";
import {
  toggleFavorite,
  upsertUserReview,
  deleteUserReview,
} from "@/lib/mock-user-data";
import { getArticleBySlug } from "@/lib/mock-articles";

export async function toggleFavoriteAction(articleId: string, lang: string) {
  const session = await verifySession();
  await toggleFavorite(session.userId, articleId);
  revalidatePath(`/${lang}/favorites`);
}

export async function toggleFavoriteBySlugAction(slug: string, lang: string) {
  const session = await verifySession();
  const article = await getArticleBySlug(slug);
  if (!article) return;
  await toggleFavorite(session.userId, article.id);
  revalidatePath(`/${lang}/favorites`);
  revalidatePath(`/${lang}`);
  revalidatePath(`/${lang}/reviews`);
  revalidatePath(`/${lang}/reviews/${slug}`);
}

export async function submitReviewAction(
  articleId: string,
  lang: string,
  formData: FormData
) {
  const session = await verifySession();
  const rating = Number(formData.get("rating") ?? 7);
  const comment = String(formData.get("comment") ?? "").trim();
  if (!comment || rating < 1 || rating > 10) return;
  await upsertUserReview(session.userId, articleId, rating, comment);
  revalidatePath(`/${lang}/my-reviews`);
}

export async function deleteReviewAction(articleId: string, lang: string) {
  const session = await verifySession();
  await deleteUserReview(session.userId, articleId);
  revalidatePath(`/${lang}/my-reviews`);
}

export async function updateNameAction(formData: FormData) {
  const session = await verifySession();
  const name = String(formData.get("name") ?? "").trim();
  if (!name || name.length < 2) return;
  await db.update(users).set({ name }).where(eq(users.id, session.userId));
  await createSession({ userId: session.userId, email: session.email, name, role: session.role, avatarUrl: session.avatarUrl });
  revalidatePath("/");
}

export async function updateAvatarAction(formData: FormData) {
  const session = await verifySession();
  const file = formData.get("avatar") as File | null;
  if (!file || file.size === 0) return;

  const { uploadToR2 } = await import("@/lib/r2");
  const ext = file.name.split(".").pop() ?? "jpg";
  const url = await uploadToR2(
    `avatars/${session.userId}.${ext}`,
    await file.arrayBuffer(),
    file.type || "image/jpeg"
  );

  await db.update(users).set({ avatarUrl: url }).where(eq(users.id, session.userId));
  await createSession({ userId: session.userId, email: session.email, name: session.name, role: session.role, avatarUrl: url });
  revalidatePath("/");
}
