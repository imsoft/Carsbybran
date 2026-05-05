import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getDictionary, hasLocale } from "../dictionaries";
import { getSession } from "@/lib/session";
import { getUserReviews } from "@/lib/mock-user-data";
import { getArticleById } from "@/lib/mock-articles";
import { deleteReviewAction } from "@/app/actions/user";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Trash2, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export async function generateMetadata({ params }: PageProps<"/[lang]/my-reviews">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: `${dict.myReviews.title} — Carsbybran` };
}

function StarRating({ value }: { value: number }) {
  const color =
    value >= 8 ? "text-emerald-500" : value >= 6 ? "text-amber-400" : "text-red-500";
  return (
    <div className={cn("flex items-center gap-1 font-bold tabular-nums", color)}>
      <Star className="size-4 fill-current" />
      <span>{value}/10</span>
    </div>
  );
}

export default async function MyReviewsPage({ params }: PageProps<"/[lang]/my-reviews">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const session = await getSession();

  const reviews = session ? await getUserReviews(session.userId) : [];
  const isEs = lang === "es-MX";

  const reviewsWithArticles = (
    await Promise.all(reviews.map(async (r) => ({ review: r, article: await getArticleById(r.articleId) })))
  ).filter((r) => !!r.article);

  return (
    <>
      <Navbar lang={lang} dict={dict.nav} />
      <main className="container mx-auto max-w-3xl px-4 py-12 space-y-8">

        <div className="space-y-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Star className="size-6 text-amber-400 fill-amber-400" />
            {dict.myReviews.title}
          </h1>
          <p className="text-sm text-muted-foreground">{dict.myReviews.subtitle}</p>
        </div>

        {reviewsWithArticles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <Star className="size-12 text-muted-foreground/30" />
            <p className="text-muted-foreground">{dict.myReviews.empty}</p>
            <Button asChild variant="outline">
              <Link href={`/${lang}/reviews`}>{dict.myReviews.emptyCta}</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {reviewsWithArticles.map(({ review, article }) => (
              <div key={review.articleId} className="border rounded-xl bg-card overflow-hidden">
                <div className="flex gap-4 p-4">
                  {/* Thumbnail */}
                  <div className="shrink-0 w-24 h-16 rounded-lg overflow-hidden bg-muted">
                    {article!.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={article!.coverImage}
                        alt={isEs ? article!.titleEs : article!.titleEn}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="size-5 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Badge variant="outline" className="text-xs capitalize mb-1">
                          {article!.category}
                        </Badge>
                        <h2 className="font-semibold text-sm leading-snug line-clamp-1">
                          <Link
                            href={`/${lang}/reviews/${article!.slug}`}
                            className="hover:text-accent transition-colors"
                          >
                            {isEs ? article!.titleEs : article!.titleEn}
                          </Link>
                        </h2>
                      </div>
                      <StarRating value={review.rating} />
                    </div>

                    {review.comment && (
                      <p className="text-sm text-muted-foreground line-clamp-2 italic">
                        "{review.comment}"
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-muted-foreground">
                        {dict.myReviews.postedOn}{" "}
                        {new Date(review.createdAt).toLocaleDateString(
                          isEs ? "es-MX" : "en-US",
                          { dateStyle: "medium" }
                        )}
                      </span>
                      <form action={deleteReviewAction.bind(null, review.articleId, lang)}>
                        <Button
                          type="submit"
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="size-3 mr-1" />
                          {dict.myReviews.deleteReview}
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>
      <Footer lang={lang} dict={dict.footer} />
    </>
  );
}
