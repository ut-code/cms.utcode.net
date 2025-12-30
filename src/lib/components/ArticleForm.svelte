<script lang="ts">
	import { createFormValidator } from "$lib/shared/logic/form-validation";
	import { generateArticleSlug, validateArticleSlug } from "$lib/shared/logic/slugs";
	import type { ArticleData, Author } from "$lib/shared/models/types";
	import { triggerSubmit } from "$lib/utils/form";
	import { onSaveShortcut } from "$lib/utils/keyboard";
	import { snapshot } from "$lib/utils/snapshot.svelte";
	import { ArticleEditor, ArticleFormHeader } from "./article-form";
	import { confirm } from "$lib/components/confirm-modal.svelte";

	let {
		initialData = {
			slug: "",
			title: "",
			content: "",
			coverUrl: "",
			authorId: null,
			published: false,
		},
		authors = [],
		onSubmit,
		onDelete = null,
		submitLabel = "Save",
		isSubmitting = $bindable(false),
		articleId = null,
	}: {
		initialData?: ArticleData;
		authors?: Author[];
		onSubmit: (data: ArticleData & { createRedirect?: boolean }) => Promise<void>;
		onDelete?: (() => Promise<void>) | null;
		submitLabel?: string;
		isSubmitting?: boolean;
		articleId?: string | null;
	} = $props();

	let formData = $state(snapshot(() => initialData));
	let errors = $state<Record<string, string>>({});
	let saveSuccess = $state(false);
	let createRedirect = $state(false);

	function handleTitleChange(title: string) {
		if (!formData.slug || formData.slug === generateArticleSlug(initialData.title)) {
			formData.slug = generateArticleSlug(title);
		}
	}

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		const validator = createFormValidator<ArticleData>();
		validator
			.required("title", formData.title, "Title is required")
			.required("slug", formData.slug, "Slug is required")
			.validate("slug", formData.slug, (value) =>
				validateArticleSlug(value)
					? null
					: "Slug must start with YYYY-MM-DD- (e.g., 2024-01-15-my-article)",
			)
			.required("content", formData.content, "Content is required");

		errors = validator.getErrors();

		if (validator.hasErrors()) {
			return;
		}

		// If unpublishing (from true to false), show confirmation
		if (initialData.published && !formData.published) {
			const confirmed = await confirm({
				title: "Unpublish article?",
				description: "This will make the article inaccessible to the public. Are you sure?",
				confirmText: "Unpublish",
				variant: "warning",
			});
			if (!confirmed) return;
		}

		isSubmitting = true;
		saveSuccess = false;
		try {
			await onSubmit({ ...formData, createRedirect });
			saveSuccess = true;
		} finally {
			isSubmitting = false;
		}
	}

	function openPreviewPage() {
		if (articleId) {
			window.open(`/admin/articles/${articleId}/preview`, "_blank");
		}
	}
</script>

<svelte:window onkeydown={onSaveShortcut(() => triggerSubmit(handleSubmit, isSubmitting))} />

<form onsubmit={handleSubmit} class="flex min-h-screen flex-col">
	<ArticleFormHeader
		bind:published={formData.published}
		bind:authorId={formData.authorId}
		bind:saveSuccess
		{authors}
		{isSubmitting}
		{submitLabel}
		{articleId}
		{onDelete}
		onPreview={openPreviewPage}
	/>

	<ArticleEditor
		bind:title={formData.title}
		bind:content={formData.content}
		bind:slug={formData.slug}
		bind:coverUrl={formData.coverUrl}
		bind:createRedirect
		initialSlug={initialData.slug}
		titleError={errors["title"]}
		contentError={errors["content"]}
		slugError={errors["slug"]}
		onTitleChange={handleTitleChange}
	/>
</form>
