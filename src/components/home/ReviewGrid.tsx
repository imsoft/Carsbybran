import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ReviewCard } from "./ReviewCard";
import { AdSlot } from "@/components/ads/AdSlot";
import type { Review } from "@/lib/mock-data";

interface ReviewGridProps {
  reviews: Review[];
  lang: string;
  dict: {
    latestReviews: string;
    seeAll: string;
    advertisement: string;
    card: {
      readMore: string;
      minRead: string;
      carRating: string;
      save: string;
      saved: string;
      loginToSave: string;
    };
  };
  canFavorite: boolean;
  favoriteSlugs: string[];
}

export function ReviewGrid({ reviews, lang, dict, canFavorite, favoriteSlugs }: ReviewGridProps) {
  const firstBatch = reviews.slice(0, 3);
  const secondBatch = reviews.slice(3);

  return (
    <div className="space-y-8">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground md:text-2xl">
          {dict.latestReviews}
        </h2>
        <Link
          href={`/${lang}/reviews`}
          className="flex items-center gap-0.5 text-sm font-medium text-accent hover:underline"
        >
          {dict.seeAll}
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      {/* First 3 cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {firstBatch.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            lang={lang}
            dict={dict.card}
            canFavorite={canFavorite}
            initialFavorited={favoriteSlugs.includes(review.slug)}
          />
        ))}
      </div>

      {/* Ad Slot 3 — In-feed between card groups */}
      <AdSlot format="infeed" label={dict.advertisement} className="py-1" />

      {/* Remaining cards */}
      {secondBatch.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {secondBatch.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              lang={lang}
              dict={dict.card}
              canFavorite={canFavorite}
              initialFavorited={favoriteSlugs.includes(review.slug)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
