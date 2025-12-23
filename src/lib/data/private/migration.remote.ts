import { command } from "$app/server";
import { requireUtCodeMember } from "$lib/server/database/auth.server";
import { runDataMigration, type MigrationResult } from "$lib/server/services/migration.server";

export const runMigration = command(async (): Promise<MigrationResult> => {
  await requireUtCodeMember();
  return runDataMigration();
});
