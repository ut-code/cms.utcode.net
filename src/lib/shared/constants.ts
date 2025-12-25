import type { ProjectCategory } from "./models/schema";

export const ITEMS_PER_PAGE = 12;

export const CATEGORY_COLORS: Record<ProjectCategory, string> = {
  active: "bg-emerald-100 text-emerald-700 border-emerald-200",
  ended: "bg-zinc-100 text-zinc-600 border-zinc-200",
  hackathon: "bg-purple-100 text-purple-700 border-purple-200",
  festival: "bg-pink-100 text-pink-700 border-pink-200",
  personal: "bg-amber-100 text-amber-700 border-amber-200",
};
