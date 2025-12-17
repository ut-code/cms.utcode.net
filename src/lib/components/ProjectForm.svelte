<script lang="ts">
  import { snapshot } from "$lib/utils/snapshot.svelte";
  import { onSaveShortcut } from "$lib/utils/keyboard";
  import { validateSlug, generateSlug } from "$lib/shared/logic/slugs";
  import type { ProjectCategory } from "$lib/shared/models/schema";
  import ProjectFormHeader from "./project-form/ProjectFormHeader.svelte";
  import ProjectEditor from "./project-form/ProjectEditor.svelte";
  import ProjectSettings from "./project-form/ProjectSettings.svelte";

  type Member = {
    id: string;
    name: string;
    imageUrl: string | null;
  };

  type ProjectData = {
    slug: string;
    name: string;
    description: string;
    content: string;
    coverUrl: string;
    repoUrl: string;
    demoUrl: string;
    category: ProjectCategory;
    leadMemberId: string | null;
  };

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
    errors = {};

    if (!formData.name.trim()) {
      errors["name"] = "Name is required";
    }
    if (!formData.slug.trim()) {
      errors["slug"] = "URL path is required";
    } else if (!validateSlug(formData.slug)) {
      errors["slug"] = "Lowercase letters, numbers, and hyphens only";
    }
    if (isNew && !formData.leadMemberId) {
      errors["leadMemberId"] = "Lead member is required";
      showSettings = true;
    }

    if (Object.keys(errors).length > 0) {
      if (errors["slug"] || errors["leadMemberId"]) showSettings = true;
      return;
    }

    isSubmitting = true;
    try {
      await onSubmit(formData);
    } finally {
      isSubmitting = false;
    }
  }

  function triggerSubmit() {
    if (!isSubmitting) handleSubmit(new SubmitEvent("submit"));
  }
</script>

<svelte:window onkeydown={onSaveShortcut(triggerSubmit)} />

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
