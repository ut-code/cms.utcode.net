<script lang="ts">
  import { goto } from "$app/navigation";
  import MemberForm from "$lib/components/MemberForm.svelte";
  import { saveMember } from "$lib/data/members.remote";

  let isSubmitting = $state(false);

  async function handleSubmit(data: { slug: string; name: string; bio: string; imageUrl: string }) {
    const result = await saveMember({
      slug: data.slug,
      name: data.name,
      bio: data.bio || null,
      imageUrl: data.imageUrl || null,
    });
    if (result) {
      goto("/admin/members");
    }
  }
</script>

<svelte:head>
  <title>New Member - ut.code(); CMS</title>
</svelte:head>

<div>
  <!-- Header -->
  <div class="mb-8">
    <nav class="mb-4 flex items-center gap-2 text-sm text-zinc-500">
      <a href="/admin/members" class="hover:text-zinc-700">Members</a>
      <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <polyline points="9 18 15 12 9 6" />
      </svg>
      <span class="text-zinc-900">New</span>
    </nav>
    <h1 class="text-2xl font-bold text-zinc-900">New Member</h1>
    <p class="text-zinc-500">Add a new member to the organization</p>
  </div>

  <MemberForm onSubmit={handleSubmit} submitLabel="Create Member" bind:isSubmitting />
</div>
