import { auth } from "$lib/server/drivers/auth";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { building } from "$app/environment";
import { sequence } from "@sveltejs/kit/hooks";
import type { Handle } from "@sveltejs/kit";

const handleAuth: Handle = async ({ event, resolve }) => {
  return await svelteKitHandler({ event, resolve, auth, building });
};

const handleCache: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  const path = event.url.pathname;

  // Skip if response already has Cache-Control
  if (response.headers.has("Cache-Control")) {
    return response;
  }

  // Private routes: no caching
  if (path.startsWith("/api/auth") || path.startsWith("/admin")) {
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  }

  // Public pages: aggressive Cloudflare caching
  // s-maxage=3600: CDN caches for 1 hour
  // stale-while-revalidate=86400: serve stale for up to 1 day while revalidating
  response.headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  return response;
};

export const handle = sequence(handleAuth, handleCache);
