<script lang="ts">
  import { page } from "$app/state";
  import { getPublicArticle } from "$lib/data/public.remote";

  const slug = $derived(page.params.slug ?? "");
  const article = $derived(await getPublicArticle(slug));
</script>

{#if article}
  <article class="mx-auto max-w-3xl px-6 py-16">
    <a
      href="/articles"
      class="mb-8 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900"
    >
      ← 記事一覧
    </a>

    {#if article.coverUrl}
      <img src={article.coverUrl} alt="" class="mb-8 aspect-video w-full rounded-xl object-cover" />
    {/if}

    <h1 class="mb-4 text-4xl font-bold">{article.title}</h1>

    <div class="mb-8 flex items-center gap-4 text-sm text-zinc-500">
      {#if article.author}
        <a
          href="/members/{article.author.slug}"
          class="flex items-center gap-2 hover:text-zinc-900"
        >
          {#if article.author.imageUrl}
            <img src={article.author.imageUrl} alt="" class="h-6 w-6 rounded-full" />
          {/if}
          {article.author.name}
        </a>
      {/if}
      {#if article.publishedAt}
        <time datetime={article.publishedAt.toISOString()}>
          {article.publishedAt.toLocaleDateString("ja-JP")}
        </time>
      {/if}
    </div>

    <div class="prose-zinc prose max-w-none">
      {article.content}
    </div>
  </article>
{:else}
  <div class="mx-auto max-w-3xl px-6 py-16 text-center">
    <h1 class="mb-4 text-2xl font-bold">記事が見つかりません</h1>
    <a href="/articles" class="text-[#00D372] hover:underline">記事一覧に戻る</a>
  </div>
{/if}
