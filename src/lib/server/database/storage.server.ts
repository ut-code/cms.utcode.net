import { s3, bucket, ensureBucket } from "$lib/server/drivers/s3";
import { env } from "$lib/env/env.server";

export async function uploadBuffer(
  buffer: Buffer,
  contentType: string,
  fileName: string,
  path: string,
): Promise<{ url: string; key: string }> {
  await ensureBucket();

  const key = `${path}/${crypto.randomUUID()}-${fileName}`;

  await s3.putObject(bucket, key, buffer, buffer.length, {
    "Content-Type": contentType,
  });

  const url = `${env.S3_PUBLIC_URL}/${key}`;
  return { url, key };
}

export async function deleteFile(key: string): Promise<void> {
  await s3.removeObject(bucket, key);
}

export async function listFiles(prefix: string): Promise<string[]> {
  const stream = s3.listObjects(bucket, prefix, true);
  const keys: string[] = [];

  return new Promise((resolve, reject) => {
    stream.on("data", (obj) => {
      if (obj.name) keys.push(obj.name);
    });
    stream.on("error", reject);
    stream.on("end", () => resolve(keys));
  });
}
