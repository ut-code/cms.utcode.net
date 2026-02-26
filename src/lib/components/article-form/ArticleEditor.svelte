<script lang="ts">
	import { ImagePlus, Loader2 } from "lucide-svelte";
	import Markdown from "../Markdown.svelte";
	import ImageUpload from "../image-upload.svelte";
	import {
		extractDateFromArticleSlug,
		formatDateForSlug,
		generateSlug,
		validateArticleSlug,
	} from "$lib/shared/logic/slugs";
	import { upload } from "$lib/data/private/storage.remote";
	import { isAcceptedImageType, inferImageType } from "$lib/shared/logic/image";
	import { arrayBufferToBase64, compressImage } from "$lib/shared/logic/image-processing";

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
	let textareaEl = $state<HTMLTextAreaElement | null>(null);
	let imageUploading = $state(false);
	let imageError = $state<string | null>(null);

	/** Upload an image and insert markdown at the cursor position in the textarea */
	async function uploadAndInsert(file: File) {
		const resolvedType = isAcceptedImageType(file.type) ? file.type : inferImageType(file.name);
		if (!resolvedType) {
			imageError = "Unsupported image format";
			return;
		}

		imageError = null;
		imageUploading = true;

		// Remember cursor position before async work
		const cursorPos = textareaEl?.selectionStart ?? content.length;

		// UUID-tagged placeholder so concurrent uploads never collide
		const id = crypto.randomUUID();
		const placeholder = `![Uploading...](upload:${id})`;
		content = content.slice(0, cursorPos) + placeholder + content.slice(cursorPos);

		try {
			const processedFile = await compressImage(file);
			const arrayBuffer = await processedFile.arrayBuffer();
			const base64 = arrayBufferToBase64(arrayBuffer);
			const uploadType = isAcceptedImageType(processedFile.type) ? processedFile.type : resolvedType;
			const result = await upload({
				data: base64,
				type: uploadType,
				name: processedFile.name,
				folder: "articles",
			});

			// Replace this specific placeholder with actual markdown image
			const markdown = `![](${result.url})`;
			content = content.replace(placeholder, markdown);

			// Move cursor after the inserted image
			const newPos = content.indexOf(markdown, cursorPos) + markdown.length;
			requestAnimationFrame(() => {
				if (textareaEl) {
					textareaEl.focus();
					textareaEl.selectionStart = newPos;
					textareaEl.selectionEnd = newPos;
				}
			});
		} catch {
			// Remove this specific placeholder on failure
			content = content.replace(placeholder, "");
			imageError = "Image upload failed. Please try again.";
		} finally {
			imageUploading = false;
		}
	}

	function handleContentPaste(e: ClipboardEvent) {
		const items = e.clipboardData?.items;
		if (!items) return;
		for (const item of items) {
			if (item.type.startsWith("image/")) {
				const file = item.getAsFile();
				if (file) {
					e.preventDefault();
					uploadAndInsert(file).catch(console.error);
					return;
				}
			}
		}
	}

	let fileInputEl = $state<HTMLInputElement | null>(null);

	function handleAttachClick() {
		fileInputEl?.click();
	}

	function handleFileInput(e: Event) {
		if (!(e.target instanceof HTMLInputElement)) return;
		const file = e.target.files?.[0];
		if (file) uploadAndInsert(file).catch(console.error);
		// Reset so same file can be selected again
		e.target.value = "";
	}

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

			{#if !showPreview}
				<button
					type="button"
					onclick={handleAttachClick}
					disabled={imageUploading}
					class="ml-2 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-50"
					title="Attach image"
				>
					{#if imageUploading}
						<Loader2 class="h-4 w-4 animate-spin" />
					{:else}
						<ImagePlus class="h-4 w-4" />
					{/if}
					Attach image
				</button>
				<input
					bind:this={fileInputEl}
					type="file"
					accept="image/*"
					class="hidden"
					oninput={handleFileInput}
				/>
			{/if}

			<span class="ml-auto text-xs text-zinc-500">
				{#if imageUploading}
					Uploading image...
				{:else}
					Markdown supported
				{/if}
			</span>
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
					bind:this={textareaEl}
					bind:value={content}
					onpaste={handleContentPaste}
					class="min-h-[60vh] w-full resize-none border-none bg-transparent font-[JetBrains_Mono,monospace] text-base leading-relaxed text-zinc-900 placeholder:text-zinc-300 focus:ring-0 focus:outline-none"
					class:text-red-600={contentError}
					placeholder="Write your content here..."
				></textarea>
				{#if contentError}
					<p class="text-sm text-red-500">{contentError}</p>
				{/if}
				{#if imageError}
					<p class="text-sm text-red-500">{imageError}</p>
				{/if}
			{/if}
		</div>
	</div>
</main>
