import { eq } from "drizzle-orm";
import { getRequestEvent } from "$app/server";
import { env } from "$lib/env/env.server";
import * as v from "valibot";
import { auth } from "$lib/server/drivers/auth";
import { db } from "$lib/server/drivers/db";
import { user } from "$lib/shared/models/schema";

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export class AuthError extends Error {
  constructor(
    message: string,
    public code: "UNAUTHENTICATED" | "UNAUTHORIZED",
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export type Session = typeof auth.$Infer.Session;

const mockSession: Session = {
  session: {
    id: "mock",
    userId: "mock",
    expiresAt: new Date(Date.now() + 86400000),
    token: "mock",
    createdAt: new Date(),
    updatedAt: new Date(),
    ipAddress: null,
    userAgent: null,
  },
  user: {
    id: "mock",
    name: "Dev User",
    email: "dev@example.com",
    emailVerified: false,
    image: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

function getRequest(): Request {
  const event = getRequestEvent();
  return event.request;
}

export async function getSession() {
  if (env.UNSAFE_DISABLE_AUTH === "true") {
    return mockSession;
  }
  return auth.api.getSession({ headers: getRequest().headers });
}

async function requireLogin(): Promise<Session> {
  const session = await getSession();
  if (!session) throw new AuthError("Not logged in", "UNAUTHENTICATED");
  return session;
}

export async function requireUtCodeMember(): Promise<Session> {
  const session = await requireLogin();

  if (env.UNSAFE_DISABLE_AUTH === "true") {
    return session;
  }

  const isMember = await checkUtCodeMembership(session.user.id);
  if (!isMember) throw new AuthError("Not a ut-code member", "UNAUTHORIZED");

  return session;
}

async function checkUtCodeMembership(userId: string): Promise<boolean> {
  const dbUser = await db.query.user.findFirst({
    where: eq(user.id, userId),
  });

  // Check cache
  if (dbUser?.utCodeMemberAt) {
    const cacheAge = Date.now() - dbUser.utCodeMemberAt.getTime();
    if (cacheAge < CACHE_TTL_MS) {
      return true;
    }
  }

  // Cache miss or stale - check GitHub API
  const isMember = await verifyUtCodeMemberViaGitHub(userId);

  if (isMember) {
    await db.update(user).set({ utCodeMemberAt: new Date() }).where(eq(user.id, userId));
  }

  return isMember;
}

const GitHubOrgSchema = v.array(v.object({ login: v.string() }));

async function verifyUtCodeMemberViaGitHub(userId: string): Promise<boolean> {
  const account = await db.query.account.findFirst({
    where: (t, { and, eq }) => and(eq(t.userId, userId), eq(t.providerId, "github")),
  });

  if (!account?.accessToken) return false;

  const res = await fetch("https://api.github.com/user/orgs", {
    headers: {
      Authorization: `Bearer ${account.accessToken}`,
      Accept: "application/vnd.github+json",
    },
  });

  if (!res.ok) return false;

  try {
    const data = await res.json();
    const orgs = v.parse(GitHubOrgSchema, data);
    return orgs.some((org) => org.login === "ut-code");
  } catch {
    return false;
  }
}
