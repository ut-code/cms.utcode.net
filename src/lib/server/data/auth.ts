import { getRequestEvent } from "$app/server";
import { redirect } from "@sveltejs/kit";
import { auth } from "$lib/server/auth";
import { db } from "$lib/shared/db/db.server";

export type Session = typeof auth.$Infer.Session;

function getRequest(): Request {
  const event = getRequestEvent();
  if (!event) throw new Error("No request event available");
  return event.request;
}

export async function getSession() {
  return auth.api.getSession({ headers: getRequest().headers });
}

export async function requireAuth(): Promise<Session> {
  const session = await getSession();
  if (!session) throw redirect(303, "/login");
  return session;
}

export async function requireOrgMember(): Promise<Session> {
  const session = await requireAuth();

  const isMember = await isUtCodeMember(session);
  if (!isMember) throw redirect(303, "/unauthorized");

  return session;
}

async function isUtCodeMember(session: Session): Promise<boolean> {
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
