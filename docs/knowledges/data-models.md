# Data Models

## Schema

```
user (Better Auth)
  │ 1:1 (optional)
  ▼
members ◄────────────────┐
  │                      │
  │ 1:N                  │ N:M
  ▼                      │
articles    projects ────┘
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
| 自己紹介ページを書く       |      |      |

### Articles

| アクション                 | 公開 | 実装 |
| -------------------------- | ---- | ---- |
| 記事を書く                 |      | ✓    |
| 記事を編集する             |      | ✓    |
| 記事を公開する             |      | ✓    |
| 記事を非公開にする         |      | ✓    |
| 記事を削除する             |      | ✓    |
| 下書き含む記事一覧を見る   |      | ✓    |
| 下書きを読む               |      | ✓    |
| 記事をプレビューする       |      | ✓    |
| 公開記事一覧を見る         | ✓    | ✓    |
| 公開記事を読む             | ✓    | ✓    |
| 記事閲覧数をインクリメント | ✓    | ✓    |
| 関連記事を取得する         | ✓    | ✓    |

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
| リードを引き継ぐ                 |      |      |

### Search

| アクション             | 公開 | 実装 |
| ---------------------- | ---- | ---- |
| 記事・プロジェクト検索 | ✓    | ✓    |
