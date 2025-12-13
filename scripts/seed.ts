import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../src/lib/shared/models/schema";

const client = createClient({ url: "file:local.db" });
const db = drizzle(client, { schema });

async function seed() {
  console.log("Seeding database...");

  // Create members
  const members = await db
    .insert(schema.member)
    .values([
      {
        id: "m1",
        slug: "taro-yamada",
        name: "山田 太郎",
        bio: "フロントエンド大好き。React/Next.js が得意。",
        imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=taro",
      },
      {
        id: "m2",
        slug: "hanako-suzuki",
        name: "鈴木 花子",
        bio: "バックエンドエンジニア。Go と Rust を書いてます。",
        imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=hanako",
      },
      {
        id: "m3",
        slug: "ken-tanaka",
        name: "田中 健",
        bio: "インフラ担当。Kubernetes と Terraform。",
        imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=ken",
      },
      {
        id: "m4",
        slug: "yuki-sato",
        name: "佐藤 優希",
        bio: "デザインもコードも書く。Figma と Svelte。",
        imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=yuki",
      },
      {
        id: "m5",
        slug: "akira-ito",
        name: "伊藤 明",
        bio: "機械学習エンジニア。PyTorch で研究中。",
        imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=akira",
      },
    ])
    .returning();
  console.log(`Created ${members.length} members`);

  // Create articles
  const articles = await db
    .insert(schema.article)
    .values([
      {
        id: "a1",
        slug: "getting-started-with-svelte",
        title: "Svelte 入門：React からの移行ガイド",
        content: "# Svelte とは\n\nSvelte は...",
        excerpt: "React ユーザー向けの Svelte 入門ガイド",
        authorId: "m1",
        published: true,
        publishedAt: new Date(),
      },
      {
        id: "a2",
        slug: "rust-for-beginners",
        title: "Rust を始めよう",
        content: "# Rust の魅力\n\n安全性と速度...",
        excerpt: "Rust 初心者向けの入門記事",
        authorId: "m2",
        published: true,
        publishedAt: new Date(),
      },
      {
        id: "a3",
        slug: "kubernetes-tips",
        title: "Kubernetes 運用 Tips 10選",
        content: "# 1. リソース制限\n\n...",
        excerpt: "本番運用で役立つ K8s Tips",
        authorId: "m3",
        published: false,
      },
      {
        id: "a4",
        slug: "design-system-guide",
        title: "デザインシステム構築ガイド",
        content: "# デザインシステムとは\n\n...",
        excerpt: "スケーラブルなデザインシステムの作り方",
        authorId: "m4",
        published: true,
        publishedAt: new Date(),
      },
      {
        id: "a5",
        slug: "ml-basics",
        title: "機械学習の基礎",
        content: "# 教師あり学習\n\n...",
        excerpt: "ML 入門者向けの基礎解説",
        authorId: "m5",
        published: false,
      },
    ])
    .returning();
  console.log(`Created ${articles.length} articles`);

  // Create projects
  const projects = await db
    .insert(schema.project)
    .values([
      {
        id: "p1",
        slug: "coursemate",
        name: "CourseMate",
        description: "東大生のための履修管理・時間割アプリ",
        repoUrl: "https://github.com/ut-code/coursemate",
        demoUrl: "https://coursemate.utcode.net",
      },
      {
        id: "p2",
        slug: "utcode-learn",
        name: "ut.code(); Learn",
        description: "プログラミング学習教材",
        repoUrl: "https://github.com/ut-code/utcode-learn",
        demoUrl: "https://learn.utcode.net",
      },
      {
        id: "p3",
        slug: "meibo",
        name: "Meibo",
        description: "サークル名簿管理システム",
        repoUrl: "https://github.com/ut-code/meibo",
      },
    ])
    .returning();
  console.log(`Created ${projects.length} projects`);

  // Add project members
  await db.insert(schema.projectMember).values([
    { projectId: "p1", memberId: "m1", role: "lead" },
    { projectId: "p1", memberId: "m2", role: "member" },
    { projectId: "p1", memberId: "m4", role: "member" },
    { projectId: "p2", memberId: "m4", role: "lead" },
    { projectId: "p2", memberId: "m1", role: "member" },
    { projectId: "p3", memberId: "m3", role: "lead" },
    { projectId: "p3", memberId: "m2", role: "member" },
    { projectId: "p3", memberId: "m5", role: "member" },
  ]);
  console.log("Created project members");

  console.log("Seed completed!");
}

seed().catch(console.error);
