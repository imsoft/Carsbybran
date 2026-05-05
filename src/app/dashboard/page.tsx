import Link from "next/link";
import { FileText, Eye, BookOpen, FilePen, Plus, ArrowRight } from "lucide-react";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { StatsCard } from "@/components/admin/StatsCard";
import { ArticleStatusBadge } from "@/components/admin/ArticleStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getArticles, getArticleStats } from "@/lib/mock-articles";

export default async function DashboardPage() {
  const [stats, allArticles] = await Promise.all([getArticleStats(), getArticles()]);
  const recent = allArticles.slice(0, 5);

  return (
    <>
      <DashboardHeader breadcrumbs={[{ label: "Dashboard" }]} />
      <main className="flex-1 overflow-auto p-6 space-y-6">
        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total artículos"
            value={stats.total}
            description="En todas las categorías"
            icon={<FileText className="size-4" />}
          />
          <StatsCard
            title="Publicados"
            value={stats.published}
            description="Visibles en el sitio"
            icon={<BookOpen className="size-4" />}
          />
          <StatsCard
            title="Borradores"
            value={stats.drafts}
            description="Pendientes de publicar"
            icon={<FilePen className="size-4" />}
          />
          <StatsCard
            title="Vistas totales"
            value={stats.totalViews.toLocaleString()}
            description="Suma de todos los artículos"
            icon={<Eye className="size-4" />}
          />
        </div>

        {/* Recent articles */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Artículos recientes</CardTitle>
            <div className="flex items-center gap-2">
              <Button asChild size="sm">
                <Link href="/dashboard/articles/new">
                  <Plus className="size-3.5 mr-1" />
                  Nuevo
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard/articles">
                  Ver todos
                  <ArrowRight className="size-3.5 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {recent.map((article) => (
                <div
                  key={article.id}
                  className="flex items-center gap-3 px-6 py-3 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{article.titleEs}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {article.titleEn}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <ArticleStatusBadge status={article.status} />
                    <span className="text-xs text-muted-foreground w-16 text-right">
                      {article.views.toLocaleString()} vistas
                    </span>
                    <Button asChild variant="ghost" size="sm" className="h-7 px-2">
                      <Link href={`/dashboard/articles/${article.id}`}>Editar</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <Link href="/dashboard/articles/new" className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Plus className="size-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Nuevo artículo</p>
                  <p className="text-xs text-muted-foreground">
                    Editor markdown bilingüe
                  </p>
                </div>
                <ArrowRight className="size-4 ml-auto text-muted-foreground" />
              </Link>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <Link href="/dashboard/articles" className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-accent/10 flex items-center justify-center">
                  <FileText className="size-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium">Gestionar artículos</p>
                  <p className="text-xs text-muted-foreground">
                    Ver, editar y publicar
                  </p>
                </div>
                <ArrowRight className="size-4 ml-auto text-muted-foreground" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
