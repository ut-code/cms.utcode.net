<script lang="ts">
	import { ArrowLeft, ExternalLink, Eye, EyeOff, Loader2, Settings } from "lucide-svelte";
	import { goto } from "$app/navigation";

	let {
		published = $bindable(false),
		showSettings = $bindable(false),
		isSubmitting = false,
		submitLabel = "Save",
		articleId = null,
		onPreview = null,
	}: {
		published?: boolean;
		showSettings?: boolean;
		isSubmitting?: boolean;
		submitLabel?: string;
		articleId?: string | null;
		onPreview?: (() => void) | null;
	} = $props();

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
				class="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 sm:px-3 sm:py-2"
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
				: 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'}"
		>
			<Settings class="h-4 w-4" />
			<span class="hidden sm:inline">Settings</span>
		</button>

		<!-- Save Button -->
		<button
			type="submit"
			disabled={isSubmitting}
			class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-white transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:px-4 sm:py-2 {published
				? 'bg-emerald-600 hover:bg-emerald-700'
				: 'bg-zinc-900 hover:bg-zinc-800'}"
		>
			{#if isSubmitting}
				<Loader2 class="h-4 w-4 animate-spin" />
			{/if}
			<span class="hidden sm:inline">{published ? "Publish" : submitLabel}</span>
			<span class="sm:hidden">Save</span>
		</button>
	</div>
</header>
