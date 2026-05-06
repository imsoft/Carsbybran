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
import { SeoAioChecklist } from "./SeoAioChecklist";
import type {
  Article,
  ArticleFormState,
  ArticleProsCons,
  ArticleVersion,
} from "@/lib/definitions";
import {
  translateEnToEs,
  translateEsToEn,
  translateProsConsEnToEs,
  translateProsConsEsToEn,
  translateVersionsEnToEs,
  translateVersionsEsToEn,
} from "@/app/actions/translate";
import { Save, Eye, CloudOff, Cloud, Languages } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  article?: Article;
  action: (state: ArticleFormState, formData: FormData) => Promise<ArticleFormState>;
};

const CATEGORIES = ["reviews", "comparisons", "news", "guides", "brands"];
const AUTOSAVE_MS = 30_000;
const initialState: ArticleFormState = {};

const emptyVersion = (): ArticleVersion => ({
  name: "",
  priceMin: "",
  priceMax: "",
  highlights: "",
});

const defaultProsCons = (): ArticleProsCons => ({
  pros: [{ text: "" }],
  cons: [{ text: "" }],
});

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
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, initialState);
  const storageKey = article ? `cbb_draft_${article.id}` : "cbb_draft_new";
  const formRef = useRef<HTMLFormElement>(null);
  const serverDataKey = article ? `${article.id}:${article.updatedAt}` : "new";
  const [titleEs, setTitleEs] = useState(article?.titleEs ?? "");
  const [excerptEs, setExcerptEs] = useState(article?.excerptEs ?? "");
  const [contentEsDraft, setContentEsDraft] = useState(article?.contentEs ?? "");
  const [titleEn, setTitleEn] = useState(article?.titleEn ?? "");
  const [excerptEn, setExcerptEn] = useState(article?.excerptEn ?? "");
  const [contentEnDraft, setContentEnDraft] = useState(article?.contentEn ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [slugManual, setSlugManual] = useState(!!article?.slug);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "unsaved">("idle");
  const [translating, setTranslating] = useState<"idle" | "to-en" | "to-es">("idle");
  const [versionsEs, setVersionsEs] = useState<ArticleVersion[]>(() =>
    article?.versions?.length ? article.versions : [emptyVersion()]
  );
  const [versionsEn, setVersionsEn] = useState<ArticleVersion[]>(() =>
    article?.versionsEn?.length ? article.versionsEn : [emptyVersion()]
  );
  const [prosConsEs, setProsConsEs] = useState<ArticleProsCons>(() =>
    article?.prosCons ?? defaultProsCons()
  );
  const [prosConsEn, setProsConsEn] = useState<ArticleProsCons>(() =>
    article?.prosConsEn ?? defaultProsCons()
  );

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

  useEffect(() => {
    setSaveStatus("unsaved");
  }, [
    titleEs,
    excerptEs,
    contentEsDraft,
    titleEn,
    excerptEn,
    contentEnDraft,
    slug,
    versionsEs,
    versionsEn,
    prosConsEs,
    prosConsEn,
  ]);

  useEffect(() => {
    if (state.success && article?.id) {
      router.refresh();
    }
  }, [state.success, article?.id, router]);

  async function handleTranslateToEn() {
    setTranslating("to-en");
    try {
      const r = await translateEsToEn({
        titleEs,
        excerptEs,
        contentEs: contentEsDraft,
        versions: versionsEs,
        prosCons: prosConsEs,
      });
      if (!r.ok) {
        toast.error(r.error);
        return;
      }
      setTitleEn(r.titleEn);
      setExcerptEn(r.excerptEn);
      setContentEnDraft(r.contentEn);
      if (r.versionsEn) setVersionsEn(r.versionsEn);
      if (r.prosConsEn) setProsConsEn(r.prosConsEn);
      toast.success("Campos EN actualizados con Google Translate. Revísalos antes de publicar.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo traducir (sesión o red).");
    } finally {
      setTranslating("idle");
    }
  }

  async function handleTranslateToEs() {
    setTranslating("to-es");
    try {
      const r = await translateEnToEs({
        titleEn,
        excerptEn,
        contentEn: contentEnDraft,
        versions: versionsEn,
        prosCons: prosConsEn,
      });
      if (!r.ok) {
        toast.error(r.error);
        return;
      }
      setTitleEs(r.titleEs);
      setExcerptEs(r.excerptEs);
      setContentEsDraft(r.contentEs);
      if (r.versionsEs) setVersionsEs(r.versionsEs);
      if (r.prosConsEs) setProsConsEs(r.prosConsEs);
      toast.success("Campos ES actualizados con Google Translate. Revísalos antes de publicar.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo traducir (sesión o red).");
    } finally {
      setTranslating("idle");
    }
  }

  async function handleTranslateVersionsToEn() {
    setTranslating("to-en");
    try {
      const r = await translateVersionsEsToEn(versionsEs);
      if (!r.ok) {
        toast.error(r.error);
        return;
      }
      setVersionsEn(r.versions);
      toast.success("Versiones traducidas al inglés. Revísalas antes de publicar.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo traducir (sesión o red).");
    } finally {
      setTranslating("idle");
    }
  }

  async function handleTranslateVersionsToEs() {
    setTranslating("to-es");
    try {
      const r = await translateVersionsEnToEs(versionsEn);
      if (!r.ok) {
        toast.error(r.error);
        return;
      }
      setVersionsEs(r.versions);
      toast.success("Versiones traducidas al español. Revísalas antes de publicar.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo traducir (sesión o red).");
    } finally {
      setTranslating("idle");
    }
  }

  async function handleTranslateProsConsToEn() {
    setTranslating("to-en");
    try {
      const r = await translateProsConsEsToEn(prosConsEs);
      if (!r.ok) {
        toast.error(r.error);
        return;
      }
      setProsConsEn(r.prosCons);
      toast.success("Pros/contras traducidos al inglés. Revísalos antes de publicar.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo traducir (sesión o red).");
    } finally {
      setTranslating("idle");
    }
  }

  async function handleTranslateProsConsToEs() {
    setTranslating("to-es");
    try {
      const r = await translateProsConsEnToEs(prosConsEn);
      if (!r.ok) {
        toast.error(r.error);
        return;
      }
      setProsConsEs(r.prosCons);
      toast.success("Pros/contras traducidos al español. Revísalos antes de publicar.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo traducir (sesión o red).");
    } finally {
      setTranslating("idle");
    }
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      encType="multipart/form-data"
      className="flex flex-col gap-6"
    >
      {state.message && (
        <p className={state.success ? "text-sm text-emerald-600" : "text-sm text-destructive"}>
          {state.message}
        </p>
      )}

      <SeoAioChecklist
        titleEs={titleEs}
        excerptEs={excerptEs}
        contentMd={contentEsDraft}
        article={article}
      />

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
        <TabsContent value="content-es" forceMount className="space-y-4 mt-4">
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              disabled={translating !== "idle"}
              onClick={handleTranslateToEs}
            >
              <Languages className="size-3.5" />
              {translating === "to-es" ? "Traduciendo…" : "Desde inglés (Google)"}
            </Button>
          </div>
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
            <Textarea
              id="excerptEs"
              name="excerptEs"
              rows={2}
              maxLength={300}
              placeholder="Breve descripción..."
              value={excerptEs}
              onChange={(e) => setExcerptEs(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Contenido — Markdown</Label>
            <MarkdownEditor
              name="contentEs"
              defaultValue={article?.contentEs}
              value={contentEsDraft}
              onChange={setContentEsDraft}
              placeholder="## Introducción\n\nEscribe el contenido en español..."
            />
            {state.errors?.contentEs && <p className="text-xs text-destructive">{state.errors.contentEs[0]}</p>}
          </div>
        </TabsContent>

        {/* ── Content EN ── */}
        <TabsContent value="content-en" forceMount className="space-y-4 mt-4">
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="gap-1.5"
              disabled={translating !== "idle"}
              onClick={handleTranslateToEn}
            >
              <Languages className="size-3.5" />
              {translating === "to-en" ? "Traduciendo…" : "Desde español (Google)"}
            </Button>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="titleEn">Title</Label>
            <Input
              id="titleEn"
              name="titleEn"
              placeholder="2025 Toyota GR86: The Purity of Driving Pleasure"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
            />
            {state.errors?.titleEn && <p className="text-xs text-destructive">{state.errors.titleEn[0]}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="excerptEn">Excerpt — max 300 chars</Label>
            <Textarea
              id="excerptEn"
              name="excerptEn"
              rows={2}
              maxLength={300}
              placeholder="Brief description..."
              value={excerptEn}
              onChange={(e) => setExcerptEn(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Content — Markdown</Label>
            <MarkdownEditor
              name="contentEn"
              defaultValue={article?.contentEn}
              value={contentEnDraft}
              onChange={setContentEnDraft}
              placeholder="## Introduction\n\nWrite the content in English..."
            />
            {state.errors?.contentEn && <p className="text-xs text-destructive">{state.errors.contentEn[0]}</p>}
          </div>
        </TabsContent>

        {/* ── Ficha técnica ── */}
        <TabsContent value="specs" forceMount className="mt-4">
          <SpecsForm key={`specs-${serverDataKey}`} defaultValue={article?.specs} />
        </TabsContent>

        {/* ── Versiones & precios (ES + EN por separado) ── */}
        <TabsContent value="versions" forceMount className="mt-4 space-y-4">
          <p className="text-xs text-muted-foreground">
            Edita español e inglés por separado. Traducir rellena solo la otra lengua; los precios en EN suelen copiarse del bloque ES al traducir.
          </p>
          <Tabs defaultValue="ver-es" className="w-full">
            <TabsList className="h-9">
              <TabsTrigger value="ver-es" className="text-xs">
                🇲🇽 Español
              </TabsTrigger>
              <TabsTrigger value="ver-en" className="text-xs">
                🇺🇸 English
              </TabsTrigger>
            </TabsList>
            <TabsContent value="ver-es" forceMount className="mt-4 space-y-3">
              <div className="flex flex-wrap justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  disabled={translating !== "idle"}
                  onClick={handleTranslateVersionsToEs}
                >
                  <Languages className="size-3.5" />
                  {translating === "to-es" ? "Traduciendo…" : "Desde inglés (Google)"}
                </Button>
              </div>
              <VersionsForm value={versionsEs} onChange={setVersionsEs} formHiddenName="versions" />
            </TabsContent>
            <TabsContent value="ver-en" forceMount className="mt-4 space-y-3">
              <div className="flex flex-wrap justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="gap-1.5"
                  disabled={translating !== "idle"}
                  onClick={handleTranslateVersionsToEn}
                >
                  <Languages className="size-3.5" />
                  {translating === "to-en" ? "Traduciendo…" : "Desde español (Google)"}
                </Button>
              </div>
              <VersionsForm value={versionsEn} onChange={setVersionsEn} formHiddenName="versionsEn" />
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* ── Calificaciones ── */}
        <TabsContent value="ratings" forceMount className="mt-4">
          <RatingsForm key={`ratings-${serverDataKey}`} defaultValue={article?.ratings} />
        </TabsContent>

        {/* ── Pros / Contras (ES + EN) ── */}
        <TabsContent value="proscons" forceMount className="mt-4 space-y-4">
          <Tabs defaultValue="pc-es" className="w-full">
            <TabsList className="h-9">
              <TabsTrigger value="pc-es" className="text-xs">
                🇲🇽 Español
              </TabsTrigger>
              <TabsTrigger value="pc-en" className="text-xs">
                🇺🇸 English
              </TabsTrigger>
            </TabsList>
            <TabsContent value="pc-es" forceMount className="mt-4 space-y-3">
              <div className="flex flex-wrap justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  disabled={translating !== "idle"}
                  onClick={handleTranslateProsConsToEs}
                >
                  <Languages className="size-3.5" />
                  {translating === "to-es" ? "Traduciendo…" : "Desde inglés (Google)"}
                </Button>
              </div>
              <ProsConsForm value={prosConsEs} onChange={setProsConsEs} formHiddenName="prosCons" />
            </TabsContent>
            <TabsContent value="pc-en" forceMount className="mt-4 space-y-3">
              <div className="flex flex-wrap justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="gap-1.5"
                  disabled={translating !== "idle"}
                  onClick={handleTranslateProsConsToEn}
                >
                  <Languages className="size-3.5" />
                  {translating === "to-en" ? "Traduciendo…" : "Desde español (Google)"}
                </Button>
              </div>
              <ProsConsForm value={prosConsEn} onChange={setProsConsEn} formHiddenName="prosConsEn" />
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* ── Galería ── */}
        <TabsContent value="gallery" forceMount className="mt-4">
          <GalleryUploader key={`gallery-${serverDataKey}`} defaultValue={article?.gallery} />
        </TabsContent>

        {/* ── Video ── */}
        <TabsContent value="video" forceMount className="mt-4">
          <VideoForm key={`video-${serverDataKey}`} defaultValue={article?.videoUrl} />
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

      {/* Cover image — key fuerza remount tras guardar para alinear con URL del servidor */}
      <div className="space-y-1.5">
        <Label>Imagen de portada</Label>
        <ImageUploader
          key={article ? `cover-${serverDataKey}` : "cover-new"}
          name="coverImage"
          defaultPreview={article?.coverImage || undefined}
        />
      </div>
    </form>
  );
}
