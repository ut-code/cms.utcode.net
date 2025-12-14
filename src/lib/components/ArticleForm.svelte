<script lang="ts">
  import { goto } from "$app/navigation";
  import { snapshot } from "$lib/utils/snapshot.svelte";

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

  function validateSlug(slug: string): boolean {
    return /^[a-z0-9-]+$/.test(slug);
  }

  function generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

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
</script>

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

      <div class="space-y-1.5">
        <label for="coverUrl" class="block text-sm font-medium text-zinc-700">Cover Image URL</label
        >
        <input
          type="url"
          id="coverUrl"
          bind:value={formData.coverUrl}
          class="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 transition-all duration-150 placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 focus:outline-none"
          placeholder="https://example.com/cover.jpg"
        />
        {#if formData.coverUrl}
          <div
            class="mt-2 overflow-hidden rounded-lg border border-zinc-100 transition-all duration-150 hover:border-zinc-200"
          >
            <img
              src={formData.coverUrl}
              alt="Cover preview"
              class="h-32 w-full object-cover"
              onerror={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        {/if}
      </div>
    </div>
  </div>

  <!-- Content Section -->
  <div class="rounded-xl border border-zinc-100 bg-white p-5 transition-shadow hover:shadow-sm">
    <div class="mb-5 flex items-center justify-between">
      <h2 class="text-sm font-semibold text-zinc-900">Content</h2>
      <span class="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500"
        >Markdown</span
      >
    </div>

    <div class="space-y-1.5">
      <textarea
        id="content"
        bind:value={formData.content}
        rows={16}
        class="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-3 font-[JetBrains_Mono,monospace] text-sm text-zinc-900 transition-all duration-150 placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 focus:outline-none"
        class:border-red-300={errors["content"]}
        placeholder="Write your article content here..."
      ></textarea>
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
        <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      {/if}
      {submitLabel}
    </button>
  </div>
</form>
