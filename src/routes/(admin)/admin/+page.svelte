<script lang="ts">
  import { getAdminStats } from "$lib/data/private/stats.remote";
  import {
    LayoutGrid,
    FileText,
    SquarePen,
    Folder,
    Users,
    UserPlus,
    Pencil,
    ExternalLink,
    ArrowRight,
    Clock,
    AlertCircle,
    TrendingUp,
    Zap,
  } from "lucide-svelte";

  const stats = $derived(await getAdminStats());

  function formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return new Date(date).toLocaleDateString("ja-JP");
  }
</script>

<svelte:head>
  <title>Dashboard - ut.code(); CMS</title>
</svelte:head>

<svelte:boundary>
  {#snippet pending()}
    <div class="space-y-8">
      <!-- Header skeleton -->
      <div class="h-32 w-full skeleton rounded-2xl"></div>

      <!-- Stats skeleton -->
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {#each Array.from({ length: 4 }, (_, i) => i) as i (i)}
          <div class="h-28 skeleton rounded-2xl"></div>
        {/each}
      </div>

      <!-- Content skeleton -->
      <div class="grid gap-6 lg:grid-cols-2">
        <div class="h-64 skeleton rounded-2xl"></div>
        <div class="h-64 skeleton rounded-2xl"></div>
      </div>
    </div>
  {/snippet}

  <div class="space-y-8">
    <!-- Hero Header -->
    <header class="animate-fade-slide-in gradient-dark relative overflow-hidden rounded-2xl p-8">
      <!-- Decorative elements -->
      <div class="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary/30 blur-3xl"></div>
      <div class="absolute -bottom-10 left-1/4 h-32 w-32 rounded-full bg-info/20 blur-3xl"></div>

      <div class="relative flex items-start justify-between">
        <div>
          <div class="mb-2 flex items-center gap-2">
            <div
              class="gradient-primary glow-primary flex h-10 w-10 items-center justify-center rounded-xl"
            >
              <LayoutGrid class="h-5 w-5 text-white" />
            </div>
            <span class="font-mono text-xs font-semibold tracking-wider text-primary uppercase">
              Dashboard
            </span>
          </div>
          <h1 class="text-3xl font-bold text-white">Welcome back</h1>
          <p class="mt-1 text-white/60">Here's what's happening with your content</p>
        </div>
        <a
          href="/"
          target="_blank"
          class="btn gap-2 border-white/20 bg-white/10 text-white btn-sm hover:bg-white/20"
        >
          <ExternalLink class="h-4 w-4" />
          View Site
        </a>
      </div>

      <!-- Quick stats row -->
      <div class="relative mt-6 flex items-center gap-6">
        <div class="flex items-center gap-2 text-white/80">
          <TrendingUp class="h-4 w-4 text-primary" />
          <span class="text-sm font-medium">{stats.publishedArticles} published</span>
        </div>
        <div class="h-4 w-px bg-white/20"></div>
        <div class="flex items-center gap-2 text-white/80">
          <Users class="h-4 w-4 text-info" />
          <span class="text-sm font-medium">{stats.members} members</span>
        </div>
        <div class="h-4 w-px bg-white/20"></div>
        <div class="flex items-center gap-2 text-white/80">
          <Folder class="h-4 w-4 text-secondary-content" />
          <span class="text-sm font-medium">{stats.projects} projects</span>
        </div>
      </div>
    </header>

    <!-- Stats Grid -->
    <section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Published Articles -->
      <a
        href="/admin/articles?status=published"
        class="group animate-fade-slide-in stagger-1 card-hover glow-soft relative overflow-hidden rounded-2xl bg-base-100 p-5"
      >
        <div class="stat-accent" style="--accent-color: oklch(72% 0.19 145);"></div>
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-base-content/60">Published</span>
          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success transition-all group-hover:scale-110 group-hover:bg-success/20"
          >
            <FileText class="h-5 w-5" />
          </div>
        </div>
        <p class="mt-3 font-mono text-4xl font-bold text-base-content">
          {stats.publishedArticles}
        </p>
        <div class="mt-1 flex items-center justify-between">
          <span class="text-xs text-base-content/40">articles</span>
          <ArrowRight
            class="h-4 w-4 text-base-content/20 transition-all group-hover:translate-x-1 group-hover:text-primary"
          />
        </div>
      </a>

      <!-- Drafts -->
      <a
        href="/admin/articles?status=draft"
        class="group animate-fade-slide-in stagger-2 card-hover glow-soft relative overflow-hidden rounded-2xl bg-base-100 p-5"
      >
        <div class="stat-accent" style="--accent-color: oklch(75% 0.18 75);"></div>
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-base-content/60">Drafts</span>
          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10 text-warning transition-all group-hover:scale-110 group-hover:bg-warning/20"
          >
            <SquarePen class="h-5 w-5" />
          </div>
        </div>
        <p class="mt-3 font-mono text-4xl font-bold text-base-content">
          {stats.articles - stats.publishedArticles}
        </p>
        <div class="mt-1 flex items-center justify-between">
          <span class="text-xs text-base-content/40">articles</span>
          <ArrowRight
            class="h-4 w-4 text-base-content/20 transition-all group-hover:translate-x-1 group-hover:text-primary"
          />
        </div>
      </a>

      <!-- Projects -->
      <a
        href="/admin/projects"
        class="group animate-fade-slide-in stagger-3 card-hover glow-soft relative overflow-hidden rounded-2xl bg-base-100 p-5"
      >
        <div class="stat-accent" style="--accent-color: oklch(65% 0.19 240);"></div>
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-base-content/60">Projects</span>
          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-info/10 text-info transition-all group-hover:scale-110 group-hover:bg-info/20"
          >
            <Folder class="h-5 w-5" />
          </div>
        </div>
        <p class="mt-3 font-mono text-4xl font-bold text-base-content">
          {stats.projects}
        </p>
        <div class="mt-1 flex items-center justify-between">
          <span class="text-xs text-base-content/40">projects</span>
          <ArrowRight
            class="h-4 w-4 text-base-content/20 transition-all group-hover:translate-x-1 group-hover:text-primary"
          />
        </div>
      </a>

      <!-- Members -->
      <a
        href="/admin/members"
        class="group animate-fade-slide-in stagger-4 card-hover glow-soft relative overflow-hidden rounded-2xl bg-base-100 p-5"
      >
        <div class="stat-accent" style="--accent-color: oklch(65% 0.22 25);"></div>
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-base-content/60">Members</span>
          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-error/10 text-error transition-all group-hover:scale-110 group-hover:bg-error/20"
          >
            <Users class="h-5 w-5" />
          </div>
        </div>
        <p class="mt-3 font-mono text-4xl font-bold text-base-content">
          {stats.members}
        </p>
        <div class="mt-1 flex items-center justify-between">
          <span class="text-xs text-base-content/40">members</span>
          <ArrowRight
            class="h-4 w-4 text-base-content/20 transition-all group-hover:translate-x-1 group-hover:text-primary"
          />
        </div>
      </a>
    </section>

    <!-- Content Sections -->
    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Needs Attention -->
      {#if stats.draftArticles.length > 0}
        <section class="animate-fade-slide-in stagger-5 glow-soft rounded-2xl bg-base-100 p-6">
          <div class="mb-4 flex items-center gap-3">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/10">
              <AlertCircle class="h-4 w-4 text-warning" />
            </div>
            <h2 class="font-semibold text-base-content">Needs Attention</h2>
            <span
              class="ml-auto rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning"
            >
              {stats.draftArticles.length} drafts
            </span>
          </div>
          <div class="space-y-2">
            {#each stats.draftArticles as draft (draft.id)}
              <a
                href="/admin/articles/edit/{draft.id}"
                class="group flex items-center gap-3 rounded-xl bg-base-200/50 p-3 transition-all hover:bg-base-200"
              >
                <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/10">
                  <SquarePen class="h-4 w-4 text-warning" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-base-content">{draft.title}</p>
                  <p class="text-xs text-base-content/40">Updated {formatDate(draft.updatedAt)}</p>
                </div>
                <ArrowRight
                  class="h-4 w-4 text-base-content/20 transition-all group-hover:translate-x-1 group-hover:text-warning"
                />
              </a>
            {/each}
          </div>
        </section>
      {/if}

      <!-- Recent Activity -->
      <section
        class="animate-fade-slide-in stagger-5 glow-soft rounded-2xl bg-base-100 p-6 {stats
          .draftArticles.length === 0
          ? 'lg:col-span-2'
          : ''}"
      >
        <div class="mb-4 flex items-center gap-3">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Clock class="h-4 w-4 text-primary" />
          </div>
          <h2 class="font-semibold text-base-content">Recent Activity</h2>
        </div>
        <div class="space-y-2">
          {#each stats.recentArticles as article (article.id)}
            <a
              href="/admin/articles/edit/{article.id}"
              class="group flex items-center gap-3 rounded-xl bg-base-200/50 p-3 transition-all hover:bg-base-200"
            >
              <div
                class="flex h-9 w-9 items-center justify-center rounded-lg {article.published
                  ? 'bg-success/10'
                  : 'bg-warning/10'}"
              >
                {#if article.published}
                  <FileText class="h-4 w-4 text-success" />
                {:else}
                  <SquarePen class="h-4 w-4 text-warning" />
                {/if}
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium text-base-content">{article.title}</p>
                <p class="flex items-center gap-2 text-xs text-base-content/40">
                  <span>{formatDate(article.updatedAt)}</span>
                  {#if article.published}
                    <span
                      class="rounded bg-success/10 px-1.5 py-0.5 text-[10px] font-medium text-success"
                    >
                      Published
                    </span>
                  {:else}
                    <span
                      class="rounded bg-warning/10 px-1.5 py-0.5 text-[10px] font-medium text-warning"
                    >
                      Draft
                    </span>
                  {/if}
                </p>
              </div>
              <ArrowRight
                class="h-4 w-4 text-base-content/20 transition-all group-hover:translate-x-1 group-hover:text-primary"
              />
            </a>
          {/each}
        </div>
      </section>
    </div>

    <!-- Quick Actions -->
    <section class="animate-fade-slide-in stagger-5">
      <div class="mb-4 flex items-center gap-3">
        <div class="gradient-primary flex h-8 w-8 items-center justify-center rounded-lg">
          <Zap class="h-4 w-4 text-white" />
        </div>
        <h2 class="font-semibold text-base-content">Quick Actions</h2>
      </div>
      <div class="flex flex-wrap gap-3">
        <a
          href="/admin/members/new"
          class="btn gap-2 border-base-300 bg-base-100 font-medium transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
        >
          <UserPlus class="h-4 w-4" />
          Add Member
        </a>
        <a
          href="/admin/articles/new"
          class="btn gap-2 border-base-300 bg-base-100 font-medium transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
        >
          <Pencil class="h-4 w-4" />
          New Article
        </a>
        <a
          href="/admin/projects/new"
          class="btn gap-2 border-base-300 bg-base-100 font-medium transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
        >
          <Folder class="h-4 w-4" />
          New Project
        </a>
      </div>
    </section>
  </div>
</svelte:boundary>
