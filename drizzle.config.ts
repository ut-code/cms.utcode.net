import { defineConfig } from "drizzle-kit";
import { env } from "./src/lib/env/env.server.ts";

const isLocal = env.DATABASE_URL.startsWith("file:");

export default defineConfig({
  schema: "./src/lib/shared/models/schema.ts",
  dialect: isLocal ? "sqlite" : "turso",
  dbCredentials: isLocal
    ? { url: env.DATABASE_URL }
    : { url: env.DATABASE_URL, authToken: env.DATABASE_AUTH_TOKEN },
  verbose: true,
  strict: true,
});
