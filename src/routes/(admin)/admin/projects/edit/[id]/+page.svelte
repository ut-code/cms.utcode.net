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
  } from "$lib/data/private/projects.remote";
  import { useToast } from "$lib/components/toast/controls.svelte";
  import { Folder, Plus, X } from "lucide-svelte";
  import type { ProjectCategory } from "$lib/shared/models/schema";

  const toast = useToast();
  const id = $derived(page.params.id ?? "");
  const project = $derived(await getProject(id));
  const members = $derived(await getMembers());
  let isSubmitting = $state(false);
  let showAddMember = $state(false);
  let newMemberId = $state<string | null>(null);
  let newMemberRole = $state<"member" | "lead">("member");

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
    if (!project) return;

    try {
      if (data.slug !== project.slug) {
        const confirmed = await confirm({
          title: "Change URL?",
          description: `This will break existing links. Change from /projects/${project.slug} to /projects/${data.slug}?`,
          confirmText: "Change",
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
      toast.show("Saved", "success");
    } catch (error) {
      toast.show(error instanceof Error ? error.message : "Failed to save");
    }
  }

  async function handleDelete() {
    if (!project) return;

    const confirmed = await confirm({
      title: "Delete project?",
      description: `Delete "${project.name}"? Team associations will be removed.`,
      confirmText: "Delete",
      variant: "danger",
    });

    if (confirmed) {
      try {
        await removeProject(id);
        toast.show("Deleted", "success");
        goto("/admin/projects");
      } catch (error) {
        toast.show(error instanceof Error ? error.message : "Failed to delete");
      }
    }
  }

  async function handleAddMember() {
    if (!newMemberId) return;
    try {
      await addMember({ projectId: id, memberId: newMemberId, role: newMemberRole }).updates(
        getProject(id),
      );
      toast.show("Member added", "success");
      showAddMember = false;
      newMemberId = null;
      newMemberRole = "member";
    } catch (error) {
      toast.show(error instanceof Error ? error.message : "Failed to add member");
    }
  }

  async function handleRemoveMember(memberId: string, memberName: string) {
    const confirmed = await confirm({
      title: "Remove member?",
      description: `Remove ${memberName} from this project?`,
      confirmText: "Remove",
      variant: "danger",
    });

    if (confirmed) {
      try {
        await removeMember({ projectId: id, memberId }).updates(getProject(id));
        toast.show("Member removed", "success");
      } catch (error) {
        toast.show(error instanceof Error ? error.message : "Failed to remove");
      }
    }
  }
</script>

<svelte:head>
  <title>{project?.name ?? "Edit Project"} - ut.code(); CMS</title>
</svelte:head>

<svelte:boundary>
  {#snippet pending()}
    <div class="flex h-96 items-center justify-center">
      <span class="loading loading-md loading-spinner"></span>
    </div>
  {/snippet}

  {#if !project}
    <div class="flex h-96 flex-col items-center justify-center text-center">
      <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400">
        <Folder class="h-6 w-6" />
      </div>
      <h2 class="mt-4 font-semibold text-zinc-900">Project not found</h2>
      <p class="mt-1 text-sm text-zinc-500">This project doesn't exist.</p>
      <a
        href="/admin/projects"
        class="mt-4 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
      >
        Back to Projects
      </a>
    </div>
  {:else}
    <div class="flex h-[calc(100vh-4rem)] flex-col">
      <!-- Team Members Bar -->
      <div class="flex items-center gap-3 border-b border-zinc-200 bg-zinc-50 px-4 py-2">
        <span class="text-xs font-medium text-zinc-500">Team:</span>
        <div class="flex items-center gap-1">
          {#each project.projectMembers as pm (pm.memberId)}
            <div
              class="group flex items-center gap-1.5 rounded-full bg-white py-1 pr-2 pl-1 text-xs shadow-sm ring-1 ring-zinc-200"
            >
              {#if pm.member.imageUrl}
                <img src={pm.member.imageUrl} alt="" class="h-5 w-5 rounded-full" />
              {:else}
                <div
                  class="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-200 text-[10px] font-medium"
                >
                  {pm.member.name.charAt(0)}
                </div>
              {/if}
              <span class="text-zinc-700">{pm.member.name}</span>
              {#if pm.role === "lead"}
                <span
                  class="rounded bg-purple-100 px-1 py-0.5 text-[10px] font-medium text-purple-700"
                  >lead</span
                >
              {/if}
              {#if pm.role !== "lead"}
                <button
                  type="button"
                  onclick={() => handleRemoveMember(pm.memberId, pm.member.name)}
                  class="ml-0.5 hidden rounded p-0.5 text-zinc-400 group-hover:block hover:bg-zinc-100 hover:text-red-500"
                >
                  <X class="h-3 w-3" />
                </button>
              {/if}
            </div>
          {/each}
          <button
            type="button"
            onclick={() => (showAddMember = true)}
            class="flex h-7 w-7 items-center justify-center rounded-full bg-white text-zinc-400 shadow-sm ring-1 ring-zinc-200 transition-colors hover:bg-zinc-50 hover:text-zinc-600"
          >
            <Plus class="h-4 w-4" />
          </button>
        </div>
      </div>

      <!-- Main Form -->
      <div class="flex-1">
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
          onDelete={handleDelete}
          submitLabel="Save"
          bind:isSubmitting
        />
      </div>
    </div>

    <!-- Add Member Modal -->
    {#if showAddMember}
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div class="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl">
          <h3 class="font-semibold text-zinc-900">Add member</h3>
          <div class="mt-4 space-y-4">
            <div class="space-y-1.5">
              <label for="newMember" class="text-sm font-medium text-zinc-700">Member</label>
              <select
                id="newMember"
                bind:value={newMemberId}
                class="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900"
              >
                <option value={null}>Select</option>
                {#each members.filter((m) => !project.projectMembers.some((pm) => pm.memberId === m.id)) as member (member.id)}
                  <option value={member.id}>{member.name}</option>
                {/each}
              </select>
            </div>
            <div class="space-y-1.5">
              <label for="role" class="text-sm font-medium text-zinc-700">Role</label>
              <select
                id="role"
                bind:value={newMemberRole}
                class="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900"
              >
                <option value="member">Member</option>
                <option value="lead">Lead</option>
              </select>
            </div>
          </div>
          <div class="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onclick={() => (showAddMember = false)}
              class="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onclick={handleAddMember}
              disabled={!newMemberId}
              class="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    {/if}
  {/if}
</svelte:boundary>
