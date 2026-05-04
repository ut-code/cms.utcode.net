<script lang="ts">
	import {
		ArrowLeft,
		Check,
		ChevronDown,
		ChevronsUpDown,
		ExternalLink,
		Eye,
		EyeOff,
		Loader2,
		MoreHorizontal,
		Search,
		Trash2,
		UserCircle2,
	} from "lucide-svelte";
	import { goto } from "$app/navigation";
	import { Combobox, DropdownMenu } from "bits-ui";

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
	let authorSearch = $state("");

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

	// Combobox uses string values; we map "" <-> null for "No author".
	const authorComboValue = $derived(authorId ?? "");
	function handleAuthorChange(value: string) {
		authorId = value === "" ? null : value;
	}

	const filteredAuthors = $derived(
		authorSearch.trim() === ""
			? authors
			: authors.filter((a) => {
					const q = authorSearch.toLowerCase();
					return a.name.toLowerCase().includes(q) || a.slug.toLowerCase().includes(q);
				}),
	);
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

		<!-- Visibility Toggle (looks like a switch button: bordered, with chevron + clear hover affordance) -->
		<button
			type="button"
			onclick={() => (published = !published)}
			aria-pressed={published}
			title={published ? "Click to unpublish" : "Click to publish"}
			class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium shadow-sm transition-all hover:shadow-md active:scale-[0.98] sm:px-3 sm:py-1.5 {published
				? 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:border-emerald-400 hover:bg-emerald-100'
				: 'border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50'}"
		>
			{#if published}
				<Eye class="h-3.5 w-3.5" />
				<span>Public</span>
			{:else}
				<EyeOff class="h-3.5 w-3.5" />
				<span>Draft</span>
			{/if}
			<ChevronsUpDown class="h-3 w-3 opacity-60" />
		</button>

		<!-- Author Combobox (searchable) -->
		<Combobox.Root
			type="single"
			value={authorComboValue}
			onValueChange={handleAuthorChange}
			bind:open={authorMenuOpen}
			onOpenChangeComplete={(o) => {
				if (!o) authorSearch = "";
			}}
		>
			<Combobox.Trigger
				class="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-sm text-zinc-700 shadow-sm transition-colors hover:border-primary/30 hover:bg-primary/5 sm:px-3"
				aria-label="Select author"
			>
				<UserCircle2 class="h-3.5 w-3.5 text-zinc-400" />
				{#if selectedAuthor}
					<span class="max-w-24 truncate sm:max-w-32">{selectedAuthor.name}</span>
				{:else}
					<span class="text-zinc-400">No author</span>
				{/if}
				<ChevronDown class="h-3 w-3 {authorMenuOpen ? 'rotate-180' : ''} transition-transform" />
			</Combobox.Trigger>
			<Combobox.Portal>
				<Combobox.Content
					class="z-50 mt-1 w-64 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-lg"
					sideOffset={4}
				>
					<div class="relative border-b border-zinc-100">
						<Search class="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
						<Combobox.Input
							oninput={(e) => (authorSearch = e.currentTarget.value)}
							class="w-full bg-transparent py-2 pr-3 pl-8 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
							placeholder="Search authors..."
							aria-label="Search authors"
						/>
					</div>
					<Combobox.Viewport class="max-h-60 overflow-auto p-1">
						{#if authorSearch.trim() === ""}
							<Combobox.Item
								value=""
								label="No author"
								class="data-highlighted:bg-zinc-100 flex cursor-pointer items-center rounded-md px-3 py-2 text-sm text-zinc-500 outline-none {authorId ===
								null
									? 'bg-primary/5 font-medium'
									: ''}"
							>
								No author
							</Combobox.Item>
						{/if}
						{#each filteredAuthors as author (author.id)}
							<Combobox.Item
								value={author.id}
								label={author.name}
								class="data-highlighted:bg-zinc-100 flex cursor-pointer items-center rounded-md px-3 py-2 text-sm text-zinc-900 outline-none {author.id ===
								authorId
									? 'bg-primary/5 font-medium'
									: ''}"
							>
								<div class="flex flex-col">
									<span>{author.name}</span>
									<span class="text-xs text-zinc-500">@{author.slug}</span>
								</div>
							</Combobox.Item>
						{:else}
							<div class="px-3 py-2 text-sm text-zinc-400">No matches</div>
						{/each}
					</Combobox.Viewport>
				</Combobox.Content>
			</Combobox.Portal>
		</Combobox.Root>
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
