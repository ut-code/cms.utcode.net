/**
 * Escapes special characters in LIKE pattern to prevent SQL wildcard injection.
 * Escapes: % (matches any characters), _ (matches single character), \ (escape character)
 *
 * @example
 * escapeLikePattern("50%") // => "50\\%"
 * escapeLikePattern("test_file") // => "test\\_file"
 */
export function escapeLikePattern(pattern: string): string {
  return pattern.replace(/[%_\\]/g, "\\$&");
}
