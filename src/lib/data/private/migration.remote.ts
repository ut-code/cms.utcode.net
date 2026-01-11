import { command } from "$app/server";
import { requireUtCodeMember } from "$lib/server/database/auth.server";
import {
  startDataMigration,
  startDeleteAll,
  startImageCleanup,
} from "$lib/server/services/migration/index.server";
import { migrationActor } from "$lib/server/services/migration/state.server";
import type { MigrationState } from "$lib/shared/types/migration";

export const start = command(async (): Promise<{ started: boolean; message: string }> => {
  await requireUtCodeMember();
  return startDataMigration();
});

// Use command instead of query to bypass caching for real-time polling
export const getStatus = command(async (): Promise<MigrationState> => {
  await requireUtCodeMember();
  return migrationActor.getState();
});

export const reset = command(async (): Promise<void> => {
  await requireUtCodeMember();
  migrationActor.reset();
});

export const cleanup = command(async (): Promise<{ started: boolean; message: string }> => {
  await requireUtCodeMember();
  return startImageCleanup();
});

export const deleteAll = command(async (): Promise<{ started: boolean; message: string }> => {
  await requireUtCodeMember();
  return startDeleteAll();
});
