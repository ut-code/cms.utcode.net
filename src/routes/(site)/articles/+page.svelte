<script lang="ts">
  import { getPublicArticles } from "$lib/data/public.remote";

  const articles = $derived(await getPublicArticles());
</script>

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
      {#each articles as article (article.id)}
        <a
          href="/articles/{article.slug}"
          class="group rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:border-[#00D372] hover:shadow-md"
        >
          {#if article.coverUrl}
            <img
              src={article.coverUrl}
              alt=""
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
  {/if}
</div>
