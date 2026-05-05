import Image from "next/image";
import Link from "next/link";
import { Star, Clock, ChevronRight } from "lucide-react";
import type { Review } from "@/lib/mock-data";

interface HeroProps {
  review: Review;
  lang: string;
  dict: {
    heroLabel: string;
    readFull: string;
    minRead: string;
  };
}

export function Hero({ review, lang, dict }: HeroProps) {
  return (
    <section className="relative h-[72vh] min-h-[520px] w-full overflow-hidden">
      <Image
        src={review.coverImage}
        alt={review.title}
        fill
        priority
        loading="eager"
        className="object-cover"
        sizes="100vw"
      />

      {/* Gradient overlay — strong at the bottom for text legibility */}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/35 to-black/10" />

      {/* Content anchored to bottom-left */}
      <div className="absolute inset-0 flex items-end">
        <div className="container mx-auto max-w-7xl px-4 pb-12 md:px-8 md:pb-16">
          <div className="max-w-2xl">
            <span className="mb-3 inline-block rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white">
              {dict.heroLabel}
            </span>

            <h1 className="mb-3 text-2xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
              {review.title}
            </h1>

            <p className="mb-6 line-clamp-2 text-sm text-white/80 md:text-base">
              {review.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={`/${lang}/reviews/${review.slug}`}
                className="inline-flex items-center gap-1.5 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-white"
              >
                {dict.readFull}
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>

              <div className="flex items-center gap-3 text-sm text-white/70">
                <span className="flex items-center gap-1">
                  <Star
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                    aria-hidden="true"
                  />
                  <span className="font-bold tabular-nums text-white">
                    {review.rating}
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  <span className="tabular-nums">
                    {review.readTime} {dict.minRead}
                  </span>
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  {review.brand} {review.model} {review.year}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
