import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, articles } from "@/lib/db/schema";
import { MOCK_ARTICLES } from "@/lib/mock-articles";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not allowed in production" }, { status: 403 });
  }

  try {
    // Seed admin user
    const passwordHash = await bcrypt.hash("Admin1234!", 12);
    await db
      .insert(users)
      .values({
        id: "usr_admin_1",
        name: "Brandon",
        email: "weareimsoft@gmail.com",
        passwordHash,
        role: "admin",
      })
      .onConflictDoNothing();

    // Seed articles from mock data
    for (const article of MOCK_ARTICLES) {
      await db
        .insert(articles)
        .values({
          id: article.id,
          slug: article.slug,
          status: article.status,
          titleEs: article.titleEs,
          titleEn: article.titleEn,
          excerptEs: article.excerptEs,
          excerptEn: article.excerptEn,
          contentEs: article.contentEs,
          contentEn: article.contentEn,
          coverImage: article.coverImage ?? null,
          category: article.category,
          tags: article.tags,
          views: article.views,
          specs: (article.specs ?? null) as unknown,
          versions: (article.versions ?? null) as unknown,
          ratings: (article.ratings ?? null) as unknown,
          prosCons: (article.prosCons ?? null) as unknown,
          gallery: (article.gallery ?? null) as unknown,
          videoUrl: article.videoUrl ?? null,
          createdAt: new Date(article.createdAt),
          updatedAt: new Date(article.updatedAt),
        })
        .onConflictDoNothing();
    }

    return NextResponse.json({
      ok: true,
      seeded: {
        users: 1,
        articles: MOCK_ARTICLES.length,
      },
    });
  } catch (err) {
    console.error("[seed] error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
