import { describe, expect, test } from "bun:test";

export function shouldCreateRedirect(oldSlug: string, newSlug: string): boolean {
  return oldSlug !== newSlug;
}

describe("shouldCreateRedirect", () => {
  test("returns true when slug changes", () => {
    expect(shouldCreateRedirect("old-slug", "new-slug")).toBe(true);
  });

  test("returns false when slug unchanged", () => {
    expect(shouldCreateRedirect("same-slug", "same-slug")).toBe(false);
  });

  test("returns true for date prefix changes", () => {
    expect(shouldCreateRedirect("2024-01-01-article", "2024-01-02-article")).toBe(true);
  });

  test("returns true for empty string to slug", () => {
    expect(shouldCreateRedirect("", "new-slug")).toBe(true);
  });
});
