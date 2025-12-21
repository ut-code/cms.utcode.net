import { redirect } from "@sveltejs/kit";
import { isHttpError } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { requireUtCodeMember } from "$lib/server/database/auth.server";

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
