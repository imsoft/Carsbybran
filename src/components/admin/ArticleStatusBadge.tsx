import { Badge } from "@/components/ui/badge";
import type { ArticleStatus } from "@/lib/definitions";

export function ArticleStatusBadge({ status }: { status: ArticleStatus }) {
  return status === "published" ? (
    <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20">
      Publicado
    </Badge>
  ) : (
    <Badge variant="secondary">Borrador</Badge>
  );
}
