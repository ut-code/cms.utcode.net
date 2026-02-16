import { env } from "$lib/env/env.server";

const CLOUDFLARE_API_BASE = "https://api.cloudflare.com/client/v4";

export async function purgeCache(): Promise<void> {
  if (!env.CLOUDFLARE_ZONE_ID || !env.CLOUDFLARE_API_TOKEN) {
    console.warn(
      "[cache] Cloudflare cache purge skipped: CLOUDFLARE_ZONE_ID or CLOUDFLARE_API_TOKEN not set",
    );
    return;
  }

  const res = await fetch(`${CLOUDFLARE_API_BASE}/zones/${env.CLOUDFLARE_ZONE_ID}/purge_cache`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ purge_everything: true }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Cloudflare cache purge failed: ${res.status} ${body}`);
  }
}
