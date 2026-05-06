"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Bold, Italic, Heading2, Link2, Image, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  label?: string;
  rows?: number;
  /** Para checklist SEO / seguimiento del cuerpo sin controlar el estado interno */
  onValueChange?: (value: string) => void;
};

const TOOLBAR = [
  { icon: Bold, syntax: "**texto**", label: "Negrita" },
  { icon: Italic, syntax: "_texto_", label: "Cursiva" },
  { icon: Heading2, syntax: "\n## Título\n", label: "Título H2" },
  { icon: Link2, syntax: "[texto](url)", label: "Enlace" },
  { icon: Image, syntax: "![alt](url)", label: "Imagen" },
  { icon: List, syntax: "\n- elemento\n", label: "Lista" },
];

export function MarkdownEditor({
  name,
  defaultValue = "",
  placeholder,
  rows = 18,
  onValueChange,
}: Props) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    onValueChange?.(value);
  }, [value, onValueChange]);

  function insertSyntax(syntax: string) {
    setValue((v) => v + syntax);
  }

  const preview = renderMarkdownPreview(value);

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b bg-muted/40">
        {TOOLBAR.map(({ icon: Icon, syntax, label }) => (
          <Button
            key={label}
            type="button"
            variant="ghost"
            size="icon"
            className="size-7"
            title={label}
            onClick={() => insertSyntax(syntax)}
          >
            <Icon className="size-3.5" />
          </Button>
        ))}
      </div>

      {/* Write / Preview tabs */}
      <Tabs defaultValue="write">
        <div className="flex items-center px-2 py-1 border-b bg-muted/20">
          <TabsList className="h-7 p-0.5">
            <TabsTrigger value="write" className="h-6 text-xs px-3">
              Escribir
            </TabsTrigger>
            <TabsTrigger value="preview" className="h-6 text-xs px-3">
              Preview
            </TabsTrigger>
          </TabsList>
          <span className="ml-auto text-[10px] text-muted-foreground font-mono">
            {value.length} chars
          </span>
        </div>

        <TabsContent value="write" className="m-0">
          <Textarea
            name={name}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder ?? "Escribe en Markdown..."}
            rows={rows}
            className={cn(
              "rounded-none border-0 resize-none font-sans text-sm focus-visible:ring-0",
              "bg-background"
            )}
          />
        </TabsContent>

        <TabsContent value="preview" className="m-0">
          {/* Hidden input so form still submits value when on preview tab */}
          <input type="hidden" name={name} value={value} />
          <div
            className={cn(
              "prose prose-sm dark:prose-invert max-w-none p-4",
              "min-h-(--editor-height)"
            )}
            style={{ "--editor-height": `${rows * 1.5}rem` } as React.CSSProperties}
            dangerouslySetInnerHTML={{ __html: preview }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Minimal markdown → HTML (no deps). Handles headings, bold, italic, links, lists.
function renderMarkdownPreview(md: string): string {
  let html = md
    // Escape HTML
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // Headings
    .replace(/^### (.+)$/gm, "<h3 class='text-base font-semibold mt-4 mb-1'>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2 class='text-lg font-semibold mt-5 mb-2'>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1 class='text-xl font-bold mt-6 mb-2'>$1</h1>")
    // Bold / italic
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/_(.+?)_/g, "<em>$1</em>")
    // Images before links
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "<img src='$2' alt='$1' class='rounded my-2 max-w-full' />")
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "<a href='$2' class='text-accent underline'>$1</a>")
    // Unordered lists
    .replace(/^- (.+)$/gm, "<li class='ml-4 list-disc'>$1</li>")
    // Paragraphs (double newline)
    .replace(/\n{2,}/g, "</p><p class='mb-3'>");

  return `<p class='mb-3'>${html}</p>`;
}
