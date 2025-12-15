/**
 * Migration script: Import all data from old utcode.net (Astro) to new CMS
 *
 * Usage:
 *   bun --env-file=.env run scripts/migrate-all.ts [--dry-run]
 *
 * This script runs migrations in the correct order:
 *   1. Members (must be first - articles and projects reference them)
 *   2. Articles
 *   3. Projects (links to members via projectMember table)
 *
 * Prerequisites:
 *   - Old utcode.net repo at ../utcode.net
 *   - DATABASE_URL env var set
 */

import { spawn } from "node:child_process";
import { join } from "node:path";

const SCRIPTS_DIR = import.meta.dirname;

async function runScript(scriptName: string, dryRun: boolean): Promise<boolean> {
  return new Promise((resolve) => {
    const args = ["--env-file=.env", "run", join(SCRIPTS_DIR, scriptName)];
    if (dryRun) args.push("--dry-run");

    const child = spawn("bun", args, {
      stdio: "inherit",
      cwd: join(SCRIPTS_DIR, ".."),
    });

    child.on("close", (code) => {
      resolve(code === 0);
    });

    child.on("error", () => {
      resolve(false);
    });
  });
}

async function main(): Promise<void> {
  const dryRun = process.argv.includes("--dry-run");

  console.log("╔════════════════════════════════════════╗");
  console.log("║     ut.code(); CMS Migration Tool      ║");
  console.log("╚════════════════════════════════════════╝");
  console.log();
  console.log(`Mode: ${dryRun ? "DRY RUN (no changes)" : "LIVE"}`);
  console.log();

  const migrations = [
    { name: "Members", script: "migrate-members.ts" },
    { name: "Articles", script: "migrate-articles.ts" },
    { name: "Projects", script: "migrate-projects.ts" },
  ];

  const results: { name: string; success: boolean }[] = [];

  for (const migration of migrations) {
    console.log("─".repeat(50));
    console.log(`Starting: ${migration.name}`);
    console.log("─".repeat(50));
    console.log();

    const success = await runScript(migration.script, dryRun);
    results.push({ name: migration.name, success });

    console.log();
  }

  console.log("═".repeat(50));
  console.log("Migration Complete");
  console.log("═".repeat(50));
  console.log();

  for (const result of results) {
    const status = result.success ? "✓" : "✗";
    console.log(`  ${status} ${result.name}`);
  }

  const failed = results.filter((r) => !r.success);
  if (failed.length > 0) {
    console.log();
    console.log(`${failed.length} migration(s) had errors.`);
    process.exit(1);
  }
}

main().catch(console.error);
