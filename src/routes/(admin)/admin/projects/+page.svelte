<script lang="ts">
  import { getProjects } from "$lib/data/projects.remote";

  const projects = $derived(await getProjects());
</script>

<svelte:head>
  <title>Projects - ut.code(); CMS</title>
</svelte:head>

<svelte:boundary>
  {#snippet pending()}
    <div class="flex h-64 items-center justify-center">
      <span class="loading loading-md loading-spinner"></span>
    </div>
  {/snippet}

  <div>
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-zinc-900">Projects</h1>
        <p class="text-zinc-500">{projects.length} projects registered</p>
      </div>
      <a
        href="/admin/projects/new"
        class="inline-flex items-center gap-2 rounded-lg bg-[#00D372] px-4 py-2 text-sm font-semibold text-zinc-900 transition-colors hover:bg-[#00C066]"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        New Project
      </a>
    </div>

    {#if projects.length === 0}
      <div class="rounded-xl border border-zinc-200 bg-white p-12 text-center">
        <svg
          class="mx-auto h-12 w-12 text-zinc-300"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          viewBox="0 0 24 24"
        >
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
        <h3 class="mt-4 font-semibold text-zinc-900">No projects yet</h3>
        <p class="mt-1 text-sm text-zinc-500">Get started by creating a project.</p>
        <a
          href="/admin/projects/new"
          class="mt-4 inline-block rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          New Project
        </a>
      </div>
    {:else}
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {#each projects as project (project.id)}
          <div
            class="rounded-xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-md"
          >
            {#if project.coverUrl}
              <img src={project.coverUrl} alt="" class="mb-4 h-32 w-full rounded-lg object-cover" />
            {:else}
              <div class="mb-4 flex h-32 items-center justify-center rounded-lg bg-zinc-100">
                <svg
                  class="h-12 w-12 text-zinc-300"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
                  />
                </svg>
              </div>
            {/if}

            <h3 class="font-semibold text-zinc-900">{project.name}</h3>
            <code class="text-xs text-zinc-400">/{project.slug}</code>

            {#if project.description}
              <p class="mt-2 line-clamp-2 text-sm text-zinc-500">{project.description}</p>
            {/if}

            <!-- Members -->
            <div class="mt-4 flex items-center justify-between">
              <div class="flex -space-x-2">
                {#each project.projectMembers.slice(0, 4) as pm (pm.memberId)}
                  {#if pm.member.imageUrl}
                    <img
                      src={pm.member.imageUrl}
                      alt={pm.member.name}
                      class="h-6 w-6 rounded-full border-2 border-white"
                      title={pm.member.name}
                    />
                  {:else}
                    <div
                      class="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-zinc-200"
                      title={pm.member.name}
                    >
                      <span class="text-xs text-zinc-600">{pm.member.name.charAt(0)}</span>
                    </div>
                  {/if}
                {/each}
                {#if project.projectMembers.length > 4}
                  <div
                    class="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-zinc-100"
                  >
                    <span class="text-xs text-zinc-500">+{project.projectMembers.length - 4}</span>
                  </div>
                {/if}
              </div>

              <a href="/admin/projects/{project.id}" class="text-sm text-[#00D372] hover:underline">
                Edit →
              </a>
            </div>

            <!-- Links -->
            {#if project.repoUrl || project.demoUrl}
              <div class="mt-3 flex gap-2 border-t border-zinc-100 pt-3">
                {#if project.repoUrl}
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener"
                    class="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900"
                  >
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path
                        d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                      />
                    </svg>
                    Repo
                  </a>
                {/if}
                {#if project.demoUrl}
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener"
                    class="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900"
                  >
                    <svg
                      class="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    Demo
                  </a>
                {/if}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </div>
</svelte:boundary>
