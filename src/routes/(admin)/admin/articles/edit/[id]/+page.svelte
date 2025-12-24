<script lang="ts">
	import { FileText } from "lucide-svelte";
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import ArticleForm from "$lib/components/ArticleForm.svelte";
	import { confirm } from "$lib/components/confirm-modal.svelte";
	import { useToast } from "$lib/components/toast/controls.svelte";
	import { getMembers } from "$lib/data/private/members.remote";
	import {
		editArticle,
		getArticle,
		removeArticle,
	} from "$lib/data/private/articles.remote";

	const toast = useToast();

	const id = $derived(page.params.id ?? "");
	const article = $derived(await getArticle(id));
	const authors = $derived(await getMembers());
	let isSubmitting = $state(false);

	async function handleSubmit(data: {
		slug: string;
		title: string;
		content: string;
		excerpt: string;
		coverUrl: string;
		authorId: string | null;
		published: boolean;
		createRedirect?: boolean;
	}) {
		if (!article) return;

		try {
			if (data.slug !== article.slug) {
				const confirmed = await confirm({
					title: "Change URL?",
					description: `This will break existing links. Change from /${article.slug} to /${data.slug}?`,
					confirmText: "Change",
					variant: "warning",
				});
				if (!confirmed) return;
			}

			await editArticle({
				id,
				data: {
					slug: data.slug,
					title: data.title,
					content: data.content,
					excerpt: data.excerpt || null,
					coverUrl: data.coverUrl || null,
					authorId: data.authorId,
					published: data.published,
					publishedAt: data.published ? (article?.publishedAt ?? new Date()) : article?.publishedAt,
				},
				createRedirect: data.createRedirect,
			});
			toast.show(data.published ? "Published" : "Saved", "success");
		} catch (error) {
			toast.show(
				error instanceof Error
					? error.message
					: "Failed to save article. Check your connection and try again.",
			);
		}
	}

	async function handleDelete() {
		if (!article) return;

		const confirmed = await confirm({
			title: "Delete article?",
			description: `Delete "${article.title}"? This cannot be undone.`,
			confirmText: "Delete",
			variant: "danger",
		});

		if (confirmed) {
			try {
				await removeArticle(id);
				toast.show(`Article deleted`, "success");
				await goto("/admin/articles");
			} catch (error) {
				toast.show(
					error instanceof Error
						? error.message
						: "Failed to delete article. Check your connection and try again.",
				);
			}
		}
	}
</script>

<svelte:head>
	<title>{article?.title ?? "Edit Article"} - ut.code(); CMS</title>
</svelte:head>

{#if !article}
		<div class="flex h-96 flex-col items-center justify-center text-center">
			<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400">
				<FileText class="h-6 w-6" />
			</div>
			<h2 class="mt-4 font-semibold text-zinc-900">Article not found</h2>
			<p class="mt-1 text-sm text-zinc-500">This article doesn't exist.</p>
			<a
				href="/admin/articles"
				class="mt-4 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
			>
				Back to Articles
			</a>
		</div>
	{:else}
		<div class="h-[calc(100vh-4rem)]">
			<ArticleForm
				initialData={{
					slug: article.slug,
					title: article.title,
					content: article.content,
					excerpt: article.excerpt ?? "",
					coverUrl: article.coverUrl ?? "",
					authorId: article.authorId,
					published: article.published,
				}}
				{authors}
				onSubmit={handleSubmit}
				onDelete={handleDelete}
				submitLabel="Save"
				bind:isSubmitting
				articleId={article.id}
			/>
		</div>
{/if}
