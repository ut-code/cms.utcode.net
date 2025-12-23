import { command, query } from "$app/server";
import { requireUtCodeMember } from "$lib/server/database/auth.server";
import { startDataMigration } from "$lib/server/services/migration/index.server";
import { getMigrationState, resetMigration } from "$lib/server/services/migration/state.server";
import type { MigrationState } from "$lib/shared/types/migration";

export const start = command(async (): Promise<{ started: boolean; message: string }> => {
  await requireUtCodeMember();
  return startDataMigration();
});

export const getStatus = query(async (): Promise<MigrationState> => {
  await requireUtCodeMember();
  return getMigrationState();
});

export const reset = command(async (): Promise<void> => {
  await requireUtCodeMember();
  resetMigration();
});
