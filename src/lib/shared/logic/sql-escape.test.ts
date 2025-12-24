import { expect, test } from "bun:test";
import { escapeLikePattern } from "./sql-escape";

test("escapes % wildcard", () => {
  expect(escapeLikePattern("50%")).toBe("50\\%");
});

test("escapes _ wildcard", () => {
  expect(escapeLikePattern("test_file")).toBe("test\\_file");
});

test("escapes backslash", () => {
  expect(escapeLikePattern("path\\to")).toBe("path\\\\to");
});

test("escapes multiple special characters", () => {
  expect(escapeLikePattern("a%b_c\\d")).toBe("a\\%b\\_c\\\\d");
});

test("handles empty string", () => {
  expect(escapeLikePattern("")).toBe("");
});

test("handles normal text", () => {
  expect(escapeLikePattern("normal text")).toBe("normal text");
});
