"use client";

import { useState, useMemo } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReviewCard } from "@/components/home/ReviewCard";
import type { Review } from "@/lib/articles";

interface ReviewFiltersProps {
  reviews: Review[];
  lang: string;
  dict: {
    all: string;
    filterBrand: string;
    filterCategory: string;
    resultsCount: string;
    noResults: string;
    clearFilters: string;
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

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1 text-xs font-medium transition-all cursor-pointer",
        active
          ? "border-accent bg-accent text-white"
          : "border-border bg-card text-muted-foreground hover:border-accent hover:text-accent"
      )}
    >
      {label}
    </button>
  );
}

export function ReviewFilters({ reviews, lang, dict, canFavorite, favoriteSlugs }: ReviewFiltersProps) {
  const [activeBrand, setActiveBrand] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const brands = useMemo(
    () => Array.from(new Set(reviews.map((r) => r.brand))).sort(),
    [reviews]
  );

  const categories = useMemo(
    () => Array.from(new Set(reviews.map((r) => r.category))).sort(),
    [reviews]
  );

  const filtered = useMemo(
    () =>
      reviews.filter(
        (r) =>
          (!activeBrand || r.brand === activeBrand) &&
          (!activeCategory || r.category === activeCategory)
      ),
    [reviews, activeBrand, activeCategory]
  );

  const hasActiveFilter = activeBrand !== null || activeCategory !== null;

  const clearAll = () => {
    setActiveBrand(null);
    setActiveCategory(null);
  };

  return (
    <div className="space-y-6">
      {/* Filter bar */}
      <div className="space-y-3 rounded-lg border border-border bg-card p-4">
        {/* Brand filter row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground w-20 shrink-0">
            {dict.filterBrand}
          </span>
          <FilterPill
            label={dict.all}
            active={activeBrand === null}
            onClick={() => setActiveBrand(null)}
          />
          {brands.map((brand) => (
            <FilterPill
              key={brand}
              label={brand}
              active={activeBrand === brand}
              onClick={() =>
                setActiveBrand(activeBrand === brand ? null : brand)
              }
            />
          ))}
        </div>

        {/* Category filter row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground w-20 shrink-0">
            {dict.filterCategory}
          </span>
          <FilterPill
            label={dict.all}
            active={activeCategory === null}
            onClick={() => setActiveCategory(null)}
          />
          {categories.map((cat) => (
            <FilterPill
              key={cat}
              label={cat}
              active={activeCategory === cat}
              onClick={() =>
                setActiveCategory(activeCategory === cat ? null : cat)
              }
            />
          ))}
        </div>
      </div>

      {/* Results count + clear */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground tabular-nums">
            {filtered.length}
          </span>{" "}
          {dict.resultsCount}
        </p>
        {hasActiveFilter && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs font-medium text-accent hover:underline cursor-pointer"
          >
            <X className="h-3 w-3" />
            {dict.clearFilters}
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
          <p className="text-sm text-muted-foreground">{dict.noResults}</p>
          <button
            onClick={clearAll}
            className="mt-3 text-sm font-medium text-accent hover:underline cursor-pointer"
          >
            {dict.clearFilters}
          </button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((review) => (
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
