/**
 * Migration state manager - holds stdout/stderr buffer for polling
 */

import type { MigrationState } from "$lib/shared/types/migration";

export type { MigrationState };

const initialState: MigrationState = {
  status: "idle",
  logs: [],
  startedAt: null,
  completedAt: null,
  result: null,
  error: null,
};

// Singleton state
let state: MigrationState = { ...initialState };

export function getMigrationState(): MigrationState {
  return { ...state, logs: [...state.logs] };
}

export function isRunning(): boolean {
  return state.status === "running";
}

export function startMigration(): void {
  state = {
    status: "running",
    logs: [],
    startedAt: new Date(),
    completedAt: null,
    result: null,
    error: null,
  };
}

export function log(message: string): void {
  state.logs.push(`[${new Date().toISOString().slice(11, 19)}] ${message}`);
}

export function completeMigration(result: MigrationState["result"]): void {
  state.status = "completed";
  state.completedAt = new Date();
  state.result = result;
}

export function failMigration(error: string): void {
  state.status = "error";
  state.completedAt = new Date();
  state.error = error;
}

export function resetMigration(): void {
  state = { ...initialState };
}
