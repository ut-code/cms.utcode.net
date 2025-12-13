<script lang="ts">
  import { getStats } from "$lib/data/stats.remote";

  const stats = $derived(await getStats());
</script>

<svelte:head>
  <title>Dashboard - ut.code(); CMS</title>
</svelte:head>

<svelte:boundary>
  {#snippet pending()}
    <div class="flex h-64 items-center justify-center">
      <span class="loading loading-md loading-spinner"></span>
    </div>
  {/snippet}

  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-zinc-900">Dashboard</h1>
      <p class="text-zinc-500">Overview of your CMS content</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-xl border border-zinc-200 bg-white p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-zinc-500">Members</p>
            <p class="mt-1 font-[JetBrains_Mono,monospace] text-3xl font-bold">{stats.members}</p>
          </div>
          <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-[#00D372]/10">
            <svg
              class="h-6 w-6 text-[#00D372]"
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
        <a href="/admin/members" class="mt-4 inline-block text-sm text-[#00D372] hover:underline">
          View all →
        </a>
      </div>

      <div class="rounded-xl border border-zinc-200 bg-white p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-zinc-500">Articles</p>
            <p class="mt-1 font-[JetBrains_Mono,monospace] text-3xl font-bold">{stats.articles}</p>
          </div>
          <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
            <svg
              class="h-6 w-6 text-blue-500"
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
        <p class="mt-2 text-xs text-zinc-400">{stats.publishedArticles} published</p>
        <a href="/admin/articles" class="mt-2 inline-block text-sm text-blue-500 hover:underline">
          View all →
        </a>
      </div>

      <div class="rounded-xl border border-zinc-200 bg-white p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-zinc-500">Projects</p>
            <p class="mt-1 font-[JetBrains_Mono,monospace] text-3xl font-bold">{stats.projects}</p>
          </div>
          <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50">
            <svg
              class="h-6 w-6 text-purple-500"
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
        <a href="/admin/projects" class="mt-4 inline-block text-sm text-purple-500 hover:underline">
          View all →
        </a>
      </div>

      <div class="rounded-xl border border-zinc-200 bg-white p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-zinc-500">Published</p>
            <p class="mt-1 font-[JetBrains_Mono,monospace] text-3xl font-bold">
              {stats.publishedArticles}
            </p>
          </div>
          <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50">
            <svg
              class="h-6 w-6 text-orange-500"
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
        <p class="mt-2 text-xs text-zinc-400">
          {stats.articles - stats.publishedArticles} drafts
        </p>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mt-8">
      <h2 class="mb-4 text-lg font-semibold text-zinc-900">Quick Actions</h2>
      <div class="flex flex-wrap gap-3">
        <a
          href="/admin/members/new"
          class="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
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
          class="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
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
          class="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
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
