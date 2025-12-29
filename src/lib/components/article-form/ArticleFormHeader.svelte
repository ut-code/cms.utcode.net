<script lang="ts">
	import {
		ArrowLeft,
		Check,
		ChevronDown,
		ExternalLink,
		Eye,
		EyeOff,
		Loader2,
		MoreHorizontal,
		Trash2,
	} from "lucide-svelte";
	import { goto } from "$app/navigation";
	import { DropdownMenu } from "bits-ui";

	type Author = {
		id: string;
		slug: string;
		name: string;
		imageUrl: string | null;
	};

	let {
		published = $bindable(false),
		authorId = $bindable<string | null>(null),
		authors = [],
		isSubmitting = false,
		saveSuccess = $bindable(false),
		submitLabel = "Save",
		articleId = null,
		onPreview = null,
		onDelete = null,
	}: {
		published?: boolean;
		authorId?: string | null;
		authors?: Author[];
		isSubmitting?: boolean;
		saveSuccess?: boolean;
		submitLabel?: string;
		articleId?: string | null;
		onPreview?: (() => void) | null;
		onDelete?: (() => Promise<void>) | null;
	} = $props();

	let successTimeout: ReturnType<typeof setTimeout> | null = null;
	let authorMenuOpen = $state(false);
	let moreMenuOpen = $state(false);

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

	const selectedAuthor = $derived(authors.find((a) => a.id === authorId));
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

		<!-- Visibility Toggle -->
		<button
			type="button"
			onclick={() => (published = !published)}
			class="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition-colors sm:px-2.5 sm:py-1 {published
				? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
				: 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}"
		>
			{#if published}
				<Eye class="h-3 w-3" />
				<span class="hidden sm:inline">Public</span>
			{:else}
				<EyeOff class="h-3 w-3" />
				<span class="hidden sm:inline">Draft</span>
			{/if}
		</button>

		<!-- Author Dropdown -->
		<DropdownMenu.Root bind:open={authorMenuOpen}>
			<DropdownMenu.Trigger
				class="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 sm:px-3"
			>
				{#if selectedAuthor}
					<span class="max-w-24 truncate sm:max-w-32">{selectedAuthor.name}</span>
				{:else}
					<span class="text-zinc-400">No author</span>
				{/if}
				<ChevronDown class="h-3 w-3 {authorMenuOpen ? 'rotate-180' : ''} transition-transform" />
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="z-50 mt-1 max-h-60 min-w-40 overflow-auto rounded-lg border border-zinc-200 bg-white p-1 shadow-lg"
				sideOffset={4}
			>
				<DropdownMenu.Item
					class="cursor-pointer rounded-md px-3 py-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-100"
					onSelect={() => (authorId = null)}
				>
					No author
				</DropdownMenu.Item>
				{#each authors as author (author.id)}
					<DropdownMenu.Item
						class="cursor-pointer rounded-md px-3 py-2 text-sm text-zinc-900 transition-colors hover:bg-zinc-100 {author.id ===
						authorId
							? 'bg-primary/5 font-medium'
							: ''}"
						onSelect={() => (authorId = author.id)}
					>
						<div class="flex flex-col">
							<span>{author.name}</span>
							<span class="text-xs text-zinc-500">@{author.slug}</span>
						</div>
					</DropdownMenu.Item>
				{/each}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
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

		<!-- More Menu (Delete) -->
		{#if onDelete}
			<DropdownMenu.Root bind:open={moreMenuOpen}>
				<DropdownMenu.Trigger
					class="flex items-center rounded-lg p-1.5 text-zinc-600 transition-colors hover:bg-zinc-100 sm:p-2"
					aria-label="More options"
				>
					<MoreHorizontal class="h-4 w-4" />
				</DropdownMenu.Trigger>
				<DropdownMenu.Content
					class="z-50 mt-1 min-w-36 rounded-lg border border-zinc-200 bg-white p-1 shadow-lg"
					sideOffset={4}
					align="end"
				>
					<DropdownMenu.Item
						class="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
						onSelect={() => onDelete?.()}
					>
						<Trash2 class="h-4 w-4" />
						Delete article
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		{/if}

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
				<span class="sm:hidden">...</span>
			{:else if saveSuccess}
				<Check class="h-4 w-4" />
				<span class="hidden sm:inline">Saved</span>
				<span class="sm:hidden">✓</span>
			{:else}
				<span class="hidden sm:inline">{published ? "Publish" : submitLabel}</span>
				<span class="sm:hidden">Save</span>
			{/if}
		</button>
	</div>
</header>
