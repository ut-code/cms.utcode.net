<script lang="ts" module>
  export { modalState, openSearch, closeSearch, toggleSearch } from "./search-modal-base.svelte";
</script>

<script lang="ts">
  import SearchModalBase from "./search-modal-base.svelte";
  import { searchAdmin } from "$lib/data/private/search.remote";
  import { FileText, Folder, Users } from "lucide-svelte";
  import type { AdminSearchResult } from "$lib/shared/logic/search";

  function getResultIcon(result: AdminSearchResult) {
    switch (result.type) {
      case "article":
        return FileText;
      case "project":
        return Folder;
      case "member":
        return Users;
    }
  }

  function getResultLabel(type: AdminSearchResult["type"]) {
    switch (type) {
      case "article":
        return "Article";
      case "project":
        return "Project";
      case "member":
        return "Member";
    }
  }

  function getResultName(result: AdminSearchResult) {
    switch (result.type) {
      case "article":
        return result.title;
      case "project":
        return result.name;
      case "member":
        return result.name;
    }
  }

  function getResultHref(result: AdminSearchResult) {
    switch (result.type) {
      case "article":
        return `/admin/articles/edit/${result.id}`;
      case "project":
        return `/admin/projects/edit/${result.id}`;
      case "member":
        return `/admin/members/edit/${result.id}`;
    }
  }
</script>

<SearchModalBase
  searchFn={searchAdmin}
  getResultId={(result) => result.id}
  {getResultIcon}
  {getResultName}
  {getResultHref}
  placeholder="Search articles, projects, members..."
  emptyStateText="Type to search..."
  noResultsText={(query) => `No results found for "${query}"`}
  theme={{
    zIndex: "z-50",
    backdrop: "bg-zinc-900/50",
    modal: "rounded-xl border border-base-300 bg-base-100",
    searchBorder: "border-b border-base-300",
    searchIcon: "text-base-content/40",
    inputPlaceholder: "placeholder:text-base-content/40",
    kbd: "rounded border border-base-300 bg-base-200 px-1.5 py-0.5 font-mono text-xs text-base-content/60",
    emptyIcon: "text-base-content/20",
    emptyText: "text-base-content/50",
    spinner: "loading loading-md loading-spinner text-base-content/40",
    resultSelected: "rounded-lg bg-primary text-primary-content",
    resultHover: "rounded-lg hover:bg-base-200",
    resultIconBg: "bg-base-200",
    resultIconBgSelected: "bg-primary-content/20",
    enterIcon: "text-primary-content/60",
    footer: "border-t border-base-300 bg-base-200/50",
    footerText: "text-base-content/50",
    footerKbd: "rounded border border-base-300 bg-base-100 px-1.5 py-0.5 font-mono text-[10px]",
  }}
>
  {#snippet resultMeta(result: AdminSearchResult, isSelected: boolean)}
    <p class="text-xs {isSelected ? 'text-primary-content/70' : 'text-base-content/50'}">
      {getResultLabel(result.type)}
      {#if result.type === "article" && !result.published}
        <span
          class="ml-1 rounded px-1 py-0.5 text-[10px] font-medium
            {isSelected ? 'bg-primary-content/20' : 'bg-warning/20 text-warning'}"
        >
          Draft
        </span>
      {/if}
    </p>
  {/snippet}
</SearchModalBase>
