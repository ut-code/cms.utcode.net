<script lang="ts">
  import { getArticles } from "$lib/data/articles.remote";

  const articles = $derived(await getArticles());
  const publishedCount = $derived(articles.filter((a) => a.published).length);
</script>

<svelte:head>
  <title>Articles - ut.code(); CMS</title>
</svelte:head>

<svelte:boundary>
  {#snippet pending()}
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div class="space-y-2">
          <div class="h-7 w-24 animate-pulse rounded bg-zinc-200"></div>
          <div class="h-4 w-32 animate-pulse rounded bg-zinc-100"></div>
        </div>
        <div class="h-9 w-28 animate-pulse rounded-lg bg-zinc-200"></div>
      </div>
      <div class="space-y-3">
        {#each Array.from({ length: 3 }, (_, i) => i) as i (i)}
          <div class="rounded-xl border border-zinc-100 bg-white p-4">
            <div class="flex gap-4">
              <div class="h-16 w-24 shrink-0 animate-pulse rounded-lg bg-zinc-100"></div>
              <div class="flex-1 space-y-2">
                <div class="h-5 w-48 animate-pulse rounded bg-zinc-200"></div>
                <div class="h-4 w-32 animate-pulse rounded bg-zinc-100"></div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/snippet}

  <div>
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-zinc-900">Articles</h1>
        <p class="mt-0.5 text-sm text-zinc-500">
          {articles.length} articles · {publishedCount} published
        </p>
      </div>
      <a
        href="/admin/articles/new"
        class="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-all duration-150 hover:bg-zinc-800 hover:shadow active:scale-[0.98]"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        New Article
      </a>
    </div>

    {#if articles.length === 0}
      <!-- Empty state -->
      <div
        class="rounded-2xl border border-dashed border-zinc-200 bg-white p-12 text-center transition-colors hover:border-zinc-300"
      >
        <div
          class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400"
        >
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            viewBox="0 0 24 24"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        </div>
        <h3 class="mt-4 text-sm font-semibold text-zinc-900">No articles yet</h3>
        <p class="mt-1 text-sm text-zinc-500">Get started by writing your first article.</p>
        <a
          href="/admin/articles/new"
          class="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-all duration-150 hover:bg-zinc-800"
        >
          <svg
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Article
        </a>
      </div>
    {:else}
      <!-- Article list -->
      <div class="space-y-2">
        {#each articles as article, i (article.id)}
          <a
            href="/admin/articles/edit/{article.id}"
            class="group flex gap-4 rounded-xl border border-zinc-100 bg-white p-4 transition-all duration-150 hover:border-zinc-200 hover:shadow-sm"
            style="animation: fadeSlideIn 0.2s ease-out {i * 0.03}s both"
          >
            <!-- Cover thumbnail -->
            {#if article.coverUrl}
              <div
                class="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-zinc-100 transition-transform duration-150 group-hover:scale-[1.02]"
              >
                <img
                  src={article.coverUrl}
                  alt=""
                  class="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            {:else}
              <div
                class="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg bg-zinc-50 text-zinc-300 transition-colors duration-150 group-hover:bg-zinc-100"
              >
                <svg
                  class="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
            {/if}

            <!-- Content -->
            <div class="min-w-0 flex-1">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0 flex-1">
                  <h3
                    class="truncate font-medium text-zinc-900 transition-colors duration-150 group-hover:text-zinc-700"
                  >
                    {article.title}
                  </h3>
                  <p class="mt-0.5 flex items-center gap-2 text-sm text-zinc-400">
                    <code class="font-[JetBrains_Mono,monospace] text-xs">/{article.slug}</code>
                    <span class="text-zinc-200">·</span>
                    <span>{new Date(article.updatedAt).toLocaleDateString("ja-JP")}</span>
                  </p>
                </div>

                <!-- Status badge -->
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

              <!-- Author -->
              <div class="mt-2 flex items-center gap-4">
                {#if article.author}
                  <div class="flex items-center gap-1.5">
                    {#if article.author.imageUrl}
                      <img
                        src={article.author.imageUrl}
                        alt=""
                        class="h-5 w-5 rounded-full ring-1 ring-zinc-100"
                      />
                    {/if}
                    <span class="text-xs text-zinc-500">{article.author.name}</span>
                  </div>
                {/if}

                <!-- Arrow indicator -->
                <div class="ml-auto">
                  <svg
                    class="h-4 w-4 text-zinc-300 transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-zinc-400"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </div>
            </div>
          </a>
        {/each}
      </div>
    {/if}
  </div>
</svelte:boundary>

<style>
  @keyframes fadeSlideIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
