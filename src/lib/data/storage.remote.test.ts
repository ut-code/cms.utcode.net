import { describe, test, expect } from "bun:test";
import * as v from "valibot";

// S3 keys are: {uuid}/{uuid}.{ext} format
const S3KeySchema = v.pipe(v.string(), v.regex(/^[a-f0-9-]+\/[a-f0-9-]+\.[a-zA-Z0-9]+$/));

describe("S3 Key Validation", () => {
  test("valid UUID key passes", () => {
    const result = v.safeParse(S3KeySchema, "a1b2c3d4-e5f6/a1b2c3d4-e5f6.jpg");
    expect(result.success).toBe(true);
  });

  test("valid key with hyphens passes", () => {
    const result = v.safeParse(
      S3KeySchema,
      "550e8400-e29b-41d4-a716-446655440000/550e8400-e29b-41d4-a716-446655440000.png",
    );
    expect(result.success).toBe(true);
  });

  test("path traversal attempt fails", () => {
    const result = v.safeParse(S3KeySchema, "../../../etc/passwd");
    expect(result.success).toBe(false);
  });

  test("invalid format without extension fails", () => {
    const result = v.safeParse(S3KeySchema, "a1b2c3d4-e5f6/a1b2c3d4-e5f6");
    expect(result.success).toBe(false);
  });

  test("invalid format without slash fails", () => {
    const result = v.safeParse(S3KeySchema, "a1b2c3d4-e5f6-a1b2c3d4-e5f6.jpg");
    expect(result.success).toBe(false);
  });

  test("absolute path fails", () => {
    const result = v.safeParse(S3KeySchema, "/var/www/file.jpg");
    expect(result.success).toBe(false);
  });

  test("special characters fail", () => {
    const result = v.safeParse(S3KeySchema, "test/../admin/secret.jpg");
    expect(result.success).toBe(false);
  });
});
