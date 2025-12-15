<script lang="ts">
  import { getPublicArticles } from "$lib/data/public/index.remote";

  const articles = $derived(await getPublicArticles());

  let currentPage = $state(1);
  const itemsPerPage = 12;

  const totalPages = $derived(Math.ceil(articles.length / itemsPerPage));
  const paginatedArticles = $derived(
    articles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
  );

  function goToPage(page: number) {
    currentPage = page;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
</script>

<svelte:head>
  <title>記事一覧 | ut.code();</title>
  <meta property="og:title" content="記事一覧 | ut.code();" />
</svelte:head>

<div class="mx-auto max-w-6xl px-6 py-16">
  <div
    class="mb-3 font-[JetBrains_Mono,monospace] text-xs font-medium tracking-widest text-[#00D372] uppercase"
  >
    Articles
  </div>
  <h1 class="mb-8 text-3xl font-bold">記事一覧</h1>

  {#if articles.length === 0}
    <p class="text-zinc-500">まだ記事がありません。</p>
  {:else}
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {#each paginatedArticles as article (article.id)}
        <a
          href="/articles/{article.slug}"
          class="group rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:border-[#00D372] hover:shadow-md"
        >
          {#if article.coverUrl}
            <img
              src={article.coverUrl}
              alt={article.title}
              class="mb-4 aspect-video w-full rounded-lg object-cover"
            />
          {/if}
          <h2 class="mb-2 font-semibold group-hover:text-[#00D372]">{article.title}</h2>
          {#if article.excerpt}
            <p class="mb-4 line-clamp-2 text-sm text-zinc-500">{article.excerpt}</p>
          {/if}
          <div class="flex items-center gap-2 text-xs text-zinc-400">
            {#if article.author}
              <span>{article.author.name}</span>
              <span>·</span>
            {/if}
            {#if article.publishedAt}
              <time datetime={article.publishedAt.toISOString()}>
                {article.publishedAt.toLocaleDateString("ja-JP")}
              </time>
            {/if}
          </div>
        </a>
      {/each}
    </div>

    {#if articles.length > itemsPerPage}
      <div class="mt-8 flex items-center justify-center gap-2">
        <button
          onclick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          class="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium transition-colors hover:border-[#00D372] hover:text-[#00D372] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-zinc-200 disabled:hover:text-inherit"
        >
          前へ
        </button>

        <div class="flex items-center gap-1">
          {#each Array.from({ length: totalPages }, (_, i) => i + 1) as page (page)}
            <button
              onclick={() => goToPage(page)}
              class="rounded-lg border px-3 py-2 text-sm font-medium transition-colors {currentPage ===
              page
                ? 'border-[#00D372] bg-[#00D372] text-white'
                : 'border-zinc-200 bg-white hover:border-[#00D372] hover:text-[#00D372]'}"
            >
              {page}
            </button>
          {/each}
        </div>

        <button
          onclick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          class="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium transition-colors hover:border-[#00D372] hover:text-[#00D372] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-zinc-200 disabled:hover:text-inherit"
        >
          次へ
        </button>
      </div>
    {/if}
  {/if}
</div>
