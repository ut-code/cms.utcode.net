import sharp from "sharp";

// Re-export shared types
export {
  ACCEPTED_IMAGE_TYPES,
  type AcceptedImageType,
  isAcceptedImageType,
} from "$lib/shared/logic/image";

/**
 * Image compression options
 */
interface CompressOptions {
  /** Max width/height in pixels (default: 1920) */
  maxSize?: number;
  /** WebP quality 1-100 (default: 85) */
  quality?: number;
}

/**
 * Compress an image buffer to WebP format
 * - Resizes if larger than maxSize
 * - Converts to WebP for optimal compression
 * - Preserves aspect ratio
 * - Handles animated GIFs by keeping them as-is
 *
 * @returns Compressed buffer and the output MIME type
 */
export async function compressImage(
  buffer: Buffer,
  inputType: string,
  options: CompressOptions = {},
): Promise<{ buffer: Buffer; type: string; extension: string }> {
  const { maxSize = 1920, quality = 85 } = options;

  // Pass through SVG as-is (vector format, no compression needed)
  if (inputType === "image/svg+xml") {
    return { buffer, type: "image/svg+xml", extension: "svg" };
  }

  // Check if it's an animated GIF
  if (inputType === "image/gif") {
    const metadata = await sharp(buffer).metadata();
    if (metadata.pages && metadata.pages > 1) {
      // Animated GIF - pass through as-is
      return { buffer, type: "image/gif", extension: "gif" };
    }
  }

  // Process with sharp
  let image = sharp(buffer, {
    // Enable HEIF/HEIC support
    failOnError: false,
  });

  const metadata = await image.metadata();

  // Resize if needed (preserve aspect ratio)
  if (metadata.width && metadata.height) {
    if (metadata.width > maxSize || metadata.height > maxSize) {
      image = image.resize(maxSize, maxSize, {
        fit: "inside",
        withoutEnlargement: true,
      });
    }
  }

  // Convert to WebP
  const outputBuffer = await image
    .webp({
      quality,
      effort: 4, // Balance between speed and compression (0-6)
    })
    .toBuffer();

  return {
    buffer: outputBuffer,
    type: "image/webp",
    extension: "webp",
  };
}
