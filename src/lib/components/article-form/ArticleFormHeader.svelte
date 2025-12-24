<script lang="ts">
	import {
		ArrowLeft,
		Check,
		ExternalLink,
		Eye,
		EyeOff,
		Loader2,
		Settings,
	} from "lucide-svelte";
	import { goto } from "$app/navigation";

	let {
		published = $bindable(false),
		showSettings = $bindable(false),
		isSubmitting = false,
		saveSuccess = $bindable(false),
		submitLabel = "Save",
		articleId = null,
		onPreview = null,
	}: {
		published?: boolean;
		showSettings?: boolean;
		isSubmitting?: boolean;
		saveSuccess?: boolean;
		submitLabel?: string;
		articleId?: string | null;
		onPreview?: (() => void) | null;
	} = $props();

	let successTimeout: ReturnType<typeof setTimeout> | null = null;

	$effect(() => {
		if (saveSuccess) {
			if (successTimeout) {
				clearTimeout(successTimeout);
			}
			successTimeout = setTimeout(() => {
				saveSuccess = false;
				successTimeout = null;
			}, 2000);
		}

		return () => {
			if (successTimeout) {
				clearTimeout(successTimeout);
			}
		};
	});

	function openPreviewPage() {
		if (articleId && onPreview) {
			onPreview();
		}
	}
</script>

<header
	class="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 bg-white px-3 py-2 sm:px-4 sm:py-3"
>
	<div class="flex items-center gap-2 sm:gap-4">
		<button
			type="button"
			onclick={() => goto("/admin/articles")}
			class="flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900"
			aria-label="Back to Articles"
		>
			<ArrowLeft class="h-4 w-4" />
			<span class="hidden sm:inline">Articles</span>
		</button>

		<!-- Status Badge -->
		{#if published}
			<span
				class="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 sm:px-2.5 sm:py-1"
			>
				<Eye class="h-3 w-3" />
				<span class="hidden sm:inline">Public</span>
			</span>
		{:else}
			<span
				class="flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 sm:px-2.5 sm:py-1"
			>
				<EyeOff class="h-3 w-3" />
				<span class="hidden sm:inline">Draft</span>
			</span>
		{/if}
	</div>

	<div class="flex items-center gap-1 sm:gap-2">
		<!-- Preview Button -->
		{#if articleId}
			<button
				type="button"
				onclick={openPreviewPage}
				class="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-primary/5 hover:text-primary sm:px-3 sm:py-2"
				aria-label="Preview article"
			>
				<ExternalLink class="h-4 w-4" />
				<span class="hidden sm:inline">Preview</span>
			</button>
		{/if}

		<!-- Settings Toggle -->
		<button
			type="button"
			onclick={() => (showSettings = !showSettings)}
			class="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm transition-colors sm:px-3 sm:py-2 {showSettings
				? 'bg-zinc-900 text-white'
				: 'text-zinc-600 hover:bg-primary/5 hover:text-primary'}"
			aria-label="Toggle settings"
		>
			<Settings class="h-4 w-4" />
			<span class="hidden sm:inline">Settings</span>
		</button>

		<!-- Save Button -->
		<button
			type="submit"
			disabled={isSubmitting || saveSuccess}
			class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-white transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:px-4 sm:py-2 {published
				? 'bg-emerald-600 hover:bg-emerald-700'
				: 'bg-zinc-900 hover:bg-zinc-800'}"
		>
			{#if isSubmitting}
				<Loader2 class="h-4 w-4 animate-spin" />
				<span class="hidden sm:inline">Saving...</span>
				<span class="sm:hidden">Saving...</span>
			{:else if saveSuccess}
				<Check class="h-4 w-4" />
				<span class="hidden sm:inline">Saved</span>
				<span class="sm:hidden">Saved</span>
			{:else}
				<span class="hidden sm:inline">{published ? "Publish" : submitLabel}</span>
				<span class="sm:hidden">Save</span>
			{/if}
		</button>
	</div>
</header>
