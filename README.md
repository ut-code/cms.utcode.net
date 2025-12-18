# cms.utcode.net

utcode.net の CMS 駆動版フォーク (フォークではない) です。そのうち utcode.net を置き換える予定です。

## Development

環境構築

- devenv パッケージをインストールします

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

ログ

```sh
bun logs
```

## Data Access Layer

データ操作は `$lib/server/data/*` から import する。直接 db を触らない。

```ts
import { listMembers, createMember } from "$lib/server/data/members";
import { listPublishedArticles } from "$lib/server/data/articles";
```

Admin 関数は内部で自動的に認可チェックを行う。

## その他

何かあったら書く
