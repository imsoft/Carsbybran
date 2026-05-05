"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";
import { updateAvatarAction } from "@/app/actions/user";

interface AvatarUploadProps {
  name: string;
  avatarUrl?: string;
}

export function AvatarUpload({ name, avatarUrl }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const initials = name.slice(0, 2).toUpperCase();
  const displayUrl = preview ?? avatarUrl;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    const form = new FormData();
    form.append("avatar", file);
    startTransition(async () => {
      await updateAvatarAction(form);
    });
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      disabled={isPending}
      className="relative size-16 shrink-0 rounded-full group focus-visible:outline-2 focus-visible:outline-ring"
      aria-label="Change profile photo"
    >
      {displayUrl ? (
        <Image
          src={displayUrl}
          alt={name}
          fill
          sizes="64px"
          className="rounded-full object-cover"
        />
      ) : (
        <div className="size-16 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">
          {initials}
        </div>
      )}

      <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        {isPending ? (
          <Loader2 className="size-5 text-white animate-spin" />
        ) : (
          <Camera className="size-5 text-white" />
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={handleChange}
      />
    </button>
  );
}
