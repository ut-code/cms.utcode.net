import { auth } from "$lib/server/drivers/auth";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { building } from "$app/environment";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  return await svelteKitHandler({ event, resolve, auth, building });
};
