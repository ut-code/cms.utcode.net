import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import * as v from "valibot";
import { getRequestEvent } from "$app/server";
import { env } from "$lib/env/env.server";
import { auth } from "$lib/server/drivers/auth";
import { db } from "$lib/server/drivers/db";
import { user } from "$lib/shared/models/schema";

// 組織脱退から最大 1h でアクセス権限が無効化される。
// GitHub API レート制限 (5000 req/h) とのバランスで決定。
// NOTE: ネガティブキャッシュ (非メンバー判定の短期キャッシュ) は未実装。
// session cleanup で再ログインを強制するため、繰り返し API を叩くケースは多くないと想定。
// 必要が出たら 5-15 分のネガティブキャッシュを user テーブルに追加検討。
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

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
  return await auth.api.getSession({ headers: getRequest().headers });
}

async function requireLogin(): Promise<Session> {
  const session = await getSession();
  if (!session) throw error(401, "Not logged in");
  return session;
}

export async function requireUtCodeMember(): Promise<Session> {
  const session = await requireLogin();

  if (env.UNSAFE_DISABLE_AUTH === "true") {
    return session;
  }

  const isMember = await checkUtCodeMembership(session.user.id);
  if (!isMember) throw error(403, "Not a ut-code member");

  return session;
}

/**
 * 現在のセッションを revoke する。better-auth の sign-out エンドポイントを呼び、
 * cookie とサーバー側 session を同時に削除する。
 * 非メンバーが admin にアクセスしてきた際の cleanup 用途。
 */
export async function signOutCurrentSession(): Promise<void> {
  if (env.UNSAFE_DISABLE_AUTH === "true") return;
  try {
    await auth.api.signOut({ headers: getRequest().headers });
  } catch (err) {
    // signOut の失敗は致命的ではないので呼び出し側で error() を継続させる。
    console.error("[auth] signOut failed:", err);
  }
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

const GitHubUserSchema = v.object({ login: v.string() });
const GitHubMembershipSchema = v.object({ state: v.string() });

async function verifyUtCodeMemberViaGitHub(userId: string): Promise<boolean> {
  const account = await db.query.account.findFirst({
    where: (t, { and, eq }) => and(eq(t.userId, userId), eq(t.providerId, "github")),
  });

  if (!account?.accessToken) return false;

  const headers = {
    Authorization: `Bearer ${account.accessToken}`,
    Accept: "application/vnd.github+json",
  };

  // 1. Get authenticated user's login.
  // /user/orgs だと public membership しか返さないため、/orgs/{org}/memberships/{username}
  // を使う。これには username が必要なので、まず /user で login を取得する。
  const userRes = await fetch("https://api.github.com/user", { headers });
  if (!userRes.ok) {
    // 401/403 はトークン期限切れ等。ログだけ残して false。
    if (userRes.status === 401 || userRes.status === 403) {
      console.warn(`[auth] GitHub /user returned ${userRes.status} for user ${userId}`);
    }
    return false;
  }

  const userData = await userRes.json().catch(() => null);
  const userParsed = v.safeParse(GitHubUserSchema, userData);
  if (!userParsed.success) return false;
  const login = userParsed.output.login;

  // 2. Check active membership in ut-code org.
  // private membership や private org でも、read:org scope があれば 200 で返る。
  const memRes = await fetch(
    `https://api.github.com/orgs/ut-code/memberships/${encodeURIComponent(login)}`,
    { headers },
  );

  if (memRes.status === 404) return false;
  if (!memRes.ok) {
    if (memRes.status === 401 || memRes.status === 403) {
      console.warn(
        `[auth] GitHub /orgs/ut-code/memberships returned ${memRes.status} for ${login}`,
      );
    }
    return false;
  }

  const memData = await memRes.json().catch(() => null);
  const memParsed = v.safeParse(GitHubMembershipSchema, memData);
  if (!memParsed.success) return false;

  // state は "active" | "pending"。pending は招待中なのでメンバー扱いしない。
  return memParsed.output.state === "active";
}
