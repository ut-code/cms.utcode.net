# Data Models

## Database Optimizations

### Better Auth Performance Indexes

Better Auth 推奨のパフォーマンス最適化インデックス（全て実装済み）:

- ✅ `user.email` - unique constraint (自動インデックス)
- ✅ `session.userId` - `session_userId_idx`
- ✅ `session.token` - unique constraint (自動インデックス)
- ✅ `account.userId` - `account_userId_idx`
- ✅ `verification.identifier` - `verification_identifier_idx`

### Additional Indexes

CMS テーブル用の追加インデックス:

- `member.userId` - `member_userId_idx` (user linkage lookup)
- `article.authorId` - `article_authorId_idx` (author's articles)
- `article.published, publishedAt` - `article_published_publishedAt_idx` (published articles sorted by date)
- `articleSlugRedirect.oldSlug` - `article_slug_redirect_oldSlug_idx` (redirect lookup)
- `articleSlugRedirect.articleId` - `article_slug_redirect_articleId_idx` (article's redirects)
- `projectMember.projectId, memberId` - `projectMember_pk` (project-member junction)
- `viewLog.resourceType, resourceId` - `view_log_resourceType_resourceId_idx` (resource view lookups)
- `viewLog.viewedAt` - `view_log_viewedAt_idx` (time-series analytics)

参考: [Better Auth Performance Guide](https://www.better-auth.com/docs/guides/optimizing-for-performance#database-optimizations)

## Schema

```
user (Better Auth)
  │ 1:1 (optional)
  ▼
members ◄────────────────┐
  │                      │
  │ 1:N                  │ N:M
  ▼                      │
articles ──► articleSlugRedirects
           projects ─────┘
                projectMembers
```

### Better Auth (自動管理)

- `user` - id, name, email, emailVerified, image, timestamps
- `session` - id, token, expiresAt, userId, ipAddress, userAgent
- `account` - id, accountId, providerId, userId, tokens, ...
- `verification` - id, identifier, value, expiresAt, timestamps

### CMS Tables

```
members
├── id           TEXT PK
├── userId       TEXT FK → user.id UNIQUE NULL  -- 未リンク可 (OB等)
├── slug         TEXT UNIQUE NOT NULL
├── name         TEXT NOT NULL
├── bio          TEXT
├── imageUrl     TEXT
├── pageContent  TEXT
├── viewCount    INTEGER NOT NULL DEFAULT 0
├── createdAt    INTEGER NOT NULL
└── updatedAt    INTEGER NOT NULL

articles
├── id           TEXT PK
├── slug         TEXT UNIQUE NOT NULL
├── title        TEXT NOT NULL
├── content      TEXT NOT NULL
├── excerpt      TEXT
├── coverUrl     TEXT
├── authorId     TEXT FK → members.id
├── published    INTEGER NOT NULL (0/1)
├── publishedAt  INTEGER
├── viewCount    INTEGER NOT NULL DEFAULT 0
├── createdAt    INTEGER NOT NULL
└── updatedAt    INTEGER NOT NULL

articleSlugRedirects
├── id           TEXT PK
├── oldSlug      TEXT NOT NULL
├── newSlug      TEXT NOT NULL
├── articleId    TEXT FK → articles.id (CASCADE)
└── createdAt    INTEGER NOT NULL

projects
├── id           TEXT PK
├── slug         TEXT UNIQUE NOT NULL
├── name         TEXT NOT NULL
├── description  TEXT
├── content      TEXT
├── coverUrl     TEXT
├── repoUrl      TEXT
├── demoUrl      TEXT
├── category     TEXT NOT NULL DEFAULT 'active'  -- "active" | "ended" | "hackathon" | "festival" | "personal"
├── viewCount    INTEGER NOT NULL DEFAULT 0
├── createdAt    INTEGER NOT NULL
└── updatedAt    INTEGER NOT NULL

## Project Categories

| Key         | Label              |
| ----------- | ------------------ |
| `active`    | 稼働中プロジェクト |
| `ended`     | 終了済みプロジェクト |
| `hackathon` | ハッカソン         |
| `festival`  | 学園祭             |
| `personal`  | 個人プロジェクト   |

projectMembers
├── projectId    TEXT FK → projects.id  ┐
├── memberId     TEXT FK → members.id   ┘ PK
└── role         TEXT                      -- "lead", "member"

viewLog (時系列アナリティクス用)
├── id           TEXT PK
├── resourceType TEXT NOT NULL             -- "article", "member", "project"
├── resourceId   TEXT NOT NULL
└── viewedAt     TIMESTAMP NOT NULL
```

## Actions

### Members

| アクション                 | 公開 | 実装 |
| -------------------------- | ---- | ---- |
| メンバーを登録する         |      | ✓    |
| プロフィールを編集する     |      | ✓    |
| プロフィール画像を変更する |      | ✓    |
| メンバーを削除する         |      | ✓    |
| メンバーを検索する         |      | ✓    |
| メンバー一覧を見る         | ✓    | ✓    |
| メンバー詳細を見る         | ✓    | ✓    |
| メンバーページ閲覧数をインクリメント | ✓    | ✓    |
| 自己紹介ページを書く       | ✓    | ✓    |

### Articles

| アクション                       | 公開 | 実装 |
| -------------------------------- | ---- | ---- |
| 記事を書く                       |      | ✓    |
| 記事を編集する                   |      | ✓    |
| スラグ変更時にリダイレクトを残す |      | ✓    |
| 記事を公開する                   |      | ✓    |
| 記事を非公開にする               |      | ✓    |
| 記事を削除する                   |      | ✓    |
| 下書き含む記事一覧を見る         |      | ✓    |
| 下書きを読む                     |      | ✓    |
| 記事をプレビューする             |      | ✓    |
| 公開記事一覧を見る               | ✓    | ✓    |
| 公開記事を読む                   | ✓    | ✓    |
| 記事閲覧数をインクリメント       | ✓    | ✓    |
| 関連記事を取得する               | ✓    | ✓    |
| 旧スラグから新スラグへリダイレクト | ✓    | ✓    |

### Projects

| アクション                       | 公開 | 実装 |
| -------------------------------- | ---- | ---- |
| プロジェクトを登録する           |      | ✓    |
| プロジェクト情報を編集する       |      | ✓    |
| プロジェクトにメンバーを追加する |      | ✓    |
| プロジェクトからメンバーを外す   |      | ✓    |
| プロジェクトを削除する           |      | ✓    |
| プロジェクトを検索する           |      | ✓    |
| プロジェクト一覧を見る           | ✓    | ✓    |
| プロジェクト詳細を見る           | ✓    | ✓    |
| プロジェクト閲覧数をインクリメント | ✓    | ✓    |
| リードを引き継ぐ                 |      | ✓    |

### Search

| アクション             | 公開 | 実装 |
| ---------------------- | ---- | ---- |
| 記事・プロジェクト検索 | ✓    | ✓    |

### Analytics

| アクション                     | 公開 | 実装 |
| ------------------------------ | ---- | ---- |
| 閲覧数統計を見る               |      | ✓    |
| 記事別閲覧数ランキング         |      | ✓    |
| プロジェクト別閲覧数ランキング |      | ✓    |
| メンバー別閲覧数ランキング     |      | ✓    |
| ダッシュボードで統計概要を見る |      | ✓    |
| 時系列グラフで閲覧傾向を見る   |      | ✓    |
| コンテンツタイプ別推移を見る   |      | ✓    |
