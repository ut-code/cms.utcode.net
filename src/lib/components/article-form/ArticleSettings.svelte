<script lang="ts">
	import { ChevronDown, Eye, EyeOff, X } from "lucide-svelte";
	import { Combobox } from "bits-ui";
	import {
		extractDateFromArticleSlug,
		formatDateForSlug,
		generateSlug,
		validateArticleSlug,
	} from "$lib/shared/logic/slugs";
	import ImageUpload from "../image-upload.svelte";

	type Author = {
		id: string;
		slug: string;
		name: string;
		imageUrl: string | null;
	};

	let {
		show = $bindable(false),
		published = $bindable(false),
		slug = $bindable(""),
		authorId = $bindable<string | null>(null),
		excerpt = $bindable(""),
		coverUrl = $bindable(""),
		createRedirect = $bindable(false),
		initialSlug = "",
		authors = [],
		slugError = null,
		onDelete = null,
		onPublishToggle = null,
		viewCount = 0,
	}: {
		show?: boolean;
		published?: boolean;
		slug?: string;
		authorId?: string | null;
		excerpt?: string;
		coverUrl?: string;
		createRedirect?: boolean;
		initialSlug?: string;
		authors?: Author[];
		slugError?: string | null;
		onDelete?: (() => Promise<void>) | null;
		onPublishToggle?: ((newValue: boolean) => Promise<void>) | null;
		viewCount?: number;
	} = $props();

	// Real-time validation state
	let isSlugValid = $derived(slug.length === 0 || validateArticleSlug(slug));
	let validationError = $derived.by(() => {
		if (slug.length === 0) return null;
		if (!validateArticleSlug(slug)) {
			return "Slug must start with YYYY-MM-DD- (e.g., 2024-01-15-my-article)";
		}
		return null;
	});
	let displayError = $derived(slugError || validationError);

	// Extract date and title parts from slug
	let slugDate = $derived.by(() => {
		const extracted = extractDateFromArticleSlug(slug);
		return extracted ?? new Date();
	});

	let slugTitle = $derived.by(() => {
		if (slug.length === 0) return "";
		const match = slug.match(/^\d{4}-\d{2}-\d{2}-(.*)$/);
		return match ? match[1] : slug;
	});

	function updateSlugFromParts(date: Date, title: string) {
		const dateStr = formatDateForSlug(date);
		const cleanTitle = generateSlug(title);
		slug = cleanTitle ? `${dateStr}-${cleanTitle}` : dateStr;
	}

	function handleDateChange(e: Event) {
		const input = e.target as HTMLInputElement;
		const newDate = new Date(input.value);
		if (!Number.isNaN(newDate.getTime())) {
			updateSlugFromParts(newDate, slugTitle ?? "");
		}
	}

	function handleTitlePartChange(e: Event) {
		const input = e.target as HTMLInputElement;
		const titleValue = input.value.trim();
		if (titleValue === "") {
			slug = "";
		} else {
			updateSlugFromParts(slugDate, titleValue);
		}
	}

	// Author combobox state
	type AuthorItem = { value: string; label: string; slug: string };
	let authorItems: AuthorItem[] = $derived(
		authors.map((a) => ({ value: a.id, label: a.name, slug: a.slug })),
	);
	let searchValue = $state("");
	let isAuthorSelectOpen = $state(false);

	// Convert authorId (string | null) to comboboxValue (string | undefined) for bits-ui
	function getComboboxValue(): string | undefined {
		return authorId ?? undefined;
	}

	function setComboboxValue(value: string | undefined) {
		authorId = value ?? null;
	}

	// Filter authors by name or slug
	let filteredAuthors = $derived.by(() => {
		if (!searchValue) return authorItems;
		const query = searchValue.toLowerCase();
		return authorItems.filter(
			(item) => item.label.toLowerCase().includes(query) || item.slug.toLowerCase().includes(query),
		);
	});

	// Get selected author label for display
	let selectedAuthorLabel = $derived(authorItems.find((a) => a.value === authorId)?.label ?? "");

	function handleAuthorOpenChange(open: boolean) {
		isAuthorSelectOpen = open;
		if (!open) searchValue = "";
	}

	async function handlePublishButtonClick(newValue: boolean) {
		if (onPublishToggle) {
			await onPublishToggle(newValue);
		} else {
			published = newValue;
		}
	}
</script>

{#if show}
	<aside
		class="fixed inset-0 z-30 overflow-y-auto bg-zinc-50 lg:static lg:w-80 lg:shrink-0 lg:border-l lg:border-zinc-200 lg:bg-zinc-50/50 xl:w-96"
	>
		<div
			class="sticky top-0 flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-4 py-3 backdrop-blur-sm lg:bg-zinc-50/80"
		>
			<h2 class="font-semibold text-zinc-900">Settings</h2>
			<button
				type="button"
				onclick={() => (show = false)}
				class="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-primary/5 hover:text-primary"
			>
				<X class="h-4 w-4" />
			</button>
		</div>

		<div class="space-y-6 p-4">
			<!-- Visibility -->
			<div class="space-y-3">
				<p class="text-sm font-medium text-zinc-700">Visibility</p>
				<div class="grid grid-cols-2 gap-2">
					<button
						type="button"
						onclick={() => handlePublishButtonClick(false)}
						class="rounded-lg border-2 p-3 text-left transition-all {!published
							? 'border-zinc-900 bg-white'
							: 'border-zinc-200 bg-white hover:border-primary/30'}"
					>
						<EyeOff class="mb-1 h-4 w-4 {!published ? 'text-zinc-900' : 'text-zinc-400'}" />
						<span class="block text-sm font-medium {!published ? 'text-zinc-900' : 'text-zinc-600'}"
							>Draft</span
						>
					</button>
					<button
						type="button"
						onclick={() => handlePublishButtonClick(true)}
						class="rounded-lg border-2 p-3 text-left transition-all {published
							? 'border-emerald-500 bg-emerald-50'
							: 'border-zinc-200 bg-white hover:border-primary/30'}"
					>
						<Eye class="mb-1 h-4 w-4 {published ? 'text-emerald-600' : 'text-zinc-400'}" />
						<span
							class="block text-sm font-medium {published ? 'text-emerald-700' : 'text-zinc-600'}"
							>Public</span
						>
					</button>
				</div>
			</div>

			<!-- URL Path -->
			<div class="space-y-2">
				<p class="text-sm font-medium text-zinc-700">URL path</p>

				<!-- Preview (thin label) -->
				<p
					class="break-all font-mono text-xs"
					class:text-red-500={displayError}
					class:text-emerald-600={isSlugValid && slug.length > 0}
					class:text-zinc-500={!displayError && !isSlugValid}
				>
					/articles/{slug || "..."}
				</p>

				<!-- Date + Title inputs grouped -->
				<div class="flex gap-2">
					<input
						type="date"
						id="slug-date"
						value={formatDateForSlug(slugDate)}
						oninput={handleDateChange}
						class="w-28 shrink-0 rounded-lg border bg-white px-2 py-1.5 font-mono text-xs text-zinc-900 focus:ring-0 focus:outline-none"
						class:border-zinc-200={!displayError && !isSlugValid}
						class:border-emerald-500={isSlugValid && slug.length > 0}
						class:border-red-300={displayError}
						class:focus:border-zinc-400={!displayError && !isSlugValid}
						class:focus:border-emerald-600={isSlugValid && slug.length > 0}
						class:focus:border-red-400={displayError}
					/>
					<input
						type="text"
						id="slug-title"
						value={slugTitle}
						oninput={handleTitlePartChange}
						class="min-w-0 flex-1 rounded-lg border bg-white px-2 py-1.5 font-mono text-xs text-zinc-900 focus:ring-0 focus:outline-none"
						class:border-zinc-200={!displayError && !isSlugValid}
						class:border-emerald-500={isSlugValid && slug.length > 0}
						class:border-red-300={displayError}
						class:focus:border-zinc-400={!displayError && !isSlugValid}
						class:focus:border-emerald-600={isSlugValid && slug.length > 0}
						class:focus:border-red-400={displayError}
						placeholder="title-slug"
					/>
				</div>

				{#if displayError}
					<p class="text-xs text-red-500">{displayError}</p>
				{/if}
				{#if isSlugValid && slug.length > 0 && !displayError}
					<p class="text-xs text-emerald-600">Valid slug format</p>
				{/if}

				<!-- Redirect checkbox (only show when editing and slug has changed) -->
				{#if initialSlug && slug !== initialSlug}
					<label
						class="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 p-3"
					>
						<input
							type="checkbox"
							bind:checked={createRedirect}
							class="mt-0.5 h-4 w-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
						/>
						<div class="flex-1">
							<span class="block text-sm font-medium text-amber-900"
								>Leave redirect from old URL</span
							>
							<span class="mt-0.5 block text-xs text-amber-700">
								Old links to <span class="font-mono">/articles/{initialSlug}</span> will redirect to
								the new URL
							</span>
						</div>
					</label>
				{/if}
			</div>

			<!-- Author (searchable) -->
			<div class="space-y-2">
				<p class="text-sm font-medium text-zinc-700">Author</p>
				<Combobox.Root
					type="single"
					bind:value={getComboboxValue, setComboboxValue}
					bind:open={isAuthorSelectOpen}
					onOpenChange={handleAuthorOpenChange}
					allowDeselect={true}
				>
					<div class="relative">
						<Combobox.Input
							oninput={(e) => (searchValue = e.currentTarget.value)}
							placeholder={selectedAuthorLabel || "Search by name or slug..."}
							class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 pr-8 text-sm text-zinc-900 placeholder-zinc-400 transition-colors hover:border-zinc-300 focus:border-zinc-400 focus:ring-0 focus:outline-none"
						/>
						<Combobox.Trigger
							class="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 transition-transform {isAuthorSelectOpen
								? 'rotate-180'
								: ''}"
						>
							<ChevronDown class="h-4 w-4" />
						</Combobox.Trigger>
					</div>
					<Combobox.Content
						class="z-50 mt-1 max-h-60 overflow-auto rounded-lg border border-zinc-200 bg-white shadow-lg"
						sideOffset={4}
					>
						<Combobox.Viewport class="p-1">
							{#each filteredAuthors as author (author.value)}
								<Combobox.Item
									value={author.value}
									label={author.label}
									class="cursor-pointer rounded-md px-3 py-2 text-sm text-zinc-900 transition-colors hover:bg-zinc-100 data-[highlighted]:bg-zinc-100 data-[selected]:bg-primary/5 data-[selected]:font-medium"
								>
									<div class="flex flex-col">
										<span>{author.label}</span>
										<span class="text-xs text-zinc-500">@{author.slug}</span>
									</div>
								</Combobox.Item>
							{:else}
								<div class="px-3 py-2 text-sm text-zinc-500">No results found</div>
							{/each}
						</Combobox.Viewport>
					</Combobox.Content>
				</Combobox.Root>
			</div>

			<!-- Excerpt -->
			<div class="space-y-2">
				<label for="excerpt" class="text-sm font-medium text-zinc-700">
					Excerpt
					<span class="font-normal text-zinc-500">(for cards)</span>
				</label>
				<textarea
					id="excerpt"
					bind:value={excerpt}
					rows={3}
					class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-400 focus:ring-0 focus:outline-none"
					placeholder="Brief summary..."
				></textarea>
			</div>

			<!-- Cover Image -->
			<div class="space-y-2">
				<ImageUpload bind:value={coverUrl} folder="articles" label="Cover image" />
			</div>

			<!-- View Count (Analytics) -->
			<div class="space-y-2">
				<p class="text-sm font-medium text-zinc-700">Analytics</p>
				<div class="rounded-lg border border-zinc-200 bg-white px-3 py-2">
					<div class="flex items-center justify-between">
						<span class="text-sm text-zinc-600">View count</span>
						<span class="font-mono text-sm font-medium text-zinc-900"
							>{viewCount.toLocaleString()}</span
						>
					</div>
				</div>
			</div>

			<!-- Danger Zone -->
			{#if onDelete}
				<div class="border-t border-zinc-200 pt-6">
					<p class="text-sm font-medium text-red-600">Danger zone</p>
					<p class="mt-1 text-xs text-zinc-500">Deleting is permanent. Links will break.</p>
					<button
						type="button"
						onclick={onDelete}
						class="mt-3 w-full rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
					>
						Delete article
					</button>
				</div>
			{/if}
		</div>
	</aside>
{/if}
