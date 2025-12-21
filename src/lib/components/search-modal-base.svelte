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

<script lang="ts" generics="TResult">
  import { goto } from "$app/navigation";
  import { Search, CornerDownLeft } from "lucide-svelte";
  import type { ComponentType, Snippet } from "svelte";

  type Props = {
    searchFn: (query: string) => Promise<TResult[]>;
    getResultId: (result: TResult) => string;
    getResultIcon: (result: TResult) => ComponentType;
    getResultName: (result: TResult) => string;
    getResultHref: (result: TResult) => string;
    resultMeta?: Snippet<[result: TResult, isSelected: boolean]>;
    placeholder: string;
    emptyStateText: string;
    noResultsText: (query: string) => string;
    footerNavigateText?: string;
    footerSelectText?: string;
    footerSearchText?: string;
    theme: {
      zIndex: string;
      backdrop: string;
      modal: string;
      searchBorder: string;
      searchIcon: string;
      inputPlaceholder: string;
      kbd: string;
      emptyIcon: string;
      emptyText: string;
      spinner: string;
      resultSelected: string;
      resultHover: string;
      resultIconBg: string;
      resultIconBgSelected: string;
      resultIconSize?: string;
      iconSize?: string;
      resultIconText?: string;
      resultIconTextSelected?: string;
      enterIcon: string;
      footer: string;
      footerText: string;
      footerKbd: string;
    };
  };

  const {
    searchFn,
    getResultId,
    getResultIcon,
    getResultName,
    getResultHref,
    resultMeta,
    placeholder,
    emptyStateText,
    noResultsText,
    footerNavigateText = "Navigate",
    footerSelectText = "Select",
    footerSearchText = "to search",
    theme,
  }: Props = $props();

  let query = $state("");
  let selectedIndex = $state(0);

  const results = $derived(query.trim() ? await searchFn(query) : []);

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

  function navigateToResult(result: TResult) {
    closeSearch();
    query = "";
    goto(getResultHref(result)).catch(console.error);
  }

  function handleBackdropClick() {
    closeSearch();
    query = "";
  }
</script>

<svelte:window onkeydown={handleGlobalKeydown} />

{#if modalState.open}
  <!-- Backdrop -->
  <div
    class="fixed inset-0 flex items-start justify-center pt-[15vh] backdrop-blur-sm {theme.zIndex} {theme.backdrop}"
    onclick={handleBackdropClick}
    onkeydown={(e) => e.key === "Enter" && handleBackdropClick()}
    role="button"
    tabindex="-1"
  >
    <!-- Modal -->
    <div
      class="w-full max-w-xl overflow-hidden shadow-2xl {theme.modal}"
      style="animation: modalIn 0.15s ease-out"
      onclick={(e) => e.stopPropagation()}
      onkeydown={handleKeydown}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      tabindex="-1"
    >
      <!-- Search input -->
      <div class="flex items-center gap-3 px-4 {theme.searchBorder}">
        <Search class="h-5 w-5 shrink-0 {theme.searchIcon}" />
        <input
          value={query}
          oninput={handleQueryInput}
          type="text"
          {placeholder}
          class="h-14 flex-1 bg-transparent text-base outline-none {theme.inputPlaceholder}"
        />
        <kbd class="hidden sm:inline {theme.kbd}">ESC</kbd>
      </div>

      <!-- Results -->
      <div class="max-h-80 overflow-y-auto p-2">
        {#if query.trim() === ""}
          <div class="flex flex-col items-center gap-2 py-8 text-center">
            <Search class="h-8 w-8 {theme.emptyIcon}" />
            <p class="text-sm {theme.emptyText}">{emptyStateText}</p>
          </div>
        {:else}
          <svelte:boundary>
            {#snippet pending()}
              <div class="flex items-center justify-center py-8">
                <div class={theme.spinner}></div>
              </div>
            {/snippet}

            {#if results.length === 0}
              <div class="flex flex-col items-center gap-2 py-8 text-center">
                <Search class="h-8 w-8 {theme.emptyIcon}" />
                <p class="text-sm {theme.emptyText}">{noResultsText(query)}</p>
              </div>
            {:else}
              <ul class="space-y-1">
                {#each results as result, i (getResultId(result))}
                  {@const Icon = getResultIcon(result)}
                  {@const isSelected = i === selectedIndex}
                  <li>
                    <button
                      type="button"
                      onclick={() => navigateToResult(result)}
                      onmouseenter={() => (selectedIndex = i)}
                      class="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors
                        {isSelected ? theme.resultSelected : theme.resultHover}"
                    >
                      <div
                        class="flex shrink-0 items-center justify-center rounded-lg
                          {isSelected
                          ? theme.resultIconBgSelected
                          : theme.resultIconBg} {theme.resultIconSize || 'h-8 w-8'}"
                      >
                        <Icon
                          class="{theme.iconSize || 'h-4 w-4'} {theme.resultIconText && !isSelected
                            ? theme.resultIconText
                            : ''} {theme.resultIconTextSelected && isSelected
                            ? theme.resultIconTextSelected
                            : ''}"
                        />
                      </div>
                      <div class="min-w-0 flex-1">
                        <p class="truncate font-medium">{getResultName(result)}</p>
                        {#if resultMeta}
                          {@render resultMeta(result, isSelected)}
                        {/if}
                      </div>
                      {#if isSelected}
                        <CornerDownLeft class="h-4 w-4 shrink-0 {theme.enterIcon}" />
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
      <div class="flex items-center justify-between px-4 py-2 {theme.footer}">
        <div class="flex items-center gap-4 text-xs {theme.footerText}">
          <span class="flex items-center gap-1">
            <kbd class={theme.footerKbd}>
              <span class="text-[10px]">↑↓</span>
            </kbd>
            {footerNavigateText}
          </span>
          <span class="flex items-center gap-1">
            <kbd class={theme.footerKbd}>
              <span class="text-[10px]">↵</span>
            </kbd>
            {footerSelectText}
          </span>
        </div>
        <div class="flex items-center gap-1 text-xs {theme.footerText}">
          <kbd class={theme.footerKbd}>⌘K</kbd>
          {footerSearchText}
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
