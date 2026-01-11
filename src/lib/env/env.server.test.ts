import { afterEach, beforeEach, describe, expect, test } from "bun:test";

describe("env production guard", () => {
  const originalEnv = process.env;

  const mockEnv = {
    DATABASE_URL: "postgresql://localhost/cms",
    GITHUB_CLIENT_ID: "test",
    GITHUB_CLIENT_SECRET: "test",
    BETTER_AUTH_SECRET: "test",
    BETTER_AUTH_URL: "http://localhost:5173",
    S3_ENDPOINT: "http://localhost:9000",
    S3_ACCESS_KEY: "minioadmin",
    S3_SECRET_KEY: "minioadmin",
    S3_BUCKET: "dev",
    S3_PUBLIC_URL: "http://localhost:9000/dev",
    CLOUDFLARE_ZONE_ID: "test",
    CLOUDFLARE_API_TOKEN: "test",
  };

  beforeEach(() => {
    process.env = { ...originalEnv, ...mockEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test("throws when UNSAFE_DISABLE_AUTH=true in production", () => {
    process.env.NODE_ENV = "production";
    process.env.UNSAFE_DISABLE_AUTH = "true";

    expect(() => {
      // Force re-import to clear cache and trigger fresh validation
      delete require.cache[require.resolve("./env.server.ts")];
      const { env } = require("./env.server.ts");
      // Access env to trigger lazy evaluation
      void env.DATABASE_URL;
    }).toThrow("UNSAFE_DISABLE_AUTH cannot be enabled in production");
  });

  test("allows UNSAFE_DISABLE_AUTH=true in development", () => {
    process.env.NODE_ENV = "development";
    process.env.UNSAFE_DISABLE_AUTH = "true";

    expect(() => {
      delete require.cache[require.resolve("./env.server.ts")];
      const { env } = require("./env.server.ts");
      void env.DATABASE_URL;
    }).not.toThrow();
  });

  test("allows production without UNSAFE_DISABLE_AUTH", () => {
    process.env.NODE_ENV = "production";
    delete process.env.UNSAFE_DISABLE_AUTH;

    expect(() => {
      delete require.cache[require.resolve("./env.server.ts")];
      const { env } = require("./env.server.ts");
      void env.DATABASE_URL;
    }).not.toThrow();
  });
});
