<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import ArticleForm from "$lib/components/ArticleForm.svelte";
  import { confirm } from "$lib/components/confirm-modal.svelte";
  import { useToast } from "$lib/components/toast/controls.svelte";
  import { getArticle, getAuthors, editArticle, removeArticle } from "$lib/data/articles.remote";
  import { ChevronRight, FileText } from "lucide-svelte";

  const toast = useToast();

  const id = $derived(page.params.id ?? "");
  const article = $derived(await getArticle(id));
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
    if (!article) return;

    try {
      // Confirm slug change
      if (data.slug !== article.slug) {
        const confirmed = await confirm({
          title: "Change URL slug?",
          description: `Changing the slug will break existing links. The URL will change from /${article.slug} to /${data.slug}.`,
          confirmText: "Change Slug",
          variant: "warning",
        });
        if (!confirmed) return;
      }

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
          publishedAt: data.published ? (article!.publishedAt ?? new Date()) : article!.publishedAt,
        },
      });
      goto("/admin/articles");
    } catch (error) {
      toast.show(error instanceof Error ? error.message : "保存に失敗しました");
    }
  }

  async function handleDelete() {
    if (!article) return;

    try {
      const confirmed = await confirm({
        title: "Delete Article",
        description: `Are you sure you want to delete "${article.title}"? This action cannot be undone.`,
        confirmText: "Delete",
        variant: "danger",
      });

      if (confirmed) {
        await removeArticle(id);
        goto("/admin/articles");
      }
    } catch (error) {
      toast.show(error instanceof Error ? error.message : "削除に失敗しました");
    }
  }
</script>

<svelte:head>
  <title>Edit {article?.title ?? "Article"} - ut.code(); CMS</title>
</svelte:head>

<svelte:boundary>
  {#snippet pending()}
    <div class="space-y-6">
      <div class="space-y-2">
        <div class="h-4 w-32 animate-pulse rounded bg-zinc-100"></div>
        <div class="h-7 w-48 animate-pulse rounded bg-zinc-200"></div>
      </div>
      <div class="h-64 animate-pulse rounded-xl bg-zinc-100"></div>
    </div>
  {/snippet}

  {#if !article}
    <div
      class="rounded-2xl border border-dashed border-zinc-200 bg-white p-12 text-center transition-colors"
    >
      <div
        class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400"
      >
        <FileText class="h-6 w-6" />
      </div>
      <h2 class="mt-4 text-sm font-semibold text-zinc-900">Article not found</h2>
      <p class="mt-1 text-sm text-zinc-500">The article you're looking for doesn't exist.</p>
      <a
        href="/admin/articles"
        class="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-all duration-150 hover:bg-zinc-800"
      >
        Back to Articles
      </a>
    </div>
  {:else}
    <div>
      <!-- Header -->
      <div class="mb-6 flex items-start justify-between gap-4">
        <div class="min-w-0 flex-1">
          <nav class="mb-3 flex items-center gap-1.5 text-sm">
            <a
              href="/admin/articles"
              class="text-zinc-400 transition-colors duration-150 hover:text-zinc-600"
            >
              Articles
            </a>
            <ChevronRight class="h-3.5 w-3.5 text-zinc-300" />
            <span class="truncate text-zinc-900">{article.title}</span>
          </nav>
          <div class="flex items-center gap-2">
            <h1 class="text-xl font-bold text-zinc-900">Edit Article</h1>
            {#if article.published}
              <span
                class="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600"
              >
                Published
              </span>
            {:else}
              <span
                class="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600"
              >
                Draft
              </span>
            {/if}
          </div>
          <p class="mt-0.5 text-sm text-zinc-500">Update article content and settings</p>
        </div>

        <button
          type="button"
          onclick={handleDelete}
          class="shrink-0 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition-all duration-150 hover:border-red-300 hover:bg-red-50 active:scale-[0.98]"
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
  {/if}
</svelte:boundary>
