<script lang="ts">
  import { goto } from "$app/navigation";

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

  let formData = $state({ ...initialData });
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

<form onsubmit={handleSubmit} class="space-y-8">
  <!-- Basic Info Section -->
  <div class="rounded-xl border border-zinc-200 bg-white p-6">
    <h2 class="mb-6 text-lg font-semibold text-zinc-900">Article Details</h2>

    <div class="space-y-6">
      <div class="space-y-2">
        <label for="title" class="block text-sm font-medium text-zinc-700">
          Title <span class="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          bind:value={formData.title}
          oninput={handleTitleChange}
          class="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 transition-colors focus:border-[#00D372] focus:ring-2 focus:ring-[#00D372]/20 focus:outline-none"
          class:border-red-500={errors["title"]}
          placeholder="My Awesome Article"
        />
        {#if errors["title"]}
          <p class="text-sm text-red-500">{errors["title"]}</p>
        {/if}
      </div>

      <div class="grid gap-6 md:grid-cols-2">
        <div class="space-y-2">
          <label for="slug" class="block text-sm font-medium text-zinc-700">
            Slug <span class="text-red-500">*</span>
          </label>
          <div class="flex">
            <span
              class="inline-flex items-center rounded-l-lg border border-r-0 border-zinc-300 bg-zinc-50 px-3 text-sm text-zinc-500"
            >
              /articles/
            </span>
            <input
              type="text"
              id="slug"
              bind:value={formData.slug}
              class="w-full rounded-r-lg border border-zinc-300 px-4 py-2.5 font-mono text-sm text-zinc-900 transition-colors focus:border-[#00D372] focus:ring-2 focus:ring-[#00D372]/20 focus:outline-none"
              class:border-red-500={errors["slug"]}
              placeholder="my-awesome-article"
            />
          </div>
          {#if errors["slug"]}
            <p class="text-sm text-red-500">{errors["slug"]}</p>
          {/if}
        </div>

        <div class="space-y-2">
          <label for="author" class="block text-sm font-medium text-zinc-700">Author</label>
          <select
            id="author"
            bind:value={formData.authorId}
            class="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 transition-colors focus:border-[#00D372] focus:ring-2 focus:ring-[#00D372]/20 focus:outline-none"
          >
            <option value={null}>No author</option>
            {#each authors as author (author.id)}
              <option value={author.id}>{author.name}</option>
            {/each}
          </select>
        </div>
      </div>

      <div class="space-y-2">
        <label for="excerpt" class="block text-sm font-medium text-zinc-700">Excerpt</label>
        <textarea
          id="excerpt"
          bind:value={formData.excerpt}
          rows={2}
          class="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 transition-colors focus:border-[#00D372] focus:ring-2 focus:ring-[#00D372]/20 focus:outline-none"
          placeholder="A brief summary of the article..."
        ></textarea>
      </div>

      <div class="space-y-2">
        <label for="coverUrl" class="block text-sm font-medium text-zinc-700">Cover Image URL</label
        >
        <input
          type="url"
          id="coverUrl"
          bind:value={formData.coverUrl}
          class="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 transition-colors focus:border-[#00D372] focus:ring-2 focus:ring-[#00D372]/20 focus:outline-none"
          placeholder="https://example.com/cover.jpg"
        />
        {#if formData.coverUrl}
          <img
            src={formData.coverUrl}
            alt="Cover preview"
            class="mt-2 h-32 w-full rounded-lg border border-zinc-200 object-cover"
            onerror={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        {/if}
      </div>
    </div>
  </div>

  <!-- Content Section -->
  <div class="rounded-xl border border-zinc-200 bg-white p-6">
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-lg font-semibold text-zinc-900">Content</h2>
      <span class="text-xs text-zinc-400">Markdown supported</span>
    </div>

    <div class="space-y-2">
      <textarea
        id="content"
        bind:value={formData.content}
        rows={16}
        class="w-full rounded-lg border border-zinc-300 px-4 py-3 font-mono text-sm text-zinc-900 transition-colors focus:border-[#00D372] focus:ring-2 focus:ring-[#00D372]/20 focus:outline-none"
        class:border-red-500={errors["content"]}
        placeholder="Write your article content here..."
      ></textarea>
      {#if errors["content"]}
        <p class="text-sm text-red-500">{errors["content"]}</p>
      {/if}
    </div>
  </div>

  <!-- Publishing Section -->
  <div class="rounded-xl border border-zinc-200 bg-white p-6">
    <h2 class="mb-6 text-lg font-semibold text-zinc-900">Publishing</h2>

    <label class="flex cursor-pointer items-center gap-3">
      <input type="checkbox" bind:checked={formData.published} class="checkbox checkbox-success" />
      <div>
        <span class="font-medium text-zinc-900">Publish article</span>
        <p class="text-sm text-zinc-500">Make this article publicly visible</p>
      </div>
    </label>
  </div>

  <!-- Actions -->
  <div class="flex items-center justify-between">
    <button
      type="button"
      onclick={() => goto("/admin/articles")}
      class="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
    >
      Cancel
    </button>
    <button
      type="submit"
      disabled={isSubmitting}
      class="inline-flex items-center gap-2 rounded-lg bg-[#00D372] px-6 py-2.5 text-sm font-semibold text-zinc-900 transition-colors hover:bg-[#00C066] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {#if isSubmitting}
        <span class="loading loading-sm loading-spinner"></span>
      {/if}
      {submitLabel}
    </button>
  </div>
</form>
