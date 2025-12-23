import { isHttpError, redirect } from "@sveltejs/kit";
import { requireUtCodeMember } from "$lib/server/database/auth.server";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async () => {
  try {
    const session = await requireUtCodeMember();
    return { session };
  } catch (e) {
    if (isHttpError(e) && (e.status === 401 || e.status === 403)) {
      redirect(302, "/login");
    }
    throw e;
  }
};
