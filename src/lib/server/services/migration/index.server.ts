/**
 * Migration orchestrator
 *
 * Sends events to the migration actor and executes effects.
 * The actor handles all state transitions synchronously,
 * making race conditions impossible.
 */

import { spawn } from "node:child_process";
import { rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { MigrationOperation } from "$lib/shared/types/migration";
import { type MigrationEffect, migrationActor } from "./state.server";
import {
  cleanupInvalidImageUrls,
  deleteAllMigratedData,
  migrateArticles,
  migrateImages,
  migrateMembers,
  migrateProjects,
} from "./workers.server";

const REPO_URL = "https://github.com/ut-code/utcode.net.git";

function runCommand(cmd: string, args: string[], cwd?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd, stdio: "pipe" });
    let stderr = "";
    child.stderr?.on("data", (data: Buffer) => {
      stderr += data.toString();
    });
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} failed: ${stderr}`));
    });
    child.on("error", reject);
  });
}

async function cloneRepo(): Promise<string> {
  const tempDir = join(tmpdir(), `utcode-migration-${Date.now()}`);
  migrationActor.log(`Cloning ${REPO_URL}...`);
  await runCommand("git", ["clone", "--depth", "1", REPO_URL, tempDir]);
  migrationActor.log("Repository cloned successfully");
  return tempDir;
}

// ============================================================================
// Effect executors - async work triggered by actor
// ============================================================================

async function executeMigration(): Promise<void> {
  let repoPath: string | null = null;

  try {
    repoPath = await cloneRepo();

    const log = (msg: string) => migrationActor.log(msg);
    const members = await migrateMembers(repoPath, log);
    const articles = await migrateArticles(repoPath, log);
    const projects = await migrateProjects(repoPath, log);
    const images = await migrateImages(repoPath, log);

    migrationActor.complete({ members, articles, projects, images });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    migrationActor.fail(errorMessage);
  } finally {
    if (repoPath) {
      migrationActor.log("Cleaning up temporary files...");
      await rm(repoPath, { recursive: true, force: true }).catch(() => {});
    }
  }
}

async function executeCleanup(): Promise<void> {
  try {
    const log = (msg: string) => migrationActor.log(msg);
    const result = await cleanupInvalidImageUrls(log);

    migrationActor.complete({
      members: { created: result.members.cleaned, skipped: result.members.skipped, errors: 0 },
      articles: { created: result.articles.cleaned, skipped: result.articles.skipped, errors: 0 },
      projects: { created: result.projects.cleaned, skipped: result.projects.skipped, errors: 0 },
      images: { created: 0, skipped: 0, errors: 0 },
    });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    migrationActor.fail(errorMessage);
  }
}

async function executeDelete(): Promise<void> {
  try {
    const log = (msg: string) => migrationActor.log(msg);
    const result = await deleteAllMigratedData(log);

    migrationActor.complete({
      members: { created: result.members.deleted, skipped: 0, errors: 0 },
      articles: { created: result.articles.deleted, skipped: 0, errors: 0 },
      projects: { created: result.projects.deleted, skipped: 0, errors: 0 },
      images: { created: 0, skipped: 0, errors: 0 },
    });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    migrationActor.fail(errorMessage);
  }
}

/**
 * Execute an effect returned by the actor
 */
function executeEffect(effect: MigrationEffect): void {
  if (!effect) return;

  switch (effect.type) {
    case "RUN_MIGRATION":
      executeMigration().catch(console.error);
      break;
    case "RUN_CLEANUP":
      executeCleanup().catch(console.error);
      break;
    case "RUN_DELETE":
      executeDelete().catch(console.error);
      break;
  }
}

// ============================================================================
// Public API - sends events to actor and executes effects
// ============================================================================

/**
 * Start an operation by sending START event to actor
 * Returns immediately - async work runs in background
 */
export function startOperation(operation: MigrationOperation): {
  started: boolean;
  message: string;
} {
  const { effect, started } = migrationActor.send({ type: "START", operation });

  if (!started) {
    return { started: false, message: "Migration already in progress" };
  }

  // Execute the effect (async work) in background
  executeEffect(effect);

  const labels: Record<MigrationOperation, string> = {
    migrate: "Migration",
    cleanup: "Cleanup",
    delete: "Delete",
  };

  return { started: true, message: `${labels[operation]} started` };
}

// Convenience exports for backward compatibility
export const startDataMigration = () => startOperation("migrate");
export const startImageCleanup = () => startOperation("cleanup");
export const startDeleteAll = () => startOperation("delete");
