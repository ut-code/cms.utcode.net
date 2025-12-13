import { getRequestEvent } from "$app/server";
import { env } from "$env/dynamic/private";
import { auth } from "$lib/server/auth";
import { db } from "$lib/shared/db/db.server";

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
    console.log("skipping login because UNSAFE_DISABLE_AUTH is set");
    return mockSession;
  }
  return auth.api.getSession({ headers: getRequest().headers });
}

export async function requireAuth(): Promise<Session> {
  const session = await getSession();
  if (!session) throw new AuthError("Not authenticated", "UNAUTHENTICATED");
  return session;
}

export async function requireOrgMember(): Promise<Session> {
  const session = await requireAuth();

  const isMember = await isUtCodeMember(session);
  if (!isMember) throw new AuthError("Not a ut-code member", "UNAUTHORIZED");

  return session;
}

async function isUtCodeMember(session: Session): Promise<boolean> {
  if (env.UNSAFE_DISABLE_AUTH) {
    console.log("skipping utcode member check because UNSAFE_DISABLE_AUTH is set");
    return true;
  }

  const account = await db.query.account.findFirst({
    where: (t, { and, eq }) => and(eq(t.userId, session.user.id), eq(t.providerId, "github")),
  });

  if (!account?.accessToken) return false;

  const res = await fetch("https://api.github.com/user/orgs", {
    headers: {
      Authorization: `Bearer ${account.accessToken}`,
      Accept: "application/vnd.github+json",
    },
  });

  if (!res.ok) return false;

  const orgs = (await res.json()) as { login: string }[];
  return orgs.some((org) => org.login === "ut-code");
}
