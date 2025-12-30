<script lang="ts">
	import Markdown from "../Markdown.svelte";
	import ImageUpload from "../image-upload.svelte";
	import {
		extractDateFromArticleSlug,
		formatDateForSlug,
		generateSlug,
		validateArticleSlug,
	} from "$lib/shared/logic/slugs";

	let {
		title = $bindable(""),
		content = $bindable(""),
		slug = $bindable(""),
		coverUrl = $bindable(""),
		initialSlug = "",
		createRedirect = $bindable(false),
		titleError = null,
		contentError = null,
		slugError = null,
		onTitleChange,
	}: {
		title?: string;
		content?: string;
		slug?: string;
		coverUrl?: string;
		initialSlug?: string;
		createRedirect?: boolean;
		titleError?: string | null;
		contentError?: string | null;
		slugError?: string | null;
		onTitleChange?: (title: string) => void;
	} = $props();

	let showPreview = $state(false);

	// Real-time slug validation
	let isSlugValid = $derived(slug.length === 0 || validateArticleSlug(slug));
	let validationError = $derived.by(() => {
		if (slug.length === 0) return null;
		if (!validateArticleSlug(slug)) {
			return "Slug must start with YYYY-MM-DD-";
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

	function updateSlugFromParts(date: Date, titlePart: string) {
		const dateStr = formatDateForSlug(date);
		const cleanTitle = generateSlug(titlePart);
		slug = cleanTitle ? `${dateStr}-${cleanTitle}` : dateStr;
	}

	function handleDateChange(e: Event) {
		const input = e.target as HTMLInputElement;
		const newDate = new Date(input.value);
		if (!Number.isNaN(newDate.getTime())) {
			updateSlugFromParts(newDate, slugTitle ?? "");
		}
	}

	function handleSlugTitleChange(e: Event) {
		const input = e.target as HTMLInputElement;
		const titleValue = input.value.trim();
		if (titleValue === "") {
			slug = "";
		} else {
			updateSlugFromParts(slugDate, titleValue);
		}
	}

	function handleTitleInput() {
		if (onTitleChange) {
			onTitleChange(title);
		}
	}
</script>

<main class="flex-1 bg-white">
	<div class="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-8">
		<!-- Cover Image -->
		<div class="mb-6">
			<ImageUpload bind:value={coverUrl} folder="articles" label="Cover image" aspect="5/3" />
		</div>

		<!-- Slug Input -->
		<div class="mb-6 space-y-2">
			<p
				class="break-all font-mono text-sm"
				class:text-red-500={displayError}
				class:text-emerald-600={isSlugValid && slug.length > 0}
				class:text-zinc-500={!displayError && !isSlugValid}
			>
				/articles/{slug || "..."}
			</p>

			<div class="flex gap-2">
				<input
					type="date"
					value={formatDateForSlug(slugDate)}
					oninput={handleDateChange}
					class="w-32 shrink-0 rounded-lg border bg-white px-2 py-1.5 font-mono text-sm text-zinc-900 focus:ring-0 focus:outline-none"
					class:border-zinc-200={!displayError && !isSlugValid}
					class:border-emerald-500={isSlugValid && slug.length > 0}
					class:border-red-300={displayError}
				/>
				<input
					type="text"
					value={slugTitle}
					oninput={handleSlugTitleChange}
					class="min-w-0 flex-1 rounded-lg border bg-white px-2 py-1.5 font-mono text-sm text-zinc-900 focus:ring-0 focus:outline-none"
					class:border-zinc-200={!displayError && !isSlugValid}
					class:border-emerald-500={isSlugValid && slug.length > 0}
					class:border-red-300={displayError}
					placeholder="title-slug"
				/>
			</div>

			{#if displayError}
				<p class="text-xs text-red-500">{displayError}</p>
			{/if}

			<!-- Redirect checkbox (only show when editing and slug has changed) -->
			{#if initialSlug && slug !== initialSlug}
				<label class="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
					<input
						type="checkbox"
						bind:checked={createRedirect}
						class="mt-0.5 h-4 w-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
					/>
					<div class="flex-1">
						<span class="block text-sm font-medium text-amber-900">
							Leave redirect from old URL
						</span>
						<span class="mt-0.5 block text-xs text-amber-700">
							Old links to <span class="font-mono">/articles/{initialSlug}</span> will redirect
						</span>
					</div>
				</label>
			{/if}
		</div>

		<!-- Title Input -->
		<input
			type="text"
			id="title"
			bind:value={title}
			oninput={handleTitleInput}
			class="w-full border-none bg-transparent text-3xl font-bold text-zinc-900 placeholder:text-zinc-300 focus:ring-0 focus:outline-none"
			class:text-red-600={titleError}
			placeholder="Title"
		/>
		{#if titleError}
			<p class="mt-1 text-sm text-red-500">{titleError}</p>
		{/if}

		<!-- Content Toggle -->
		<div class="mt-6 flex items-center gap-2 border-b border-zinc-100 pb-4">
			<button
				type="button"
				onclick={() => (showPreview = false)}
				class="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors {!showPreview
					? 'bg-zinc-100 text-zinc-900'
					: 'text-zinc-500 hover:text-zinc-700'}"
			>
				Write
			</button>
			<button
				type="button"
				onclick={() => (showPreview = true)}
				class="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors {showPreview
					? 'bg-zinc-100 text-zinc-900'
					: 'text-zinc-500 hover:text-zinc-700'}"
			>
				Preview
			</button>
			<span class="ml-auto text-xs text-zinc-500">Markdown supported</span>
		</div>

		<!-- Content Area -->
		<div class="mt-4 flex-1">
			{#if showPreview}
				<div class="prose max-w-none prose-zinc">
					{#if content.trim()}
						<Markdown {content} />
					{:else}
						<p class="text-zinc-500">Nothing to preview</p>
					{/if}
				</div>
			{:else}
				<textarea
					id="content"
					bind:value={content}
					class="min-h-[60vh] w-full resize-none border-none bg-transparent font-[JetBrains_Mono,monospace] text-base leading-relaxed text-zinc-900 placeholder:text-zinc-300 focus:ring-0 focus:outline-none"
					class:text-red-600={contentError}
					placeholder="Write your content here..."
				></textarea>
				{#if contentError}
					<p class="text-sm text-red-500">{contentError}</p>
				{/if}
			{/if}
		</div>
	</div>
</main>
