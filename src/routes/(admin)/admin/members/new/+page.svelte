<script lang="ts">
	import { goto } from "$app/navigation";
	import MemberForm from "$lib/components/MemberForm.svelte";
	import { useToast } from "$lib/components/toast/controls.svelte";
	import { saveMember } from "$lib/data/private/members.remote";

	const toast = useToast();
	let isSubmitting = $state(false);

	async function handleSubmit(data: {
		slug: string;
		name: string;
		bio: string;
		imageUrl: string;
		pageContent: string;
	}) {
		try {
			const result = await saveMember({
				slug: data.slug,
				name: data.name,
				bio: data.bio || null,
				imageUrl: data.imageUrl || null,
				pageContent: data.pageContent || null,
			});
			if (result) {
				toast.show("Created", "success");
				await goto(`/admin/members/edit/${result.id}`);
			}
		} catch (error) {
			toast.show(error instanceof Error ? error.message : "Failed to save");
		}
	}
</script>

<svelte:head>
	<title>New Member - ut.code(); CMS</title>
</svelte:head>

<div class="h-[calc(100vh-4rem)]">
	<MemberForm onSubmit={handleSubmit} submitLabel="Create" bind:isSubmitting />
</div>
