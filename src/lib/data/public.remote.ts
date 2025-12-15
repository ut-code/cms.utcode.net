import * as v from "valibot";
import { query } from "$app/server";
import { listPublishedArticles, getPublishedArticle } from "$lib/server/database/articles.server";
import { listProjects, getProjectBySlug } from "$lib/server/database/projects.server";
import { listMembers, getMemberBySlug } from "$lib/server/database/members.server";

export const getPublicArticles = query(listPublishedArticles);
export const getPublicArticle = query(v.string(), getPublishedArticle);

export const getPublicProjects = query(listProjects);
export const getPublicProject = query(v.string(), getProjectBySlug);

export const getPublicMembers = query(listMembers);
export const getPublicMember = query(v.string(), getMemberBySlug);
