import { describe, expect, test } from "bun:test";
import { filterSearchResults } from "./search";

describe("filterSearchResults", () => {
  test("空の検索クエリの場合は全て返す", () => {
    const data = [
      {
        type: "article" as const,
        id: "1",
        title: "Hello World",
        excerpt: "test",
        slug: "hello",
        coverUrl: null,
        publishedAt: null,
        author: null,
      },
    ];
    const results = filterSearchResults(data, "");
    expect(results).toEqual(data);
  });

  test("検索クエリに一致する記事を返す", () => {
    const data = [
      {
        type: "article" as const,
        id: "1",
        title: "Hello World",
        excerpt: "test",
        slug: "hello",
        coverUrl: null,
        publishedAt: null,
        author: null,
      },
      {
        type: "article" as const,
        id: "2",
        title: "Goodbye",
        excerpt: "test",
        slug: "goodbye",
        coverUrl: null,
        publishedAt: null,
        author: null,
      },
    ];
    const results = filterSearchResults(data, "hello");
    expect(results).toHaveLength(1);
    expect(results[0]?.title).toBe("Hello World");
  });

  test("検索クエリに一致するプロジェクトを返す", () => {
    const data = [
      {
        type: "project" as const,
        id: "1",
        name: "Project Alpha",
        description: "A cool project",
        slug: "alpha",
        coverUrl: null,
      },
      {
        type: "project" as const,
        id: "2",
        name: "Project Beta",
        description: "Another project",
        slug: "beta",
        coverUrl: null,
      },
    ];
    const results = filterSearchResults(data, "alpha");
    expect(results).toHaveLength(1);
    expect(results[0]?.name).toBe("Project Alpha");
  });

  test("大文字小文字を区別せずに検索する", () => {
    const data = [
      {
        type: "article" as const,
        id: "1",
        title: "TypeScript Tips",
        excerpt: "Learn TypeScript",
        slug: "ts-tips",
        coverUrl: null,
        publishedAt: null,
        author: null,
      },
    ];
    const results = filterSearchResults(data, "typescript");
    expect(results).toHaveLength(1);
  });

  test("excerptやdescriptionで検索する", () => {
    const data = [
      {
        type: "article" as const,
        id: "1",
        title: "Article",
        excerpt: "This contains React hooks",
        slug: "article",
        coverUrl: null,
        publishedAt: null,
        author: null,
      },
      {
        type: "project" as const,
        id: "2",
        name: "Project",
        description: "Uses Vue framework",
        slug: "project",
        coverUrl: null,
      },
    ];
    const reactResults = filterSearchResults(data, "react");
    expect(reactResults).toHaveLength(1);
    expect(reactResults[0]?.type).toBe("article");

    const vueResults = filterSearchResults(data, "vue");
    expect(vueResults).toHaveLength(1);
    expect(vueResults[0]?.type).toBe("project");
  });
});
