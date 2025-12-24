/**
 * Helper functions for migration
 */
import { readdir, stat } from "node:fs/promises";
import { extname, join } from "node:path";
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

export async function findMarkdownFiles(basePath: string): Promise<string[]> {
  const files: string[] = [];
  async function walk(dir: string): Promise<void> {
    try {
      const entries = await readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
          await walk(fullPath);
        } else if (entry.name === "index.md" || entry.name === "index.mdx") {
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
      return "personal";
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
