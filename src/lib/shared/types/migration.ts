export type MigrationStatus = "idle" | "running" | "completed" | "error";

export interface MigrationResult {
  created: number;
  skipped: number;
  errors: number;
}

export interface MigrationResults {
  members: MigrationResult;
  articles: MigrationResult;
  projects: MigrationResult;
  images: MigrationResult;
}

export interface MigrationState {
  status: MigrationStatus;
  logs: string[];
  startedAt: Date | null;
  completedAt: Date | null;
  result: MigrationResults | null;
  error: string | null;
}

// State machine events
export type MigrationOperation = "migrate" | "cleanup" | "delete";

export type MigrationEvent =
  | { type: "START"; operation: MigrationOperation }
  | { type: "LOG"; message: string }
  | { type: "COMPLETE"; result: MigrationResults }
  | { type: "FAIL"; error: string }
  | { type: "RESET" };
