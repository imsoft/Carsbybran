"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import type { ArticleVersion } from "@/lib/definitions";

type Props = {
  value: ArticleVersion[];
  onChange: (versions: ArticleVersion[]) => void;
  /** Nombre del campo en FormData (default `versions` = español). */
  formHiddenName?: string;
};

const empty = (): ArticleVersion => ({
  name: "",
  priceMin: "",
  priceMax: "",
  highlights: "",
});

export function VersionsForm({ value: versions, onChange, formHiddenName = "versions" }: Props) {
  function update(i: number, field: keyof ArticleVersion, value: string) {
    onChange(
      versions.map((v, idx) => (idx === i ? { ...v, [field]: value } : v))
    );
  }

  function add() {
    onChange([...versions, empty()]);
  }

  function remove(i: number) {
    onChange(versions.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-4">
      <input type="hidden" name={formHiddenName} value={JSON.stringify(versions)} />

      <div className="grid grid-cols-[1fr_1fr_1fr_2fr_auto] gap-2 text-xs font-medium text-muted-foreground px-1">
        <span>Versión</span>
        <span>Precio desde (MXN)</span>
        <span>Precio hasta (MXN)</span>
        <span>Equipamiento destacado</span>
        <span />
      </div>

      <div className="space-y-2">
        {versions.map((v, i) => (
          <div
            key={i}
            className="grid grid-cols-[1fr_1fr_1fr_2fr_auto] gap-2 items-center"
          >
            <Input
              value={v.name}
              onChange={(e) => update(i, "name", e.target.value)}
              placeholder="ej. Base"
              className="h-8 text-sm"
            />
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                $
              </span>
              <Input
                value={v.priceMin}
                onChange={(e) => update(i, "priceMin", e.target.value)}
                placeholder="500,000"
                className="h-8 text-sm pl-5"
              />
            </div>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                $
              </span>
              <Input
                value={v.priceMax}
                onChange={(e) => update(i, "priceMax", e.target.value)}
                placeholder="600,000"
                className="h-8 text-sm pl-5"
              />
            </div>
            <Input
              value={v.highlights}
              onChange={(e) => update(i, "highlights", e.target.value)}
              placeholder={'ej. Pantalla 10.5", CarPlay, 6 airbags'}
              className="h-8 text-sm"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-destructive"
              onClick={() => remove(i)}
              disabled={versions.length === 1}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ))}
      </div>

      <Button type="button" variant="outline" size="sm" onClick={add} className="gap-1.5">
        <Plus className="size-3.5" />
        Agregar versión
      </Button>
    </div>
  );
}
