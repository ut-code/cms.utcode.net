<script lang="ts">
  import { LayoutGrid, ExternalLink, TrendingUp, Users, Folder } from "lucide-svelte";

  interface Props {
    publishedArticles: number;
    members: number;
    projects: number;
  }

  const { publishedArticles, members, projects }: Props = $props();
</script>

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
      <span class="text-sm font-medium">{publishedArticles} published</span>
    </div>
    <div class="h-4 w-px bg-white/20"></div>
    <div class="flex items-center gap-2 text-white/80">
      <Users class="h-4 w-4 text-info" />
      <span class="text-sm font-medium">{members} members</span>
    </div>
    <div class="h-4 w-px bg-white/20"></div>
    <div class="flex items-center gap-2 text-white/80">
      <Folder class="h-4 w-4 text-secondary-content" />
      <span class="text-sm font-medium">{projects} projects</span>
    </div>
  </div>
</header>
