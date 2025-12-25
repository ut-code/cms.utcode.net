<script lang="ts">
	import { goto } from "$app/navigation";
	import ProjectForm from "$lib/components/ProjectForm.svelte";
	import { useToast } from "$lib/components/toast/controls.svelte";
	import { getMembers, saveProject } from "$lib/data/private/projects.remote";
	import type { ProjectCategory } from "$lib/shared/models/schema";

	const toast = useToast();
	const members = await getMembers();
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
				toast.show("Created", "success");
				await goto(`/admin/projects/edit/${result.id}`);
			}
		} catch (error) {
			toast.show(
				error instanceof Error
					? error.message
					: "Failed to save project. Check your connection and try again.",
			);
		}
	}
</script>

<svelte:head>
	<title>New Project - ut.code(); CMS</title>
</svelte:head>

<div class="h-[calc(100vh-4rem)]">
		<ProjectForm {members} onSubmit={handleSubmit} submitLabel="Create" bind:isSubmitting isNew />
</div>
