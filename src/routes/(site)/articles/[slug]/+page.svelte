<script lang="ts">
  import { page } from "$app/state";
  import Markdown from "$lib/components/Markdown.svelte";
  import { Eye } from "lucide-svelte";
  import {
    getPublicArticle,
    getPublicRelatedArticles,
    incrementArticleViewCount,
  } from "$lib/data/public.remote";

  const slug = $derived(page.params.slug ?? "");
  const article = $derived(await getPublicArticle(slug));
  const relatedArticles = $derived(
    article
      ? await getPublicRelatedArticles({
          articleId: article.id,
          authorId: article.authorId,
          limit: 3,
        })
      : [],
  );

  // Increment view count when article is loaded
  $effect(() => {
    if (article) {
      incrementArticleViewCount(slug);
    }
  });
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
      href="/articles"
      class="mb-8 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900"
    >
      ← 記事一覧
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
      <div class="flex items-center gap-1">
        <Eye class="h-4 w-4" />
        <span>{article.viewCount.toLocaleString()}</span>
      </div>
    </div>

    <Markdown content={article.content} />
  </article>

  {#if relatedArticles.length > 0}
    <section class="mx-auto max-w-3xl px-6 pb-16">
      <div class="border-t border-zinc-200 pt-12">
        <h2 class="mb-6 text-2xl font-bold">関連記事</h2>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {#each relatedArticles as relatedArticle (relatedArticle.id)}
            <a
              href="/articles/{relatedArticle.slug}"
              class="group rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:border-[#00D372] hover:shadow-md"
            >
              {#if relatedArticle.coverUrl}
                <img
                  src={relatedArticle.coverUrl}
                  alt={relatedArticle.title}
                  class="mb-3 aspect-video w-full rounded-lg object-cover"
                />
              {/if}
              <h3 class="mb-2 font-semibold group-hover:text-[#00D372]">
                {relatedArticle.title}
              </h3>
              {#if relatedArticle.excerpt}
                <p class="mb-3 line-clamp-2 text-sm text-zinc-500">{relatedArticle.excerpt}</p>
              {/if}
              <div class="flex items-center gap-2 text-xs text-zinc-400">
                {#if relatedArticle.author}
                  <span>{relatedArticle.author.name}</span>
                  <span>·</span>
                {/if}
                {#if relatedArticle.publishedAt}
                  <time datetime={relatedArticle.publishedAt.toISOString()}>
                    {relatedArticle.publishedAt.toLocaleDateString("ja-JP")}
                  </time>
                {/if}
              </div>
            </a>
          {/each}
        </div>
      </div>
    </section>
  {/if}
{:else}
  <div class="mx-auto max-w-3xl px-6 py-16 text-center">
    <h1 class="mb-4 text-2xl font-bold">記事が見つかりません</h1>
    <a href="/articles" class="text-[#00D372] hover:underline">記事一覧に戻る</a>
  </div>
{/if}
