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

<section class="bg-zinc-50 py-24">
  <div class="mx-auto max-w-6xl px-6">
    <div class="mb-20 flex items-end justify-between">
      <div>
        <div class="mb-4 font-mono text-sm font-medium tracking-widest text-primary uppercase">
          PROJECTS
        </div>
        <h2 class="text-5xl font-bold text-zinc-900 lg:text-6xl">つくったもの</h2>
        <p class="mt-4 max-w-2xl text-lg text-zinc-600">
          実際に使われるプロダクトを開発し、世に届ける
        </p>
      </div>
      <a
        href="/projects"
        class="group hidden items-center gap-2 rounded-lg bg-zinc-900 px-6 py-3 font-semibold text-white transition-all hover:bg-zinc-800 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none sm:flex"
      >
        すべて見る
        <ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-1" />
      </a>
    </div>
    <div class="grid gap-6 lg:grid-cols-3">
      {#each projects as project (project.id)}
        <a
          href="/projects/{project.slug}"
          class="group overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-primary/30 hover:bg-primary/5 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
        >
          {#if project.coverUrl}
            <div class="mb-4 overflow-hidden rounded-2xl">
              <img
                src={project.coverUrl}
                alt={project.name}
                class="aspect-[5/3] w-full object-cover"
                loading="lazy"
              />
            </div>
          {:else}
            <div
              class="mb-4 flex aspect-[5/3] w-full items-center justify-center overflow-hidden rounded-2xl bg-zinc-100"
            >
              <span class="font-mono text-sm font-medium text-zinc-400"> No Image </span>
            </div>
          {/if}
          <h3 class="mb-2 text-xl font-bold text-zinc-900">
            {project.name}
          </h3>
          {#if project.description}
            <p class="mb-4 line-clamp-2 text-sm leading-relaxed text-zinc-600">
              {project.description}
            </p>
          {/if}
          <div class="flex flex-wrap gap-2">
            <span
              class="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1 font-mono text-xs text-zinc-500"
            >
              {PROJECT_CATEGORIES[project.category]}
            </span>
          </div>
        </a>
      {/each}
    </div>
    <a
      href="/projects"
      class="mt-8 flex items-center justify-center gap-2 font-bold text-zinc-600 transition-colors hover:text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none sm:hidden"
    >
      すべて見る
      <ArrowRight class="h-5 w-5" />
    </a>
  </div>
</section>
