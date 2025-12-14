<script lang="ts">
  import { goto } from "$app/navigation";

  type MemberData = {
    slug: string;
    name: string;
    bio: string;
    imageUrl: string;
  };

  let {
    initialData = { slug: "", name: "", bio: "", imageUrl: "" },
    onSubmit,
    submitLabel = "Save",
    isSubmitting = $bindable(false),
  }: {
    initialData?: MemberData;
    onSubmit: (data: MemberData) => Promise<void>;
    submitLabel?: string;
    isSubmitting?: boolean;
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
    <h2 class="mb-6 text-lg font-semibold text-zinc-900">Basic Information</h2>

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
          placeholder="Taro Yamada"
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
            /members/
          </span>
          <input
            type="text"
            id="slug"
            bind:value={formData.slug}
            class="w-full rounded-r-lg border border-zinc-300 px-4 py-2.5 font-mono text-sm text-zinc-900 transition-colors focus:border-[#00D372] focus:ring-2 focus:ring-[#00D372]/20 focus:outline-none"
            class:border-red-500={errors["slug"]}
            placeholder="taro-yamada"
          />
        </div>
        {#if errors["slug"]}
          <p class="text-sm text-red-500">{errors["slug"]}</p>
        {/if}
      </div>
    </div>
  </div>

  <!-- Profile Section -->
  <div class="rounded-xl border border-zinc-200 bg-white p-6">
    <h2 class="mb-6 text-lg font-semibold text-zinc-900">Profile</h2>

    <div class="space-y-6">
      <div class="space-y-2">
        <label for="imageUrl" class="block text-sm font-medium text-zinc-700"
          >Profile Image URL</label
        >
        <div class="flex gap-4">
          <input
            type="url"
            id="imageUrl"
            bind:value={formData.imageUrl}
            class="flex-1 rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 transition-colors focus:border-[#00D372] focus:ring-2 focus:ring-[#00D372]/20 focus:outline-none"
            placeholder="https://example.com/avatar.jpg"
          />
          {#if formData.imageUrl}
            <div class="shrink-0">
              <img
                src={formData.imageUrl}
                alt="Preview"
                class="h-11 w-11 rounded-full border border-zinc-200 object-cover"
                onerror={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          {/if}
        </div>
      </div>

      <div class="space-y-2">
        <label for="bio" class="block text-sm font-medium text-zinc-700">Bio</label>
        <textarea
          id="bio"
          bind:value={formData.bio}
          rows={4}
          class="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 transition-colors focus:border-[#00D372] focus:ring-2 focus:ring-[#00D372]/20 focus:outline-none"
          placeholder="A short bio about this member..."
        ></textarea>
      </div>
    </div>
  </div>

  <!-- Actions -->
  <div class="flex items-center justify-between">
    <button
      type="button"
      onclick={() => goto("/admin/members")}
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
