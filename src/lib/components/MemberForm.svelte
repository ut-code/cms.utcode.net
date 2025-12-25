<script lang="ts">
	import { createFormValidator } from "$lib/shared/logic/form-validation";
	import { generateSlug, validateSlug } from "$lib/shared/logic/slugs";
	import type { MemberData } from "$lib/shared/models/types";
	import { triggerSubmit } from "$lib/utils/form";
	import { onSaveShortcut } from "$lib/utils/keyboard";
	import { snapshot } from "$lib/utils/snapshot.svelte";
	import { MemberEditor, MemberFormHeader, MemberSettings } from "./member-form";

	let {
		initialData = { slug: "", name: "", bio: "", imageUrl: "", pageContent: "" },
		onSubmit,
		onDelete = null,
		submitLabel = "Save",
		isSubmitting = $bindable(false),
		viewCount = 0,
	}: {
		initialData?: MemberData;
		onSubmit: (data: MemberData) => Promise<void>;
		onDelete?: (() => Promise<void>) | null;
		submitLabel?: string;
		isSubmitting?: boolean;
		viewCount?: number;
	} = $props();

	let formData = $state(snapshot(() => initialData));
	let errors = $state<Record<string, string>>({});
	let showSettings = $state(false);

	function handleNameChange() {
		if (!formData.slug || formData.slug === generateSlug(initialData.name)) {
			formData.slug = generateSlug(formData.name);
		}
	}

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		const validator = createFormValidator<MemberData>();
		validator
			.required("name", formData.name, "Name is required")
			.required("slug", formData.slug, "Username is required")
			.validate("slug", formData.slug, (value) =>
				validateSlug(value) ? null : "Lowercase letters, numbers, and hyphens only",
			);

		errors = validator.getErrors();

		if (validator.hasErrors()) {
			if (errors.slug) showSettings = true;
			return;
		}

		isSubmitting = true;
		try {
			await onSubmit(formData);
		} finally {
			isSubmitting = false;
		}
	}
</script>

<svelte:window onkeydown={onSaveShortcut(() => triggerSubmit(handleSubmit, isSubmitting))} />

<form onsubmit={handleSubmit} class="flex h-full flex-col">
	<MemberFormHeader
		bind:showSettings
		{isSubmitting}
		{submitLabel}
	/>

	<div class="flex flex-1 overflow-hidden">
		<MemberEditor
			bind:name={formData.name}
			bind:bio={formData.bio}
			bind:pageContent={formData.pageContent}
			slug={formData.slug}
			imageUrl={formData.imageUrl}
			nameError={errors["name"]}
			onNameChange={handleNameChange}
			onOpenSettings={() => (showSettings = true)}
		/>

		<MemberSettings
			bind:show={showSettings}
			bind:slug={formData.slug}
			bind:imageUrl={formData.imageUrl}
			slugError={errors["slug"]}
			{viewCount}
			{onDelete}
		/>
	</div>
</form>
