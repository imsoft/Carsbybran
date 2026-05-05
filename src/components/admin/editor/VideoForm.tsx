"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlayCircle } from "lucide-react";

type Props = { defaultValue?: string };

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export function VideoForm({ defaultValue = "" }: Props) {
  const [url, setUrl] = useState(defaultValue);
  const videoId = url ? extractYouTubeId(url) : null;

  return (
    <div className="space-y-4">
      <input type="hidden" name="videoUrl" value={url} />

      <div className="space-y-1.5">
        <Label htmlFor="videoUrl" className="flex items-center gap-1.5">
          <PlayCircle className="size-4 text-red-500" />
          URL de YouTube
        </Label>
        <Input
          id="videoUrl"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground">
          Soporta youtube.com/watch?v= y youtu.be/
        </p>
      </div>

      {videoId ? (
        <div className="rounded-xl overflow-hidden border aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="Video preview"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      ) : url ? (
        <p className="text-xs text-destructive">URL de YouTube no válida.</p>
      ) : (
        <div className="rounded-xl border-2 border-dashed aspect-video flex items-center justify-center bg-muted/30">
          <div className="text-center space-y-2">
            <PlayCircle className="size-8 text-muted-foreground/40 mx-auto" />
            <p className="text-xs text-muted-foreground">El preview del video aparecerá aquí</p>
          </div>
        </div>
      )}
    </div>
  );
}
