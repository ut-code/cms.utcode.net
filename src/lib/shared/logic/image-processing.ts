/**
 * Image processing utilities for compression and encoding
 */

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

export async function compressImage(file: File): Promise<File> {
  // Skip if not an image that can be compressed
  if (!file.type.startsWith("image/") || file.type === "image/gif") {
    return file;
  }

  const SERVER_LIMIT = 10 * 1024 * 1024; // 10MB DoS protection limit
  const QUALITY_STEPS = [0.9, 0.7, 0.5, 0.3];
  const DIMENSION_STEPS = [1920, 1440, 1080, 720];

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let dimensionIndex = 0;
      let qualityIndex = 0;

      // Progressive compression loop: try all quality levels at current dimension,
      // then reduce dimension and try again
      const tryCompress = () => {
        // Calculate dimensions for current step
        const maxSize = DIMENSION_STEPS[dimensionIndex];
        if (!maxSize) {
          resolve(file);
          return;
        }

        let { width, height } = img;

        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height / width) * maxSize;
            width = maxSize;
          } else {
            width = (width / height) * maxSize;
            height = maxSize;
          }
        }

        // Draw to canvas
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        const quality = QUALITY_STEPS[qualityIndex];
        if (!quality) {
          resolve(file);
          return;
        }

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            // If size is acceptable, we're done
            if (blob.size <= SERVER_LIMIT) {
              const compressed = new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
                type: "image/jpeg",
              });
              resolve(compressed);
              return;
            }

            // Try next quality level
            if (qualityIndex < QUALITY_STEPS.length - 1) {
              qualityIndex++;
              tryCompress();
              return;
            }

            // Try next dimension level
            if (dimensionIndex < DIMENSION_STEPS.length - 1) {
              dimensionIndex++;
              qualityIndex = 0; // Reset quality for new dimension
              tryCompress();
              return;
            }

            // All attempts exhausted - return best effort (smallest we could get)
            const compressed = new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
              type: "image/jpeg",
            });
            resolve(compressed);
          },
          "image/jpeg",
          quality,
        );
      };

      tryCompress();
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };
    img.src = url;
  });
}
