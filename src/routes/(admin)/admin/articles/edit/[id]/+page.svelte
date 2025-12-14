<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import ArticleForm from "$lib/components/ArticleForm.svelte";
  import { getArticle, getAuthors, editArticle, removeArticle } from "$lib/data/articles.remote";

  const id = $derived(page.params.id ?? "");
  const article = $derived(await getArticle(id));
  const authors = $derived(await getAuthors());
  let isSubmitting = $state(false);
  let isDeleting = $state(false);
  let showDeleteConfirm = $state(false);

  async function handleSubmit(data: {
    slug: string;
    title: string;
    content: string;
    excerpt: string;
    coverUrl: string;
    authorId: string | null;
    published: boolean;
  }) {
    await editArticle({
      id,
      data: {
        slug: data.slug,
        title: data.title,
        content: data.content,
        excerpt: data.excerpt || null,
        coverUrl: data.coverUrl || null,
        authorId: data.authorId,
        published: data.published,
        publishedAt: data.published ? new Date() : null,
      },
    });
    goto("/admin/articles");
  }

  async function handleDelete() {
    isDeleting = true;
    try {
      await removeArticle(id);
      goto("/admin/articles");
    } finally {
      isDeleting = false;
    }
  }
</script>

<svelte:head>
  <title>Edit {article?.title ?? "Article"} - ut.code(); CMS</title>
</svelte:head>

<svelte:boundary>
  {#snippet pending()}
    <div class="flex h-64 items-center justify-center">
      <span class="loading loading-md loading-spinner"></span>
    </div>
  {/snippet}

  {#if !article}
    <div class="rounded-xl border border-zinc-200 bg-white p-12 text-center">
      <h2 class="text-lg font-semibold text-zinc-900">Article not found</h2>
      <p class="mt-1 text-zinc-500">The article you're looking for doesn't exist.</p>
      <a
        href="/admin/articles"
        class="mt-4 inline-block rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
      >
        Back to Articles
      </a>
    </div>
  {:else}
    <div>
      <!-- Header -->
      <div class="mb-8 flex items-start justify-between">
        <div>
          <nav class="mb-4 flex items-center gap-2 text-sm text-zinc-500">
            <a href="/admin/articles" class="hover:text-zinc-700">Articles</a>
            <svg
              class="h-4 w-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <span class="text-zinc-900">{article.title}</span>
          </nav>
          <div class="flex items-center gap-3">
            <h1 class="text-2xl font-bold text-zinc-900">Edit Article</h1>
            {#if article.published}
              <span class="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                Published
              </span>
            {:else}
              <span
                class="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700"
              >
                Draft
              </span>
            {/if}
          </div>
          <p class="text-zinc-500">Update article content and settings</p>
        </div>

        <button
          type="button"
          onclick={() => (showDeleteConfirm = true)}
          class="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
        >
          Delete
        </button>
      </div>

      <ArticleForm
        initialData={{
          slug: article.slug,
          title: article.title,
          content: article.content,
          excerpt: article.excerpt ?? "",
          coverUrl: article.coverUrl ?? "",
          authorId: article.authorId,
          published: article.published,
        }}
        {authors}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
        bind:isSubmitting
      />
    </div>

    <!-- Delete Confirmation Modal -->
    {#if showDeleteConfirm}
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div class="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
          <h3 class="text-lg font-semibold text-zinc-900">Delete Article</h3>
          <p class="mt-2 text-zinc-600">
            Are you sure you want to delete <strong>{article.title}</strong>? This action cannot be
            undone.
          </p>
          <div class="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onclick={() => (showDeleteConfirm = false)}
              class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onclick={handleDelete}
              disabled={isDeleting}
              class="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {#if isDeleting}
                <span class="loading loading-sm loading-spinner"></span>
              {/if}
              Delete
            </button>
          </div>
        </div>
      </div>
    {/if}
  {/if}
</svelte:boundary>
