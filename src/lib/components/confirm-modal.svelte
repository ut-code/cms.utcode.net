<script lang="ts" module>
  export type ConfirmOptions = {
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "danger" | "warning";
  };

  type ModalState = {
    options: ConfirmOptions | null;
    resolver: ((value: boolean) => void) | null;
  };

  const state: ModalState = $state({ options: null, resolver: null });

  export function confirm(options: ConfirmOptions): Promise<boolean> {
    return new Promise((resolve) => {
      state.options = options;
      state.resolver = resolve;
    });
  }

  function close(result: boolean) {
    state.resolver?.(result);
    state.options = null;
    state.resolver = null;
  }
</script>

<script lang="ts">
  const variantStyles = {
    default: {
      icon: "bg-zinc-100 text-zinc-600",
      button: "bg-zinc-900 hover:bg-zinc-800 text-white",
    },
    danger: {
      icon: "bg-red-50 text-red-500",
      button: "bg-red-600 hover:bg-red-700 text-white",
    },
    warning: {
      icon: "bg-amber-50 text-amber-500",
      button: "bg-amber-600 hover:bg-amber-700 text-white",
    },
  };

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") close(false);
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if state.options}
  {@const opts = state.options}
  {@const variant = opts.variant ?? "default"}
  {@const styles = variantStyles[variant]}

  <!-- Backdrop -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/50 p-4 backdrop-blur-sm"
    onclick={() => close(false)}
    onkeydown={(e) => e.key === "Enter" && close(false)}
    role="button"
    tabindex="-1"
  >
    <!-- Modal -->
    <div
      class="w-full max-w-sm rounded-2xl border border-zinc-100 bg-white p-6 shadow-2xl"
      style="animation: modalIn 0.15s ease-out"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabindex="-1"
    >
      <!-- Icon -->
      <div class="mx-auto flex h-10 w-10 items-center justify-center rounded-full {styles.icon}">
        {#if variant === "danger"}
          <svg
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <polyline points="3 6 5 6 21 6" />
            <path
              d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
            />
          </svg>
        {:else if variant === "warning"}
          <svg
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        {:else}
          <svg
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
        {/if}
      </div>

      <!-- Title -->
      <h3 id="modal-title" class="mt-4 text-center text-base font-semibold text-zinc-900">
        {opts.title}
      </h3>

      <!-- Description -->
      {#if opts.description}
        <p class="mt-2 text-center text-sm text-zinc-500">
          {opts.description}
        </p>
      {/if}

      <!-- Actions -->
      <div class="mt-6 flex gap-3">
        <button
          type="button"
          onclick={() => close(false)}
          class="flex-1 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-all duration-150 hover:border-zinc-300 hover:bg-zinc-50 active:scale-[0.98]"
        >
          {opts.cancelText ?? "Cancel"}
        </button>
        <button
          type="button"
          onclick={() => close(true)}
          class="flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-150 active:scale-[0.98] {styles.button}"
        >
          {opts.confirmText ?? "Confirm"}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  @keyframes modalIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
</style>
