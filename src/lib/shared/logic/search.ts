export type SearchResult =
  | {
      type: "article";
      id: string;
      slug: string;
      title: string;
      excerpt: string | null;
      coverUrl: string | null;
      publishedAt: Date | null;
      author: { name: string } | null;
    }
  | {
      type: "project";
      id: string;
      slug: string;
      name: string;
      description: string | null;
      coverUrl: string | null;
    }
  | {
      type: "member";
      id: string;
      slug: string;
      name: string;
      bio: string | null;
    };

export type AdminSearchResult =
  | {
      type: "article";
      id: string;
      slug: string;
      title: string;
      published: boolean;
      author: { name: string } | null;
    }
  | {
      type: "project";
      id: string;
      slug: string;
      name: string;
    }
  | {
      type: "member";
      id: string;
      slug: string;
      name: string;
      imageUrl: string | null;
    };

export function getSearchResultLabel(
  type: SearchResult["type"] | AdminSearchResult["type"],
): string {
  switch (type) {
    case "article":
      return "Article";
    case "project":
      return "Project";
    case "member":
      return "Member";
  }
}

export function getSearchResultName(result: SearchResult | AdminSearchResult): string {
  switch (result.type) {
    case "article":
      return result.title;
    case "project":
      return result.name;
    case "member":
      return result.name;
  }
}
