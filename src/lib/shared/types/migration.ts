export type MigrationStatus = "idle" | "running" | "completed" | "error";

export interface MigrationState {
  status: MigrationStatus;
  logs: string[];
  startedAt: Date | null;
  completedAt: Date | null;
  result: {
    members: { created: number; skipped: number; errors: number };
    articles: { created: number; skipped: number; errors: number };
    projects: { created: number; skipped: number; errors: number };
  } | null;
  error: string | null;
}
