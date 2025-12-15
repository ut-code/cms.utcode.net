import { s3, bucket } from "$lib/server/drivers/s3";
import { env } from "$lib/env/env.server";

export async function uploadFile(file: File, path: string): Promise<{ url: string; key: string }> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const key = `${path}/${crypto.randomUUID()}-${file.name}`;

  await s3.putObject(bucket, key, buffer, file.size, {
    "Content-Type": file.type,
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
