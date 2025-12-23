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

export function filterSearchResults(results: SearchResult[], query: string): SearchResult[] {
  if (!query.trim()) {
    return results;
  }

  const lowerQuery = query.toLowerCase();

  return results.filter((result) => {
    if (result.type === "article") {
      return (
        result.title.toLowerCase().includes(lowerQuery) ||
        result.excerpt?.toLowerCase().includes(lowerQuery)
      );
    } else if (result.type === "project") {
      return (
        result.name.toLowerCase().includes(lowerQuery) ||
        result.description?.toLowerCase().includes(lowerQuery)
      );
    } else {
      return (
        result.name.toLowerCase().includes(lowerQuery) ||
        result.bio?.toLowerCase().includes(lowerQuery)
      );
    }
  });
}
