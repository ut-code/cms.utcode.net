# cms.utcode.net

utcode.net の CMS 駆動版フォーク (フォークではない) です。そのうち utcode.net を置き換える予定です。

## Development

環境構築

- [devenv](https://devenv.sh/) パッケージをインストールします
- `.sops-age-key.txt` を配置します（チームメンバーから取得）

```sh
direnv allow
```

サーバーその他全部起動

```sh
bun up
```

停止

```sh
bun down
```

リロード

```sh
bun reload
```

ログ

```sh
bun logs
```

process compose に接続 (F10 + enter で退出)

```sh
bun attach
```

## Secrets

シークレットは sops で暗号化されています。

```sh
# 編集
sops secrets.dev.yaml
sops secrets.prod.yaml
```

### 鍵のローテーション

```sh
# 1. 新しい鍵を生成
age-keygen

# 2. .sops.yaml に新しい公開鍵を追加（古い鍵も残す）

# 3. .sops-age-key.txt に新しい秘密鍵を追加（古い鍵も残す）

# 4. 再暗号化（古い鍵で復号→新しい鍵で暗号化）
sops updatekeys -y secrets.dev.yaml
sops updatekeys -y secrets.prod.yaml

# 5. 古い鍵を .sops.yaml と .sops-age-key.txt から削除
```

## Data Access Layer

データ操作は DAL `$lib/server/data/*` から import します。直接 db を触りません。

```ts
import { listMembers, createMember } from "$lib/server/data/members";
import { listPublishedArticles } from "$lib/server/data/articles";
```

## その他

何かあったら書く
