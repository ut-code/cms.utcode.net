import { defineConfig } from "drizzle-kit";
import { env } from "./src/lib/env/env.server.ts";

export default defineConfig({
  schema: "./src/lib/shared/models/schema.ts",
  dialect: "postgresql",
  dbCredentials: { url: env.DATABASE_URL },
  verbose: true,
  strict: true,
});
