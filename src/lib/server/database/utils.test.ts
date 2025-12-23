import { expect, test } from "bun:test";
import { createSearchPattern } from "./utils";

test("createSearchPattern returns null for empty string", () => {
  expect(createSearchPattern("")).toBe(null);
});

test("createSearchPattern returns null for whitespace", () => {
  expect(createSearchPattern("  ")).toBe(null);
});

test("createSearchPattern returns pattern for valid query", () => {
  expect(createSearchPattern("test")).toBe("%test%");
});

test("createSearchPattern trims input", () => {
  expect(createSearchPattern("  test  ")).toBe("%test%");
});
