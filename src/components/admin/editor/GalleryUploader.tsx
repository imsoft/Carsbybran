"use client";

import { useRef, useState } from "react";
import { UploadCloud, X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ArticleGalleryImage } from "@/lib/definitions";
import { cn } from "@/lib/utils";

type LocalImage = ArticleGalleryImage & { preview: string };

type Props = { defaultValue?: ArticleGalleryImage[] };

export function GalleryUploader({ defaultValue = [] }: Props) {
  const [images, setImages] = useState<LocalImage[]>(
    defaultValue.map((img) => ({ ...img, preview: img.url }))
  );
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function addFiles(files: FileList | null) {
    if (!files) return;
    const valid = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const newImages: LocalImage[] = valid.map((file) => ({
      url: URL.createObjectURL(file),
      preview: URL.createObjectURL(file),
      caption: "",
    }));
    setImages((prev) => [...prev, ...newImages]);
  }

  function updateCaption(i: number, caption: string) {
    setImages((prev) =>
      prev.map((img, idx) => (idx === i ? { ...img, caption } : img))
    );
  }

  function remove(i: number) {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
  }

  const serialized = JSON.stringify(
    images.map(({ url, caption }) => ({ url, caption }))
  );

  return (
    <div className="space-y-4">
      <input type="hidden" name="gallery" value={serialized} />

      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); addFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed py-8 cursor-pointer transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border bg-muted/30 hover:bg-muted/50 hover:border-muted-foreground/40"
        )}
      >
        <UploadCloud className="size-6 text-muted-foreground" />
        <p className="text-sm text-center">
          <span className="font-medium text-primary underline underline-offset-2">
            Sube imágenes
          </span>{" "}
          o arrástralas aquí
        </p>
        <p className="text-xs text-muted-foreground">PNG, JPG, WEBP — múltiples archivos</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((img, i) => (
            <div key={i} className="group relative rounded-lg overflow-hidden border bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.preview}
                alt={img.caption || `Imagen ${i + 1}`}
                className="w-full aspect-video object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-background/90 p-1.5 translate-y-full group-hover:translate-y-0 transition-transform">
                <Input
                  value={img.caption}
                  onChange={(e) => updateCaption(i, e.target.value)}
                  placeholder="Pie de foto…"
                  className="h-6 text-xs border-0 bg-transparent p-0 focus-visible:ring-0"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 size-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => { e.stopPropagation(); remove(i); }}
              >
                <X className="size-3" />
              </Button>
              <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-60 transition-opacity cursor-grab">
                <GripVertical className="size-4 text-white" />
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {images.length} imagen{images.length !== 1 ? "es" : ""} en la galería · Hover para añadir pie de foto
        </p>
      )}
    </div>
  );
}
