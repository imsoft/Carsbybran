/** Markdown editorial → HTML seguro básico (contenido del admin). */

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function inlineMd(raw: string): string {
  return raw
    .replace(/\*\*(.+?)\*\*/g, (_, x) => `<strong>${esc(x)}</strong>`)
    .replace(/_(.+?)_/g, (_, x) => `<em>${esc(x)}</em>`)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => {
      return `<img src="${esc(src)}" alt="${esc(alt)}" class="rounded-xl w-full max-h-[480px] object-cover my-4" loading="lazy" />`;
    })
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, href) => {
      return `<a href="${esc(href)}" class="text-primary font-medium underline underline-offset-2 hover:opacity-90">${esc(text)}</a>`;
    });
}

/** Parte el cuerpo por encabezados ## para maquetar secciones. */
export function splitArticleSections(md: string): string[] {
  return md.replace(/\r\n/g, "\n").split(/(?=^## )/m).filter(Boolean);
}

export function parseArticleMarkdown(md: string): string {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const blocks: string[] = [];
  let textBuf: string[] = [];
  let listBuf: string[] = [];

  const flushText = () => {
    if (!textBuf.length) return;
    const chunk = textBuf.join("\n").trim();
    textBuf = [];
    if (!chunk) return;
    const paras = chunk.split(/\n{2,}/);
    for (const p of paras) {
      const oneLine = p.replace(/\n+/g, " ").trim();
      if (!oneLine) continue;
      blocks.push(`<p>${inlineMd(oneLine)}</p>`);
    }
  };

  const flushList = () => {
    if (!listBuf.length) return;
    blocks.push(
      `<ul class="my-6 space-y-2.5 pl-6 list-disc marker:text-primary/80">${listBuf
        .map((li) => `<li class="leading-relaxed">${inlineMd(li)}</li>`)
        .join("")}</ul>`
    );
    listBuf = [];
  };

  for (const line of lines) {
    const t = line.trim();
    if (!t) {
      flushList();
      flushText();
      continue;
    }

    if (t.startsWith("### ")) {
      flushList();
      flushText();
      blocks.push(`<h3>${esc(t.slice(4))}</h3>`);
      continue;
    }
    if (t.startsWith("## ")) {
      flushList();
      flushText();
      blocks.push(`<h2>${esc(t.slice(3))}</h2>`);
      continue;
    }
    if (t.startsWith("# ") && !t.startsWith("##")) {
      flushList();
      flushText();
      blocks.push(`<h2>${esc(t.slice(2))}</h2>`);
      continue;
    }

    const li = t.match(/^[-*] (.+)$/);
    if (li) {
      flushText();
      listBuf.push(li[1]);
      continue;
    }

    const soloImg = t.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (soloImg) {
      flushList();
      flushText();
      blocks.push(`<div class="my-8">${inlineMd(t)}</div>`);
      continue;
    }

    flushList();
    textBuf.push(t);
  }

  flushList();
  flushText();
  return blocks.join("\n");
}
