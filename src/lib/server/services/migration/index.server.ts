/**
 * Migration orchestrator
 *
 * Coordinates the migration process: cloning repo, running workers,
 * and managing state. Uses workers from migration-workers.server.ts.
 */

import { spawn } from "node:child_process";
import { rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { completeMigration, failMigration, isRunning, log, startMigration } from "./state.server";
import {
  cleanupInvalidImageUrls,
  deleteAllMigratedData,
  migrateArticles,
  migrateImages,
  migrateMembers,
  migrateProjects,
} from "./workers.server";

const REPO_URL = "https://github.com/ut-code/utcode.net.git";

async function runCommand(cmd: string, args: string[], cwd?: string): Promise<void> {
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
  log(`Cloning ${REPO_URL}...`);
  await runCommand("git", ["clone", "--depth", "1", REPO_URL, tempDir]);
  log("Repository cloned successfully");
  return tempDir;
}

export function startDataMigration(): { started: boolean; message: string } {
  if (isRunning()) {
    return { started: false, message: "Migration already in progress" };
  }

  startMigration();
  log("=== Data Migration Started ===");

  // Run migration in background (fire and forget with proper error handling)
  runMigrationAsync().catch(console.error);

  return { started: true, message: "Migration started" };
}

export function startImageCleanup(): { started: boolean; message: string } {
  if (isRunning()) {
    return { started: false, message: "Migration already in progress" };
  }

  startMigration();
  log("=== Image URL Cleanup Started ===");

  runCleanupAsync().catch(console.error);

  return { started: true, message: "Cleanup started" };
}

async function runCleanupAsync(): Promise<void> {
  try {
    const result = await cleanupInvalidImageUrls(log);

    log("=== Cleanup Complete ===");
    completeMigration({
      members: { created: result.members.cleaned, skipped: result.members.skipped, errors: 0 },
      articles: { created: result.articles.cleaned, skipped: result.articles.skipped, errors: 0 },
      projects: { created: result.projects.cleaned, skipped: result.projects.skipped, errors: 0 },
      images: { created: 0, skipped: 0, errors: 0 },
    });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    log(`=== Cleanup Failed: ${errorMessage} ===`);
    failMigration(errorMessage);
  }
}

export function startDeleteAll(): { started: boolean; message: string } {
  if (isRunning()) {
    return { started: false, message: "Migration already in progress" };
  }

  startMigration();
  log("=== Delete All Data Started ===");

  runDeleteAllAsync().catch(console.error);

  return { started: true, message: "Delete started" };
}

async function runDeleteAllAsync(): Promise<void> {
  try {
    const result = await deleteAllMigratedData(log);

    log("=== Delete Complete ===");
    completeMigration({
      members: { created: result.members.deleted, skipped: 0, errors: 0 },
      articles: { created: result.articles.deleted, skipped: 0, errors: 0 },
      projects: { created: result.projects.deleted, skipped: 0, errors: 0 },
      images: { created: 0, skipped: 0, errors: 0 },
    });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    log(`=== Delete Failed: ${errorMessage} ===`);
    failMigration(errorMessage);
  }
}

async function runMigrationAsync(): Promise<void> {
  let repoPath: string | null = null;

  try {
    // Clone repo
    repoPath = await cloneRepo();

    // Run migrations in order (members first, then articles/projects, then images)
    const members = await migrateMembers(repoPath, log);
    const articles = await migrateArticles(repoPath, log);
    const projects = await migrateProjects(repoPath, log);
    const images = await migrateImages(repoPath, log);

    log("=== Migration Complete ===");
    completeMigration({ members, articles, projects, images });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    log(`=== Migration Failed: ${errorMessage} ===`);
    failMigration(errorMessage);
  } finally {
    // Cleanup
    if (repoPath) {
      log("Cleaning up temporary files...");
      await rm(repoPath, { recursive: true, force: true }).catch(() => {});
    }
  }
}
