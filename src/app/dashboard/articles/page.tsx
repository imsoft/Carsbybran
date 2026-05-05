import Link from "next/link";
import { Plus } from "lucide-react";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { ArticleStatusBadge } from "@/components/admin/ArticleStatusBadge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getArticles } from "@/lib/mock-articles";
import { toggleArticleStatus, deleteArticle } from "@/app/actions/articles";

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <>
      <DashboardHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Artículos" },
        ]}
      />
      <main className="flex-1 overflow-auto p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {articles.length} artículo{articles.length !== 1 ? "s" : ""} en total
          </p>
          <Button asChild size="sm">
            <Link href="/dashboard/articles/new">
              <Plus className="size-3.5 mr-1" />
              Nuevo artículo
            </Link>
          </Button>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead className="w-28">Categoría</TableHead>
                <TableHead className="w-28">Estado</TableHead>
                <TableHead className="w-24 text-right">Vistas</TableHead>
                <TableHead className="w-28">Actualizado</TableHead>
                <TableHead className="w-36 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm truncate max-w-xs">
                        {article.titleEs}
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-xs">
                        {article.titleEn}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs capitalize">
                      {article.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <ArticleStatusBadge status={article.status} />
                  </TableCell>
                  <TableCell className="text-right text-sm tabular-nums">
                    {article.views.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(article.updatedAt).toLocaleDateString("es-MX", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-xs">
                        <Link href={`/dashboard/articles/${article.id}`}>Editar</Link>
                      </Button>
                      <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-xs">
                        <Link href={`/preview/${article.id}`} target="_blank">
                          Preview
                        </Link>
                      </Button>
                      <form
                        action={toggleArticleStatus.bind(null, article.id)}
                        className="inline"
                      >
                        <Button
                          type="submit"
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs"
                        >
                          {article.status === "published" ? "Despublicar" : "Publicar"}
                        </Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </>
  );
}
