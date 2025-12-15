import * as v from "valibot";

const TursoEnv = v.union([
  v.object({
    DATABASE_URL: v.pipe(v.string(), v.startsWith("file:")),
    DATABASE_AUTH_TOKEN: v.optional(v.string()),
  }),
  v.object({
    DATABASE_URL: v.pipe(v.string(), v.startsWith("libsql:")),
    DATABASE_AUTH_TOKEN: v.string(),
  }),
]);

const AuthEnv = v.object({
  GITHUB_CLIENT_ID: v.string(),
  GITHUB_CLIENT_SECRET: v.string(),
  BETTER_AUTH_SECRET: v.string(),
  BETTER_AUTH_URL: v.string(),
});

const S3Env = v.object({
  S3_ENDPOINT: v.string(),
  S3_ACCESS_KEY: v.string(),
  S3_SECRET_KEY: v.string(),
  S3_BUCKET: v.string(),
  S3_PUBLIC_URL: v.string(),
});

const Env = v.intersect([TursoEnv, AuthEnv, S3Env]);

export const env = v.parse(Env, process.env);
