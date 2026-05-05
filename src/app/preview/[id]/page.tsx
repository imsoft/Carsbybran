import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Geist } from "next/font/google";
import { ArrowLeft, Pencil } from "lucide-react";
import { SiteLogo } from "@/components/layout/SiteLogo";
import { ArticlePreview } from "@/components/admin/editor/ArticlePreview";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Badge } from "@/components/ui/badge";
import { getArticleById } from "@/lib/mock-articles";
import { cn } from "@/lib/utils";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticleById(id);
  return {
    title: article ? `Preview: ${article.titleEs}` : "No encontrado",
    robots: { index: false, follow: false },
  };
}

export default async function ArticlePreviewPage({ params }: Props) {
  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) notFound();

  return (
    <html suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{const t=localStorage.getItem('theme');if(t==='dark'||((!t||t==='system')&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <div
            className={cn(
              geist.variable,
              "font-sans min-h-dvh flex flex-col bg-background text-foreground antialiased"
            )}
          >
            {/* Admin preview banner — not part of the public blog */}
            <div className="bg-primary text-primary-foreground text-xs py-2 px-4 flex items-center gap-3">
              <Badge variant="secondary" className="text-[10px] h-5">
                PREVIEW
              </Badge>
              <span className="flex-1 text-center opacity-80">
                Vista previa — esto no está publicado todavía
              </span>
              <div className="flex items-center gap-2">
                <Button
                  asChild
                  size="sm"
                  variant="secondary"
                  className="h-6 text-xs px-2"
                >
                  <Link href={`/dashboard/articles/${id}`}>
                    <ArrowLeft className="size-3 mr-1" />
                    Editor
                  </Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  variant="secondary"
                  className="h-6 text-xs px-2"
                >
                  <Link href={`/dashboard/articles/${id}`}>
                    <Pencil className="size-3 mr-1" />
                    Editar
                  </Link>
                </Button>
              </div>
            </div>

            {/* Public blog Navbar (replica) */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
              <nav className="container mx-auto flex h-16 max-w-4xl items-center gap-4 px-4">
                <SiteLogo href="/" className="mr-2" imageClassName="h-8 w-auto" />
                <ul className="hidden md:flex items-center gap-0.5 text-sm text-muted-foreground">
                  {["Reviews", "Marcas", "Comparaciones"].map((l) => (
                    <li key={l}>
                      <span className="rounded-md px-3 py-1.5 font-medium">{l}</span>
                    </li>
                  ))}
                </ul>
                <div className="ml-auto">
                  <ThemeToggle />
                </div>
              </nav>
            </header>

            {/* Article content */}
            <main className="flex-1 container mx-auto max-w-4xl px-4 py-10">
              <Tabs defaultValue="es">
                <div className="flex items-center justify-between mb-8">
                  <TabsList>
                    <TabsTrigger value="es">🇲🇽 Español</TabsTrigger>
                    <TabsTrigger value="en">🇺🇸 English</TabsTrigger>
                  </TabsList>
                  <span className="text-xs text-muted-foreground">
                    Cambia idioma para previsualizar ambas versiones
                  </span>
                </div>
                <TabsContent value="es">
                  <ArticlePreview article={article} lang="es" />
                </TabsContent>
                <TabsContent value="en">
                  <ArticlePreview article={article} lang="en" />
                </TabsContent>
              </Tabs>
            </main>

            {/* Public blog Footer (replica) */}
            <footer className="border-t py-8 text-center text-xs text-muted-foreground">
              © {new Date().getFullYear()} Carsbybran — Expert automotive reviews
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
