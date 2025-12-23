import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import { getExtensionFromKey, S3_KEY_PATTERN, S3KeySchema, validateS3Key } from "./storage";

describe("storage", () => {
  describe("validateS3Key", () => {
    test("accepts valid UUID key", () => {
      expect(validateS3Key("a1b2c3d4-e5f6/a1b2c3d4-e5f6.jpg")).toBe(true);
    });

    test("accepts valid key with full UUID format", () => {
      expect(
        validateS3Key(
          "550e8400-e29b-41d4-a716-446655440000/550e8400-e29b-41d4-a716-446655440000.png",
        ),
      ).toBe(true);
    });

    test("accepts various file extensions", () => {
      expect(validateS3Key("abc123/def456.jpg")).toBe(true);
      expect(validateS3Key("abc123/def456.png")).toBe(true);
      expect(validateS3Key("abc123/def456.webp")).toBe(true);
      expect(validateS3Key("abc123/def456.gif")).toBe(true);
    });

    test("rejects path traversal attempt", () => {
      expect(validateS3Key("../../../etc/passwd")).toBe(false);
    });

    test("rejects key without extension", () => {
      expect(validateS3Key("a1b2c3d4-e5f6/a1b2c3d4-e5f6")).toBe(false);
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

    test("rejects uppercase letters", () => {
      expect(validateS3Key("ABC123/DEF456.jpg")).toBe(false);
    });

    test("rejects empty string", () => {
      expect(validateS3Key("")).toBe(false);
    });
  });

  describe("getExtensionFromKey", () => {
    test("extracts jpg extension", () => {
      expect(getExtensionFromKey("abc123/def456.jpg")).toBe("jpg");
    });

    test("extracts png extension", () => {
      expect(getExtensionFromKey("abc123/def456.png")).toBe("png");
    });

    test("extracts webp extension", () => {
      expect(getExtensionFromKey("abc123/def456.webp")).toBe("webp");
    });

    test("returns null for key without extension", () => {
      expect(getExtensionFromKey("abc123/def456")).toBe(null);
    });

    test("returns null for empty string", () => {
      expect(getExtensionFromKey("")).toBe(null);
    });
  });

  describe("S3KeySchema (Valibot)", () => {
    test("passes valid key", () => {
      const result = v.safeParse(S3KeySchema, "a1b2c3d4-e5f6/a1b2c3d4-e5f6.jpg");
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
      const result = v.safeParse(S3KeySchema, "abc123/def456");
      expect(result.success).toBe(false);
    });
  });

  describe("S3_KEY_PATTERN", () => {
    test("is exported and usable", () => {
      expect(S3_KEY_PATTERN).toBeInstanceOf(RegExp);
      expect(S3_KEY_PATTERN.test("abc123/def456.jpg")).toBe(true);
    });
  });
});
