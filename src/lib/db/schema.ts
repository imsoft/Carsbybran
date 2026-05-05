import {
  pgTable,
  text,
  integer,
  timestamp,
  primaryKey,
  jsonb,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const articles = pgTable("articles", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  status: text("status").notNull().default("draft"),
  titleEs: text("title_es").notNull(),
  titleEn: text("title_en").notNull(),
  excerptEs: text("excerpt_es").notNull().default(""),
  excerptEn: text("excerpt_en").notNull().default(""),
  contentEs: text("content_es").notNull(),
  contentEn: text("content_en").notNull(),
  coverImage: text("cover_image"),
  category: text("category").notNull(),
  tags: text("tags").array().notNull().default([]),
  views: integer("views").notNull().default(0),
  specs: jsonb("specs"),
  versions: jsonb("versions"),
  ratings: jsonb("ratings"),
  prosCons: jsonb("pros_cons"),
  gallery: jsonb("gallery"),
  videoUrl: text("video_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// No FK to articles — article IDs can come from mock fallback during seeding
export const favorites = pgTable(
  "favorites",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    articleId: text("article_id").notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.articleId] })]
);

export const userReviews = pgTable(
  "user_reviews",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    articleId: text("article_id").notNull(),
    rating: integer("rating").notNull(),
    comment: text("comment").notNull().default(""),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.articleId] })]
);
