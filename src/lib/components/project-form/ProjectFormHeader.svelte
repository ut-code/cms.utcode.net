<script lang="ts">
	import { ArrowLeft, Loader2, Settings } from "lucide-svelte";
	import { goto } from "$app/navigation";
	import { PROJECT_CATEGORIES, type ProjectCategory } from "$lib/shared/models/schema";

	let {
		category,
		showSettings = $bindable(),
		isSubmitting,
		submitLabel,
		onToggleSettings,
	}: {
		category: ProjectCategory;
		showSettings?: boolean;
		isSubmitting: boolean;
		submitLabel: string;
		onToggleSettings: () => void;
	} = $props();
</script>

<header
	class="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 bg-white px-3 py-2 sm:px-4 sm:py-3"
>
	<div class="flex items-center gap-2 sm:gap-4">
		<button
			type="button"
			onclick={() => goto("/admin/projects")}
			class="flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900"
		>
			<ArrowLeft class="h-4 w-4" />
			<span class="hidden sm:inline">Projects</span>
		</button>

		<span class="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 sm:px-2.5 sm:py-1">
			{PROJECT_CATEGORIES[category]}
		</span>
	</div>

	<div class="flex items-center gap-1 sm:gap-2">
		<button
			type="button"
			onclick={onToggleSettings}
			class="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm transition-colors sm:px-3 sm:py-2 {showSettings
				? 'bg-zinc-900 text-white'
				: 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'}"
		>
			<Settings class="h-4 w-4" />
			<span class="hidden sm:inline">Settings</span>
		</button>

		<button
			type="submit"
			disabled={isSubmitting}
			class="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-semibold text-white transition-all hover:bg-zinc-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:px-4 sm:py-2"
		>
			{#if isSubmitting}
				<Loader2 class="h-4 w-4 animate-spin" />
			{/if}
			<span class="hidden sm:inline">{submitLabel}</span>
			<span class="sm:hidden">Save</span>
		</button>
	</div>
</header>
