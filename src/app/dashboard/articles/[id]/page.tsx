import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { ArticleEditor } from "@/components/admin/editor/ArticleEditor";
import { getArticleById } from "@/lib/mock-articles";
import { updateArticle } from "@/app/actions/articles";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticleById(id);
  return { title: article ? `Editar: ${article.titleEs}` : "Artículo no encontrado" };
}

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) notFound();

  const action = updateArticle.bind(null, id);

  return (
    <>
      <DashboardHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Artículos", href: "/dashboard/articles" },
          { label: article.titleEs },
        ]}
      />
      <main className="flex-1 overflow-auto p-6">
        <ArticleEditor article={article} action={action} />
      </main>
    </>
  );
}
