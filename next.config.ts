import type { NextConfig } from "next";

type RemotePattern = NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
>[number];

/** Hostname permitido para next/image a partir de R2_PUBLIC_URL (p. ej. dominio custom en R2). */
function remotePatternFromEnvUrl(urlStr: string | undefined): RemotePattern | null {
  if (!urlStr?.trim()) return null;
  try {
    const u = new URL(urlStr.trim());
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    if (!u.hostname) return null;
    return {
      protocol: u.protocol === "https:" ? "https" : "http",
      hostname: u.hostname,
    };
  } catch {
    return null;
  }
}

function dedupeRemotePatterns(patterns: RemotePattern[]): RemotePattern[] {
  const seen = new Set<string>();
  const out: RemotePattern[] = [];
  for (const p of patterns) {
    const key = `${p.protocol ?? "https"}://${p.hostname}:${p.port ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(p);
  }
  return out;
}

const fromR2Public = remotePatternFromEnvUrl(process.env.R2_PUBLIC_URL);

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    serverActions: {
      // Portadas suelen pesar >1MB; subimos límite para multipart de editor.
      bodySizeLimit: "6mb",
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 365,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: dedupeRemotePatterns([
      { protocol: "https", hostname: "images.unsplash.com" },
      // `**` = cualquier profundidad de subdominio (ver docs de remotePatterns en Next.js)
      { protocol: "https", hostname: "**.r2.cloudflarestorage.com" },
      { protocol: "https", hostname: "**.r2.dev" },
      ...(fromR2Public ? [fromR2Public] : []),
    ]),
  },
};

export default nextConfig;
