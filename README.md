# cms.utcode.net

utcode.net の CMS 駆動版フォーク (フォークではない) です。そのうち utcode.net を置き換える予定です。

## Development

環境構築

- [devenv](https://devenv.sh/) パッケージをインストールします

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

## Data Access Layer

データ操作は DAL `$lib/server/data/*` から import します。直接 db を触りません。

```ts
import { listMembers, createMember } from "$lib/server/data/members";
import { listPublishedArticles } from "$lib/server/data/articles";
```

## その他

何かあったら書く
