<script lang="ts">
  import { goto } from "$app/navigation";
  import ArticleForm from "$lib/components/ArticleForm.svelte";
  import { saveArticle, getAuthors } from "$lib/data/articles.remote";

  const authors = $derived(await getAuthors());
  let isSubmitting = $state(false);

  async function handleSubmit(data: {
    slug: string;
    title: string;
    content: string;
    excerpt: string;
    coverUrl: string;
    authorId: string | null;
    published: boolean;
  }) {
    const result = await saveArticle({
      slug: data.slug,
      title: data.title,
      content: data.content,
      excerpt: data.excerpt || null,
      coverUrl: data.coverUrl || null,
      authorId: data.authorId,
      published: data.published,
      publishedAt: data.published ? new Date() : null,
    });
    if (result) {
      goto("/admin/articles");
    }
  }
</script>

<svelte:head>
  <title>New Article - ut.code(); CMS</title>
</svelte:head>

<svelte:boundary>
  {#snippet pending()}
    <div class="space-y-6">
      <div class="space-y-2">
        <div class="h-4 w-32 animate-pulse rounded bg-zinc-100"></div>
        <div class="h-7 w-40 animate-pulse rounded bg-zinc-200"></div>
      </div>
      <div class="h-64 animate-pulse rounded-xl bg-zinc-100"></div>
    </div>
  {/snippet}

  <div>
    <!-- Header -->
    <div class="mb-6">
      <nav class="mb-3 flex items-center gap-1.5 text-sm">
        <a
          href="/admin/articles"
          class="text-zinc-400 transition-colors duration-150 hover:text-zinc-600"
        >
          Articles
        </a>
        <svg
          class="h-3.5 w-3.5 text-zinc-300"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span class="text-zinc-900">New</span>
      </nav>
      <h1 class="text-xl font-bold text-zinc-900">New Article</h1>
      <p class="mt-0.5 text-sm text-zinc-500">Create a new article</p>
    </div>

    <ArticleForm {authors} onSubmit={handleSubmit} submitLabel="Create Article" bind:isSubmitting />
  </div>
</svelte:boundary>
