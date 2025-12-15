<script lang="ts">
  import { page } from "$app/state";
  import { getArticles } from "$lib/data/private/articles.remote";
  import { FileText, Plus, ChevronRight, Eye } from "lucide-svelte";

  const allArticles = $derived(await getArticles());
  const statusFilter = $derived(page.url.searchParams.get("status"));
  const articles = $derived(
    statusFilter === "published"
      ? allArticles.filter((a) => a.published)
      : statusFilter === "draft"
        ? allArticles.filter((a) => !a.published)
        : allArticles,
  );
  const publishedCount = $derived(allArticles.filter((a) => a.published).length);
  const draftCount = $derived(allArticles.length - publishedCount);
</script>

<svelte:head>
  <title>Articles - ut.code(); CMS</title>
</svelte:head>

<svelte:boundary>
  {#snippet pending()}
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 skeleton rounded-xl"></div>
          <div class="space-y-2">
            <div class="h-7 w-24 skeleton"></div>
            <div class="h-4 w-40 skeleton"></div>
          </div>
        </div>
        <div class="h-9 w-28 skeleton rounded-lg"></div>
      </div>
      <div class="space-y-3">
        {#each Array.from({ length: 3 }, (_, i) => i) as i (i)}
          <div class="card bg-base-100 shadow-sm">
            <div class="card-body flex-row gap-4 p-4">
              <div class="h-16 w-24 shrink-0 skeleton rounded-lg"></div>
              <div class="flex-1 space-y-2">
                <div class="h-5 w-48 skeleton"></div>
                <div class="h-4 w-32 skeleton"></div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/snippet}

  <div class="space-y-6">
    <!-- Header -->
    <header class="animate-fade-slide-in space-y-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-info/10">
            <FileText class="h-5 w-5 text-info" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-base-content">Articles</h1>
            <p class="text-sm text-base-content/60">
              {articles.length}
              {statusFilter === "published"
                ? "published"
                : statusFilter === "draft"
                  ? "drafts"
                  : "articles"}
            </p>
          </div>
        </div>
        <a href="/admin/articles/new" class="btn gap-2 btn-sm btn-secondary">
          <Plus class="h-4 w-4" />
          New Article
        </a>
      </div>

      <!-- Filter tabs -->
      <div role="tablist" class="tabs-box tabs tabs-sm">
        <a href="/admin/articles" role="tab" class="tab {!statusFilter ? 'tab-active' : ''}">
          All ({allArticles.length})
        </a>
        <a
          href="/admin/articles?status=published"
          role="tab"
          class="tab {statusFilter === 'published' ? 'tab-active' : ''}"
        >
          Published ({publishedCount})
        </a>
        <a
          href="/admin/articles?status=draft"
          role="tab"
          class="tab {statusFilter === 'draft' ? 'tab-active' : ''}"
        >
          Drafts ({draftCount})
        </a>
      </div>
    </header>

    {#if articles.length === 0}
      <!-- Empty state -->
      <div
        class="animate-fade-slide-in stagger-1 card border-2 border-dashed border-base-300 bg-base-100"
      >
        <div class="card-body items-center py-12 text-center">
          <div
            class="flex h-14 w-14 items-center justify-center rounded-2xl bg-base-200 text-base-content/40"
          >
            <FileText class="h-7 w-7" />
          </div>
          {#if statusFilter === "published"}
            <h3 class="mt-4 text-lg font-semibold text-base-content">No published articles</h3>
            <p class="text-base-content/60">Publish your first article to see it here.</p>
            {#if draftCount > 0}
              <a href="/admin/articles?status=draft" class="btn mt-4 gap-2 btn-outline btn-sm">
                View {draftCount} draft{draftCount > 1 ? "s" : ""}
              </a>
            {/if}
          {:else if statusFilter === "draft"}
            <h3 class="mt-4 text-lg font-semibold text-base-content">No drafts</h3>
            <p class="text-base-content/60">All articles are published!</p>
            <a href="/admin/articles/new" class="btn mt-4 gap-2 btn-secondary">
              <Plus class="h-4 w-4" />
              New Article
            </a>
          {:else}
            <h3 class="mt-4 text-lg font-semibold text-base-content">No articles yet</h3>
            <p class="text-base-content/60">Get started by writing your first article.</p>
            <a href="/admin/articles/new" class="btn mt-4 gap-2 btn-secondary">
              <Plus class="h-4 w-4" />
              New Article
            </a>
          {/if}
        </div>
      </div>
    {:else}
      <!-- Article list -->
      <div class="space-y-3">
        {#each articles as article, i (article.id)}
          <a
            href="/admin/articles/edit/{article.id}"
            class="group animate-fade-slide-in card bg-base-100 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            style="animation-delay: {i * 30}ms"
          >
            <div class="card-body flex-row gap-4 p-4">
              <!-- Cover thumbnail -->
              {#if article.coverUrl}
                <figure
                  class="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-base-200 transition-transform duration-150 group-hover:scale-[1.02]"
                >
                  <img
                    src={article.coverUrl}
                    alt={article.title}
                    class="h-full w-full object-cover"
                    loading="lazy"
                  />
                </figure>
              {:else}
                <div
                  class="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg bg-base-200 text-base-content/30 transition-colors duration-150 group-hover:bg-base-300"
                >
                  <FileText class="h-6 w-6" />
                </div>
              {/if}

              <!-- Content -->
              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0 flex-1">
                    <h3
                      class="truncate font-medium text-base-content transition-colors duration-150 group-hover:text-base-content/80"
                    >
                      {article.title}
                    </h3>
                    <p class="mt-0.5 flex items-center gap-2 text-sm text-base-content/50">
                      <code class="font-mono text-xs">/{article.slug}</code>
                      <span class="text-base-content/20">·</span>
                      <span>{new Date(article.updatedAt).toLocaleDateString("ja-JP")}</span>
                    </p>
                  </div>

                  <!-- Status badge -->
                  {#if article.published}
                    <span class="badge shrink-0 badge-sm badge-success">Published</span>
                  {:else}
                    <span class="badge shrink-0 badge-sm badge-warning">Draft</span>
                  {/if}
                </div>

                <!-- Author and View Count -->
                <div class="mt-2 flex items-center gap-4">
                  {#if article.author}
                    <div class="flex items-center gap-1.5">
                      {#if article.author.imageUrl}
                        <div class="avatar">
                          <div class="w-5 rounded-full ring-1 ring-base-200">
                            <img src={article.author.imageUrl} alt={article.author.name} />
                          </div>
                        </div>
                      {/if}
                      <span class="text-xs text-base-content/50">{article.author.name}</span>
                    </div>
                  {/if}

                  <!-- View count -->
                  <div class="flex items-center gap-1 text-xs text-base-content/50">
                    <Eye class="h-3.5 w-3.5" />
                    <span>{article.viewCount.toLocaleString()}</span>
                  </div>

                  <!-- Arrow indicator -->
                  <div class="ml-auto">
                    <ChevronRight
                      class="h-4 w-4 text-base-content/30 transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-base-content/50"
                    />
                  </div>
                </div>
              </div>
            </div>
          </a>
        {/each}
      </div>
    {/if}
  </div>
</svelte:boundary>
