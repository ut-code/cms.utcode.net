import * as v from "valibot";

const Env = v.object({
  DATABASE_URL: v.string(),
  GITHUB_CLIENT_ID: v.string(),
  GITHUB_CLIENT_SECRET: v.string(),
  BETTER_AUTH_SECRET: v.string(),
  BETTER_AUTH_URL: v.string(),

  S3_ENDPOINT: v.string(),
  S3_ACCESS_KEY: v.string(),
  S3_SECRET_KEY: v.string(),
  S3_BUCKET: v.string(),
  S3_PUBLIC_URL: v.string(),
  UNSAFE_DISABLE_AUTH: v.optional(v.picklist(["true"])),

  CLOUDFLARE_ZONE_ID: v.string(),
  CLOUDFLARE_API_TOKEN: v.string(),
});

export const env = v.parse(Env, process.env);
