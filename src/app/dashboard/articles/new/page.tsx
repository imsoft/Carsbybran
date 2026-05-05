import type { Metadata } from "next";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { ArticleEditor } from "@/components/admin/editor/ArticleEditor";
import { createArticle } from "@/app/actions/articles";

export const metadata: Metadata = { title: "Nuevo artículo" };

export default function NewArticlePage() {
  return (
    <>
      <DashboardHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Artículos", href: "/dashboard/articles" },
          { label: "Nuevo artículo" },
        ]}
      />
      <main className="flex-1 overflow-auto p-6">
        <ArticleEditor action={createArticle} />
      </main>
    </>
  );
}
