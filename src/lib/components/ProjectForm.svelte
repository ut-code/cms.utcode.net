<script lang="ts">
  import { goto } from "$app/navigation";

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

  let formData = $state({ ...initialData });
  let errors = $state<Record<string, string>>({});

  function validateSlug(slug: string): boolean {
    return /^[a-z0-9-]+$/.test(slug);
  }

  function generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

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
</script>

<form onsubmit={handleSubmit} class="space-y-8">
  <!-- Basic Info Section -->
  <div class="rounded-xl border border-zinc-200 bg-white p-6">
    <h2 class="mb-6 text-lg font-semibold text-zinc-900">Project Details</h2>

    <div class="space-y-6">
      <div class="grid gap-6 md:grid-cols-2">
        <div class="space-y-2">
          <label for="name" class="block text-sm font-medium text-zinc-700">
            Name <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            bind:value={formData.name}
            oninput={handleNameChange}
            class="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 transition-colors focus:border-[#00D372] focus:ring-2 focus:ring-[#00D372]/20 focus:outline-none"
            class:border-red-500={errors["name"]}
            placeholder="My Awesome Project"
          />
          {#if errors["name"]}
            <p class="text-sm text-red-500">{errors["name"]}</p>
          {/if}
        </div>

        <div class="space-y-2">
          <label for="slug" class="block text-sm font-medium text-zinc-700">
            Slug <span class="text-red-500">*</span>
          </label>
          <div class="flex">
            <span
              class="inline-flex items-center rounded-l-lg border border-r-0 border-zinc-300 bg-zinc-50 px-3 text-sm text-zinc-500"
            >
              /projects/
            </span>
            <input
              type="text"
              id="slug"
              bind:value={formData.slug}
              class="w-full rounded-r-lg border border-zinc-300 px-4 py-2.5 font-mono text-sm text-zinc-900 transition-colors focus:border-[#00D372] focus:ring-2 focus:ring-[#00D372]/20 focus:outline-none"
              class:border-red-500={errors["slug"]}
              placeholder="my-awesome-project"
            />
          </div>
          {#if errors["slug"]}
            <p class="text-sm text-red-500">{errors["slug"]}</p>
          {/if}
        </div>
      </div>

      <div class="space-y-2">
        <label for="description" class="block text-sm font-medium text-zinc-700">Description</label>
        <textarea
          id="description"
          bind:value={formData.description}
          rows={2}
          class="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 transition-colors focus:border-[#00D372] focus:ring-2 focus:ring-[#00D372]/20 focus:outline-none"
          placeholder="A brief description of the project..."
        ></textarea>
      </div>

      {#if isNew}
        <div class="space-y-2">
          <label for="leadMemberId" class="block text-sm font-medium text-zinc-700">
            Lead Member <span class="text-red-500">*</span>
          </label>
          <select
            id="leadMemberId"
            bind:value={formData.leadMemberId}
            class="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 transition-colors focus:border-[#00D372] focus:ring-2 focus:ring-[#00D372]/20 focus:outline-none"
            class:border-red-500={errors["leadMemberId"]}
          >
            <option value={null}>Select a lead member</option>
            {#each members as member (member.id)}
              <option value={member.id}>{member.name}</option>
            {/each}
          </select>
          {#if errors["leadMemberId"]}
            <p class="text-sm text-red-500">{errors["leadMemberId"]}</p>
          {/if}
        </div>
      {/if}
    </div>
  </div>

  <!-- Media Section -->
  <div class="rounded-xl border border-zinc-200 bg-white p-6">
    <h2 class="mb-6 text-lg font-semibold text-zinc-900">Media & Links</h2>

    <div class="space-y-6">
      <div class="space-y-2">
        <label for="coverUrl" class="block text-sm font-medium text-zinc-700">Cover Image URL</label
        >
        <input
          type="url"
          id="coverUrl"
          bind:value={formData.coverUrl}
          class="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 transition-colors focus:border-[#00D372] focus:ring-2 focus:ring-[#00D372]/20 focus:outline-none"
          placeholder="https://example.com/cover.jpg"
        />
        {#if formData.coverUrl}
          <img
            src={formData.coverUrl}
            alt="Cover preview"
            class="mt-2 h-32 w-full rounded-lg border border-zinc-200 object-cover"
            onerror={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        {/if}
      </div>

      <div class="grid gap-6 md:grid-cols-2">
        <div class="space-y-2">
          <label for="repoUrl" class="block text-sm font-medium text-zinc-700">Repository URL</label
          >
          <div class="flex">
            <span
              class="inline-flex items-center rounded-l-lg border border-r-0 border-zinc-300 bg-zinc-50 px-3"
            >
              <svg class="h-4 w-4 text-zinc-500" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                />
              </svg>
            </span>
            <input
              type="url"
              id="repoUrl"
              bind:value={formData.repoUrl}
              class="w-full rounded-r-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 transition-colors focus:border-[#00D372] focus:ring-2 focus:ring-[#00D372]/20 focus:outline-none"
              placeholder="https://github.com/..."
            />
          </div>
        </div>

        <div class="space-y-2">
          <label for="demoUrl" class="block text-sm font-medium text-zinc-700">Demo URL</label>
          <div class="flex">
            <span
              class="inline-flex items-center rounded-l-lg border border-r-0 border-zinc-300 bg-zinc-50 px-3"
            >
              <svg
                class="h-4 w-4 text-zinc-500"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </span>
            <input
              type="url"
              id="demoUrl"
              bind:value={formData.demoUrl}
              class="w-full rounded-r-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 transition-colors focus:border-[#00D372] focus:ring-2 focus:ring-[#00D372]/20 focus:outline-none"
              placeholder="https://example.com"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Content Section -->
  <div class="rounded-xl border border-zinc-200 bg-white p-6">
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-lg font-semibold text-zinc-900">Content</h2>
      <span class="text-xs text-zinc-400">Markdown supported</span>
    </div>

    <textarea
      id="content"
      bind:value={formData.content}
      rows={12}
      class="w-full rounded-lg border border-zinc-300 px-4 py-3 font-mono text-sm text-zinc-900 transition-colors focus:border-[#00D372] focus:ring-2 focus:ring-[#00D372]/20 focus:outline-none"
      placeholder="Write detailed project content here..."
    ></textarea>
  </div>

  <!-- Actions -->
  <div class="flex items-center justify-between">
    <button
      type="button"
      onclick={() => goto("/admin/projects")}
      class="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
    >
      Cancel
    </button>
    <button
      type="submit"
      disabled={isSubmitting}
      class="inline-flex items-center gap-2 rounded-lg bg-[#00D372] px-6 py-2.5 text-sm font-semibold text-zinc-900 transition-colors hover:bg-[#00C066] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {#if isSubmitting}
        <span class="loading loading-sm loading-spinner"></span>
      {/if}
      {submitLabel}
    </button>
  </div>
</form>
