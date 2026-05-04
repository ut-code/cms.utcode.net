/**
 * Helper functions for migration
 */
import { readdir, stat } from "node:fs/promises";
import { basename, dirname, extname, join } from "node:path";
import * as v from "valibot";
import { parse as parseYaml } from "yaml";
import type { ProjectCategory } from "$lib/shared/models/schema";

export type Logger = (message: string) => void;

export function parseFrontmatter<T>(
  content: string,
  schema: v.GenericSchema<unknown, T>,
): { frontmatter: T; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const frontmatterStr = match?.[1];
  const bodyStr = match?.[2];
  if (!frontmatterStr || bodyStr === undefined) {
    throw new Error("Invalid frontmatter format");
  }
  const parsed = parseYaml(frontmatterStr);
  const frontmatter = v.parse(schema, parsed);
  return { frontmatter, body: bodyStr.trim() };
}

/**
 * Walk `basePath` and collect markdown files.
 *
 * - `pattern: "index"` (default): only `index.md` / `index.mdx`. Used for the
 *   directory-per-entry layout (members, articles, project form A like
 *   `coursemate/index.md`).
 * - `pattern: "all"`: every `.md` / `.mdx`. Used for project form B
 *   (`hackathon/<date>/<slug>.md`) where multiple flat files share a parent
 *   directory. See migrate-projects.server.ts for slug derivation.
 */
export async function findMarkdownFiles(
  basePath: string,
  pattern: "index" | "all" = "index",
): Promise<string[]> {
  const files: string[] = [];
  async function walk(dir: string): Promise<void> {
    try {
      const entries = await readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
          await walk(fullPath);
        } else if (matchesPattern(entry.name, pattern)) {
          files.push(fullPath);
        }
      }
    } catch {
      // Directory doesn't exist, skip
    }
  }
  await walk(basePath);
  return files.sort();
}

function matchesPattern(name: string, pattern: "index" | "all"): boolean {
  switch (pattern) {
    case "index":
      return name === "index.md" || name === "index.mdx";
    case "all":
      return name.endsWith(".md") || name.endsWith(".mdx");
    default:
      return pattern satisfies never;
  }
}

/**
 * Derive project slug from a markdown file path.
 *
 * Legacy content has two layouts:
 * - Form A: `<slug>/index.md` (e.g. `coursemate/index.md`) -> parent dir name
 * - Form B: `hackathon/<date>/<slug>.md` (e.g. `hackathon/2023-08-17/call-paper.md`) -> file basename
 *
 * Previously slug was always `basename(dirname(file))`, which collapsed all
 * Form B siblings under one date dir into the same slug and silently skipped
 * 9 projects on prod migration.
 */
export function deriveProjectSlug(file: string): string {
  const filename = basename(file);
  if (filename === "index.md" || filename === "index.mdx") {
    return basename(dirname(file));
  }
  return basename(file, extname(file));
}

export function generateArticleSlug(dirPath: string): string {
  const parts = dirPath.split("/");
  const year = parts.at(-2) ?? "";
  const name = parts.at(-1) ?? "";
  const [monthDay = "", ...rest] = name.split("_");
  return `${year}-${monthDay}-${rest.join("-")}`;
}

export function generateExcerpt(content: string, maxLength = 200): string {
  const plain = content
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]+)\]\(.*?\)/g, "$1")
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\n+/g, " ")
    .trim();

  if (plain.length <= maxLength) return plain;
  return `${plain.slice(0, maxLength).replace(/\s+\S*$/, "")}...`;
}

export function mapCategory(kind: string | undefined): ProjectCategory {
  switch (kind) {
    case "long-term":
      return "active";
    case "hackathon":
      return "hackathon";
    case "festival":
      return "festival";
    case "personal":
      // 旧 utcode.net の "personal" は新仕様では完了プロジェクトに統合する。
      return "completed";
    default:
      return "active";
  }
}

export function getMimeType(filePath: string): string {
  const ext = extname(filePath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
  };
  return mimeTypes[ext] ?? "application/octet-stream";
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}
