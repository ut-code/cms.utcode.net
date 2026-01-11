<script lang="ts">
	import { createFormValidator } from "$lib/shared/logic/form-validation";
	import { generateSlug, validateSlug } from "$lib/shared/logic/slugs";
	import type { Member, ProjectData } from "$lib/shared/models/types";
	import { triggerSubmit } from "$lib/utils/form";
	import { onSaveShortcut } from "$lib/utils/keyboard";
	import { snapshot } from "$lib/utils/snapshot.svelte";
	import ProjectEditor from "./project-form/ProjectEditor.svelte";
	import ProjectFormHeader from "./project-form/ProjectFormHeader.svelte";

	let {
		initialData = {
			slug: "",
			name: "",
			description: "",
			content: "",
			coverUrl: "",
			repoUrl: "",
			demoUrl: "",
			category: "active",
			leadMemberId: null,
		},
		members = [],
		onSubmit,
		onDelete = null,
		submitLabel = "Save",
		isSubmitting = $bindable(false),
		isNew = false,
	}: {
		initialData?: ProjectData;
		members?: Member[];
		onSubmit: (data: ProjectData) => Promise<void>;
		onDelete?: (() => Promise<void>) | null;
		submitLabel?: string;
		isSubmitting?: boolean;
		isNew?: boolean;
	} = $props();

	let formData = $state(snapshot(() => initialData));
	let errors = $state<Record<string, string>>({});
	let saveSuccess = $state(false);

	function handleNameChange() {
		if (!formData.slug || formData.slug === generateSlug(initialData.name)) {
			formData.slug = generateSlug(formData.name);
		}
	}

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		const validator = createFormValidator<ProjectData>();
		validator
			.required("name", formData.name, "Name is required")
			.required("slug", formData.slug, "URL path is required")
			.validate("slug", formData.slug, (value) =>
				validateSlug(value) ? null : "Lowercase letters, numbers, and hyphens only",
			);

		if (isNew && !formData.leadMemberId) {
			validator.validate("leadMemberId", "", () => "Lead member is required");
		}

		errors = validator.getErrors();

		if (validator.hasErrors()) {
			return;
		}

		isSubmitting = true;
		saveSuccess = false;
		try {
			await onSubmit(formData);
			saveSuccess = true;
		} finally {
			isSubmitting = false;
		}
	}
</script>

<svelte:window onkeydown={onSaveShortcut(() => triggerSubmit(handleSubmit, isSubmitting))} />

<form onsubmit={handleSubmit} class="flex min-h-screen flex-col">
	<ProjectFormHeader
		bind:leadMemberId={formData.leadMemberId}
		bind:saveSuccess
		{members}
		{isSubmitting}
		{submitLabel}
		{onDelete}
	/>

	<ProjectEditor
		bind:name={formData.name}
		bind:description={formData.description}
		bind:content={formData.content}
		bind:slug={formData.slug}
		bind:coverUrl={formData.coverUrl}
		bind:category={formData.category}
		bind:repoUrl={formData.repoUrl}
		bind:demoUrl={formData.demoUrl}
		{errors}
		onNameChange={handleNameChange}
	/>
</form>
