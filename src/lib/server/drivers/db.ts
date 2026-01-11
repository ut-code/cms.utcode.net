import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "$lib/env/env.server";
import * as schema from "$lib/shared/models/schema";

type DbType = PostgresJsDatabase<typeof schema>;

let _db: DbType | null = null;

function getDb(): DbType {
  if (!_db) {
    const client = postgres(env.DATABASE_URL);
    _db = drizzle(client, { schema });
  }
  return _db;
}

// Lazy-initialized db instance via Proxy
export const db: DbType = new Proxy({} as DbType, {
  get(_, prop) {
    const instance = getDb();
    const value = instance[prop as keyof DbType];
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  },
});
