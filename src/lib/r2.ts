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
const PUBLIC_BASE = (
  process.env.R2_PUBLIC_URL ?? `${process.env.R2_ENDPOINT}/${BUCKET}`
).replace(/\/$/, "");

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
  return `${PUBLIC_BASE}/${key}`;
}
