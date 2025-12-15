<script lang="ts">
  import { getPublicProjects } from "$lib/data/public.remote";

  const projects = $derived(await getPublicProjects());
</script>

<svelte:head>
  <title>プロジェクト一覧 | ut.code();</title>
  <meta property="og:title" content="プロジェクト一覧 | ut.code();" />
</svelte:head>

<div class="mx-auto max-w-6xl px-6 py-16">
  <div
    class="mb-3 font-[JetBrains_Mono,monospace] text-xs font-medium tracking-widest text-[#00D372] uppercase"
  >
    Projects
  </div>
  <h1 class="mb-8 text-3xl font-bold">プロジェクト一覧</h1>

  {#if projects.length === 0}
    <p class="text-zinc-500">まだプロジェクトがありません。</p>
  {:else}
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {#each projects as project (project.id)}
        <a
          href="/projects/{project.slug}"
          class="group rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:border-[#00D372] hover:shadow-md"
        >
          {#if project.coverUrl}
            <img
              src={project.coverUrl}
              alt=""
              class="mb-4 aspect-video w-full rounded-lg object-cover"
            />
          {/if}
          <h2 class="mb-2 font-semibold group-hover:text-[#00D372]">{project.name}</h2>
          {#if project.description}
            <p class="mb-4 line-clamp-2 text-sm text-zinc-500">{project.description}</p>
          {/if}
          <div class="flex flex-wrap gap-2">
            {#each project.projectMembers.slice(0, 3) as pm (pm.memberId)}
              <span class="rounded bg-zinc-100 px-2 py-1 text-xs text-zinc-600">
                {pm.member.name}
              </span>
            {/each}
            {#if project.projectMembers.length > 3}
              <span class="rounded bg-zinc-100 px-2 py-1 text-xs text-zinc-600">
                +{project.projectMembers.length - 3}
              </span>
            {/if}
          </div>
        </a>
      {/each}
    </div>
  {/if}
</div>
