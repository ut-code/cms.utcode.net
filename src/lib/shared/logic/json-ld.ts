/** Serialize an object for safe embedding in {@html `<script type="application/ld+json">`} */
export function safeJsonLd(obj: unknown): string {
  // Escape '<' to prevent </script> from closing the tag
  return JSON.stringify(obj).replaceAll("<", "\\u003c");
}
