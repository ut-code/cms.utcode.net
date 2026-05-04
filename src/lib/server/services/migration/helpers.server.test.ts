import { describe, expect, test } from "bun:test";
import { deriveProjectSlug } from "./helpers.server";

describe("deriveProjectSlug", () => {
  // Form A: <slug>/index.md
  test("returns parent dir name for index.md", () => {
    expect(deriveProjectSlug("/repo/contents/projects/coursemate/index.md")).toBe("coursemate");
  });

  test("returns parent dir name for index.mdx", () => {
    expect(deriveProjectSlug("/repo/contents/projects/coursemate/index.mdx")).toBe("coursemate");
  });

  // Form B: hackathon/<date>/<slug>.md
  test("returns file basename for flat .md (regression: 9 projects silently skipped)", () => {
    expect(deriveProjectSlug("/repo/contents/projects/hackathon/2023-08-17/call-paper.md")).toBe(
      "call-paper",
    );
  });

  test("returns file basename for flat .mdx", () => {
    expect(deriveProjectSlug("/repo/contents/projects/hackathon/2024-01-01/hack-shooter.mdx")).toBe(
      "hack-shooter",
    );
  });

  test("disambiguates siblings under same date dir", () => {
    const a = deriveProjectSlug("/repo/contents/projects/hackathon/2023-08-17/denigma.md");
    const b = deriveProjectSlug("/repo/contents/projects/hackathon/2023-08-17/music-app.md");
    expect(a).toBe("denigma");
    expect(b).toBe("music-app");
    expect(a).not.toBe(b);
  });
});
