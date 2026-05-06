"use client";

import Link from "next/link";
import { Bookmark } from "lucide-react";
import { useOptimistic, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toggleFavoriteBySlugAction } from "@/app/actions/user";

type Props = {
  slug: string;
  lang: string;
  canFavorite: boolean;
  initialFavorited: boolean;
  labels: {
    save: string;
    saved: string;
    loginToSave: string;
  };
};

export function CardFavoriteButton({
  slug,
  lang,
  canFavorite,
  initialFavorited,
  labels,
}: Props) {
  const [optimisticFav, setOptimisticFav] = useOptimistic(initialFavorited);
  const [isPending, startTransition] = useTransition();

  if (!canFavorite) {
    return (
      <Button asChild variant="outline" size="xs">
        <Link href={`/${lang}/login`}>{labels.loginToSave}</Link>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant={optimisticFav ? "default" : "outline"}
      size="icon-xs"
      disabled={isPending}
      className={cn(
        "rounded-full",
        optimisticFav && "bg-primary hover:bg-primary/90 border-primary text-primary-foreground"
      )}
      title={optimisticFav ? labels.saved : labels.save}
      aria-label={optimisticFav ? labels.saved : labels.save}
      onClick={() =>
        startTransition(async () => {
          setOptimisticFav(!optimisticFav);
          await toggleFavoriteBySlugAction(slug, lang);
        })
      }
    >
      <Bookmark className={cn("size-3.5", optimisticFav && "fill-current")} />
    </Button>
  );
}

