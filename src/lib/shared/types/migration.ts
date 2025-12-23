export type MigrationStatus = "idle" | "running" | "completed" | "error";

export interface MigrationResult {
  created: number;
  skipped: number;
  errors: number;
}

export interface MigrationState {
  status: MigrationStatus;
  logs: string[];
  startedAt: Date | null;
  completedAt: Date | null;
  result: {
    members: MigrationResult;
    articles: MigrationResult;
    projects: MigrationResult;
    images: MigrationResult;
  } | null;
  error: string | null;
}
