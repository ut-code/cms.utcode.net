<script lang="ts">
	import { goto } from "$app/navigation";
	import ArticleForm from "$lib/components/ArticleForm.svelte";
	import { useToast } from "$lib/components/toast/controls.svelte";
	import { getMembers } from "$lib/data/private/members.remote";
	import { saveArticle } from "$lib/data/private/articles.remote";
	import { getMyPreference } from "$lib/data/private/user-preferences.remote";

	const toast = useToast();
	const authors = await getMembers();
	const preference = await getMyPreference();
	const defaultAuthorId = $derived(preference?.defaultAuthorId ?? null);
	let isSubmitting = $state(false);

	async function handleSubmit(data: {
		slug: string;
		title: string;
		content: string;
		coverUrl: string;
		authorId: string | null;
		published: boolean;
	}) {
		try {
			const result = await saveArticle({
				slug: data.slug,
				title: data.title,
				content: data.content,
				coverUrl: data.coverUrl || null,
				authorId: data.authorId,
				published: data.published,
				publishedAt: data.published ? new Date() : null,
			});
			if (result) {
				toast.show(data.published ? "Published" : "Created", "success");
				await goto(`/admin/articles/edit/${result.id}`);
			}
		} catch (error) {
			toast.show(
				error instanceof Error
					? error.message
					: "Failed to save article. Check your connection and try again.",
			);
		}
	}
</script>

<svelte:head>
	<title>New Article - ut.code(); CMS</title>
</svelte:head>

<div class="h-[calc(100vh-4rem)]">
		<ArticleForm
			initialData={{ slug: "", title: "", content: "", coverUrl: "", authorId: defaultAuthorId, published: false }}
			{authors}
			onSubmit={handleSubmit}
			submitLabel="Create"
			bind:isSubmitting
		/>
</div>
