<script lang="ts">
  import { goto } from "$app/navigation";
  import { snapshot } from "$lib/utils/snapshot.svelte";
  import { onSaveShortcut } from "$lib/utils/keyboard";
  import { validateSlug, generateSlug } from "$lib/shared/logic/slugs";
  import ImageUpload from "./image-upload.svelte";
  import Markdown from "./Markdown.svelte";
  import { Loader2, ArrowLeft, Settings, X, Github, ExternalLink } from "lucide-svelte";
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
  let showPreview = $state(false);

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
  <!-- Header Bar -->
  <header
    class="sticky top-0 z-20 flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3"
  >
    <div class="flex items-center gap-4">
      <button
        type="button"
        onclick={() => goto("/admin/projects")}
        class="flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900"
      >
        <ArrowLeft class="h-4 w-4" />
        <span class="hidden sm:inline">Projects</span>
      </button>

      <!-- Category Badge -->
      <span class="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
        {PROJECT_CATEGORIES[formData.category]}
      </span>
    </div>

    <div class="flex items-center gap-2">
      <!-- Settings Toggle -->
      <button
        type="button"
        onclick={() => (showSettings = !showSettings)}
        class="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-colors {showSettings
          ? 'bg-zinc-900 text-white'
          : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'}"
      >
        <Settings class="h-4 w-4" />
        <span class="hidden sm:inline">Settings</span>
      </button>

      <!-- Save Button -->
      <button
        type="submit"
        disabled={isSubmitting}
        class="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-zinc-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {#if isSubmitting}
          <Loader2 class="h-4 w-4 animate-spin" />
        {/if}
        {submitLabel}
      </button>
    </div>
  </header>

  <!-- Main Content Area -->
  <div class="flex flex-1 overflow-hidden">
    <!-- Editor -->
    <main class="flex flex-1 flex-col overflow-y-auto bg-white">
      <div class="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-8">
        <!-- Name Input -->
        <input
          type="text"
          id="name"
          bind:value={formData.name}
          oninput={handleNameChange}
          class="w-full border-none bg-transparent text-3xl font-bold text-zinc-900 placeholder:text-zinc-300 focus:ring-0 focus:outline-none"
          class:text-red-600={errors["name"]}
          placeholder="Project Name"
        />
        {#if errors["name"]}
          <p class="mt-1 text-sm text-red-500">{errors["name"]}</p>
        {/if}

        <!-- Description -->
        <textarea
          id="description"
          bind:value={formData.description}
          rows={2}
          class="mt-4 w-full resize-none border-none bg-transparent text-lg text-zinc-500 placeholder:text-zinc-300 focus:ring-0 focus:outline-none"
          placeholder="Short description..."
        ></textarea>

        <!-- Content Toggle -->
        <div class="mt-6 flex items-center gap-2 border-b border-zinc-100 pb-4">
          <button
            type="button"
            onclick={() => (showPreview = false)}
            class="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors {!showPreview
              ? 'bg-zinc-100 text-zinc-900'
              : 'text-zinc-500 hover:text-zinc-700'}"
          >
            Write
          </button>
          <button
            type="button"
            onclick={() => (showPreview = true)}
            class="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors {showPreview
              ? 'bg-zinc-100 text-zinc-900'
              : 'text-zinc-500 hover:text-zinc-700'}"
          >
            Preview
          </button>
          <span class="ml-auto text-xs text-zinc-400">Markdown supported</span>
        </div>

        <!-- Content Area -->
        <div class="mt-4 flex-1">
          {#if showPreview}
            <div class="prose-zinc prose max-w-none">
              {#if formData.content.trim()}
                <Markdown content={formData.content} />
              {:else}
                <p class="text-zinc-400">Nothing to preview</p>
              {/if}
            </div>
          {:else}
            <textarea
              id="content"
              bind:value={formData.content}
              class="min-h-[50vh] w-full resize-none border-none bg-transparent font-[JetBrains_Mono,monospace] text-base leading-relaxed text-zinc-900 placeholder:text-zinc-300 focus:ring-0 focus:outline-none"
              placeholder="Write detailed project content here..."
            ></textarea>
          {/if}
        </div>
      </div>
    </main>

    <!-- Settings Sidebar -->
    {#if showSettings}
      <aside class="w-80 shrink-0 overflow-y-auto border-l border-zinc-200 bg-zinc-50/50 lg:w-96">
        <div
          class="sticky top-0 flex items-center justify-between border-b border-zinc-200 bg-zinc-50/80 px-4 py-3 backdrop-blur-sm"
        >
          <h2 class="font-semibold text-zinc-900">Settings</h2>
          <button
            type="button"
            onclick={() => (showSettings = false)}
            class="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-600"
          >
            <X class="h-4 w-4" />
          </button>
        </div>

        <div class="space-y-6 p-4">
          <!-- Category -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-zinc-700">Category</label>
            <div class="flex flex-wrap gap-2">
              {#each Object.entries(PROJECT_CATEGORIES) as [key, label] (key)}
                <button
                  type="button"
                  onclick={() => (formData.category = key as ProjectCategory)}
                  class="rounded-lg border px-3 py-1.5 text-sm font-medium transition-all {formData.category ===
                  key
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300'}"
                >
                  {label}
                </button>
              {/each}
            </div>
          </div>

          <!-- URL Path -->
          <div class="space-y-2">
            <label for="slug" class="text-sm font-medium text-zinc-700">URL path</label>
            <div class="flex rounded-lg border border-zinc-200 bg-white">
              <span
                class="shrink-0 border-r border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-400"
              >
                /projects/
              </span>
              <input
                type="text"
                id="slug"
                bind:value={formData.slug}
                class="w-full rounded-r-lg border-none bg-transparent px-3 py-2 font-mono text-sm text-zinc-900 focus:ring-0 focus:outline-none"
                class:text-red-600={errors["slug"]}
                placeholder="my-project"
              />
            </div>
            {#if errors["slug"]}
              <p class="text-xs text-red-500">{errors["slug"]}</p>
            {/if}
          </div>

          <!-- Lead Member (only for new) -->
          {#if isNew}
            <div class="space-y-2">
              <label for="leadMemberId" class="text-sm font-medium text-zinc-700">Lead member</label
              >
              <select
                id="leadMemberId"
                bind:value={formData.leadMemberId}
                class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-400 focus:ring-0 focus:outline-none"
                class:border-red-300={errors["leadMemberId"]}
              >
                <option value={null}>Select a lead</option>
                {#each members as member (member.id)}
                  <option value={member.id}>{member.name}</option>
                {/each}
              </select>
              {#if errors["leadMemberId"]}
                <p class="text-xs text-red-500">{errors["leadMemberId"]}</p>
              {/if}
            </div>
          {/if}

          <!-- Cover Image -->
          <div class="space-y-2">
            <ImageUpload bind:value={formData.coverUrl} folder="projects" label="Cover image" />
          </div>

          <!-- Repository URL -->
          <div class="space-y-2">
            <label for="repoUrl" class="text-sm font-medium text-zinc-700">Repository</label>
            <div class="flex rounded-lg border border-zinc-200 bg-white">
              <span class="shrink-0 border-r border-zinc-200 bg-zinc-50 px-3 py-2">
                <Github class="h-4 w-4 text-zinc-400" />
              </span>
              <input
                type="url"
                id="repoUrl"
                bind:value={formData.repoUrl}
                class="w-full rounded-r-lg border-none bg-transparent px-3 py-2 text-sm text-zinc-900 focus:ring-0 focus:outline-none"
                placeholder="https://github.com/..."
              />
            </div>
          </div>

          <!-- Demo URL -->
          <div class="space-y-2">
            <label for="demoUrl" class="text-sm font-medium text-zinc-700">Demo</label>
            <div class="flex rounded-lg border border-zinc-200 bg-white">
              <span class="shrink-0 border-r border-zinc-200 bg-zinc-50 px-3 py-2">
                <ExternalLink class="h-4 w-4 text-zinc-400" />
              </span>
              <input
                type="url"
                id="demoUrl"
                bind:value={formData.demoUrl}
                class="w-full rounded-r-lg border-none bg-transparent px-3 py-2 text-sm text-zinc-900 focus:ring-0 focus:outline-none"
                placeholder="https://..."
              />
            </div>
          </div>

          <!-- Danger Zone -->
          {#if onDelete}
            <div class="border-t border-zinc-200 pt-6">
              <p class="text-sm font-medium text-red-600">Danger zone</p>
              <p class="mt-1 text-xs text-zinc-500">Team associations will be removed.</p>
              <button
                type="button"
                onclick={onDelete}
                class="mt-3 w-full rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                Delete project
              </button>
            </div>
          {/if}
        </div>
      </aside>
    {/if}
  </div>
</form>
