"use client";

import { useState } from "react";
import type { ArticleRatings } from "@/lib/definitions";
import { cn } from "@/lib/utils";

type Props = { defaultValue?: Partial<ArticleRatings> };

const CATEGORIES: { key: keyof ArticleRatings; label: string; icon: string }[] = [
  { key: "performance", label: "Desempeño", icon: "🏎️" },
  { key: "comfort", label: "Confort", icon: "🛋️" },
  { key: "technology", label: "Tecnología", icon: "📱" },
  { key: "value", label: "Precio/Valor", icon: "💰" },
  { key: "design", label: "Diseño", icon: "✏️" },
  { key: "safety", label: "Seguridad", icon: "🛡️" },
];

function ratingColor(n: number) {
  if (n >= 8) return "bg-emerald-500";
  if (n >= 6) return "bg-amber-400";
  return "bg-red-500";
}

export function RatingsForm({ defaultValue = {} }: Props) {
  const [ratings, setRatings] = useState<Partial<ArticleRatings>>({
    performance: 7,
    comfort: 7,
    technology: 7,
    value: 7,
    design: 7,
    safety: 7,
    ...defaultValue,
  });

  function update(key: keyof ArticleRatings, value: number) {
    setRatings((prev) => ({ ...prev, [key]: value }));
  }

  const avg = Object.values(ratings).length
    ? (Object.values(ratings).reduce((a, b) => a + (b ?? 0), 0) /
        Object.values(ratings).length).toFixed(1)
    : "—";

  return (
    <div className="space-y-5">
      <input type="hidden" name="ratings" value={JSON.stringify(ratings)} />

      <div className="flex items-center gap-3">
        <div className="text-4xl font-bold tabular-nums">{avg}</div>
        <div>
          <p className="text-sm font-medium">Puntuación general</p>
          <p className="text-xs text-muted-foreground">Promedio de todas las categorías</p>
        </div>
      </div>

      <div className="space-y-4">
        {CATEGORIES.map(({ key, label, icon }) => {
          const val = ratings[key] ?? 7;
          return (
            <div key={key} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {icon} {label}
                </span>
                <span className="text-sm font-bold tabular-nums w-6 text-right">
                  {val}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={val}
                  onChange={(e) => update(key, Number(e.target.value))}
                  className="flex-1 h-1.5 accent-primary cursor-pointer"
                />
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all", ratingColor(val))}
                  style={{ width: `${val * 10}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
