# Coding Standards

**Last Updated**: 2025-12-24

## Import Order

インポートは以下の順序で記述する:

1. **外部ライブラリ** - `@sveltejs/kit`, `valibot`, `drizzle-orm`等
2. **$app/*** - SvelteKitの内部API (`$app/server`, `$app/environment`等)
3. **$lib/*** - プロジェクトの内部モジュール (階層順)
   - `$lib/server/database/*`
   - `$lib/server/services/*`
   - `$lib/server/drivers/*`
   - `$lib/shared/*`
   - `$lib/components/*`
4. **型インポート** - `import type { ... }`は最後

### 例

```ts
// ✅ 正しい順序
import { error } from "@sveltejs/kit";
import * as v from "valibot";
import { command, query } from "$app/server";
import { requireUtCodeMember } from "$lib/server/database/auth.server";
import { createArticle } from "$lib/server/database/articles.server";
import { purgeCache } from "$lib/server/services/cloudflare/cache.server";
import type { Article } from "$lib/shared/models/types";

// ❌ 誤った順序
import { createArticle } from "$lib/server/database/articles.server";
import type { Article } from "$lib/shared/models/types";
import { error } from "@sveltejs/kit";
import { command, query } from "$app/server";
```

## Async/Await パターン

### Fire-and-Forget パターン

非同期処理を「発射して忘れる」場合、必ず`.catch(console.error)`を使用する。

```ts
// ✅ 正しいパターン
purgeCache().catch(console.error);

db.update(article)
  .set({ viewCount: sql`${article.viewCount} + 1` })
  .where(eq(article.slug, slug))
  .catch(console.error);

// ❌ 誤ったパターン (サーバークラッシュの原因)
purgeCache(); // エラーがキャッチされない

// ❌ 冗長なパターン
purgeCache()
  .then(() => {})
  .catch(console.error);

// ❌ 古いパターン (Prettierが自動修正)
purgeCache().then(() => {}, console.error);
```

**理由**: サーバー環境では、catchされないPromiseリジェクションはサーバー全体をクラッシュさせる可能性がある。

### Async/Await の統一

非同期関数は一貫して`async/await`を使用する。`.then()`チェーンは避ける。

```ts
// ✅ 正しいパターン
export const getArticles = query(async () => {
  await requireUtCodeMember();
  return await listAllArticles();
});

// ❌ 混在パターン (避ける)
export const getArticles = query(() => {
  return requireUtCodeMember().then(() => listAllArticles());
});
```

## エラーハンドリング

### Remote Functions

Remote functionsでは、エラーは自動的にクライアントに伝播されるため、try-catchは不要。

```ts
// ✅ シンプルなパターン
export const deleteArticle = command(v.string(), async (id) => {
  const session = await requireUtCodeMember();
  await requireArticleOwnership(session, id);
  await deleteArticle(id);
  purgeCache().catch(console.error);
});

// ❌ 不要なtry-catch
export const deleteArticle = command(v.string(), async (id) => {
  try {
    const session = await requireUtCodeMember();
    await requireArticleOwnership(session, id);
    await deleteArticle(id);
  } catch (error) {
    throw error; // 不要
  }
});
```

例外: ビジネスロジックで特定のエラーを変換する場合のみtry-catchを使用。

### Database層

Database層では、エラーメッセージを明確にする。

```ts
// ✅ 明確なエラーメッセージ
export async function createArticle(data: NewArticle) {
  const [created] = await db.insert(article).values(data).returning();
  if (!created) throw new Error("Failed to create article");
  return created;
}

// ❌ 曖昧なエラー
export async function createArticle(data: NewArticle) {
  const [created] = await db.insert(article).values(data).returning();
  return created; // undefinedの可能性
}
```

## 命名規則

### ファイル命名

- **Remote Functions**: `*.remote.ts`
- **Server Functions**: `*.server.ts`
- **Shared Logic**: `*.ts` (サフィックスなし)
- **Tests**: `*.test.ts`
- **Types**: `types.ts` または `schema.ts`

### 関数命名

- **Remote Query**: 名詞形 (`getArticles`, `getMember`)
- **Remote Command**: 動詞形 (`saveArticle`, `editMember`, `removeProject`)
- **Server Functions**: 動詞形 (`listArticles`, `createMember`, `updateProject`)

```ts
// Remote Functions (DAL)
export const getArticles = query(async () => ...);
export const saveArticle = command(..., async (data) => ...);

// Server Functions (DB)
export async function listArticles() { ... }
export async function createArticle(data: NewArticle) { ... }
```

## Valibot バリデーション

### Picklist の使用

列挙型の値は`v.picklist()`を使用する。

```ts
// ✅ 型安全なpicklist
const PROJECT_CATEGORY_VALUES = [
  "active",
  "ended",
  "hackathon",
  "festival",
  "personal",
] as const satisfies readonly ProjectCategory[];

const categorySchema = v.picklist(PROJECT_CATEGORY_VALUES);

// ❌ 型安全でないパターン
const categorySchema = v.picklist(["active", "ended", "hackathon"]);
```

## フォーマット

### インデント

- **タブ文字**を使用 (Prettier設定: `useTabs: true`)
- スペースは使用しない

### 行の長さ

- 最大120文字 (Prettier設定: `printWidth: 120`)
- 長いインポートや関数呼び出しは自動で折り返される

### セミコロン

- 常にセミコロンを使用 (Prettier設定: `semi: true`)

### クォート

- ダブルクォートを使用 (Prettier設定: `useTabs: true`)

## ツール

### 自動フォーマット

```sh
bun tidy  # type-check + test-check + biome + prettier
bun fix   # biome + prettier のみ
```

### 個別チェック

```sh
bun type-check    # TypeScript型チェック
bun test-check    # 単体テスト
bun lint-check    # Biomeリント
bun format-check  # Prettierフォーマット
```

## 検証ルール

コミット前に必ず以下を実行:

1. `bun type-check` - エラー0であること
2. `bun tidy` - エラー・警告0であること

## 参考

- CLAUDE.md - プロジェクト固有のワークフロー
- security.md - セキュリティ設計
- project-context.md - プロジェクト概要
