import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import {
  ARTICLE_SLUG_PATTERN,
  ArticleSlugSchema,
  extractDateFromArticleSlug,
  formatDateForSlug,
  generateArticleSlug,
  generateSlug,
  SLUG_PATTERN,
  SlugSchema,
  validateArticleSlug,
  validateSlug,
} from "./slugs";

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

  describe("validateArticleSlug", () => {
    test("accepts valid article slug with date prefix", () => {
      expect(validateArticleSlug("2024-01-15-my-article")).toBe(true);
    });

    test("accepts valid article slug with complex title", () => {
      expect(validateArticleSlug("2024-12-31-hello-world-123")).toBe(true);
    });

    test("rejects slug without date prefix", () => {
      expect(validateArticleSlug("my-article")).toBe(false);
    });

    test("rejects invalid date format", () => {
      expect(validateArticleSlug("24-01-15-my-article")).toBe(false);
      expect(validateArticleSlug("2024-1-15-my-article")).toBe(false);
      expect(validateArticleSlug("2024-01-5-my-article")).toBe(false);
    });

    test("rejects date-only slug", () => {
      expect(validateArticleSlug("2024-01-15")).toBe(false);
      expect(validateArticleSlug("2024-01-15-")).toBe(false);
    });

    test("rejects uppercase after date", () => {
      expect(validateArticleSlug("2024-01-15-MyArticle")).toBe(false);
    });

    test("rejects empty string", () => {
      expect(validateArticleSlug("")).toBe(false);
    });
  });

  describe("generateArticleSlug", () => {
    test("generates slug with date prefix", () => {
      const date = new Date(2024, 0, 15); // Jan 15, 2024
      expect(generateArticleSlug("Hello World", date)).toBe("2024-01-15-hello-world");
    });

    test("handles empty title with just date", () => {
      const date = new Date(2024, 11, 31); // Dec 31, 2024
      expect(generateArticleSlug("", date)).toBe("2024-12-31");
    });

    test("removes special characters from title", () => {
      const date = new Date(2024, 5, 1); // Jun 1, 2024
      expect(generateArticleSlug("Hello, World!", date)).toBe("2024-06-01-hello-world");
    });

    test("handles Japanese title", () => {
      const date = new Date(2024, 2, 10); // Mar 10, 2024
      expect(generateArticleSlug("日本語 Article", date)).toBe("2024-03-10-article");
    });
  });

  describe("extractDateFromArticleSlug", () => {
    test("extracts date from valid article slug", () => {
      const date = extractDateFromArticleSlug("2024-01-15-my-article");
      expect(date).not.toBeNull();
      expect(date?.getFullYear()).toBe(2024);
      expect(date?.getMonth()).toBe(0); // January
      expect(date?.getDate()).toBe(15);
    });

    test("returns null for invalid slug", () => {
      expect(extractDateFromArticleSlug("my-article")).toBeNull();
    });

    test("returns null for empty string", () => {
      expect(extractDateFromArticleSlug("")).toBeNull();
    });
  });

  describe("formatDateForSlug", () => {
    test("formats date with zero-padded month and day", () => {
      const date = new Date(2024, 0, 5); // Jan 5, 2024
      expect(formatDateForSlug(date)).toBe("2024-01-05");
    });

    test("formats date with double-digit month and day", () => {
      const date = new Date(2024, 11, 25); // Dec 25, 2024
      expect(formatDateForSlug(date)).toBe("2024-12-25");
    });
  });

  describe("ArticleSlugSchema (Valibot)", () => {
    test("passes valid article slug", () => {
      const result = v.safeParse(ArticleSlugSchema, "2024-01-15-hello-world");
      expect(result.success).toBe(true);
    });

    test("fails empty string with proper message", () => {
      const result = v.safeParse(ArticleSlugSchema, "");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.issues[0].message).toBe("Slug is required");
      }
    });

    test("fails slug without date prefix", () => {
      const result = v.safeParse(ArticleSlugSchema, "hello-world");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.issues[0].message).toBe(
          "Article slug must start with YYYY-MM-DD- followed by lowercase letters, numbers, and hyphens",
        );
      }
    });
  });

  describe("ARTICLE_SLUG_PATTERN", () => {
    test("is exported and usable", () => {
      expect(ARTICLE_SLUG_PATTERN).toBeInstanceOf(RegExp);
      expect(ARTICLE_SLUG_PATTERN.test("2024-01-15-valid-slug")).toBe(true);
      expect(ARTICLE_SLUG_PATTERN.test("invalid-slug")).toBe(false);
    });
  });
});
