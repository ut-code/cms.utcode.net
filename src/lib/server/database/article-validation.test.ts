import { describe, expect, test } from "bun:test";
import { validateAuthorId } from "./article-validation";

describe("validateAuthorId", () => {
  test("accepts null authorId", () => {
    expect(validateAuthorId(null, "member123")).toBe(true);
  });

  test("accepts undefined authorId", () => {
    expect(validateAuthorId(undefined, "member123")).toBe(true);
  });

  test("accepts authorId matching currentMemberId", () => {
    expect(validateAuthorId("member123", "member123")).toBe(true);
  });

  test("rejects authorId not matching currentMemberId", () => {
    expect(validateAuthorId("member456", "member123")).toBe(false);
  });

  test("rejects authorId when currentMemberId is null", () => {
    expect(validateAuthorId("member123", null)).toBe(false);
  });

  test("accepts null authorId when currentMemberId is null", () => {
    expect(validateAuthorId(null, null)).toBe(true);
  });
});
