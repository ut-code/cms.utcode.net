/**
 * Image processing and upload utilities for migration
 */
import { readFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { compressImage } from "$lib/server/database/image.server";
import { uploadBuffer } from "$lib/server/database/storage.server";
import type { Logger } from "./helpers.server";
import { fileExists, getMimeType } from "./helpers.server";

/**
 * Process markdown content and upload embedded images
 * Replaces relative paths like ./image.webp with S3 URLs
 */
export async function processContentImages(
  content: string,
  dirPath: string,
  folder: string,
  log: Logger,
): Promise<string> {
  // Match markdown images: ![alt](./path/to/image.ext)
  const imageRegex = /!\[([^\]]*)\]\(\.\/([^)]+)\)/g;
  let processedContent = content;
  const matches = [...content.matchAll(imageRegex)];

  for (const match of matches) {
    const [fullMatch, alt, relativePath] = match;
    if (!relativePath) continue;

    const imagePath = join(dirPath, relativePath);

    if (!(await fileExists(imagePath))) {
      log(`    ⊘ Image not found: ${relativePath}`);
      continue;
    }

    try {
      const inputBuffer = await readFile(imagePath);
      const {
        buffer: compressedBuffer,
        type: outputType,
        extension,
      } = await compressImage(inputBuffer, getMimeType(imagePath));
      const baseName = basename(imagePath).replace(/\.[^.]+$/, "");
      const outputName = `${baseName}.${extension}`;

      const { url } = await uploadBuffer(compressedBuffer, outputType, outputName, folder);
      processedContent = processedContent.replace(fullMatch, `![${alt}](${url})`);
      log(`    ✓ Uploaded: ${relativePath}`);
    } catch {
      log(`    ✗ Failed to upload: ${relativePath}`);
    }
  }

  return processedContent;
}
