<script lang="ts">
  import { goto } from "$app/navigation";
  import MemberForm from "$lib/components/MemberForm.svelte";
  import { useToast } from "$lib/components/toast/controls.svelte";
  import { saveMember } from "$lib/data/members.remote";
  import { ChevronRight } from "lucide-svelte";

  const toast = useToast();
  let isSubmitting = $state(false);

  async function handleSubmit(data: { slug: string; name: string; bio: string; imageUrl: string }) {
    try {
      const result = await saveMember({
        slug: data.slug,
        name: data.name,
        bio: data.bio || null,
        imageUrl: data.imageUrl || null,
      });
      if (result) {
        goto("/admin/members");
      }
    } catch (error) {
      toast.show(error instanceof Error ? error.message : "保存に失敗しました");
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
      <ChevronRight class="h-4 w-4" />
      <span class="text-zinc-900">New</span>
    </nav>
    <h1 class="text-2xl font-bold text-zinc-900">New Member</h1>
    <p class="text-zinc-500">Add a new member to the organization</p>
  </div>

  <MemberForm onSubmit={handleSubmit} submitLabel="Create Member" bind:isSubmitting />
</div>
