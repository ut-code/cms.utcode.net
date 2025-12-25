# cms.utcode.net

utcode.net の CMS 駆動版フォーク (フォークではない) です。そのうち utcode.net を置き換える予定です。

## Development

### 環境構築

- [devenv](https://devenv.sh/) パッケージをインストールします
- `.sops-age-key.txt` を配置します（チームメンバーから取得）

```sh
direnv allow
```

### コマンド


```sh
bun up # (devenv) サーバーその他全部起動
bun down # (devenv) 停止
bun reload # (devenv) リロード
bun tail # (devenv) ログ
bun attach # (devenv) process compose に接続 (F10 + enter で退出)

bun check # 全てのチェックを実行
bun fix # 自動修正 (フォーマットなど)
bun tidy # 全てのチェックを実行し、自動修正できるものは修正
bun test:e2e # playwright で E2E テストを実行
```

## Secrets

シークレットは sops で暗号化されています。

```sh
# 編集
sops secrets.dev.yaml
sops secrets.prod.yaml
# 実行
sops exec-env secrets.dev.yaml 'bun run build'
```

## コーディングルール

### Data Access Layer

データ操作は DAL `$lib/server/data/*` から import します。直接 db を触りません。

```ts
import { createMember } from "$lib/server/data/private/members";
import { listPublishedArticles } from "$lib/server/data/public/articles";
```

## その他

何かあったら書く
