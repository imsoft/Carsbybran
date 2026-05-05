"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ThumbsUp, ThumbsDown } from "lucide-react";
import type { ArticleProsCons, ProConItem } from "@/lib/definitions";
import { cn } from "@/lib/utils";

type Props = { defaultValue?: ArticleProsCons };

const defaultData: ArticleProsCons = {
  pros: [{ text: "" }],
  cons: [{ text: "" }],
};

export function ProsConsForm({ defaultValue = defaultData }: Props) {
  const [data, setData] = useState<ArticleProsCons>(defaultValue);

  function updateItem(type: "pros" | "cons", i: number, text: string) {
    setData((prev) => ({
      ...prev,
      [type]: prev[type].map((item, idx) => (idx === i ? { text } : item)),
    }));
  }

  function addItem(type: "pros" | "cons") {
    setData((prev) => ({ ...prev, [type]: [...prev[type], { text: "" }] }));
  }

  function removeItem(type: "pros" | "cons", i: number) {
    setData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, idx) => idx !== i),
    }));
  }

  return (
    <div className="space-y-6">
      <input type="hidden" name="prosCons" value={JSON.stringify(data)} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(["pros", "cons"] as const).map((type) => {
          const isPro = type === "pros";
          return (
            <div key={type} className="space-y-3">
              <div
                className={cn(
                  "flex items-center gap-2 font-semibold text-sm py-2 px-3 rounded-lg",
                  isPro
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-red-500/10 text-red-600 dark:text-red-400"
                )}
              >
                {isPro ? (
                  <ThumbsUp className="size-4" />
                ) : (
                  <ThumbsDown className="size-4" />
                )}
                {isPro ? "Ventajas" : "Desventajas"}
              </div>

              <div className="space-y-2">
                {data[type].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span
                      className={cn(
                        "size-1.5 rounded-full shrink-0",
                        isPro ? "bg-emerald-500" : "bg-red-500"
                      )}
                    />
                    <Input
                      value={item.text}
                      onChange={(e) => updateItem(type, i, e.target.value)}
                      placeholder={
                        isPro
                          ? "ej. Excelente manejo en curvas"
                          : "ej. Interior algo austero"
                      }
                      className="h-8 text-sm flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => removeItem(type, i)}
                      disabled={data[type].length === 1}
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => addItem(type)}
                className={cn(
                  "gap-1.5 text-xs h-7",
                  isPro
                    ? "text-emerald-600 hover:text-emerald-700"
                    : "text-red-600 hover:text-red-700"
                )}
              >
                <Plus className="size-3" />
                Agregar {isPro ? "ventaja" : "desventaja"}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
