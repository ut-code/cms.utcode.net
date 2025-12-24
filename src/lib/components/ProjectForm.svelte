<script lang="ts">
	import { createFormValidator } from "$lib/shared/logic/form-validation";
	import { generateSlug, validateSlug } from "$lib/shared/logic/slugs";
	import type { Member, ProjectData } from "$lib/shared/models/types";
	import { triggerSubmit } from "$lib/utils/form";
	import { onSaveShortcut } from "$lib/utils/keyboard";
	import { snapshot } from "$lib/utils/snapshot.svelte";
	import ProjectEditor from "./project-form/ProjectEditor.svelte";
	import ProjectFormHeader from "./project-form/ProjectFormHeader.svelte";
	import ProjectSettings from "./project-form/ProjectSettings.svelte";

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
	let showSettings = $state(false);

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
			showSettings = true;
		}

		errors = validator.getErrors();

		if (validator.hasErrors()) {
			if (errors.slug || errors.leadMemberId) showSettings = true;
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
	<ProjectFormHeader
		category={formData.category}
		bind:showSettings
		{isSubmitting}
		{submitLabel}
		onToggleSettings={() => (showSettings = !showSettings)}
	/>

	<div class="flex flex-1 overflow-hidden">
		<ProjectEditor
			bind:name={formData.name}
			bind:description={formData.description}
			bind:content={formData.content}
			{errors}
			onNameChange={handleNameChange}
		/>

		<ProjectSettings
			show={showSettings}
			bind:category={formData.category}
			bind:slug={formData.slug}
			bind:leadMemberId={formData.leadMemberId}
			bind:coverUrl={formData.coverUrl}
			bind:repoUrl={formData.repoUrl}
			bind:demoUrl={formData.demoUrl}
			{members}
			{errors}
			{isNew}
			onClose={() => (showSettings = false)}
			{onDelete}
		/>
	</div>
</form>
