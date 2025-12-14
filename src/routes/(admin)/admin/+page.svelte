<script lang="ts">
  import { getStats } from "$lib/data/stats.remote";

  const stats = $derived(await getStats());
</script>

<svelte:head>
  <title>Dashboard - ut.code(); CMS</title>
</svelte:head>

<svelte:boundary>
  {#snippet pending()}
    <div class="space-y-6">
      <div class="space-y-2">
        <div class="h-7 w-28 animate-pulse rounded bg-zinc-200"></div>
        <div class="h-4 w-40 animate-pulse rounded bg-zinc-100"></div>
      </div>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {#each Array.from({ length: 4 }, (_, i) => i) as i (i)}
          <div class="rounded-xl border border-zinc-100 bg-white p-5">
            <div class="h-4 w-16 animate-pulse rounded bg-zinc-100"></div>
            <div class="mt-3 h-8 w-12 animate-pulse rounded bg-zinc-200"></div>
          </div>
        {/each}
      </div>
    </div>
  {/snippet}

  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-xl font-bold text-zinc-900">Dashboard</h1>
      <p class="mt-0.5 text-sm text-zinc-500">Overview of your CMS content</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <a
        href="/admin/members"
        class="group rounded-xl border border-zinc-100 bg-white p-5 transition-all duration-150 hover:border-zinc-200 hover:shadow-sm"
        style="animation: fadeSlideIn 0.2s ease-out 0s both"
      >
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-zinc-500">Members</p>
          <div
            class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-500 transition-transform duration-150 group-hover:scale-110"
          >
            <svg
              class="h-4 w-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
        </div>
        <p class="mt-3 font-[JetBrains_Mono,monospace] text-3xl font-bold text-zinc-900">
          {stats.members}
        </p>
      </a>

      <a
        href="/admin/articles"
        class="group rounded-xl border border-zinc-100 bg-white p-5 transition-all duration-150 hover:border-zinc-200 hover:shadow-sm"
        style="animation: fadeSlideIn 0.2s ease-out 0.05s both"
      >
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-zinc-500">Articles</p>
          <div
            class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-500 transition-transform duration-150 group-hover:scale-110"
          >
            <svg
              class="h-4 w-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
        </div>
        <p class="mt-3 font-[JetBrains_Mono,monospace] text-3xl font-bold text-zinc-900">
          {stats.articles}
        </p>
        <p class="mt-1 text-xs text-zinc-400">{stats.publishedArticles} published</p>
      </a>

      <a
        href="/admin/projects"
        class="group rounded-xl border border-zinc-100 bg-white p-5 transition-all duration-150 hover:border-zinc-200 hover:shadow-sm"
        style="animation: fadeSlideIn 0.2s ease-out 0.1s both"
      >
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-zinc-500">Projects</p>
          <div
            class="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-500 transition-transform duration-150 group-hover:scale-110"
          >
            <svg
              class="h-4 w-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
              />
            </svg>
          </div>
        </div>
        <p class="mt-3 font-[JetBrains_Mono,monospace] text-3xl font-bold text-zinc-900">
          {stats.projects}
        </p>
      </a>

      <div
        class="rounded-xl border border-zinc-100 bg-white p-5"
        style="animation: fadeSlideIn 0.2s ease-out 0.15s both"
      >
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-zinc-500">Published</p>
          <div
            class="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-500"
          >
            <svg
              class="h-4 w-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
        </div>
        <p class="mt-3 font-[JetBrains_Mono,monospace] text-3xl font-bold text-zinc-900">
          {stats.publishedArticles}
        </p>
        <p class="mt-1 text-xs text-zinc-400">{stats.articles - stats.publishedArticles} drafts</p>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mt-8" style="animation: fadeSlideIn 0.2s ease-out 0.2s both">
      <h2 class="mb-3 text-sm font-semibold text-zinc-900">Quick Actions</h2>
      <div class="flex flex-wrap gap-2">
        <a
          href="/admin/members/new"
          class="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-all duration-150 hover:border-zinc-300 hover:bg-zinc-50 active:scale-[0.98]"
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
          Add Member
        </a>
        <a
          href="/admin/articles/new"
          class="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-all duration-150 hover:border-zinc-300 hover:bg-zinc-50 active:scale-[0.98]"
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
        <a
          href="/admin/projects/new"
          class="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-all duration-150 hover:border-zinc-300 hover:bg-zinc-50 active:scale-[0.98]"
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
          New Project
        </a>
      </div>
    </div>
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
