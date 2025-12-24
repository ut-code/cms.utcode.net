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

  CLOUDFLARE_ZONE_ID: v.optional(v.string()),
  CLOUDFLARE_API_TOKEN: v.optional(v.string()),
});

export const env = v.parse(Env, process.env);

// Production guard: UNSAFE_DISABLE_AUTH must never be enabled in production
if (env.UNSAFE_DISABLE_AUTH === "true" && process.env.NODE_ENV === "production") {
  throw new Error("UNSAFE_DISABLE_AUTH cannot be enabled in production");
}
