<script lang="ts">
  import { goto } from "$app/navigation";
  import ProjectForm from "$lib/components/ProjectForm.svelte";
  import { saveProject, getMembers } from "$lib/data/private/projects.remote";
  import { useToast } from "$lib/components/toast/controls.svelte";
  import { ChevronRight } from "lucide-svelte";
  import type { ProjectCategory } from "$lib/shared/models/schema";

  const toast = useToast();
  const members = $derived(await getMembers());
  let isSubmitting = $state(false);

  async function handleSubmit(data: {
    slug: string;
    name: string;
    description: string;
    content: string;
    coverUrl: string;
    repoUrl: string;
    demoUrl: string;
    category: ProjectCategory;
    leadMemberId: string | null;
  }) {
    if (!data.leadMemberId) return;

    try {
      const result = await saveProject({
        data: {
          slug: data.slug,
          name: data.name,
          description: data.description || null,
          content: data.content || null,
          coverUrl: data.coverUrl || null,
          repoUrl: data.repoUrl || null,
          demoUrl: data.demoUrl || null,
          category: data.category,
        },
        leadMemberId: data.leadMemberId,
      });
      if (result) {
        goto("/admin/projects");
      }
    } catch (error) {
      toast.show(error instanceof Error ? error.message : "保存に失敗しました");
    }
  }
</script>

<svelte:head>
  <title>New Project - ut.code(); CMS</title>
</svelte:head>

<svelte:boundary>
  {#snippet pending()}
    <div class="flex h-64 items-center justify-center">
      <span class="loading loading-md loading-spinner"></span>
    </div>
  {/snippet}

  <div>
    <!-- Header -->
    <div class="mb-8">
      <nav class="mb-4 flex items-center gap-2 text-sm text-zinc-500">
        <a href="/admin/projects" class="hover:text-zinc-700">Projects</a>
        <ChevronRight class="h-4 w-4" />
        <span class="text-zinc-900">New</span>
      </nav>
      <h1 class="text-2xl font-bold text-zinc-900">New Project</h1>
      <p class="text-zinc-500">Create a new project</p>
    </div>

    <ProjectForm
      {members}
      onSubmit={handleSubmit}
      submitLabel="Create Project"
      bind:isSubmitting
      isNew
    />
  </div>
</svelte:boundary>
