<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import MemberForm from "$lib/components/MemberForm.svelte";
  import { confirm } from "$lib/components/confirm-modal.svelte";
  import { getMember, editMember, removeMember } from "$lib/data/members.remote";
  import { useToast } from "$lib/components/toast/controls.svelte";
  import { ChevronRight } from "lucide-svelte";

  const toast = useToast();
  const id = $derived(page.params.id ?? "");
  const member = $derived(await getMember(id));
  let isSubmitting = $state(false);

  async function handleSubmit(data: { slug: string; name: string; bio: string; imageUrl: string }) {
    try {
      if (member && data.slug !== member.slug) {
        const confirmed = await confirm({
          title: "Change URL slug?",
          description: `Changing the slug will break existing links. The URL will change from /@${member.slug} to /@${data.slug}.`,
          confirmText: "Change Slug",
          variant: "warning",
        });
        if (!confirmed) return;
      }

      await editMember({
        id,
        data: {
          slug: data.slug,
          name: data.name,
          bio: data.bio || null,
          imageUrl: data.imageUrl || null,
        },
      });
      goto("/admin/members");
    } catch (error) {
      toast.show(error instanceof Error ? error.message : "保存に失敗しました");
    }
  }

  async function handleDelete() {
    if (!member) return;

    try {
      const confirmed = await confirm({
        title: "Delete Member",
        description: `Are you sure you want to delete "${member.name}"? This action cannot be undone.`,
        confirmText: "Delete",
        variant: "danger",
      });

      if (confirmed) {
        await removeMember(id);
        goto("/admin/members");
      }
    } catch (error) {
      toast.show(error instanceof Error ? error.message : "削除に失敗しました");
    }
  }
</script>

<svelte:head>
  <title>Edit {member?.name ?? "Member"} - ut.code(); CMS</title>
</svelte:head>

<svelte:boundary>
  {#snippet pending()}
    <div class="flex h-64 items-center justify-center">
      <span class="loading loading-md loading-spinner"></span>
    </div>
  {/snippet}

  {#if !member}
    <div class="rounded-xl border border-zinc-200 bg-white p-12 text-center">
      <h2 class="text-lg font-semibold text-zinc-900">Member not found</h2>
      <p class="mt-1 text-zinc-500">The member you're looking for doesn't exist.</p>
      <a
        href="/admin/members"
        class="mt-4 inline-block rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
      >
        Back to Members
      </a>
    </div>
  {:else}
    <div>
      <!-- Header -->
      <div class="mb-8 flex items-start justify-between">
        <div>
          <nav class="mb-4 flex items-center gap-2 text-sm text-zinc-500">
            <a href="/admin/members" class="hover:text-zinc-700">Members</a>
            <ChevronRight class="h-4 w-4" />
            <span class="text-zinc-900">{member.name}</span>
          </nav>
          <h1 class="text-2xl font-bold text-zinc-900">Edit Member</h1>
          <p class="text-zinc-500">Update member information</p>
        </div>

        <button
          type="button"
          onclick={handleDelete}
          class="shrink-0 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition-all duration-150 hover:border-red-300 hover:bg-red-50 active:scale-[0.98]"
        >
          Delete
        </button>
      </div>

      <MemberForm
        initialData={{
          slug: member.slug,
          name: member.name,
          bio: member.bio ?? "",
          imageUrl: member.imageUrl ?? "",
        }}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
        bind:isSubmitting
      />
    </div>
  {/if}
</svelte:boundary>
