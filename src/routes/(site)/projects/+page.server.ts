import { getPublicProjects } from "$lib/data/public/index.remote";
import { PROJECT_KIND_KEYS, type ProjectKind } from "$lib/shared/models/schema";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url }) => {
  const projects = await getPublicProjects();
  const rawCategory = url.searchParams.get("category");
  // 旧 utcode.net 互換: `?category=long-term|festival|hackathon` を kind フィルタとして受ける。
  // 旧個別ステータス値 (active/ended など) や未知の値は無視して全件表示する。
  const kindParam: ProjectKind | null = PROJECT_KIND_KEYS.find((k) => k === rawCategory) ?? null;
  const currentPage = Number(url.searchParams.get("page")) || 1;

  return {
    projects,
    kindParam,
    currentPage,
  };
};
