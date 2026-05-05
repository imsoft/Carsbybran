"use client";

import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { MarkdownEditor } from "./MarkdownEditor";
import { ImageUploader } from "./ImageUploader";
import { SpecsForm } from "./SpecsForm";
import { VersionsForm } from "./VersionsForm";
import { RatingsForm } from "./RatingsForm";
import { ProsConsForm } from "./ProsConsForm";
import { GalleryUploader } from "./GalleryUploader";
import { VideoForm } from "./VideoForm";
import type { Article, ArticleFormState } from "@/lib/definitions";
import { Save, Eye, CloudOff, Cloud } from "lucide-react";
import Link from "next/link";

type Props = {
  article?: Article;
  action: (state: ArticleFormState, formData: FormData) => Promise<ArticleFormState>;
};

const CATEGORIES = ["reviews", "comparisons", "news", "guides", "brands"];
const AUTOSAVE_MS = 30_000;
const initialState: ArticleFormState = {};

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export function ArticleEditor({ article, action }: Props) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const storageKey = article ? `cbb_draft_${article.id}` : "cbb_draft_new";
  const formRef = useRef<HTMLFormElement>(null);
  const [titleEs, setTitleEs] = useState(article?.titleEs ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [slugManual, setSlugManual] = useState(!!article?.slug);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "unsaved">("idle");

  useEffect(() => {
    if (!slugManual) setSlug(toSlug(titleEs));
  }, [titleEs, slugManual]);

  const saveToStorage = useCallback(() => {
    if (!formRef.current) return;
    const data = new FormData(formRef.current);
    const obj: Record<string, string> = { titleEs: titleEs, slug };
    data.forEach((v, k) => { if (typeof v === "string") obj[k] = v; });
    try {
      localStorage.setItem(storageKey, JSON.stringify({ ...obj, _savedAt: Date.now() }));
      setSaveStatus("saved");
    } catch { /* unavailable */ }
  }, [storageKey, titleEs, slug]);

  useEffect(() => {
    const id = setInterval(saveToStorage, AUTOSAVE_MS);
    return () => clearInterval(id);
  }, [saveToStorage]);

  useEffect(() => { setSaveStatus("unsaved"); }, [titleEs, slug]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-6">
      {state.message && (
        <p className={state.success ? "text-sm text-emerald-600" : "text-sm text-destructive"}>
          {state.message}
        </p>
      )}

      {/* ── Main editor tabs (first: contenido y bloques del artículo) ── */}
      <Tabs defaultValue="content-es" className="scroll-mt-4">
        <TabsList className="flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="content-es">🇲🇽 Contenido ES</TabsTrigger>
          <TabsTrigger value="content-en">🇺🇸 Content EN</TabsTrigger>
          <TabsTrigger value="specs">🔧 Ficha técnica</TabsTrigger>
          <TabsTrigger value="versions">📊 Versiones</TabsTrigger>
          <TabsTrigger value="ratings">⭐ Calificaciones</TabsTrigger>
          <TabsTrigger value="proscons">✅ Pros / Contras</TabsTrigger>
          <TabsTrigger value="gallery">🖼️ Galería</TabsTrigger>
          <TabsTrigger value="video">🎬 Video</TabsTrigger>
        </TabsList>

        {/* ── Contenido ES ── */}
        <TabsContent value="content-es" className="space-y-4 mt-4">
          <div className="space-y-1.5">
            <Label htmlFor="titleEs">Título</Label>
            <Input
              id="titleEs" name="titleEs"
              placeholder="Toyota GR86 2025: La Pureza del Placer"
              value={titleEs}
              onChange={(e) => setTitleEs(e.target.value)}
            />
            {state.errors?.titleEs && <p className="text-xs text-destructive">{state.errors.titleEs[0]}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="excerptEs">Resumen — máx. 300 chars</Label>
            <Textarea id="excerptEs" name="excerptEs" rows={2} maxLength={300}
              placeholder="Breve descripción..." defaultValue={article?.excerptEs} />
          </div>
          <div className="space-y-1.5">
            <Label>Contenido — Markdown</Label>
            <MarkdownEditor name="contentEs" defaultValue={article?.contentEs}
              placeholder="## Introducción\n\nEscribe el contenido en español..." />
            {state.errors?.contentEs && <p className="text-xs text-destructive">{state.errors.contentEs[0]}</p>}
          </div>
        </TabsContent>

        {/* ── Content EN ── */}
        <TabsContent value="content-en" className="space-y-4 mt-4">
          <div className="space-y-1.5">
            <Label htmlFor="titleEn">Title</Label>
            <Input id="titleEn" name="titleEn"
              placeholder="2025 Toyota GR86: The Purity of Driving Pleasure"
              defaultValue={article?.titleEn} />
            {state.errors?.titleEn && <p className="text-xs text-destructive">{state.errors.titleEn[0]}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="excerptEn">Excerpt — max 300 chars</Label>
            <Textarea id="excerptEn" name="excerptEn" rows={2} maxLength={300}
              placeholder="Brief description..." defaultValue={article?.excerptEn} />
          </div>
          <div className="space-y-1.5">
            <Label>Content — Markdown</Label>
            <MarkdownEditor name="contentEn" defaultValue={article?.contentEn}
              placeholder="## Introduction\n\nWrite the content in English..." />
            {state.errors?.contentEn && <p className="text-xs text-destructive">{state.errors.contentEn[0]}</p>}
          </div>
        </TabsContent>

        {/* ── Ficha técnica ── */}
        <TabsContent value="specs" className="mt-4">
          <SpecsForm defaultValue={article?.specs} />
        </TabsContent>

        {/* ── Versiones & precios ── */}
        <TabsContent value="versions" className="mt-4">
          <VersionsForm defaultValue={article?.versions} />
        </TabsContent>

        {/* ── Calificaciones ── */}
        <TabsContent value="ratings" className="mt-4">
          <RatingsForm defaultValue={article?.ratings} />
        </TabsContent>

        {/* ── Pros / Contras ── */}
        <TabsContent value="proscons" className="mt-4">
          <ProsConsForm defaultValue={article?.prosCons} />
        </TabsContent>

        {/* ── Galería ── */}
        <TabsContent value="gallery" className="mt-4">
          <GalleryUploader defaultValue={article?.gallery} />
        </TabsContent>

        {/* ── Video ── */}
        <TabsContent value="video" className="mt-4">
          <VideoForm defaultValue={article?.videoUrl} />
        </TabsContent>
      </Tabs>

      <Separator />

      {/* ── Publicación: URL, categoría, portada y acciones ── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-40 space-y-1.5">
          <Label htmlFor="slug">Slug (URL)</Label>
          <Input
            id="slug" name="slug" value={slug}
            onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }}
            placeholder="auto-generado-desde-titulo"
            className="font-mono text-sm"
          />
          {!slugManual && titleEs && (
            <p className="text-[11px] text-muted-foreground">Auto-generado desde el título ES</p>
          )}
          {state.errors?.slug && <p className="text-xs text-destructive">{state.errors.slug[0]}</p>}
        </div>

        <div className="min-w-0 flex-1 basis-[min(100%,12rem)] space-y-1.5">
          <Label htmlFor="category">Categoría</Label>
          <Select name="category" defaultValue={article?.category ?? "reviews"}>
            <SelectTrigger id="category"><SelectValue /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-0 flex-1 basis-[min(100%,11rem)] space-y-1.5">
          <Label htmlFor="status">Estado</Label>
          <Select name="status" defaultValue={article?.status ?? "draft"}>
            <SelectTrigger id="status"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Borrador</SelectItem>
              <SelectItem value="published">Publicado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {saveStatus === "saved" && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Cloud className="size-3" />Guardado localmente
            </span>
          )}
          {saveStatus === "unsaved" && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <CloudOff className="size-3" />Sin guardar
            </span>
          )}
          <Button type="button" variant="outline" size="sm" onClick={saveToStorage}>
            Guardar borrador
          </Button>
          {article && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/preview/${article.id}`} target="_blank">
                <Eye className="size-3.5 mr-1" />Preview
              </Link>
            </Button>
          )}
          <Button type="submit" size="sm" disabled={pending}>
            <Save className="size-3.5 mr-1" />
            {pending ? "Guardando…" : "Publicar"}
          </Button>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="tags">Tags (separados por coma)</Label>
        <Input
          id="tags" name="tags"
          placeholder="toyota, gr86, sports-car"
          defaultValue={article?.tags?.join(", ")}
        />
      </div>

      {/* Cover image */}
      <div className="space-y-1.5">
        <Label>Imagen de portada</Label>
        <ImageUploader name="coverImage" defaultPreview={article?.coverImage || undefined} />
      </div>
    </form>
  );
}
