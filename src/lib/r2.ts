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

export async function uploadToR2(
  key: string,
  body: ArrayBuffer,
  contentType: string
): Promise<string> {
  await r2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: new Uint8Array(body),
      ContentType: contentType,
    })
  );
  return `${PUBLIC_BASE}/${key}`;
}
