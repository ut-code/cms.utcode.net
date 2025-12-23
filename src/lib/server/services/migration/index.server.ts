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
import { migrateArticles, migrateImages, migrateMembers, migrateProjects } from "./workers.server";

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
    const msg = e instanceof Error ? e.message : String(e);
    log(`=== Migration Failed: ${msg} ===`);
    failMigration(msg);
  } finally {
    // Cleanup
    if (repoPath) {
      log("Cleaning up temporary files...");
      await rm(repoPath, { recursive: true, force: true }).catch(() => {});
    }
  }
}
