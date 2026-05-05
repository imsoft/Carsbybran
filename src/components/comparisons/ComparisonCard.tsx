import Image from "next/image";
import Link from "next/link";
import { Star, Trophy, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Comparison } from "@/lib/mock-data";

interface ComparisonCardProps {
  comparison: Comparison;
  lang: string;
  dict: {
    vs: string;
    ourPick: string;
    tie: string;
    readBoth: string;
    specs: { rating: string; category: string; year: string };
  };
}

function CarColumn({
  review,
  isWinner,
  isTie,
  lang,
  dict,
}: {
  review: Comparison["car1"];
  isWinner: boolean;
  isTie: boolean;
  lang: string;
  dict: ComparisonCardProps["dict"];
}) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border bg-card overflow-hidden transition-all",
        isWinner
          ? "border-accent shadow-md"
          : isTie
            ? "border-border"
            : "border-border opacity-90"
      )}
    >
      {/* Winner badge */}
      {isWinner && (
        <div className="flex items-center gap-1.5 bg-accent px-3 py-1.5">
          <Trophy className="h-3.5 w-3.5 text-white" aria-hidden="true" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-white">
            {dict.ourPick}
          </span>
        </div>
      )}
      {isTie && (
        <div className="flex items-center gap-1.5 bg-muted px-3 py-1.5">
          <Minus className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            {dict.tie}
          </span>
        </div>
      )}

      {/* Cover image */}
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={review.coverImage}
          alt={review.title}
          fill
          className="object-cover"
          sizes="(min-width: 768px) 40vw, 100vw"
        />
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-accent">
          {review.brand}
        </p>
        <Link
          href={`/${lang}/reviews/${review.slug}`}
          className="text-sm font-semibold leading-snug text-card-foreground hover:text-accent transition-colors line-clamp-2"
        >
          {review.model} {review.year}
        </Link>

        {/* Specs */}
        <dl className="mt-1 space-y-1.5 border-t border-border pt-3">
          <div className="flex items-center justify-between">
            <dt className="text-xs text-muted-foreground">{dict.specs.rating}</dt>
            <dd className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" aria-hidden="true" />
              <span className="text-sm font-bold tabular-nums text-amber-500">
                {review.rating}
              </span>
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-xs text-muted-foreground">{dict.specs.category}</dt>
            <dd className="text-xs font-medium text-card-foreground">{review.category}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-xs text-muted-foreground">{dict.specs.year}</dt>
            <dd className="text-xs font-medium tabular-nums text-card-foreground">{review.year}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export function ComparisonCard({ comparison, lang, dict }: ComparisonCardProps) {
  const car1Wins = comparison.winner === "car1";
  const car2Wins = comparison.winner === "car2";
  const isTie = comparison.winner === "tie";

  return (
    <article className="rounded-xl border border-border bg-background p-5 space-y-5">
      {/* Cars grid */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-3">
        <CarColumn
          review={comparison.car1}
          isWinner={car1Wins}
          isTie={isTie}
          lang={lang}
          dict={dict}
        />

        <div className="flex h-full items-center justify-center pt-8">
          <span className="text-sm font-black text-muted-foreground/60 uppercase tracking-widest">
            {dict.vs}
          </span>
        </div>

        <CarColumn
          review={comparison.car2}
          isWinner={car2Wins}
          isTie={isTie}
          lang={lang}
          dict={dict}
        />
      </div>

      {/* Verdict */}
      <p className="text-sm leading-relaxed text-muted-foreground border-t border-border pt-4">
        {comparison.verdict}
      </p>

      <Link
        href={`/${lang}/comparisons/${comparison.slug}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
      >
        {dict.readBoth} →
      </Link>
    </article>
  );
}
