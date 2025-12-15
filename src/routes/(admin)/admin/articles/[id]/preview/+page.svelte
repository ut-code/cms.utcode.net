<script lang="ts">
  import { page } from "$app/state";
  import Markdown from "$lib/components/Markdown.svelte";
  import { getArticle } from "$lib/data/articles.remote";

  const id = $derived(page.params.id ?? "");
  const article = $derived(await getArticle(id));
</script>

<svelte:head>
  {#if article}
    <title>{article.title} | ut.code();</title>
    <meta property="og:title" content={article.title} />
    {#if article.excerpt}
      <meta name="description" content={article.excerpt} />
      <meta property="og:description" content={article.excerpt} />
    {/if}
    {#if article.coverUrl}
      <meta property="og:image" content={article.coverUrl} />
    {/if}
    <meta property="og:type" content="article" />
  {/if}
</svelte:head>

{#if article}
  <article class="mx-auto max-w-3xl px-6 py-16">
    <a
      href="/admin/articles/edit/{article.id}"
      class="mb-8 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900"
    >
      ← 編集に戻る
    </a>

    {#if article.coverUrl}
      <img
        src={article.coverUrl}
        alt={article.title}
        class="mb-8 max-h-64 w-full rounded-xl object-cover"
        style="aspect-ratio: 5/3"
      />
    {/if}

    <h1 class="mb-4 text-4xl font-bold">{article.title}</h1>

    <div class="mb-8 flex items-center gap-4 text-sm text-zinc-500">
      {#if article.author}
        <a
          href="/members/{article.author.slug}"
          class="flex items-center gap-2 hover:text-zinc-900"
        >
          {#if article.author.imageUrl}
            <img
              src={article.author.imageUrl}
              alt={article.author.name}
              class="h-6 w-6 rounded-full"
            />
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

    <Markdown content={article.content} />
  </article>
{:else}
  <div class="mx-auto max-w-3xl px-6 py-16 text-center">
    <h1 class="mb-4 text-2xl font-bold">記事が見つかりません</h1>
    <a href="/admin/articles" class="text-[#00D372] hover:underline">記事一覧に戻る</a>
  </div>
{/if}
