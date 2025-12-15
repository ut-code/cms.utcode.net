<script lang="ts">
  import { upload } from "$lib/data/storage.remote";

  let {
    value = $bindable(""),
    folder = "images",
    label = "Image",
  }: {
    value?: string;
    folder?: string;
    label?: string;
  } = $props();

  let isUploading = $state(false);
  let dragOver = $state(false);
  let containerEl: HTMLDivElement;

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    isUploading = true;
    try {
      const result = await upload({ file, folder });
      value = result.url;
    } finally {
      isUploading = false;
    }
  }

  function handleInput(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    dragOver = false;
    const file = e.dataTransfer?.files[0];
    if (file) handleFile(file);
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    dragOver = true;
  }

  function handleDragLeave() {
    dragOver = false;
  }

  function handlePaste(e: ClipboardEvent) {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          e.preventDefault();
          handleFile(file);
          return;
        }
      }
    }
  }

  function clearImage() {
    value = "";
  }
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  class="space-y-1.5"
  bind:this={containerEl}
  tabindex="0"
  onpaste={handlePaste}
  onfocus={() => containerEl.classList.add("ring-2", "ring-[#00D372]/20", "rounded-lg")}
  onblur={() => containerEl.classList.remove("ring-2", "ring-[#00D372]/20", "rounded-lg")}
>
  <span class="block text-sm font-medium text-zinc-700">{label}</span>

  {#if value}
    <div class="relative overflow-hidden rounded-lg border border-zinc-200">
      <img src={value} alt="" class="h-40 w-full object-cover" />
      <div
        class="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity hover:opacity-100"
      >
        <label
          class="cursor-pointer rounded-lg bg-white px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100"
        >
          Change
          <input type="file" accept="image/*" class="hidden" oninput={handleInput} />
        </label>
        <button
          type="button"
          onclick={clearImage}
          class="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600"
        >
          Remove
        </button>
      </div>
    </div>
  {:else}
    <label
      class="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors
        {dragOver
        ? 'border-[#00D372] bg-[#00D372]/5'
        : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'}"
      ondrop={handleDrop}
      ondragover={handleDragOver}
      ondragleave={handleDragLeave}
    >
      {#if isUploading}
        <svg class="mb-2 h-8 w-8 animate-spin text-zinc-400" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span class="text-sm text-zinc-500">Uploading...</span>
      {:else}
        <svg
          class="mb-2 h-8 w-8 text-zinc-400"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          viewBox="0 0 24 24"
        >
          <path
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          />
        </svg>
        <span class="text-sm text-zinc-600">Drop, click, or paste (Ctrl+V) to upload</span>
        <span class="mt-1 text-xs text-zinc-400">PNG, JPG, GIF up to 10MB</span>
      {/if}
      <input
        type="file"
        accept="image/*"
        class="hidden"
        oninput={handleInput}
        disabled={isUploading}
      />
    </label>
  {/if}
</div>
