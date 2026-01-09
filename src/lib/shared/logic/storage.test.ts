import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import {
  extractS3KeyFromUrl,
  getExtensionFromKey,
  S3_KEY_PATTERN,
  S3KeySchema,
  validateS3Key,
} from "./storage";

describe("storage", () => {
  describe("validateS3Key", () => {
    test("accepts valid key with folder/uuid-filename format", () => {
      expect(validateS3Key("articles/a1b2c3d4-e5f6-7890-abcd-ef1234567890-cover.jpg")).toBe(true);
    });

    test("accepts valid key with full UUID format", () => {
      expect(validateS3Key("projects/550e8400-e29b-41d4-a716-446655440000-thumbnail.png")).toBe(
        true,
      );
    });

    test("accepts various allowed folders", () => {
      expect(validateS3Key("images/abc-123-file.jpg")).toBe(true);
      expect(validateS3Key("uploads/abc-123-file.png")).toBe(true);
      expect(validateS3Key("covers/abc-123-file.webp")).toBe(true);
      expect(validateS3Key("avatars/abc-123-file.gif")).toBe(true);
      expect(validateS3Key("members/abc-123-file.jpg")).toBe(true);
    });

    test("rejects path traversal attempt", () => {
      expect(validateS3Key("../../../etc/passwd")).toBe(false);
    });

    test("rejects key without extension", () => {
      expect(validateS3Key("articles/a1b2c3d4-cover")).toBe(false);
    });

    test("rejects key without slash", () => {
      expect(validateS3Key("a1b2c3d4-e5f6-a1b2c3d4-e5f6.jpg")).toBe(false);
    });

    test("rejects absolute path", () => {
      expect(validateS3Key("/var/www/file.jpg")).toBe(false);
    });

    test("rejects special characters in path", () => {
      expect(validateS3Key("test/../admin/secret.jpg")).toBe(false);
    });

    test("rejects uppercase folder", () => {
      expect(validateS3Key("ARTICLES/abc-123.jpg")).toBe(false);
    });

    test("rejects invalid folder", () => {
      expect(validateS3Key("invalid/abc-123-file.jpg")).toBe(false);
    });

    test("rejects empty string", () => {
      expect(validateS3Key("")).toBe(false);
    });
  });

  describe("getExtensionFromKey", () => {
    test("extracts jpg extension", () => {
      expect(getExtensionFromKey("articles/abc-123-file.jpg")).toBe("jpg");
    });

    test("extracts png extension", () => {
      expect(getExtensionFromKey("projects/abc-123-file.png")).toBe("png");
    });

    test("extracts webp extension", () => {
      expect(getExtensionFromKey("images/abc-123-file.webp")).toBe("webp");
    });

    test("returns null for key without extension", () => {
      expect(getExtensionFromKey("articles/abc-123-file")).toBe(null);
    });

    test("returns null for empty string", () => {
      expect(getExtensionFromKey("")).toBe(null);
    });
  });

  describe("S3KeySchema (Valibot)", () => {
    test("passes valid key", () => {
      const result = v.safeParse(S3KeySchema, "articles/a1b2c3d4-cover.jpg");
      expect(result.success).toBe(true);
    });

    test("fails invalid key with proper message", () => {
      const result = v.safeParse(S3KeySchema, "../../../etc/passwd");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.issues[0].message).toBe("Invalid S3 key format");
      }
    });

    test("fails path without extension", () => {
      const result = v.safeParse(S3KeySchema, "articles/abc-123-file");
      expect(result.success).toBe(false);
    });

    test("fails with invalid folder", () => {
      const result = v.safeParse(S3KeySchema, "invalid/abc-123-file.jpg");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.issues[0].message).toBe("Invalid folder");
      }
    });
  });

  describe("S3_KEY_PATTERN", () => {
    test("is exported and usable", () => {
      expect(S3_KEY_PATTERN).toBeInstanceOf(RegExp);
      expect(S3_KEY_PATTERN.test("articles/abc-123-file.jpg")).toBe(true);
    });
  });

  describe("extractS3KeyFromUrl", () => {
    const baseUrl = "http://localhost:9000/dev";

    test("extracts key from valid S3 URL", () => {
      expect(extractS3KeyFromUrl(`${baseUrl}/articles/a1b2c3d4-cover.webp`, baseUrl)).toBe(
        "articles/a1b2c3d4-cover.webp",
      );
    });

    test("returns null for external URL", () => {
      expect(extractS3KeyFromUrl("https://example.com/image.jpg", baseUrl)).toBe(null);
    });

    test("returns null for URL with different base", () => {
      expect(extractS3KeyFromUrl("http://other.host/articles/a1b2c3d4-cover.webp", baseUrl)).toBe(
        null,
      );
    });

    test("returns null for invalid key format", () => {
      expect(extractS3KeyFromUrl(`${baseUrl}/invalid/key`, baseUrl)).toBe(null);
    });

    test("returns null for empty URL", () => {
      expect(extractS3KeyFromUrl("", baseUrl)).toBe(null);
    });

    test("works with production-like URLs", () => {
      const prodUrl = "https://s3.example.com/bucket";
      expect(extractS3KeyFromUrl(`${prodUrl}/members/a1b2c3d4-avatar.png`, prodUrl)).toBe(
        "members/a1b2c3d4-avatar.png",
      );
    });
  });
});
