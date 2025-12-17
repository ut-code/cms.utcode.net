<script lang="ts">
  import { ArrowRight } from "lucide-svelte";
  import type { getPublicArticles } from "$lib/data/public/index.remote";

  type Props = {
    articles: Awaited<ReturnType<typeof getPublicArticles>>;
  };

  const { articles }: Props = $props();
</script>

<section class="py-24">
  <div class="mx-auto max-w-6xl px-6">
    <div class="mb-8 flex items-end justify-between">
      <div>
        <div
          class="mb-3 font-[JetBrains_Mono,monospace] text-xs font-medium tracking-widest text-[#00D372] uppercase"
        >
          News
        </div>
        <h2 class="text-3xl font-bold">最新情報</h2>
      </div>
      <a
        href="/articles"
        class="group hidden items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-900 sm:flex"
      >
        すべて見る
        <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </a>
    </div>
    {#if articles.length > 0}
      <div class="grid gap-6 md:grid-cols-3">
        {#each articles as article (article.id)}
          <a
            href="/articles/{article.slug}"
            class="group rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-[#00D372] hover:shadow-md"
          >
            {#if article.coverUrl}
              <img
                src={article.coverUrl}
                alt={article.title}
                class="mb-4 aspect-video w-full rounded-xl object-cover"
              />
            {/if}
            <h3 class="mb-2 font-semibold transition-colors group-hover:text-[#00D372]">
              {article.title}
            </h3>
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
    {:else}
      <p class="text-zinc-500">まだ記事がありません。</p>
    {/if}
    <a
      href="/articles"
      class="mt-8 flex items-center justify-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-900 sm:hidden"
    >
      すべて見る
      <ArrowRight class="h-4 w-4" />
    </a>
  </div>
</section>
