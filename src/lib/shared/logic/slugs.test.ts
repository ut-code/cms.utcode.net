import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import { generateSlug, SLUG_PATTERN, SlugSchema, validateSlug } from "./slugs";

describe("slugs", () => {
  describe("validateSlug", () => {
    test("accepts valid slug with lowercase letters", () => {
      expect(validateSlug("hello")).toBe(true);
    });

    test("accepts valid slug with numbers", () => {
      expect(validateSlug("hello123")).toBe(true);
    });

    test("accepts valid slug with hyphens", () => {
      expect(validateSlug("hello-world")).toBe(true);
    });

    test("accepts complex valid slug", () => {
      expect(validateSlug("my-awesome-project-2024")).toBe(true);
    });

    test("rejects uppercase letters", () => {
      expect(validateSlug("Hello")).toBe(false);
    });

    test("rejects spaces", () => {
      expect(validateSlug("hello world")).toBe(false);
    });

    test("rejects special characters", () => {
      expect(validateSlug("hello_world")).toBe(false);
      expect(validateSlug("hello.world")).toBe(false);
      expect(validateSlug("hello@world")).toBe(false);
    });

    test("rejects empty string", () => {
      expect(validateSlug("")).toBe(false);
    });
  });

  describe("generateSlug", () => {
    test("converts title to lowercase", () => {
      expect(generateSlug("Hello World")).toBe("hello-world");
    });

    test("replaces spaces with hyphens", () => {
      expect(generateSlug("hello world")).toBe("hello-world");
    });

    test("removes special characters", () => {
      expect(generateSlug("Hello, World!")).toBe("hello-world");
    });

    test("collapses multiple hyphens", () => {
      expect(generateSlug("hello---world")).toBe("hello-world");
    });

    test("handles multiple spaces", () => {
      expect(generateSlug("hello   world")).toBe("hello-world");
    });

    test("preserves numbers", () => {
      expect(generateSlug("Project 2024")).toBe("project-2024");
    });

    test("handles Japanese characters by removing them", () => {
      expect(generateSlug("プロジェクト Project")).toBe("project");
    });

    test("handles empty string", () => {
      expect(generateSlug("")).toBe("");
    });

    test("handles string with only special characters", () => {
      expect(generateSlug("!@#$%")).toBe("");
    });
  });

  describe("SlugSchema (Valibot)", () => {
    test("passes valid slug", () => {
      const result = v.safeParse(SlugSchema, "hello-world");
      expect(result.success).toBe(true);
    });

    test("fails empty string with proper message", () => {
      const result = v.safeParse(SlugSchema, "");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.issues[0].message).toBe("Slug is required");
      }
    });

    test("fails invalid format with proper message", () => {
      const result = v.safeParse(SlugSchema, "Hello World");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.issues[0].message).toBe(
          "Slug must be lowercase letters, numbers, and hyphens only",
        );
      }
    });
  });

  describe("SLUG_PATTERN", () => {
    test("is exported and usable", () => {
      expect(SLUG_PATTERN).toBeInstanceOf(RegExp);
      expect(SLUG_PATTERN.test("valid-slug")).toBe(true);
    });
  });
});
