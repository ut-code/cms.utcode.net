<script lang="ts">
  import { getProjects } from "$lib/data/projects.remote";
  import { Folder, Plus, ChevronRight, Github, ExternalLink } from "lucide-svelte";

  const projects = $derived(await getProjects());
</script>

<svelte:head>
  <title>Projects - ut.code(); CMS</title>
</svelte:head>

<svelte:boundary>
  {#snippet pending()}
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 skeleton rounded-xl"></div>
          <div class="space-y-2">
            <div class="h-7 w-24 skeleton"></div>
            <div class="h-4 w-32 skeleton"></div>
          </div>
        </div>
        <div class="h-9 w-28 skeleton rounded-lg"></div>
      </div>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {#each Array.from({ length: 3 }, (_, i) => i) as i (i)}
          <div class="card bg-base-100 shadow-sm">
            <div class="h-32 w-full skeleton rounded-t-xl rounded-b-none"></div>
            <div class="card-body p-4">
              <div class="h-5 w-32 skeleton"></div>
              <div class="h-4 w-24 skeleton"></div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/snippet}

  <div class="space-y-6">
    <!-- Header -->
    <header class="animate-fade-slide-in flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10">
          <Folder class="h-5 w-5 text-secondary" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-base-content">Projects</h1>
          <p class="text-sm text-base-content/60">{projects.length} projects registered</p>
        </div>
      </div>
      <a href="/admin/projects/new" class="btn gap-2 btn-sm btn-secondary">
        <Plus class="h-4 w-4" />
        New Project
      </a>
    </header>

    {#if projects.length === 0}
      <!-- Empty state -->
      <div
        class="animate-fade-slide-in stagger-1 card border-2 border-dashed border-base-300 bg-base-100"
      >
        <div class="card-body items-center py-12 text-center">
          <div
            class="flex h-14 w-14 items-center justify-center rounded-2xl bg-base-200 text-base-content/40"
          >
            <Folder class="h-7 w-7" />
          </div>
          <h3 class="mt-4 text-lg font-semibold text-base-content">No projects yet</h3>
          <p class="text-base-content/60">Get started by creating a project.</p>
          <a href="/admin/projects/new" class="btn mt-4 gap-2 btn-secondary">
            <Plus class="h-4 w-4" />
            New Project
          </a>
        </div>
      </div>
    {:else}
      <!-- Projects grid -->
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {#each projects as project, i (project.id)}
          <a
            href="/admin/projects/edit/{project.id}"
            class="group animate-fade-slide-in card bg-base-100 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            style="animation-delay: {i * 40}ms"
          >
            <!-- Cover -->
            {#if project.coverUrl}
              <figure class="overflow-hidden rounded-t-xl">
                <img
                  src={project.coverUrl}
                  alt={project.name}
                  class="h-32 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </figure>
            {:else}
              <figure
                class="flex h-32 items-center justify-center rounded-t-xl bg-gradient-to-br from-base-200 to-base-300 transition-colors duration-150 group-hover:from-base-300 group-hover:to-base-200"
              >
                <Folder
                  class="h-10 w-10 text-base-content/20 transition-transform duration-150 group-hover:scale-110"
                />
              </figure>
            {/if}

            <!-- Content -->
            <div class="card-body p-4">
              <h3
                class="font-medium text-base-content transition-colors duration-150 group-hover:text-base-content/80"
              >
                {project.name}
              </h3>
              <code class="block font-mono text-xs text-base-content/40">/{project.slug}</code>

              {#if project.description}
                <p class="mt-2 line-clamp-2 text-sm text-base-content/60">{project.description}</p>
              {/if}

              <!-- Members -->
              <div class="mt-3 flex items-center justify-between">
                <div class="avatar-group -space-x-2">
                  {#each project.projectMembers.slice(0, 4) as pm (pm.memberId)}
                    {#if pm.member.imageUrl}
                      <div class="avatar border-base-100">
                        <div class="w-6">
                          <img
                            src={pm.member.imageUrl}
                            alt={pm.member.name}
                            title={pm.member.name}
                          />
                        </div>
                      </div>
                    {:else}
                      <div class="placeholder avatar border-base-100">
                        <div class="w-6 bg-base-200 text-base-content/60">
                          <span class="text-[10px]">{pm.member.name.charAt(0)}</span>
                        </div>
                      </div>
                    {/if}
                  {/each}
                  {#if project.projectMembers.length > 4}
                    <div class="placeholder avatar border-base-100">
                      <div class="w-6 bg-base-200 text-base-content/50">
                        <span class="text-[10px]">+{project.projectMembers.length - 4}</span>
                      </div>
                    </div>
                  {/if}
                </div>

                <ChevronRight
                  class="h-4 w-4 text-base-content/30 transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-base-content/50"
                />
              </div>

              <!-- Links -->
              {#if project.repoUrl || project.demoUrl}
                <div class="mt-3 flex gap-3 border-t border-base-200 pt-3">
                  {#if project.repoUrl}
                    <span class="inline-flex items-center gap-1 text-xs text-base-content/40">
                      <Github class="h-3.5 w-3.5" />
                      Repo
                    </span>
                  {/if}
                  {#if project.demoUrl}
                    <span class="inline-flex items-center gap-1 text-xs text-base-content/40">
                      <ExternalLink class="h-3.5 w-3.5" />
                      Demo
                    </span>
                  {/if}
                </div>
              {/if}
            </div>
          </a>
        {/each}
      </div>
    {/if}
  </div>
</svelte:boundary>
