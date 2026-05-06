import "server-only";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.R2_BUCKET_NAME!;

/**
 * Base pública para URLs de objetos (navegador / next/image).
 * Debe ser el dominio público de R2 (p. ej. `https://pub-xxx.r2.dev` o un custom domain),
 * nunca el endpoint API `*.r2.cloudflarestorage.com` (eso devuelve 400/403 en GET anónimo).
 */
function getPublicBase(): string {
  const raw = process.env.R2_PUBLIC_URL?.trim();
  if (!raw) {
    throw new Error(
      "Falta R2_PUBLIC_URL. En Cloudflare R2: R2 → tu bucket → Settings → Public access → " +
        "URL pública (r2.dev o dominio propio). Configúrala en Vercel sin barra final. " +
        "No uses R2_ENDPOINT como URL pública."
    );
  }
  const base = raw.replace(/\/$/, "");
  if (base.includes("r2.cloudflarestorage.com")) {
    throw new Error(
      "R2_PUBLIC_URL no debe apuntar a *.r2.cloudflarestorage.com (API S3). " +
        "Usa la URL pública del bucket (r2.dev o custom domain) del panel de R2."
    );
  }
  return base;
}

/** Segmentos seguros para prefijos R2 (IDs internos art_user, art_, etc.). */
export function r2SafeSegment(id: string): string {
  return id.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 200) || "unknown";
}

export async function uploadToR2(
  key: string,
  body: ArrayBuffer,
  contentType: string,
  opts?: { cacheControl?: string }
): Promise<string> {
  await r2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: new Uint8Array(body),
      ContentType: contentType,
      ...(opts?.cacheControl ? { CacheControl: opts.cacheControl } : {}),
    })
  );
  return `${getPublicBase()}/${key}`;
}
