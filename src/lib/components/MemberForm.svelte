<script lang="ts">
  import { goto } from "$app/navigation";
  import { snapshot } from "$lib/utils/snapshot.svelte";
  import { onSaveShortcut } from "$lib/utils/keyboard";
  import { validateSlug, generateSlug } from "$lib/shared/logic/slugs";
  import ImageUpload from "./image-upload.svelte";
  import { Loader2, ArrowLeft, Settings, X } from "lucide-svelte";

  type MemberData = {
    slug: string;
    name: string;
    bio: string;
    imageUrl: string;
  };

  let {
    initialData = { slug: "", name: "", bio: "", imageUrl: "" },
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
      errors["slug"] = "Username is required";
    } else if (!validateSlug(formData.slug)) {
      errors["slug"] = "Lowercase letters, numbers, and hyphens only";
    }

    if (Object.keys(errors).length > 0) {
      if (errors["slug"]) showSettings = true;
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
        onclick={() => goto("/admin/members")}
        class="flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900"
      >
        <ArrowLeft class="h-4 w-4" />
        <span class="hidden sm:inline">Members</span>
      </button>
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
      <div class="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-8">
        <!-- Profile Image -->
        <div class="mb-8 flex justify-center">
          {#if formData.imageUrl}
            <img
              src={formData.imageUrl}
              alt={formData.name || "Profile"}
              class="h-32 w-32 rounded-full object-cover ring-4 ring-zinc-100"
            />
          {:else}
            <div
              class="flex h-32 w-32 items-center justify-center rounded-full bg-zinc-100 text-4xl font-bold text-zinc-300"
            >
              {formData.name ? formData.name.charAt(0).toUpperCase() : "?"}
            </div>
          {/if}
        </div>

        <!-- Name Input -->
        <input
          type="text"
          id="name"
          bind:value={formData.name}
          oninput={handleNameChange}
          class="w-full border-none bg-transparent text-center text-3xl font-bold text-zinc-900 placeholder:text-zinc-300 focus:ring-0 focus:outline-none"
          class:text-red-600={errors["name"]}
          placeholder="Name"
        />
        {#if errors["name"]}
          <p class="mt-1 text-center text-sm text-red-500">{errors["name"]}</p>
        {/if}

        <!-- Username -->
        <p class="mt-2 text-center text-sm text-zinc-400">
          @{formData.slug || "username"}
        </p>

        <!-- Bio -->
        <div class="mt-8">
          <label for="bio" class="mb-2 block text-sm font-medium text-zinc-700">Bio</label>
          <textarea
            id="bio"
            bind:value={formData.bio}
            rows={6}
            class="w-full resize-none rounded-lg border border-zinc-200 bg-white px-4 py-3 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-0 focus:outline-none"
            placeholder="A short bio about this member..."
          ></textarea>
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
          <!-- Username -->
          <div class="space-y-2">
            <label for="slug" class="text-sm font-medium text-zinc-700">Username</label>
            <div class="flex rounded-lg border border-zinc-200 bg-white">
              <span
                class="shrink-0 border-r border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-400"
              >
                @
              </span>
              <input
                type="text"
                id="slug"
                bind:value={formData.slug}
                class="w-full rounded-r-lg border-none bg-transparent px-3 py-2 font-mono text-sm text-zinc-900 focus:ring-0 focus:outline-none"
                class:text-red-600={errors["slug"]}
                placeholder="username"
              />
            </div>
            {#if errors["slug"]}
              <p class="text-xs text-red-500">{errors["slug"]}</p>
            {/if}
          </div>

          <!-- Profile Image -->
          <div class="space-y-2">
            <ImageUpload
              bind:value={formData.imageUrl}
              folder="members"
              label="Profile image"
              aspect="1/1"
            />
          </div>

          <!-- Danger Zone -->
          {#if onDelete}
            <div class="border-t border-zinc-200 pt-6">
              <p class="text-sm font-medium text-red-600">Danger zone</p>
              <p class="mt-1 text-xs text-zinc-500">
                Articles by this member will lose attribution.
              </p>
              <button
                type="button"
                onclick={onDelete}
                class="mt-3 w-full rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                Delete member
              </button>
            </div>
          {/if}
        </div>
      </aside>
    {/if}
  </div>
</form>
