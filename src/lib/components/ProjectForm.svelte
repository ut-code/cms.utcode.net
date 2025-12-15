<script lang="ts">
  import { goto } from "$app/navigation";
  import { snapshot } from "$lib/utils/snapshot.svelte";
  import { onSaveShortcut } from "$lib/utils/keyboard";
  import { validateSlug, generateSlug } from "$lib/shared/logic/slugs";
  import ImageUpload from "./image-upload.svelte";
  import Markdown from "./Markdown.svelte";
  import { Loader2, Github, ExternalLink } from "lucide-svelte";
  import { PROJECT_CATEGORIES, type ProjectCategory } from "$lib/shared/models/schema";

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
      category: "active" as ProjectCategory,
      leadMemberId: null,
    },
    members = [],
    onSubmit,
    submitLabel = "Save",
    isSubmitting = $bindable(false),
    isNew = false,
  }: {
    initialData?: ProjectData;
    members?: Member[];
    onSubmit: (data: ProjectData) => Promise<void>;
    submitLabel?: string;
    isSubmitting?: boolean;
    isNew?: boolean;
  } = $props();

  let formData = $state(snapshot(() => initialData));
  let errors = $state<Record<string, string>>({});
  let activeTab = $state<"edit" | "preview">("edit");

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
      errors["slug"] = "Slug is required";
    } else if (!validateSlug(formData.slug)) {
      errors["slug"] = "Slug must be lowercase letters, numbers, and hyphens only";
    }
    if (isNew && !formData.leadMemberId) {
      errors["leadMemberId"] = "Lead member is required";
    }

    if (Object.keys(errors).length > 0) return;

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

<form onsubmit={handleSubmit} class="space-y-6">
  <!-- Basic Info Section -->
  <div class="rounded-xl border border-zinc-100 bg-white p-5 transition-shadow hover:shadow-sm">
    <h2 class="mb-5 text-sm font-semibold text-zinc-900">Project Details</h2>

    <div class="space-y-5">
      <div class="grid gap-5 md:grid-cols-2">
        <div class="space-y-1.5">
          <label for="name" class="block text-sm font-medium text-zinc-700">
            Name <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            bind:value={formData.name}
            oninput={handleNameChange}
            class="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 transition-all duration-150 placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 focus:outline-none"
            class:border-red-300={errors["name"]}
            placeholder="My Awesome Project"
          />
          {#if errors["name"]}
            <p class="text-xs text-red-500">{errors["name"]}</p>
          {/if}
        </div>

        <div class="space-y-1.5">
          <label for="slug" class="block text-sm font-medium text-zinc-700">
            Slug <span class="text-red-500">*</span>
          </label>
          <div class="flex">
            <span
              class="inline-flex items-center rounded-l-lg border border-r-0 border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-400"
            >
              /projects/
            </span>
            <input
              type="text"
              id="slug"
              bind:value={formData.slug}
              class="w-full rounded-r-lg border border-zinc-200 bg-white px-3.5 py-2.5 font-[JetBrains_Mono,monospace] text-sm text-zinc-900 transition-all duration-150 placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 focus:outline-none"
              class:border-red-300={errors["slug"]}
              placeholder="my-awesome-project"
            />
          </div>
          {#if errors["slug"]}
            <p class="text-xs text-red-500">{errors["slug"]}</p>
          {/if}
        </div>
      </div>

      <div class="space-y-1.5">
        <label for="description" class="block text-sm font-medium text-zinc-700">Description</label>
        <textarea
          id="description"
          bind:value={formData.description}
          rows={2}
          class="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 transition-all duration-150 placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 focus:outline-none"
          placeholder="A brief description of the project..."
        ></textarea>
      </div>

      <div class="space-y-1.5">
        <label class="block text-sm font-medium text-zinc-700">
          Category <span class="text-red-500">*</span>
        </label>
        <div class="flex flex-wrap gap-2">
          {#each Object.entries(PROJECT_CATEGORIES) as [key, label] (key)}
            <button
              type="button"
              onclick={() => (formData.category = key as ProjectCategory)}
              class="rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-150 {formData.category ===
              key
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'}"
            >
              {label}
            </button>
          {/each}
        </div>
      </div>

      {#if isNew}
        <div class="space-y-1.5">
          <label for="leadMemberId" class="block text-sm font-medium text-zinc-700">
            Lead Member <span class="text-red-500">*</span>
          </label>
          <select
            id="leadMemberId"
            bind:value={formData.leadMemberId}
            class="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 transition-all duration-150 hover:border-zinc-300 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 focus:outline-none"
            class:border-red-300={errors["leadMemberId"]}
          >
            <option value={null}>Select a lead member</option>
            {#each members as member (member.id)}
              <option value={member.id}>{member.name}</option>
            {/each}
          </select>
          {#if errors["leadMemberId"]}
            <p class="text-xs text-red-500">{errors["leadMemberId"]}</p>
          {/if}
        </div>
      {/if}
    </div>
  </div>

  <!-- Media Section -->
  <div class="rounded-xl border border-zinc-100 bg-white p-5 transition-shadow hover:shadow-sm">
    <h2 class="mb-5 text-sm font-semibold text-zinc-900">Media & Links</h2>

    <div class="space-y-5">
      <ImageUpload bind:value={formData.coverUrl} folder="projects" label="Cover Image" />

      <div class="grid gap-5 md:grid-cols-2">
        <div class="space-y-1.5">
          <label for="repoUrl" class="block text-sm font-medium text-zinc-700">Repository URL</label
          >
          <div class="flex">
            <span
              class="inline-flex items-center rounded-l-lg border border-r-0 border-zinc-200 bg-zinc-50 px-3"
            >
              <Github class="h-4 w-4 text-zinc-400" />
            </span>
            <input
              type="url"
              id="repoUrl"
              bind:value={formData.repoUrl}
              class="w-full rounded-r-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 transition-all duration-150 placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 focus:outline-none"
              placeholder="https://github.com/..."
            />
          </div>
        </div>

        <div class="space-y-1.5">
          <label for="demoUrl" class="block text-sm font-medium text-zinc-700">Demo URL</label>
          <div class="flex">
            <span
              class="inline-flex items-center rounded-l-lg border border-r-0 border-zinc-200 bg-zinc-50 px-3"
            >
              <ExternalLink class="h-4 w-4 text-zinc-400" />
            </span>
            <input
              type="url"
              id="demoUrl"
              bind:value={formData.demoUrl}
              class="w-full rounded-r-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 transition-all duration-150 placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 focus:outline-none"
              placeholder="https://example.com"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Content Section -->
  <div class="rounded-xl border border-zinc-100 bg-white p-5 transition-shadow hover:shadow-sm">
    <div class="mb-5 flex items-center justify-between">
      <h2 class="text-sm font-semibold text-zinc-900">Content</h2>
      <div class="flex items-center gap-2">
        <div class="inline-flex rounded-lg border border-zinc-200 p-1">
          <button
            type="button"
            onclick={() => (activeTab = "edit")}
            class="rounded px-3 py-1 text-xs font-medium transition-all duration-150"
            class:bg-zinc-900={activeTab === "edit"}
            class:text-white={activeTab === "edit"}
            class:text-zinc-600={activeTab !== "edit"}
            class:hover:text-zinc-900={activeTab !== "edit"}
          >
            Edit
          </button>
          <button
            type="button"
            onclick={() => (activeTab = "preview")}
            class="rounded px-3 py-1 text-xs font-medium transition-all duration-150"
            class:bg-zinc-900={activeTab === "preview"}
            class:text-white={activeTab === "preview"}
            class:text-zinc-600={activeTab !== "preview"}
            class:hover:text-zinc-900={activeTab !== "preview"}
          >
            Preview
          </button>
        </div>
        <span class="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500"
          >Markdown</span
        >
      </div>
    </div>

    {#if activeTab === "edit"}
      <textarea
        id="content"
        bind:value={formData.content}
        rows={12}
        class="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-3 font-[JetBrains_Mono,monospace] text-sm text-zinc-900 transition-all duration-150 placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 focus:outline-none"
        placeholder="Write detailed project content here..."
      ></textarea>
    {:else}
      <div
        class="min-h-[300px] w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-3 text-sm"
      >
        {#if formData.content.trim()}
          <Markdown content={formData.content} />
        {:else}
          <p class="text-zinc-400">No content to preview</p>
        {/if}
      </div>
    {/if}
  </div>

  <!-- Actions -->
  <div class="flex items-center justify-between pt-2">
    <button
      type="button"
      onclick={() => goto("/admin/projects")}
      class="rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-all duration-150 hover:border-zinc-300 hover:bg-zinc-50 active:scale-[0.98]"
    >
      Cancel
    </button>
    <button
      type="submit"
      disabled={isSubmitting}
      class="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-zinc-800 hover:shadow active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {#if isSubmitting}
        <Loader2 class="h-4 w-4 animate-spin" />
      {/if}
      {submitLabel}
    </button>
  </div>
</form>
