<script lang="ts">
  import { ArrowRight } from "lucide-svelte";
  import type { getPublicProjects } from "$lib/data/public/index.remote";
  import { PROJECT_CATEGORIES } from "$lib/shared/models/schema";

  type PublicProject = Awaited<ReturnType<typeof getPublicProjects>>[number];

  type Props = {
    projects: PublicProject[];
  };

  const { projects }: Props = $props();
</script>

<!--
  projects --- "what we shipped" grid.
  Card cover zooms subtly on hover, title shifts to primary, an arrow appears.
-->
<section class="relative bg-zinc-50 py-24">
  <div class="mx-auto max-w-6xl px-6">
    <div class="mb-14 flex flex-wrap items-end justify-between gap-6">
      <div>
        <div
          class="mb-4 flex items-center gap-3 font-mono text-[11px] tracking-widest text-primary uppercase"
        >
          <span class="inline-block h-px w-6 bg-primary"></span>
          <span>// projects</span>
        </div>
        <h2 class="text-4xl leading-[1.1] font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
          つくったもの
        </h2>
        <p class="mt-4 max-w-xl text-lg text-zinc-600">
          実際に使われるプロダクトを開発し、世に届ける。
        </p>
      </div>
      <a
        href="/projects"
        class="group hidden min-h-11 items-center gap-2 rounded-lg bg-zinc-900 px-6 py-3 font-semibold text-white transition-all hover:bg-zinc-800 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none sm:flex"
      >
        <span class="font-mono text-xs tracking-widest opacity-60">View all</span>
        <span>すべて見る</span>
        <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </a>
    </div>
    <div class="grid gap-5 lg:grid-cols-3">
      {#each projects as project, i (project.id)}
        <a
          href="/projects/{project.slug}"
          class="group relative isolate flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
        >
          <div class="relative mb-5 overflow-hidden rounded-xl">
            {#if project.coverUrl}
              <img
                src={project.coverUrl}
                alt={project.name}
                class="aspect-[5/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                loading="lazy"
              />
            {:else}
              <div
                class="flex aspect-[5/3] w-full items-center justify-center bg-zinc-100"
              >
                <span class="font-mono text-sm font-medium text-zinc-400">No Image</span>
              </div>
            {/if}
            <!-- index badge floating top-left of cover -->
            <span
              class="absolute top-3 left-3 rounded-md bg-white/85 px-2 py-0.5 font-mono text-[10px] tracking-widest text-zinc-700 backdrop-blur"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>
          <div class="flex items-start justify-between gap-3">
            <h3
              class="text-lg font-bold tracking-tight text-zinc-900 transition-colors group-hover:text-primary"
            >
              {project.name}
            </h3>
            <ArrowRight
              class="h-4 w-4 shrink-0 translate-y-1 text-zinc-300 opacity-0 transition-all duration-300 group-hover:translate-y-1 group-hover:translate-x-0.5 group-hover:text-primary group-hover:opacity-100"
            />
          </div>
          {#if project.description}
            <p class="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-600">
              {project.description}
            </p>
          {/if}
          <div class="mt-4 flex flex-wrap gap-2">
            <span
              class="rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 font-mono text-[11px] tracking-wide text-zinc-500"
            >
              {PROJECT_CATEGORIES[project.category]}
            </span>
          </div>
        </a>
      {/each}
    </div>
    <a
      href="/projects"
      class="mt-8 flex min-h-11 items-center justify-center gap-2 font-bold text-zinc-600 transition-colors hover:text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none sm:hidden"
    >
      すべて見る
      <ArrowRight class="h-5 w-5" />
    </a>
  </div>
</section>
