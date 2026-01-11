import { Client } from "minio";
import { env } from "$lib/env/env.server";

let _s3: Client | null = null;

function getS3(): Client {
  if (!_s3) {
    const url = new URL(env.S3_ENDPOINT);
    _s3 = new Client({
      endPoint: url.hostname,
      port: url.port ? parseInt(url.port, 10) : url.protocol === "https:" ? 443 : 80,
      useSSL: url.protocol === "https:",
      accessKey: env.S3_ACCESS_KEY,
      secretKey: env.S3_SECRET_KEY,
    });
  }
  return _s3;
}

// Lazy-initialized s3 client via Proxy
export const s3: Client = new Proxy({} as Client, {
  get(_, prop) {
    const instance = getS3();
    const value = instance[prop as keyof Client];
    if (typeof value === "function") {
      return (value as (...args: unknown[]) => unknown).bind(instance);
    }
    return value;
  },
});

export function getBucket(): string {
  return env.S3_BUCKET;
}

// Ensure bucket exists and is public (for dev)
let initialized = false;
export async function ensureBucket() {
  if (initialized) return;
  initialized = true;

  const bucketName = env.S3_BUCKET;
  const publicPolicy = {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Principal: { AWS: ["*"] },
        Action: ["s3:GetObject"],
        Resource: [`arn:aws:s3:::${bucketName}/*`],
      },
    ],
  };

  const exists = await s3.bucketExists(bucketName);
  if (!exists) {
    await s3.makeBucket(bucketName);
  }
  await s3.setBucketPolicy(bucketName, JSON.stringify(publicPolicy));
}
