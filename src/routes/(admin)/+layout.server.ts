import { isHttpError, redirect } from "@sveltejs/kit";
import { requireUtCodeMember, signOutCurrentSession } from "$lib/server/database/auth.server";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async () => {
  try {
    const session = await requireUtCodeMember();
    return { session };
  } catch (e) {
    if (isHttpError(e) && (e.status === 401 || e.status === 403)) {
      // 非メンバー (403) が GitHub ログインした場合、better-auth は session/account を作成済み。
      // session を残すと毎回 GitHub API を叩いてレート制限を消費するため、ここで revoke して
      // 再ログインを強制する。401 (未ログイン) は元々 session 無いので no-op に近いが念のため呼ぶ。
      if (e.status === 403) {
        await signOutCurrentSession();
      }
      redirect(302, "/login");
    }
    throw e;
  }
};
