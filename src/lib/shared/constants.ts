import type { ProjectCategory } from "./models/schema";

// Pagination
export const ITEMS_PER_PAGE = 12;

// Home page limits
export const HOME_FEATURED_ARTICLES_LIMIT = 3;
export const HOME_FEATURED_PROJECTS_LIMIT = 6;

// Admin dashboard limits
export const DASHBOARD_RECENT_ARTICLES_LIMIT = 5;
export const DASHBOARD_RECENT_PROJECTS_LIMIT = 3;
export const DASHBOARD_VIEW_TREND_DAYS = 14;

// Database query limits
export const DB_DEFAULT_LIMIT = 100;
export const DB_LARGE_LIMIT = 1000;
export const DB_SEARCH_LIMIT = 50;
export const DB_MEMBERS_LIMIT = 200;

// Time constants
export const MS_PER_DAY = 1000 * 60 * 60 * 24;

// Organization
export const UTCODE_FOUNDING_YEAR = 2019;

export const CATEGORY_COLORS: Record<ProjectCategory, string> = {
  active: "bg-emerald-100 text-emerald-700 border-emerald-200",
  ended: "bg-zinc-100 text-zinc-600 border-zinc-200",
  hackathon: "bg-purple-100 text-purple-700 border-purple-200",
  festival: "bg-pink-100 text-pink-700 border-pink-200",
  personal: "bg-amber-100 text-amber-700 border-amber-200",
};
