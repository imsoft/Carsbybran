import Image from "next/image";
import Link from "next/link";
import { Star, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Review } from "@/lib/mock-data";
import { CardFavoriteButton } from "@/components/reviews/CardFavoriteButton";

interface ReviewCardProps {
  review: Review;
  lang: string;
  dict: {
    readMore: string;
    minRead: string;
    carRating: string;
    save: string;
    saved: string;
    loginToSave: string;
  };
  canFavorite: boolean;
  initialFavorited: boolean;
  className?: string;
}

export function ReviewCard({
  review,
  lang,
  dict,
  canFavorite,
  initialFavorited,
  className,
}: ReviewCardProps) {
  const ratingColor =
    review.rating >= 9
      ? "text-emerald-500"
      : review.rating >= 8
        ? "text-amber-500"
        : "text-orange-500";

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
        className
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <Link
          href={`/${lang}/reviews/${review.slug}`}
          aria-label={review.title}
          className="absolute inset-0 z-10"
        />
        <Image
          src={review.coverImage}
          alt={review.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
        <span className="absolute left-3 top-3 rounded-full bg-black/65 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
          {review.category}
        </span>
        <div className="absolute right-3 top-3 z-20">
          <CardFavoriteButton
            slug={review.slug}
            lang={lang}
            canFavorite={canFavorite}
            initialFavorited={initialFavorited}
            labels={{ save: dict.save, saved: dict.saved, loginToSave: dict.loginToSave }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-accent">
          {review.brand}
        </p>
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-card-foreground transition-colors group-hover:text-accent">
          <Link href={`/${lang}/reviews/${review.slug}`} className="hover:underline">
            {review.title}
          </Link>
        </h3>
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {review.excerpt}
        </p>

        {/* Meta row */}
        <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-1.5">
            <Star className={cn("h-3.5 w-3.5 fill-current", ratingColor)} />
            <span className={cn("text-sm font-bold tabular-nums", ratingColor)}>
              {review.rating}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              {dict.carRating}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" aria-hidden="true" />
              <span className="text-xs tabular-nums">
                {review.readTime} {dict.minRead}
              </span>
            </div>
            <Link
              href={`/${lang}/reviews/${review.slug}`}
              className="text-xs font-semibold text-accent hover:underline"
            >
              {dict.readMore}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
