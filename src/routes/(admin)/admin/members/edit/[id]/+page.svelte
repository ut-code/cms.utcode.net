<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import MemberForm from "$lib/components/MemberForm.svelte";
  import { getMember, editMember, removeMember } from "$lib/data/members.remote";

  const id = $derived(page.params.id ?? "");
  const member = $derived(await getMember(id));
  let isSubmitting = $state(false);
  let isDeleting = $state(false);
  let showDeleteConfirm = $state(false);

  async function handleSubmit(data: { slug: string; name: string; bio: string; imageUrl: string }) {
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
  }

  async function handleDelete() {
    isDeleting = true;
    try {
      await removeMember(id);
      goto("/admin/members");
    } finally {
      isDeleting = false;
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
            <svg
              class="h-4 w-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <span class="text-zinc-900">{member.name}</span>
          </nav>
          <h1 class="text-2xl font-bold text-zinc-900">Edit Member</h1>
          <p class="text-zinc-500">Update member information</p>
        </div>

        <button
          type="button"
          onclick={() => (showDeleteConfirm = true)}
          class="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
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

    <!-- Delete Confirmation Modal -->
    {#if showDeleteConfirm}
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div class="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
          <h3 class="text-lg font-semibold text-zinc-900">Delete Member</h3>
          <p class="mt-2 text-zinc-600">
            Are you sure you want to delete <strong>{member.name}</strong>? This action cannot be
            undone.
          </p>
          <div class="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onclick={() => (showDeleteConfirm = false)}
              class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onclick={handleDelete}
              disabled={isDeleting}
              class="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {#if isDeleting}
                <span class="loading loading-sm loading-spinner"></span>
              {/if}
              Delete
            </button>
          </div>
        </div>
      </div>
    {/if}
  {/if}
</svelte:boundary>
