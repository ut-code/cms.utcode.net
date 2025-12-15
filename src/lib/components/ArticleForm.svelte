<script lang="ts">
  import { goto } from "$app/navigation";
  import { snapshot } from "$lib/utils/snapshot.svelte";
  import { onSaveShortcut } from "$lib/utils/keyboard";
  import { validateSlug, generateSlug } from "$lib/shared/logic/slugs";
  import ImageUpload from "./image-upload.svelte";
  import Markdown from "./Markdown.svelte";
  import { Loader2 } from "lucide-svelte";

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
    submitLabel = "Save",
    isSubmitting = $bindable(false),
  }: {
    initialData?: ArticleData;
    authors?: Author[];
    onSubmit: (data: ArticleData) => Promise<void>;
    submitLabel?: string;
    isSubmitting?: boolean;
  } = $props();

  let formData = $state(snapshot(() => initialData));
  let errors = $state<Record<string, string>>({});
  let activeTab = $state<"edit" | "preview">("edit");

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

    if (Object.keys(errors).length > 0) return;

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
</script>

<svelte:window onkeydown={onSaveShortcut(triggerSubmit)} />

<form onsubmit={handleSubmit} class="space-y-6">
  <!-- Basic Info Section -->
  <div class="rounded-xl border border-zinc-100 bg-white p-5 transition-shadow hover:shadow-sm">
    <h2 class="mb-5 text-sm font-semibold text-zinc-900">Article Details</h2>

    <div class="space-y-5">
      <div class="space-y-1.5">
        <label for="title" class="block text-sm font-medium text-zinc-700">
          Title <span class="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          bind:value={formData.title}
          oninput={handleTitleChange}
          class="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 transition-all duration-150 placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 focus:outline-none"
          class:border-red-300={errors["title"]}
          class:focus:border-red-400={errors["title"]}
          class:focus:ring-red-50={errors["title"]}
          placeholder="My Awesome Article"
        />
        {#if errors["title"]}
          <p class="text-xs text-red-500">{errors["title"]}</p>
        {/if}
      </div>

      <div class="grid gap-5 md:grid-cols-2">
        <div class="space-y-1.5">
          <label for="slug" class="block text-sm font-medium text-zinc-700">
            Slug <span class="text-red-500">*</span>
          </label>
          <div class="flex">
            <span
              class="inline-flex items-center rounded-l-lg border border-r-0 border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-400"
            >
              /articles/
            </span>
            <input
              type="text"
              id="slug"
              bind:value={formData.slug}
              class="w-full rounded-r-lg border border-zinc-200 bg-white px-3.5 py-2.5 font-[JetBrains_Mono,monospace] text-sm text-zinc-900 transition-all duration-150 placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 focus:outline-none"
              class:border-red-300={errors["slug"]}
              placeholder="my-awesome-article"
            />
          </div>
          {#if errors["slug"]}
            <p class="text-xs text-red-500">{errors["slug"]}</p>
          {/if}
        </div>

        <div class="space-y-1.5">
          <label for="author" class="block text-sm font-medium text-zinc-700">Author</label>
          <select
            id="author"
            bind:value={formData.authorId}
            class="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 transition-all duration-150 hover:border-zinc-300 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 focus:outline-none"
          >
            <option value={null}>No author</option>
            {#each authors as author (author.id)}
              <option value={author.id}>{author.name}</option>
            {/each}
          </select>
        </div>
      </div>

      <div class="space-y-1.5">
        <label for="excerpt" class="block text-sm font-medium text-zinc-700">Excerpt</label>
        <textarea
          id="excerpt"
          bind:value={formData.excerpt}
          rows={2}
          class="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 transition-all duration-150 placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 focus:outline-none"
          placeholder="A brief summary of the article..."
        ></textarea>
      </div>

      <ImageUpload bind:value={formData.coverUrl} folder="articles" label="Cover Image" />
    </div>
  </div>

  <!-- Content Section -->
  <div class="rounded-xl border border-zinc-100 bg-white p-5 transition-shadow hover:shadow-sm">
    <div class="mb-5 flex items-center justify-between">
      <h2 class="text-sm font-semibold text-zinc-900">Content</h2>
      <div class="flex items-center gap-2">
        <div class="inline-flex rounded-lg border border-zinc-200 p-1">
          <button
            type="button"
            onclick={() => (activeTab = "edit")}
            class="rounded px-3 py-1 text-xs font-medium transition-all duration-150"
            class:bg-zinc-900={activeTab === "edit"}
            class:text-white={activeTab === "edit"}
            class:text-zinc-600={activeTab !== "edit"}
            class:hover:text-zinc-900={activeTab !== "edit"}
          >
            Edit
          </button>
          <button
            type="button"
            onclick={() => (activeTab = "preview")}
            class="rounded px-3 py-1 text-xs font-medium transition-all duration-150"
            class:bg-zinc-900={activeTab === "preview"}
            class:text-white={activeTab === "preview"}
            class:text-zinc-600={activeTab !== "preview"}
            class:hover:text-zinc-900={activeTab !== "preview"}
          >
            Preview
          </button>
        </div>
        <span class="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500"
          >Markdown</span
        >
      </div>
    </div>

    <div class="space-y-1.5">
      {#if activeTab === "edit"}
        <textarea
          id="content"
          bind:value={formData.content}
          rows={16}
          class="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-3 font-[JetBrains_Mono,monospace] text-sm text-zinc-900 transition-all duration-150 placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 focus:outline-none"
          class:border-red-300={errors["content"]}
          placeholder="Write your article content here..."
        ></textarea>
      {:else}
        <div
          class="min-h-[400px] w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-3 text-sm"
        >
          {#if formData.content.trim()}
            <Markdown content={formData.content} />
          {:else}
            <p class="text-zinc-400">No content to preview</p>
          {/if}
        </div>
      {/if}
      {#if errors["content"]}
        <p class="text-xs text-red-500">{errors["content"]}</p>
      {/if}
    </div>
  </div>

  <!-- Publishing Section -->
  <div class="rounded-xl border border-zinc-100 bg-white p-5 transition-shadow hover:shadow-sm">
    <h2 class="mb-5 text-sm font-semibold text-zinc-900">Publishing</h2>

    <label
      class="group flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-100 p-3 transition-all duration-150 hover:border-zinc-200 hover:bg-zinc-50"
    >
      <input
        type="checkbox"
        bind:checked={formData.published}
        class="h-4 w-4 rounded border-zinc-300 text-zinc-900 transition-colors focus:ring-2 focus:ring-zinc-200 focus:ring-offset-0"
      />
      <div>
        <span class="text-sm font-medium text-zinc-900">Publish article</span>
        <p class="text-xs text-zinc-500">Make this article publicly visible</p>
      </div>
    </label>
  </div>

  <!-- Actions -->
  <div class="flex items-center justify-between pt-2">
    <button
      type="button"
      onclick={() => goto("/admin/articles")}
      class="rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-all duration-150 hover:border-zinc-300 hover:bg-zinc-50 active:scale-[0.98]"
    >
      Cancel
    </button>
    <button
      type="submit"
      disabled={isSubmitting}
      class="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-zinc-800 hover:shadow active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {#if isSubmitting}
        <Loader2 class="h-4 w-4 animate-spin" />
      {/if}
      {submitLabel}
    </button>
  </div>
</form>
