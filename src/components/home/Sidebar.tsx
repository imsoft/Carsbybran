import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { AdSlot } from "@/components/ads/AdSlot";
import type { Review } from "@/lib/articles";

interface SidebarProps {
  topReviews: Review[];
  lang: string;
  dict: {
    topRated: string;
    readMore: string;
    advertisement: string;
  };
}

export function Sidebar({ topReviews, lang, dict }: SidebarProps) {
  return (
    <aside className="space-y-6">
      {/* Ad Slot 2 — Rectangle 300×250 */}
      <AdSlot format="rectangle" label={dict.advertisement} />

      {/* Top Rated list */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-foreground">
          {dict.topRated}
        </h3>

        <ul className="space-y-0">
          {topReviews.map((review, i) => (
            <li key={review.id}>
              <Link
                href={`/${lang}/reviews/${review.slug}`}
                className="group flex gap-3 py-3"
              >
                <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded">
                  <Image
                    src={review.coverImage}
                    alt={review.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="80px"
                  />
                </div>
                <div className="flex min-w-0 flex-col justify-between">
                  <p className="line-clamp-2 text-xs font-medium leading-snug text-card-foreground transition-colors group-hover:text-accent">
                    {review.title}
                  </p>
                  <div className="flex items-center gap-1">
                    <Star
                      className="h-3 w-3 fill-amber-400 text-amber-400"
                      aria-hidden="true"
                    />
                    <span className="text-xs font-bold tabular-nums text-amber-500">
                      {review.rating}
                    </span>
                  </div>
                </div>
              </Link>
              {i < topReviews.length - 1 && (
                <div className="border-t border-border" />
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Ad Slot 4 — Rectangle 300×250 */}
      <AdSlot format="rectangle" label={dict.advertisement} />
    </aside>
  );
}
