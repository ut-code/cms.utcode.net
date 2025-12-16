<script lang="ts">
  import { goto } from "$app/navigation";
  import { snapshot } from "$lib/utils/snapshot.svelte";
  import { onSaveShortcut } from "$lib/utils/keyboard";
  import { validateSlug, generateSlug } from "$lib/shared/logic/slugs";
  import ImageUpload from "./image-upload.svelte";
  import Markdown from "./Markdown.svelte";
  import { Loader2, ArrowLeft, Settings, Eye, EyeOff, X, ExternalLink } from "lucide-svelte";

  type Author = {
    id: string;
    name: string;
    imageUrl: string | null;
  };

  type ArticleData = {
    slug: string;
    title: string;
    content: string;
    excerpt: string;
    coverUrl: string;
    authorId: string | null;
    published: boolean;
  };

  let {
    initialData = {
      slug: "",
      title: "",
      content: "",
      excerpt: "",
      coverUrl: "",
      authorId: null,
      published: false,
    },
    authors = [],
    onSubmit,
    onDelete = null,
    submitLabel = "Save",
    isSubmitting = $bindable(false),
    articleId = null,
  }: {
    initialData?: ArticleData;
    authors?: Author[];
    onSubmit: (data: ArticleData) => Promise<void>;
    onDelete?: (() => Promise<void>) | null;
    submitLabel?: string;
    isSubmitting?: boolean;
    articleId?: string | null;
  } = $props();

  let formData = $state(snapshot(() => initialData));
  let errors = $state<Record<string, string>>({});
  let showSettings = $state(false);
  let showPreview = $state(false);

  function handleTitleChange() {
    if (!formData.slug || formData.slug === generateSlug(initialData.title)) {
      formData.slug = generateSlug(formData.title);
    }
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    errors = {};

    if (!formData.title.trim()) {
      errors["title"] = "Title is required";
    }
    if (!formData.slug.trim()) {
      errors["slug"] = "Slug is required";
    } else if (!validateSlug(formData.slug)) {
      errors["slug"] = "Slug must be lowercase letters, numbers, and hyphens only";
    }
    if (!formData.content.trim()) {
      errors["content"] = "Content is required";
    }

    if (Object.keys(errors).length > 0) {
      // Show settings panel if there are errors in settings fields
      if (errors["slug"]) showSettings = true;
      return;
    }

    isSubmitting = true;
    try {
      await onSubmit(formData);
    } finally {
      isSubmitting = false;
    }
  }

  function triggerSubmit() {
    if (!isSubmitting) handleSubmit(new SubmitEvent("submit"));
  }

  function openPreviewPage() {
    if (articleId) {
      window.open(`/admin/articles/${articleId}/preview`, "_blank");
    }
  }
</script>

<svelte:window onkeydown={onSaveShortcut(triggerSubmit)} />

<form onsubmit={handleSubmit} class="flex h-full flex-col">
  <!-- Header Bar -->
  <header
    class="sticky top-0 z-20 flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3"
  >
    <div class="flex items-center gap-4">
      <button
        type="button"
        onclick={() => goto("/admin/articles")}
        class="flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900"
      >
        <ArrowLeft class="h-4 w-4" />
        <span class="hidden sm:inline">Articles</span>
      </button>

      <!-- Status Badge -->
      {#if formData.published}
        <span
          class="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
        >
          <Eye class="h-3 w-3" />
          Public
        </span>
      {:else}
        <span
          class="flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600"
        >
          <EyeOff class="h-3 w-3" />
          Draft
        </span>
      {/if}
    </div>

    <div class="flex items-center gap-2">
      <!-- Preview Button -->
      {#if articleId}
        <button
          type="button"
          onclick={openPreviewPage}
          class="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
        >
          <ExternalLink class="h-4 w-4" />
          <span class="hidden sm:inline">Preview</span>
        </button>
      {/if}

      <!-- Settings Toggle -->
      <button
        type="button"
        onclick={() => (showSettings = !showSettings)}
        class="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-colors {showSettings
          ? 'bg-zinc-900 text-white'
          : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'}"
      >
        <Settings class="h-4 w-4" />
        <span class="hidden sm:inline">Settings</span>
      </button>

      <!-- Save Button -->
      <button
        type="submit"
        disabled={isSubmitting}
        class="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 {formData.published
          ? 'bg-emerald-600 hover:bg-emerald-700'
          : 'bg-zinc-900 hover:bg-zinc-800'}"
      >
        {#if isSubmitting}
          <Loader2 class="h-4 w-4 animate-spin" />
        {/if}
        {formData.published ? "Publish" : submitLabel}
      </button>
    </div>
  </header>

  <!-- Main Content Area -->
  <div class="flex flex-1 overflow-hidden">
    <!-- Editor -->
    <main class="flex flex-1 flex-col overflow-y-auto bg-white">
      <div class="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-8">
        <!-- Title Input -->
        <input
          type="text"
          id="title"
          bind:value={formData.title}
          oninput={handleTitleChange}
          class="w-full border-none bg-transparent text-3xl font-bold text-zinc-900 placeholder:text-zinc-300 focus:ring-0 focus:outline-none"
          class:text-red-600={errors["title"]}
          placeholder="Title"
        />
        {#if errors["title"]}
          <p class="mt-1 text-sm text-red-500">{errors["title"]}</p>
        {/if}

        <!-- Content Toggle -->
        <div class="mt-6 flex items-center gap-2 border-b border-zinc-100 pb-4">
          <button
            type="button"
            onclick={() => (showPreview = false)}
            class="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors {!showPreview
              ? 'bg-zinc-100 text-zinc-900'
              : 'text-zinc-500 hover:text-zinc-700'}"
          >
            Write
          </button>
          <button
            type="button"
            onclick={() => (showPreview = true)}
            class="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors {showPreview
              ? 'bg-zinc-100 text-zinc-900'
              : 'text-zinc-500 hover:text-zinc-700'}"
          >
            Preview
          </button>
          <span class="ml-auto text-xs text-zinc-400">Markdown supported</span>
        </div>

        <!-- Content Area -->
        <div class="mt-4 flex-1">
          {#if showPreview}
            <div class="prose-zinc prose max-w-none">
              {#if formData.content.trim()}
                <Markdown content={formData.content} />
              {:else}
                <p class="text-zinc-400">Nothing to preview</p>
              {/if}
            </div>
          {:else}
            <textarea
              id="content"
              bind:value={formData.content}
              class="min-h-[60vh] w-full resize-none border-none bg-transparent font-[JetBrains_Mono,monospace] text-base leading-relaxed text-zinc-900 placeholder:text-zinc-300 focus:ring-0 focus:outline-none"
              class:text-red-600={errors["content"]}
              placeholder="Write your content here..."
            ></textarea>
            {#if errors["content"]}
              <p class="text-sm text-red-500">{errors["content"]}</p>
            {/if}
          {/if}
        </div>
      </div>
    </main>

    <!-- Settings Sidebar -->
    {#if showSettings}
      <aside class="w-80 shrink-0 overflow-y-auto border-l border-zinc-200 bg-zinc-50/50 lg:w-96">
        <div
          class="sticky top-0 flex items-center justify-between border-b border-zinc-200 bg-zinc-50/80 px-4 py-3 backdrop-blur-sm"
        >
          <h2 class="font-semibold text-zinc-900">Settings</h2>
          <button
            type="button"
            onclick={() => (showSettings = false)}
            class="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-600"
          >
            <X class="h-4 w-4" />
          </button>
        </div>

        <div class="space-y-6 p-4">
          <!-- Visibility -->
          <div class="space-y-3">
            <label class="text-sm font-medium text-zinc-700">Visibility</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                type="button"
                onclick={() => (formData.published = false)}
                class="rounded-lg border-2 p-3 text-left transition-all {!formData.published
                  ? 'border-zinc-900 bg-white'
                  : 'border-zinc-200 bg-white hover:border-zinc-300'}"
              >
                <EyeOff
                  class="mb-1 h-4 w-4 {!formData.published ? 'text-zinc-900' : 'text-zinc-400'}"
                />
                <span
                  class="block text-sm font-medium {!formData.published
                    ? 'text-zinc-900'
                    : 'text-zinc-600'}">Draft</span
                >
              </button>
              <button
                type="button"
                onclick={() => (formData.published = true)}
                class="rounded-lg border-2 p-3 text-left transition-all {formData.published
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-zinc-200 bg-white hover:border-zinc-300'}"
              >
                <Eye
                  class="mb-1 h-4 w-4 {formData.published ? 'text-emerald-600' : 'text-zinc-400'}"
                />
                <span
                  class="block text-sm font-medium {formData.published
                    ? 'text-emerald-700'
                    : 'text-zinc-600'}">Public</span
                >
              </button>
            </div>
          </div>

          <!-- URL Path -->
          <div class="space-y-2">
            <label for="slug" class="text-sm font-medium text-zinc-700">URL path</label>
            <div class="flex rounded-lg border border-zinc-200 bg-white">
              <span
                class="shrink-0 border-r border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-400"
              >
                /articles/
              </span>
              <input
                type="text"
                id="slug"
                bind:value={formData.slug}
                class="w-full rounded-r-lg border-none bg-transparent px-3 py-2 font-mono text-sm text-zinc-900 focus:ring-0 focus:outline-none"
                class:text-red-600={errors["slug"]}
                placeholder="my-article"
              />
            </div>
            {#if errors["slug"]}
              <p class="text-xs text-red-500">{errors["slug"]}</p>
            {/if}
          </div>

          <!-- Author -->
          <div class="space-y-2">
            <label for="author" class="text-sm font-medium text-zinc-700">Author</label>
            <select
              id="author"
              bind:value={formData.authorId}
              class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-400 focus:ring-0 focus:outline-none"
            >
              <option value={null}>No author</option>
              {#each authors as author (author.id)}
                <option value={author.id}>{author.name}</option>
              {/each}
            </select>
          </div>

          <!-- Excerpt -->
          <div class="space-y-2">
            <label for="excerpt" class="text-sm font-medium text-zinc-700">
              Excerpt
              <span class="font-normal text-zinc-400">(for cards)</span>
            </label>
            <textarea
              id="excerpt"
              bind:value={formData.excerpt}
              rows={3}
              class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-400 focus:ring-0 focus:outline-none"
              placeholder="Brief summary..."
            ></textarea>
          </div>

          <!-- Cover Image -->
          <div class="space-y-2">
            <ImageUpload bind:value={formData.coverUrl} folder="articles" label="Cover image" />
          </div>

          <!-- Danger Zone -->
          {#if onDelete}
            <div class="border-t border-zinc-200 pt-6">
              <p class="text-sm font-medium text-red-600">Danger zone</p>
              <p class="mt-1 text-xs text-zinc-500">Deleting is permanent. Links will break.</p>
              <button
                type="button"
                onclick={onDelete}
                class="mt-3 w-full rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                Delete article
              </button>
            </div>
          {/if}
        </div>
      </aside>
    {/if}
  </div>
</form>
