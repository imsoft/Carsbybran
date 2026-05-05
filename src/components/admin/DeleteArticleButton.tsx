"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteArticle } from "@/app/actions/articles";

export function DeleteArticleButton({ articleId }: { articleId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="h-7 px-2 text-xs text-destructive hover:text-destructive"
      disabled={pending}
      onClick={() => {
        if (
          !confirm(
            "¿Eliminar este artículo de forma permanente? Esta acción no se puede deshacer."
          )
        ) {
          return;
        }
        startTransition(() => {
          void deleteArticle(articleId);
        });
      }}
      aria-label="Eliminar artículo"
    >
      <Trash2 className="size-3.5 mr-0.5 shrink-0" />
      {pending ? "…" : "Eliminar"}
    </Button>
  );
}
