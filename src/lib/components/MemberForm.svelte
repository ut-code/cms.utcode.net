<script lang="ts">
  import { goto } from "$app/navigation";
  import { snapshot } from "$lib/utils/snapshot.svelte";
  import { onSaveShortcut } from "$lib/utils/keyboard";
  import ImageUpload from "./image-upload.svelte";

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

  let formData = $state(snapshot(() => initialData));
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

  function triggerSubmit() {
    if (!isSubmitting) handleSubmit(new SubmitEvent("submit"));
  }
</script>

<svelte:window onkeydown={onSaveShortcut(triggerSubmit)} />

<form onsubmit={handleSubmit} class="space-y-6">
  <!-- Basic Info Section -->
  <div class="rounded-xl border border-zinc-100 bg-white p-5 transition-shadow hover:shadow-sm">
    <h2 class="mb-5 text-sm font-semibold text-zinc-900">Basic Information</h2>

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
          placeholder="Taro Yamada"
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
            @
          </span>
          <input
            type="text"
            id="slug"
            bind:value={formData.slug}
            class="w-full rounded-r-lg border border-zinc-200 bg-white px-3.5 py-2.5 font-[JetBrains_Mono,monospace] text-sm text-zinc-900 transition-all duration-150 placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 focus:outline-none"
            class:border-red-300={errors["slug"]}
            placeholder="taro-yamada"
          />
        </div>
        {#if errors["slug"]}
          <p class="text-xs text-red-500">{errors["slug"]}</p>
        {/if}
      </div>
    </div>
  </div>

  <!-- Profile Section -->
  <div class="rounded-xl border border-zinc-100 bg-white p-5 transition-shadow hover:shadow-sm">
    <h2 class="mb-5 text-sm font-semibold text-zinc-900">Profile</h2>

    <div class="space-y-5">
      <ImageUpload bind:value={formData.imageUrl} folder="members" label="Profile Image" />

      <div class="space-y-1.5">
        <label for="bio" class="block text-sm font-medium text-zinc-700">Bio</label>
        <textarea
          id="bio"
          bind:value={formData.bio}
          rows={4}
          class="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 transition-all duration-150 placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 focus:outline-none"
          placeholder="A short bio about this member..."
        ></textarea>
      </div>
    </div>
  </div>

  <!-- Actions -->
  <div class="flex items-center justify-between pt-2">
    <button
      type="button"
      onclick={() => goto("/admin/members")}
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
        <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      {/if}
      {submitLabel}
    </button>
  </div>
</form>
