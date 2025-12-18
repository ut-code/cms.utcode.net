<script lang="ts" module>
  type ModalState = {
    open: boolean;
  };

  export const modalState: ModalState = $state({ open: false });

  export function openSearch() {
    modalState.open = true;
  }

  export function closeSearch() {
    modalState.open = false;
  }

  export function toggleSearch() {
    modalState.open = !modalState.open;
  }
</script>

<script lang="ts">
  import { goto } from "$app/navigation";
  import { searchAdmin } from "$lib/data/private/search.remote";
  import { Search, FileText, Folder, Users, CornerDownLeft } from "lucide-svelte";
  import type { AdminSearchResult } from "$lib/shared/logic/search";

  let query = $state("");
  let selectedIndex = $state(0);

  const results = $derived(query.trim() ? await searchAdmin(query) : []);

  function handleQueryInput(e: Event & { currentTarget: HTMLInputElement }) {
    const newQuery = e.currentTarget.value;
    if (newQuery !== query) {
      query = newQuery;
      selectedIndex = 0;
    }
  }

  function handleGlobalKeydown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      toggleSearch();
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      closeSearch();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, results.length - 1);
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, 0);
      return;
    }

    if (e.key === "Enter") {
      const selected = results[selectedIndex];
      if (selected) {
        e.preventDefault();
        navigateToResult(selected);
      }
    }
  }

  function navigateToResult(result: AdminSearchResult) {
    closeSearch();
    query = "";

    switch (result.type) {
      case "article":
        goto(`/admin/articles/edit/${result.id}`);
        break;
      case "project":
        goto(`/admin/projects/edit/${result.id}`);
        break;
      case "member":
        goto(`/admin/members/edit/${result.id}`);
        break;
    }
  }

  function handleBackdropClick() {
    closeSearch();
    query = "";
  }

  function getResultIcon(type: AdminSearchResult["type"]) {
    switch (type) {
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
</script>

<svelte:window onkeydown={handleGlobalKeydown} />

{#if modalState.open}
  <!-- Backdrop -->
  <div
    class="fixed inset-0 z-50 flex items-start justify-center bg-zinc-900/50 pt-[15vh] backdrop-blur-sm"
    onclick={handleBackdropClick}
    onkeydown={(e) => e.key === "Enter" && handleBackdropClick()}
    role="button"
    tabindex="-1"
  >
    <!-- Modal -->
    <div
      class="w-full max-w-xl overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-2xl"
      style="animation: modalIn 0.15s ease-out"
      onclick={(e) => e.stopPropagation()}
      onkeydown={handleKeydown}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      tabindex="-1"
    >
      <!-- Search input -->
      <div class="flex items-center gap-3 border-b border-base-300 px-4">
        <Search class="h-5 w-5 shrink-0 text-base-content/40" />
        <input
          value={query}
          oninput={handleQueryInput}
          type="text"
          placeholder="Search articles, projects, members..."
          class="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-base-content/40"
        />
        <kbd
          class="hidden rounded border border-base-300 bg-base-200 px-1.5 py-0.5 font-mono text-xs text-base-content/60 sm:inline"
        >
          ESC
        </kbd>
      </div>

      <!-- Results -->
      <div class="max-h-80 overflow-y-auto p-2">
        {#if query.trim() === ""}
          <div class="flex flex-col items-center gap-2 py-8 text-center">
            <Search class="h-8 w-8 text-base-content/20" />
            <p class="text-sm text-base-content/50">Type to search...</p>
          </div>
        {:else}
          <svelte:boundary>
            {#snippet pending()}
              <div class="flex items-center justify-center py-8">
                <span class="loading loading-md loading-spinner text-base-content/40"></span>
              </div>
            {/snippet}

            {#if results.length === 0}
              <div class="flex flex-col items-center gap-2 py-8 text-center">
                <Search class="h-8 w-8 text-base-content/20" />
                <p class="text-sm text-base-content/50">No results found for "{query}"</p>
              </div>
            {:else}
              <ul class="space-y-1">
                {#each results as result, i (result.id)}
                  {@const Icon = getResultIcon(result.type)}
                  <li>
                    <button
                      type="button"
                      onclick={() => navigateToResult(result)}
                      onmouseenter={() => (selectedIndex = i)}
                      class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors
                        {i === selectedIndex
                        ? 'bg-primary text-primary-content'
                        : 'hover:bg-base-200'}"
                    >
                      <div
                        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
                          {i === selectedIndex ? 'bg-primary-content/20' : 'bg-base-200'}"
                      >
                        <Icon class="h-4 w-4" />
                      </div>
                      <div class="min-w-0 flex-1">
                        <p class="truncate font-medium">{getResultName(result)}</p>
                        <p
                          class="text-xs {i === selectedIndex
                            ? 'text-primary-content/70'
                            : 'text-base-content/50'}"
                        >
                          {getResultLabel(result.type)}
                          {#if result.type === "article" && !result.published}
                            <span
                              class="ml-1 rounded px-1 py-0.5 text-[10px] font-medium
                                {i === selectedIndex
                                ? 'bg-primary-content/20'
                                : 'bg-warning/20 text-warning'}"
                            >
                              Draft
                            </span>
                          {/if}
                        </p>
                      </div>
                      {#if i === selectedIndex}
                        <CornerDownLeft class="h-4 w-4 shrink-0 text-primary-content/60" />
                      {/if}
                    </button>
                  </li>
                {/each}
              </ul>
            {/if}
          </svelte:boundary>
        {/if}
      </div>

      <!-- Footer -->
      <div
        class="flex items-center justify-between border-t border-base-300 bg-base-200/50 px-4 py-2"
      >
        <div class="flex items-center gap-4 text-xs text-base-content/50">
          <span class="flex items-center gap-1">
            <kbd class="rounded border border-base-300 bg-base-100 px-1 py-0.5 font-mono">
              <span class="text-[10px]">↑↓</span>
            </kbd>
            Navigate
          </span>
          <span class="flex items-center gap-1">
            <kbd class="rounded border border-base-300 bg-base-100 px-1 py-0.5 font-mono">
              <span class="text-[10px]">↵</span>
            </kbd>
            Select
          </span>
        </div>
        <div class="flex items-center gap-1 text-xs text-base-content/50">
          <kbd
            class="rounded border border-base-300 bg-base-100 px-1.5 py-0.5 font-mono text-[10px]"
            >⌘K</kbd
          >
          to search
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  @keyframes modalIn {
    from {
      opacity: 0;
      transform: scale(0.98) translateY(-10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
</style>
