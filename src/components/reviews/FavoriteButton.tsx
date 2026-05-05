"use client";

import { useOptimistic, useTransition } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleFavoriteAction } from "@/app/actions/user";
import { cn } from "@/lib/utils";

type Props = {
  articleId: string;
  lang: string;
  initialFavorited: boolean;
  labels: { save: string; saved: string };
};

export function FavoriteButton({ articleId, lang, initialFavorited, labels }: Props) {
  const [optimisticFav, setOptimisticFav] = useOptimistic(initialFavorited);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      setOptimisticFav(!optimisticFav);
      await toggleFavoriteAction(articleId, lang);
    });
  }

  return (
    <Button
      variant={optimisticFav ? "default" : "outline"}
      size="sm"
      onClick={handleClick}
      disabled={isPending}
      className={cn("gap-1.5", optimisticFav && "bg-rose-500 hover:bg-rose-600 border-rose-500 text-white")}
    >
      <Heart className={cn("size-4", optimisticFav && "fill-current")} />
      {optimisticFav ? labels.saved : labels.save}
    </Button>
  );
}
