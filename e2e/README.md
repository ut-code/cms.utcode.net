# E2E Tests

アドミンページの基本的な動作をテストするEnd-to-End (E2E) テストです。

## セットアップ

Playwrightは既にインストール済みですが、初回実行時にブラウザをインストールする必要がある場合：

```bash
bunx playwright install chromium
```

## テスト実行

### 全テストを実行

```bash
bun run test:e2e
```

### UIモードで実行（デバッグに便利）

```bash
bun run test:e2e:ui
```

### ヘッドモードで実行（ブラウザを表示）

```bash
bun run test:e2e:headed
```

## テスト環境

- テストは `UNSAFE_DISABLE_AUTH=true` 環境で実行されます
- playwright.config.ts で自動的にビルド & プレビューサーバーを起動します
- ベースURL: `http://localhost:3000`

## カバーされているテスト

1. **admin-auth.e2e.ts** - 認証バイパステスト
   - UNSAFE_DISABLE_AUTH=true でアドミンページにアクセス可能か確認
   - 全アドミンセクションがログインページにリダイレクトされないか確認

2. **admin-dashboard.e2e.ts** - ダッシュボード
   - ダッシュボードページの読み込み
   - ナビゲーションリンクの存在確認

3. **admin-articles.e2e.ts** - 記事管理
   - 記事一覧ページの読み込み
   - 新規記事作成ページへの遷移
   - 記事フォームの表示確認

4. **admin-projects.e2e.ts** - プロジェクト管理
   - プロジェクト一覧ページの読み込み
   - 新規プロジェクト作成ページへの遷移
   - プロジェクトフォームの表示確認

5. **admin-members.e2e.ts** - メンバー管理
   - メンバー一覧ページの読み込み
   - 新規メンバー作成ページへの遷移
   - メンバーフォームの表示確認

## CI環境

CI環境では、playwright.config.ts の設定により：
- リトライが2回自動実行されます
- ワーカー数が1に制限されます（安定性向上のため）
- 既存サーバーの再利用を無効化します

## トラブルシューティング

### テストが失敗する場合

1. ビルドが成功しているか確認：
   ```bash
   bun run build
   ```

2. プレビューサーバーが起動するか確認：
   ```bash
   bun run preview
   ```

3. データベースが正しくセットアップされているか確認

### スクリーンショット・トレース

- 失敗時のスクリーンショット: `test-results/` ディレクトリ
- トレースファイル: 初回リトライ時に記録されます
- HTMLレポート: `playwright-report/` ディレクトリ
  ```bash
  bunx playwright show-report
  ```
