<script lang="ts">
	import { createFormValidator } from "$lib/shared/logic/form-validation";
	import { generateArticleSlug, validateArticleSlug } from "$lib/shared/logic/slugs";
	import type { ArticleData, Author } from "$lib/shared/models/types";
	import { triggerSubmit } from "$lib/utils/form";
	import { onSaveShortcut } from "$lib/utils/keyboard";
	import { snapshot } from "$lib/utils/snapshot.svelte";
	import { ArticleEditor, ArticleFormHeader, ArticleSettings } from "./article-form";
	import { confirm } from "$lib/components/confirm-modal.svelte";

	let {
		initialData = {
			slug: "",
			title: "",
			content: "",
			excerpt: "",
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
	let showSettings = $state(false);
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
			// Show settings panel if there are errors in settings fields
			if (errors.slug) showSettings = true;
			return;
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

	async function handlePublishToggle(newValue: boolean) {
		// If unpublishing (from true to false), show confirmation
		if (formData.published && !newValue) {
			const confirmed = await confirm({
				title: "Unpublish article?",
				description: "This will make the article inaccessible to the public. Are you sure?",
				confirmText: "Unpublish",
				variant: "warning",
			});
			if (!confirmed) return;
		}
		formData.published = newValue;
	}
</script>

<svelte:window onkeydown={onSaveShortcut(() => triggerSubmit(handleSubmit, isSubmitting))} />

<form onsubmit={handleSubmit} class="flex h-full flex-col">
	<ArticleFormHeader
		bind:published={formData.published}
		bind:showSettings
		bind:saveSuccess
		{isSubmitting}
		{submitLabel}
		{articleId}
		onPreview={openPreviewPage}
	/>

	<div class="flex flex-1 overflow-hidden">
		<ArticleEditor
			bind:title={formData.title}
			bind:content={formData.content}
			titleError={errors["title"]}
			contentError={errors["content"]}
			onTitleChange={handleTitleChange}
		/>

		<ArticleSettings
			bind:show={showSettings}
			bind:published={formData.published}
			bind:slug={formData.slug}
			bind:authorId={formData.authorId}
			bind:excerpt={formData.excerpt}
			bind:coverUrl={formData.coverUrl}
			bind:createRedirect
			initialSlug={initialData.slug}
			{authors}
			slugError={errors["slug"]}
			{onDelete}
			onPublishToggle={handlePublishToggle}
		/>
	</div>
</form>
