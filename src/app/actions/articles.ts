"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ArticleSchema } from "@/lib/definitions";
import type {
  ArticleFormState,
  ArticleSpecs,
  ArticleVersion,
  ArticleRatings,
  ArticleProsCons,
  ArticleGalleryImage,
} from "@/lib/definitions";
import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { verifySession } from "@/lib/session";
import { r2SafeSegment, uploadToR2 } from "@/lib/r2";

function parseJson<T>(raw: unknown, fallback: T): T {
  if (typeof raw !== "string" || !raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function parseStructured(data: ReturnType<typeof ArticleSchema.safeParse>["data"]) {
  if (!data) return {};
  return {
    specs: parseJson<Partial<ArticleSpecs>>(data.specs, {}),
    versions: parseJson<ArticleVersion[]>(data.versions, []),
    versionsEn: parseJson<ArticleVersion[]>(data.versionsEn, []),
    ratings: parseJson<Partial<ArticleRatings>>(data.ratings, {}),
    prosCons: parseJson<ArticleProsCons>(data.prosCons, { pros: [], cons: [] }),
    prosConsEn: parseJson<ArticleProsCons>(data.prosConsEn, { pros: [], cons: [] }),
    gallery: parseJson<ArticleGalleryImage[]>(data.gallery, []),
    videoUrl: data.videoUrl ?? null,
  };
}

async function resolveCoverImage(
  formData: FormData,
  existingUrl: string | null | undefined,
  articleId: string
): Promise<string | null> {
  const field = formData.get("coverImage");
  const prefix = `articles/${r2SafeSegment(articleId)}`;

  // File upload: send to R2 (una carpeta por artículo para localizar en bucket)
  if (field instanceof File && field.size > 0) {
    const ext = (field.name.split(".").pop() ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const key = `${prefix}/cover-${Date.now()}.${ext}`;
    return uploadToR2(key, await field.arrayBuffer(), field.type || "image/jpeg", {
      cacheControl: "public, max-age=3600, must-revalidate",
    });
  }

  // String URL (e.g. existing value kept by the form)
  if (typeof field === "string" && field.startsWith("http")) return field;

  // Fall back to whatever was already stored
  return existingUrl ?? null;
}

export async function createArticle(
  _state: ArticleFormState,
  formData: FormData
): Promise<ArticleFormState> {
  await verifySession();

  const id = `art_${Date.now()}`;

  let coverImage: string | null = null;
  try {
    // Handle file upload before passing to schema (schema expects a string)
    coverImage = await resolveCoverImage(formData, undefined, id);
  } catch (e) {
    return {
      message:
        e instanceof Error
          ? `No se pudo subir la imagen de portada: ${e.message}`
          : "No se pudo subir la imagen de portada. Revisa la configuración de R2_PUBLIC_URL.",
    };
  }

  // Remove the file entry so Zod only sees strings
  const raw: Record<string, unknown> = Object.fromEntries(
    [...formData.entries()].filter(([k, v]) => k !== "coverImage" && !(v instanceof File))
  );
  raw.coverImage = coverImage ?? undefined;

  const result = ArticleSchema.safeParse(raw);
  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0]);
      fieldErrors[key] = [...(fieldErrors[key] ?? []), issue.message];
    }
    return { errors: fieldErrors };
  }
  const now = new Date();
  const structured = parseStructured(result.data);

  await db.insert(articles).values({
    id,
    slug: result.data.slug,
    status: result.data.status,
    titleEs: result.data.titleEs,
    titleEn: result.data.titleEn,
    excerptEs: result.data.excerptEs ?? "",
    excerptEn: result.data.excerptEn ?? "",
    contentEs: result.data.contentEs,
    contentEn: result.data.contentEn,
    coverImage: result.data.coverImage ?? null,
    category: result.data.category,
    tags: result.data.tags?.split(",").map((t) => t.trim()).filter(Boolean) ?? [],
    views: 0,
    specs: structured.specs as unknown,
    versions: structured.versions as unknown,
    versionsEn: structured.versionsEn as unknown,
    ratings: structured.ratings as unknown,
    prosCons: structured.prosCons as unknown,
    prosConsEn: structured.prosConsEn as unknown,
    gallery: structured.gallery as unknown,
    videoUrl: structured.videoUrl,
    createdAt: now,
    updatedAt: now,
  });

  revalidatePath("/dashboard/articles");
  redirect(`/dashboard/articles/${id}`);
}

export async function updateArticle(
  id: string,
  _state: ArticleFormState,
  formData: FormData
): Promise<ArticleFormState> {
  await verifySession();

  // Keep existing cover image URL if no new file is uploaded
  const existing = await db
    .select({ coverImage: articles.coverImage })
    .from(articles)
    .where(eq(articles.id, id));
  let coverImage: string | null = null;
  try {
    coverImage = await resolveCoverImage(formData, existing[0]?.coverImage, id);
  } catch (e) {
    return {
      message:
        e instanceof Error
          ? `No se pudo subir la imagen de portada: ${e.message}`
          : "No se pudo subir la imagen de portada. Revisa la configuración de R2_PUBLIC_URL.",
    };
  }

  const raw: Record<string, unknown> = Object.fromEntries(
    [...formData.entries()].filter(([k, v]) => k !== "coverImage" && !(v instanceof File))
  );
  raw.coverImage = coverImage ?? undefined;

  const result = ArticleSchema.safeParse(raw);
  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0]);
      fieldErrors[key] = [...(fieldErrors[key] ?? []), issue.message];
    }
    return { errors: fieldErrors };
  }

  const structured = parseStructured(result.data);

  const updated = await db
    .update(articles)
    .set({
      slug: result.data.slug,
      status: result.data.status,
      titleEs: result.data.titleEs,
      titleEn: result.data.titleEn,
      excerptEs: result.data.excerptEs ?? "",
      excerptEn: result.data.excerptEn ?? "",
      contentEs: result.data.contentEs,
      contentEn: result.data.contentEn,
      coverImage: result.data.coverImage ?? null,
      category: result.data.category,
      tags: result.data.tags?.split(",").map((t) => t.trim()).filter(Boolean) ?? [],
      specs: structured.specs as unknown,
      versions: structured.versions as unknown,
      versionsEn: structured.versionsEn as unknown,
      ratings: structured.ratings as unknown,
      prosCons: structured.prosCons as unknown,
      prosConsEn: structured.prosConsEn as unknown,
      gallery: structured.gallery as unknown,
      videoUrl: structured.videoUrl,
      updatedAt: new Date(),
    })
    .where(eq(articles.id, id))
    .returning({ id: articles.id });

  if (updated.length === 0) return { message: "Artículo no encontrado." };

  revalidatePath("/dashboard/articles");
  revalidatePath(`/dashboard/articles/${id}`);
  revalidatePath(`/es-MX/reviews/${result.data.slug}`);
  revalidatePath(`/en-US/reviews/${result.data.slug}`);

  return { success: true, message: "Artículo actualizado.", articleId: id };
}

export async function deleteArticle(id: string): Promise<void> {
  await verifySession();
  await db.delete(articles).where(eq(articles.id, id));
  revalidatePath("/dashboard/articles");
  redirect("/dashboard/articles");
}

export async function toggleArticleStatus(id: string): Promise<void> {
  await verifySession();
  const rows = await db
    .select({ status: articles.status })
    .from(articles)
    .where(eq(articles.id, id));
  if (!rows[0]) return;
  const newStatus = rows[0].status === "published" ? "draft" : "published";
  await db
    .update(articles)
    .set({ status: newStatus, updatedAt: new Date() })
    .where(eq(articles.id, id));
  revalidatePath("/dashboard/articles");
  revalidatePath(`/dashboard/articles/${id}`);
}
