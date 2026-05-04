import { error } from "@sveltejs/kit";
import { getPublicProject } from "$lib/data/public/index.remote";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const project = await getPublicProject(params.slug);
  // hooks.server.ts で旧マルチセグメント URL や旧 kind URL は既にリダイレクト済み。
  // ここに来て見つからないものは本物の 404 (soft-404 を避ける)
  if (!project) error(404, "プロジェクトが見つかりません");
  return { project };
};
