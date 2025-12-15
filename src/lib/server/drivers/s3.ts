import { Client } from "minio";
import { env } from "$lib/env/env.server";

const url = new URL(env.S3_ENDPOINT);

export const s3 = new Client({
  endPoint: url.hostname,
  port: url.port ? parseInt(url.port, 10) : url.protocol === "https:" ? 443 : 80,
  useSSL: url.protocol === "https:",
  accessKey: env.S3_ACCESS_KEY,
  secretKey: env.S3_SECRET_KEY,
});

export const bucket = env.S3_BUCKET;

// Ensure bucket exists and is public (for dev)
const publicPolicy = {
  Version: "2012-10-17",
  Statement: [
    {
      Effect: "Allow",
      Principal: { AWS: ["*"] },
      Action: ["s3:GetObject"],
      Resource: [`arn:aws:s3:::${bucket}/*`],
    },
  ],
};

let initialized = false;
export async function ensureBucket() {
  if (initialized) return;
  initialized = true;

  const exists = await s3.bucketExists(bucket);
  if (!exists) {
    await s3.makeBucket(bucket);
  }
  await s3.setBucketPolicy(bucket, JSON.stringify(publicPolicy));
}
