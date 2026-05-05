"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NavbarSearch({ lang, placeholder }: { lang: string; placeholder: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/${lang}/search?q=${encodeURIComponent(q)}`);
    setOpen(false);
    setQuery("");
  }

  if (open) {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-1">
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="h-8 w-44 sm:w-56 rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 shrink-0"
          onClick={() => { setOpen(false); setQuery(""); }}
          aria-label="Close search"
        >
          <X className="size-4" />
        </Button>
      </form>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={placeholder}
      onClick={() => setOpen(true)}
      className={cn("size-9")}
    >
      <Search className="h-5 w-5" />
    </Button>
  );
}
