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
  import { searchPublic } from "$lib/data/public/index.remote";
  import { Search, FileText, Folder, CornerDownLeft } from "lucide-svelte";
  import type { SearchResult } from "$lib/shared/logic/search";

  let query = $state("");
  let inputRef: HTMLInputElement | null = $state(null);
  let selectedIndex = $state(0);
  let prevQuery = $state("");

  const results = $derived(query.trim() ? await searchPublic(query) : []);

  $effect(() => {
    if (modalState.open && inputRef) {
      inputRef.focus();
    }
  });

  $effect(() => {
    if (query !== prevQuery) {
      prevQuery = query;
      selectedIndex = 0;
    }
  });

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

  function navigateToResult(result: SearchResult) {
    closeSearch();
    query = "";

    switch (result.type) {
      case "article":
        goto(`/articles/${result.slug}`);
        break;
      case "project":
        goto(`/projects/${result.slug}`);
        break;
    }
  }

  function handleBackdropClick() {
    closeSearch();
    query = "";
  }

  function getResultIcon(type: SearchResult["type"]) {
    switch (type) {
      case "article":
        return FileText;
      case "project":
        return Folder;
    }
  }

  function getResultLabel(type: SearchResult["type"]) {
    switch (type) {
      case "article":
        return "Article";
      case "project":
        return "Project";
    }
  }

  function getResultName(result: SearchResult) {
    switch (result.type) {
      case "article":
        return result.title;
      case "project":
        return result.name;
    }
  }

  function getResultMeta(result: SearchResult) {
    if (result.type === "article") {
      const parts: string[] = [];
      if (result.author) parts.push(result.author.name);
      if (result.publishedAt) {
        parts.push(result.publishedAt.toLocaleDateString("ja-JP"));
      }
      return parts.join(" · ");
    }
    return result.description ?? "";
  }
</script>

<svelte:window onkeydown={handleGlobalKeydown} />

{#if modalState.open}
  <!-- Backdrop -->
  <div
    class="fixed inset-0 z-[100] flex items-start justify-center bg-zinc-900/50 pt-[15vh] backdrop-blur-sm"
    onclick={handleBackdropClick}
    onkeydown={(e) => e.key === "Enter" && handleBackdropClick()}
    role="button"
    tabindex="-1"
  >
    <!-- Modal -->
    <div
      class="w-full max-w-xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl"
      style="animation: modalIn 0.15s ease-out"
      onclick={(e) => e.stopPropagation()}
      onkeydown={handleKeydown}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      tabindex="-1"
    >
      <!-- Search input -->
      <div class="flex items-center gap-3 border-b border-zinc-200 px-4">
        <Search class="h-5 w-5 shrink-0 text-zinc-400" />
        <input
          bind:this={inputRef}
          bind:value={query}
          type="text"
          placeholder="記事やプロジェクトを検索..."
          class="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-zinc-400"
        />
        <kbd
          class="hidden rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-[JetBrains_Mono,monospace] text-xs text-zinc-500 sm:inline"
        >
          ESC
        </kbd>
      </div>

      <!-- Results -->
      <div class="max-h-80 overflow-y-auto p-2">
        {#if query.trim() === ""}
          <div class="flex flex-col items-center gap-2 py-8 text-center">
            <Search class="h-8 w-8 text-zinc-300" />
            <p class="text-sm text-zinc-500">検索キーワードを入力...</p>
          </div>
        {:else}
          <svelte:boundary>
            {#snippet pending()}
              <div class="flex items-center justify-center py-8">
                <div
                  class="h-6 w-6 animate-spin rounded-full border-2 border-zinc-200 border-t-[#00D372]"
                ></div>
              </div>
            {/snippet}

            {#if results.length === 0}
              <div class="flex flex-col items-center gap-2 py-8 text-center">
                <Search class="h-8 w-8 text-zinc-300" />
                <p class="text-sm text-zinc-500">「{query}」に一致する結果がありません</p>
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
                      class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors
                        {i === selectedIndex ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-100'}"
                    >
                      <div
                        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg
                          {i === selectedIndex ? 'bg-white/10' : 'bg-zinc-100'}"
                      >
                        <Icon
                          class="h-5 w-5 {i === selectedIndex ? 'text-white' : 'text-zinc-500'}"
                        />
                      </div>
                      <div class="min-w-0 flex-1">
                        <p class="truncate font-medium">{getResultName(result)}</p>
                        <p
                          class="truncate text-xs {i === selectedIndex
                            ? 'text-white/70'
                            : 'text-zinc-500'}"
                        >
                          {getResultMeta(result) || getResultLabel(result.type)}
                        </p>
                      </div>
                      {#if i === selectedIndex}
                        <CornerDownLeft class="h-4 w-4 shrink-0 text-white/60" />
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
      <div class="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 px-4 py-2">
        <div class="flex items-center gap-4 text-xs text-zinc-400">
          <span class="flex items-center gap-1">
            <kbd
              class="rounded border border-zinc-200 bg-white px-1 py-0.5 font-[JetBrains_Mono,monospace]"
            >
              <span class="text-[10px]">↑↓</span>
            </kbd>
            移動
          </span>
          <span class="flex items-center gap-1">
            <kbd
              class="rounded border border-zinc-200 bg-white px-1 py-0.5 font-[JetBrains_Mono,monospace]"
            >
              <span class="text-[10px]">↵</span>
            </kbd>
            選択
          </span>
        </div>
        <div class="flex items-center gap-1 text-xs text-zinc-400">
          <kbd
            class="rounded border border-zinc-200 bg-white px-1.5 py-0.5 font-[JetBrains_Mono,monospace] text-[10px]"
            >⌘K</kbd
          >
          で検索
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
