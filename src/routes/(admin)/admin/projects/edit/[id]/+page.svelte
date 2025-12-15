<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import ProjectForm from "$lib/components/ProjectForm.svelte";
  import { confirm } from "$lib/components/confirm-modal.svelte";
  import {
    getProject,
    getMembers,
    editProject,
    removeProject,
    addMember,
    removeMember,
  } from "$lib/data/projects.remote";
  import { useToast } from "$lib/components/toast/controls.svelte";
  import { ChevronRight } from "lucide-svelte";
  import type { ProjectCategory } from "$lib/shared/models/schema";

  const toast = useToast();
  const id = $derived(page.params.id ?? "");
  const project = $derived(await getProject(id));
  const members = $derived(await getMembers());
  let isSubmitting = $state(false);
  let showAddMember = $state(false);
  let newMemberId = $state<string | null>(null);
  let newMemberRole = $state("member");

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
    try {
      if (project && data.slug !== project.slug) {
        const confirmed = await confirm({
          title: "Change URL slug?",
          description: `Changing the slug will break existing links. The URL will change from /projects/${project.slug} to /projects/${data.slug}.`,
          confirmText: "Change Slug",
          variant: "warning",
        });
        if (!confirmed) return;
      }

      await editProject({
        id,
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
      });
      goto("/admin/projects");
    } catch (error) {
      toast.show(error instanceof Error ? error.message : "保存に失敗しました");
    }
  }

  async function handleDelete() {
    if (!project) return;

    try {
      const confirmed = await confirm({
        title: "Delete Project",
        description: `Are you sure you want to delete "${project.name}"? This action cannot be undone.`,
        confirmText: "Delete",
        variant: "danger",
      });

      if (confirmed) {
        await removeProject(id);
        goto("/admin/projects");
      }
    } catch (error) {
      toast.show(error instanceof Error ? error.message : "削除に失敗しました");
    }
  }

  async function handleAddMember() {
    if (!newMemberId) return;
    try {
      await addMember({ projectId: id, memberId: newMemberId, role: newMemberRole }).updates(
        getProject(id),
      );
      showAddMember = false;
      newMemberId = null;
      newMemberRole = "member";
    } catch (error) {
      toast.show(error instanceof Error ? error.message : "メンバーの追加に失敗しました");
    }
  }

  async function handleRemoveMember(memberId: string, memberName: string) {
    try {
      const confirmed = await confirm({
        title: "Remove Member",
        description: `Remove ${memberName} from this project?`,
        confirmText: "Remove",
        variant: "danger",
      });

      if (confirmed) {
        await removeMember({ projectId: id, memberId }).updates(getProject(id));
      }
    } catch (error) {
      toast.show(error instanceof Error ? error.message : "メンバーの削除に失敗しました");
    }
  }
</script>

<svelte:head>
  <title>Edit {project?.name ?? "Project"} - ut.code(); CMS</title>
</svelte:head>

<svelte:boundary>
  {#snippet pending()}
    <div class="flex h-64 items-center justify-center">
      <span class="loading loading-md loading-spinner"></span>
    </div>
  {/snippet}

  {#if !project}
    <div class="rounded-xl border border-zinc-200 bg-white p-12 text-center">
      <h2 class="text-lg font-semibold text-zinc-900">Project not found</h2>
      <p class="mt-1 text-zinc-500">The project you're looking for doesn't exist.</p>
      <a
        href="/admin/projects"
        class="mt-4 inline-block rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
      >
        Back to Projects
      </a>
    </div>
  {:else}
    <div>
      <!-- Header -->
      <div class="mb-8 flex items-start justify-between">
        <div>
          <nav class="mb-4 flex items-center gap-2 text-sm text-zinc-500">
            <a href="/admin/projects" class="hover:text-zinc-700">Projects</a>
            <ChevronRight class="h-4 w-4" />
            <span class="text-zinc-900">{project.name}</span>
          </nav>
          <h1 class="text-2xl font-bold text-zinc-900">Edit Project</h1>
          <p class="text-zinc-500">Update project details and team members</p>
        </div>

        <button
          type="button"
          onclick={handleDelete}
          class="shrink-0 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition-all duration-150 hover:border-red-300 hover:bg-red-50 active:scale-[0.98]"
        >
          Delete
        </button>
      </div>

      <!-- Team Members Section -->
      <div class="mb-8 rounded-xl border border-zinc-200 bg-white p-6">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-zinc-900">Team Members</h2>
          <button
            type="button"
            onclick={() => (showAddMember = true)}
            class="text-sm font-medium text-[#00D372] hover:underline"
          >
            + Add Member
          </button>
        </div>

        <div class="space-y-3">
          {#each project.projectMembers as pm (pm.memberId)}
            <div
              class="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50 p-3"
            >
              <div class="flex items-center gap-3">
                {#if pm.member.imageUrl}
                  <img src={pm.member.imageUrl} alt={pm.member.name} class="h-8 w-8 rounded-full" />
                {:else}
                  <div class="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200">
                    <span class="text-xs font-medium text-zinc-600">{pm.member.name.charAt(0)}</span
                    >
                  </div>
                {/if}
                <div>
                  <p class="text-sm font-medium text-zinc-900">{pm.member.name}</p>
                  <span
                    class="inline-block rounded px-1.5 py-0.5 text-xs font-medium"
                    class:bg-purple-100={pm.role === "lead"}
                    class:text-purple-700={pm.role === "lead"}
                    class:bg-zinc-100={pm.role !== "lead"}
                    class:text-zinc-600={pm.role !== "lead"}
                  >
                    {pm.role}
                  </span>
                </div>
              </div>
              {#if pm.role !== "lead"}
                <button
                  type="button"
                  onclick={() => handleRemoveMember(pm.memberId, pm.member.name)}
                  class="text-sm text-red-500 hover:underline"
                >
                  Remove
                </button>
              {/if}
            </div>
          {/each}
        </div>
      </div>

      <ProjectForm
        initialData={{
          slug: project.slug,
          name: project.name,
          description: project.description ?? "",
          content: project.content ?? "",
          coverUrl: project.coverUrl ?? "",
          repoUrl: project.repoUrl ?? "",
          demoUrl: project.demoUrl ?? "",
          category: project.category,
          leadMemberId: null,
        }}
        {members}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
        bind:isSubmitting
      />
    </div>

    <!-- Add Member Modal -->
    {#if showAddMember}
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div class="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
          <h3 class="text-lg font-semibold text-zinc-900">Add Team Member</h3>
          <div class="mt-4 space-y-4">
            <div class="space-y-2">
              <label for="newMember" class="block text-sm font-medium text-zinc-700">Member</label>
              <select
                id="newMember"
                bind:value={newMemberId}
                class="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900"
              >
                <option value={null}>Select a member</option>
                {#each members.filter((m) => !project.projectMembers.some((pm) => pm.memberId === m.id)) as member (member.id)}
                  <option value={member.id}>{member.name}</option>
                {/each}
              </select>
            </div>
            <div class="space-y-2">
              <label for="role" class="block text-sm font-medium text-zinc-700">Role</label>
              <select
                id="role"
                bind:value={newMemberRole}
                class="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900"
              >
                <option value="member">Member</option>
                <option value="lead">Lead</option>
              </select>
            </div>
          </div>
          <div class="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onclick={() => (showAddMember = false)}
              class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onclick={handleAddMember}
              disabled={!newMemberId}
              class="rounded-lg bg-[#00D372] px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-[#00C066] disabled:opacity-50"
            >
              Add Member
            </button>
          </div>
        </div>
      </div>
    {/if}
  {/if}
</svelte:boundary>
