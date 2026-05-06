"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { UploadCloud, X, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Props = {
  name: string;
  defaultPreview?: string;
};

export function ImageUploader({ name, defaultPreview }: Props) {
  const [preview, setPreview] = useState<string | null>(defaultPreview || null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<File | null>(null);
  const blobUrlRef = useRef<string | null>(null);

  function revokeBlob() {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
  }

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Solo se aceptan imágenes (PNG, JPG, WEBP, GIF).", {
        id: "cover-image-type",
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no puede superar 5 MB.", { id: "cover-image-size" });
      return;
    }
    fileRef.current = file;
    revokeBlob();
    const url = URL.createObjectURL(file);
    blobUrlRef.current = url;
    setPreview(url);
  }

  useEffect(() => () => revokeBlob(), []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  function clearImage() {
    revokeBlob();
    fileRef.current = null;
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {preview ? (
        <div className="relative rounded-lg overflow-hidden border aspect-video bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Portada del artículo"
            className="w-full h-full object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 size-7 opacity-90"
            onClick={clearImage}
          >
            <X className="size-3.5" />
            <span className="sr-only">Quitar imagen</span>
          </Button>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          aria-label="Zona de carga de imagen"
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          className={cn(
            "flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed",
            "aspect-video cursor-pointer transition-colors select-none",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border bg-muted/30 hover:bg-muted/50 hover:border-muted-foreground/50"
          )}
        >
          <div className="size-10 rounded-full bg-muted flex items-center justify-center">
            <UploadCloud className="size-5 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">
              Arrastra una imagen o{" "}
              <span className="text-primary underline underline-offset-2">
                haz click para subir
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              PNG, JPG, WEBP — máx. 5 MB
            </p>
          </div>
          <ImageIcon className="size-4 text-muted-foreground/40" />
        </div>
      )}

    </div>
  );
}
