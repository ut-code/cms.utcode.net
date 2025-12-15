<script lang="ts">
  import { getStats } from "$lib/data/public/stats.remote";
  import {
    LayoutGrid,
    FileText,
    SquarePen,
    Folder,
    Users,
    UserPlus,
    Pencil,
    ExternalLink,
  } from "lucide-svelte";

  const stats = $derived(await getStats());
</script>

<svelte:head>
  <title>Dashboard - ut.code(); CMS</title>
</svelte:head>

<svelte:boundary>
  {#snippet pending()}
    <div class="space-y-8">
      <!-- Header skeleton -->
      <div class="space-y-2">
        <div class="h-8 w-32 skeleton"></div>
        <div class="h-4 w-48 skeleton"></div>
      </div>

      <!-- Stats skeleton -->
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {#each Array.from({ length: 4 }, (_, i) => i) as i (i)}
          <div class="card bg-base-100 shadow-sm">
            <div class="card-body p-5">
              <div class="h-4 w-20 skeleton"></div>
              <div class="mt-3 h-9 w-14 skeleton"></div>
            </div>
          </div>
        {/each}
      </div>

      <!-- Quick actions skeleton -->
      <div class="space-y-4">
        <div class="flex items-center gap-2">
          <div class="h-px flex-1 bg-base-300"></div>
          <div class="h-3 w-24 skeleton"></div>
          <div class="h-px flex-1 bg-base-300"></div>
        </div>
        <div class="flex gap-3">
          {#each Array.from({ length: 4 }, (_, i) => i) as i (i)}
            <div class="h-8 w-28 skeleton rounded-lg"></div>
          {/each}
        </div>
      </div>
    </div>
  {/snippet}

  <div class="space-y-8">
    <!-- Header -->
    <header class="animate-fade-slide-in">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <LayoutGrid class="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-base-content">Dashboard</h1>
          <p class="text-sm text-base-content/60">Overview of your CMS content</p>
        </div>
      </div>
    </header>

    <!-- Stats Grid -->
    <section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Published Articles -->
      <a
        href="/admin/articles?status=published"
        class="group animate-fade-slide-in stagger-1 card bg-base-100 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      >
        <div class="card-body p-5">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-base-content/60">Published</span>
            <div
              class="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10 text-success transition-transform group-hover:scale-110"
            >
              <FileText class="h-4 w-4" />
            </div>
          </div>
          <p class="mt-3 font-mono text-3xl font-bold text-base-content">
            {stats.publishedArticles}
          </p>
          <div class="mt-1 text-xs text-base-content/40">articles</div>
        </div>
      </a>

      <!-- Drafts -->
      <a
        href="/admin/articles?status=draft"
        class="group animate-fade-slide-in stagger-2 card bg-base-100 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      >
        <div class="card-body p-5">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-base-content/60">Drafts</span>
            <div
              class="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/10 text-warning transition-transform group-hover:scale-110"
            >
              <SquarePen class="h-4 w-4" />
            </div>
          </div>
          <p class="mt-3 font-mono text-3xl font-bold text-base-content">
            {stats.articles - stats.publishedArticles}
          </p>
          <div class="mt-1 text-xs text-base-content/40">articles</div>
        </div>
      </a>

      <!-- Projects -->
      <a
        href="/admin/projects"
        class="group animate-fade-slide-in stagger-3 card bg-base-100 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      >
        <div class="card-body p-5">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-base-content/60">Projects</span>
            <div
              class="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/10 text-secondary transition-transform group-hover:scale-110"
            >
              <Folder class="h-4 w-4" />
            </div>
          </div>
          <p class="mt-3 font-mono text-3xl font-bold text-base-content">
            {stats.projects}
          </p>
          <div class="mt-1 text-xs text-base-content/40">projects</div>
        </div>
      </a>

      <!-- Members -->
      <a
        href="/admin/members"
        class="group animate-fade-slide-in stagger-4 card bg-base-100 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      >
        <div class="card-body p-5">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-base-content/60">Members</span>
            <div
              class="flex h-9 w-9 items-center justify-center rounded-lg bg-info/10 text-info transition-transform group-hover:scale-110"
            >
              <Users class="h-4 w-4" />
            </div>
          </div>
          <p class="mt-3 font-mono text-3xl font-bold text-base-content">
            {stats.members}
          </p>
          <div class="mt-1 text-xs text-base-content/40">members</div>
        </div>
      </a>
    </section>

    <!-- Quick Actions -->
    <section class="animate-fade-slide-in stagger-5">
      <div class="mb-4 flex items-center gap-2">
        <div class="h-px flex-1 bg-base-300"></div>
        <span
          class="font-mono text-[10px] font-semibold tracking-widest text-base-content/40 uppercase"
        >
          Quick Actions
        </span>
        <div class="h-px flex-1 bg-base-300"></div>
      </div>
      <div class="flex flex-wrap gap-3">
        <a
          href="/admin/members/new"
          class="btn gap-2 font-medium transition-all btn-outline btn-sm hover:gap-3"
        >
          <UserPlus class="h-4 w-4" />
          Add Member
        </a>
        <a
          href="/admin/articles/new"
          class="btn gap-2 font-medium transition-all btn-outline btn-sm hover:gap-3"
        >
          <Pencil class="h-4 w-4" />
          New Article
        </a>
        <a
          href="/admin/projects/new"
          class="btn gap-2 font-medium transition-all btn-outline btn-sm hover:gap-3"
        >
          <Folder class="h-4 w-4" />
          New Project
        </a>
        <a
          href="/"
          target="_blank"
          class="btn gap-2 font-medium transition-all btn-outline btn-sm hover:gap-3"
        >
          <ExternalLink class="h-4 w-4" />
          View Site
        </a>
      </div>
    </section>
  </div>
</svelte:boundary>
