"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, X, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Review } from "@/lib/mock-data";

interface CarComparisonToolProps {
  cars: Review[];
  lang: string;
  dict: {
    selectPrompt: string;
    selectedCount: string;
    maxReached: string;
    minSelect: string;
    clearAll: string;
    readReview: string;
    specs: {
      brand: string;
      model: string;
      category: string;
      year: string;
      rating: string;
      readTime: string;
      minRead: string;
    };
  };
}

const MAX = 3;

type SpecRow = {
  key: keyof typeof specKeys;
  label: string;
};

const specKeys = {
  brand: (r: Review) => r.brand,
  model: (r: Review) => r.model,
  category: (r: Review) => r.category,
  year: (r: Review) => String(r.year),
  rating: (r: Review) => String(r.rating),
  readTime: (r: Review) => String(r.readTime),
};

export function CarComparisonTool({
  cars,
  lang,
  dict,
}: CarComparisonToolProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX) return prev;
      return [...prev, id];
    });
  };

  const selectedCars = selected
    .map((id) => cars.find((c) => c.id === id)!)
    .filter(Boolean);

  const maxRating = Math.max(...selectedCars.map((c) => c.rating));

  const specRows: SpecRow[] = [
    { key: "brand", label: dict.specs.brand },
    { key: "model", label: dict.specs.model },
    { key: "category", label: dict.specs.category },
    { key: "year", label: dict.specs.year },
    { key: "rating", label: dict.specs.rating },
    { key: "readTime", label: dict.specs.readTime },
  ];

  return (
    <div className="space-y-8">
      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm text-muted-foreground">
          {selected.length >= MAX ? (
            <span className="text-amber-500 font-medium">{dict.maxReached}</span>
          ) : (
            dict.selectPrompt
          )}
        </p>
        {selected.length > 0 && (
          <button
            onClick={() => setSelected([])}
            className="flex items-center gap-1 text-xs font-medium text-accent hover:underline cursor-pointer"
          >
            <X className="h-3 w-3" />
            {dict.clearAll}
          </button>
        )}
      </div>

      {/* Car selector grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {cars.map((car) => {
          const isSelected = selected.includes(car.id);
          const isDisabled = !isSelected && selected.length >= MAX;

          return (
            <button
              key={car.id}
              onClick={() => toggle(car.id)}
              disabled={isDisabled}
              className={cn(
                "relative rounded-lg border overflow-hidden text-left transition-all cursor-pointer",
                isSelected
                  ? "border-accent shadow-md ring-2 ring-accent/20"
                  : isDisabled
                    ? "border-border opacity-40 cursor-not-allowed"
                    : "border-border hover:border-accent/60 hover:shadow-sm"
              )}
            >
              {/* Cover image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={car.coverImage}
                  alt={car.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                />
                {/* Selected overlay */}
                {isSelected && (
                  <div className="absolute inset-0 bg-accent/20 flex items-center justify-center">
                    <span className="rounded-full bg-accent p-1">
                      <Check className="h-4 w-4 text-white" />
                    </span>
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="p-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-accent leading-none mb-1">
                  {car.brand}
                </p>
                <p className="text-xs font-semibold text-foreground leading-tight line-clamp-2">
                  {car.model} {car.year}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Comparison table */}
      {selectedCars.length >= 2 ? (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[480px] text-sm">
            {/* Car headers */}
            <thead>
              <tr className="border-b border-border">
                <th className="w-36 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-muted/40" />
                {selectedCars.map((car) => (
                  <th
                    key={car.id}
                    className="px-4 py-3 text-center bg-card"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative h-14 w-24 rounded overflow-hidden">
                        <Image
                          src={car.coverImage}
                          alt={car.title}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-accent">
                          {car.brand}
                        </p>
                        <p className="text-xs font-semibold text-foreground">
                          {car.model} {car.year}
                        </p>
                      </div>
                      <Link
                        href={`/${lang}/reviews/${car.slug}`}
                        className="text-[10px] font-medium text-accent hover:underline"
                      >
                        {dict.readReview} →
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {specRows.map(({ key, label }, i) => (
                <tr
                  key={key}
                  className={cn(
                    "border-b border-border last:border-0",
                    i % 2 === 0 ? "bg-background" : "bg-card"
                  )}
                >
                  <td className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {label}
                  </td>
                  {selectedCars.map((car) => {
                    const value = specKeys[key](car);
                    const isBestRating =
                      key === "rating" && car.rating === maxRating;

                    return (
                      <td
                        key={car.id}
                        className="px-4 py-3 text-center font-medium text-foreground"
                      >
                        {key === "rating" ? (
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold",
                              isBestRating
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                                : "text-foreground"
                            )}
                          >
                            <Star
                              className={cn(
                                "h-3 w-3",
                                isBestRating
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-muted-foreground text-muted-foreground"
                              )}
                              aria-hidden="true"
                            />
                            {value}
                          </span>
                        ) : key === "readTime" ? (
                          <span className="text-sm tabular-nums">
                            {value}{" "}
                            <span className="text-xs text-muted-foreground">
                              {dict.specs.minRead}
                            </span>
                          </span>
                        ) : (
                          <span className="text-sm">{value}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex items-center justify-center rounded-xl border border-dashed border-border py-16">
          <p className="text-sm text-muted-foreground">{dict.minSelect}</p>
        </div>
      )}
    </div>
  );
}
