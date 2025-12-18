<script lang="ts">
  import { goto } from "$app/navigation";
  import ArticleForm from "$lib/components/ArticleForm.svelte";
  import { useToast } from "$lib/components/toast/controls.svelte";
  import { saveArticle, getMembers } from "$lib/data/private/articles.remote";

  const toast = useToast();
  const authors = $derived(await getMembers());
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
    try {
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
        toast.show(data.published ? "Published" : "Created", "success");
        goto(`/admin/articles/edit/${result.id}`);
      }
    } catch (error) {
      toast.show(error instanceof Error ? error.message : "Failed to save");
    }
  }
</script>

<svelte:head>
  <title>New Article - ut.code(); CMS</title>
</svelte:head>

<svelte:boundary>
  {#snippet pending()}
    <div class="flex h-96 items-center justify-center">
      <span class="loading loading-md loading-spinner"></span>
    </div>
  {/snippet}

  <div class="h-[calc(100vh-4rem)]">
    <ArticleForm {authors} onSubmit={handleSubmit} submitLabel="Create" bind:isSubmitting />
  </div>
</svelte:boundary>
