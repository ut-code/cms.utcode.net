/**
 * 記事コンテンツから抜粋テキストを生成する
 * @param content - Markdown形式の記事コンテンツ
 * @param maxLength - 最大文字数（デフォルト: 180）
 * @returns 抜粋テキスト
 */
export function generateExcerpt(content: string, maxLength = 180): string {
  // Markdownの特殊文字を除去
  const plainText = content
    // コードブロック削除
    .replace(/```[\s\S]*?```/g, "")
    // インラインコード削除
    .replace(/`[^`]+`/g, "")
    // 見出し記号削除
    .replace(/^#{1,6}\s+/gm, "")
    // リンク削除（テキストのみ残す）
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // 画像削除
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    // 太字・斜体記号削除
    .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, "$1")
    // リスト記号削除
    .replace(/^[-*+]\s+/gm, "")
    // 番号付きリスト削除
    .replace(/^\d+\.\s+/gm, "")
    // 引用記号削除
    .replace(/^>\s+/gm, "")
    // 水平線削除
    .replace(/^[-*_]{3,}$/gm, "")
    // HTMLタグ削除
    .replace(/<[^>]+>/g, "")
    // 連続する空白・改行を1つの空白に
    .replace(/\s+/g, " ")
    // 前後の空白を削除
    .trim();

  // 指定文字数で切り取り
  if (plainText.length <= maxLength) {
    return plainText;
  }

  // 文の途中で切れないように、最後の句読点または空白で切る
  const truncated = plainText.slice(0, maxLength);
  const lastPeriod = Math.max(
    truncated.lastIndexOf("。"),
    truncated.lastIndexOf("．"),
    truncated.lastIndexOf(". "),
  );
  const lastSpace = truncated.lastIndexOf(" ");

  // 句読点が見つかり、かつ全体の70%以上の位置にある場合はそこで切る
  if (lastPeriod > maxLength * 0.7) {
    return truncated.slice(0, lastPeriod + 1);
  }

  // 空白が見つかり、かつ全体の80%以上の位置にある場合はそこで切る
  if (lastSpace > maxLength * 0.8) {
    return `${truncated.slice(0, lastSpace)}...`;
  }

  // それ以外は指定文字数で切って省略記号を付ける
  return `${truncated}...`;
}
