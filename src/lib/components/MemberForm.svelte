<script lang="ts">
	import { createFormValidator } from "$lib/shared/logic/form-validation";
	import { generateSlug, validateSlug } from "$lib/shared/logic/slugs";
	import type { MemberData } from "$lib/shared/models/types";
	import { triggerSubmit } from "$lib/utils/form";
	import { onSaveShortcut } from "$lib/utils/keyboard";
	import { snapshot } from "$lib/utils/snapshot.svelte";
	import { MemberEditor, MemberFormHeader } from "./member-form";

	let {
		initialData = {
			slug: "",
			name: "",
			bio: "",
			imageUrl: "",
			githubUrl: "",
			twitterUrl: "",
			websiteUrl: "",
			pageContent: "",
		},
		onSubmit,
		onDelete = null,
		submitLabel = "Save",
		isSubmitting = $bindable(false),
	}: {
		initialData?: MemberData;
		onSubmit: (data: MemberData) => Promise<void>;
		onDelete?: (() => Promise<void>) | null;
		submitLabel?: string;
		isSubmitting?: boolean;
	} = $props();

	let formData = $state(snapshot(() => initialData));
	let errors = $state<Record<string, string>>({});

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

<form onsubmit={handleSubmit} class="flex min-h-screen flex-col">
	<MemberFormHeader {isSubmitting} {submitLabel} {onDelete} />

	<MemberEditor
		bind:name={formData.name}
		bind:slug={formData.slug}
		bind:bio={formData.bio}
		bind:imageUrl={formData.imageUrl}
		bind:githubUrl={formData.githubUrl}
		bind:twitterUrl={formData.twitterUrl}
		bind:websiteUrl={formData.websiteUrl}
		bind:pageContent={formData.pageContent}
		nameError={errors["name"]}
		slugError={errors["slug"]}
		onNameChange={handleNameChange}
	/>
</form>
