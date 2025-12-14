import { Client } from "minio";
import { env } from "$lib/env/env.server";

const url = new URL(env.S3_ENDPOINT);

export const s3 = new Client({
  endPoint: url.hostname,
  port: url.port ? parseInt(url.port) : url.protocol === "https:" ? 443 : 80,
  useSSL: url.protocol === "https:",
  accessKey: env.S3_ACCESS_KEY,
  secretKey: env.S3_SECRET_KEY,
});

export const bucket = env.S3_BUCKET;
