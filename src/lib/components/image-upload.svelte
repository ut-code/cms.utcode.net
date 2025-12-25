<script lang="ts">
	import { AlertCircle, Loader2, RotateCw, Upload, X } from "lucide-svelte";
	import { upload } from "$lib/data/private/storage.remote";
	import {
		type AllowedFolder,
		isAcceptedImageType,
		isAllowedFolder,
	} from "$lib/shared/logic/image";
	import { arrayBufferToBase64, compressImage } from "$lib/shared/logic/image-processing";

	let {
		value = $bindable(""),
		folder = "images" as AllowedFolder,
		label = "Image",
		aspect = "5/3",
	}: {
		value?: string;
		folder?: AllowedFolder;
		label?: string;
		aspect?: "5/3" | "1/1" | "16/9" | "4/3";
	} = $props();

	// States
	let previewUrl = $state<string | null>(null);
	let isUploading = $state(false);
	let dragOver = $state(false);
	let pasteFlash = $state(false);
	let error = $state<string | null>(null);
	let lastFailedFile = $state<File | null>(null);

	// Show preview or final value
	const displayUrl = $derived(previewUrl ?? value);

	async function handleFile(file: File, fromPaste = false) {
		error = null;

		// Validate file type
		if (!isAcceptedImageType(file.type)) {
			error = "Unsupported image format";
			return;
		}

		// Validate folder
		if (!isAllowedFolder(folder)) {
			error = "Invalid upload folder";
			return;
		}

		// Show paste feedback
		if (fromPaste) {
			pasteFlash = true;
			setTimeout(() => (pasteFlash = false), 600);
		}

		// Compress image before upload
		const processedFile = await compressImage(file);

		// Immediate preview
		previewUrl = URL.createObjectURL(processedFile);
		isUploading = true;

		try {
			const arrayBuffer = await processedFile.arrayBuffer();
			const base64 = arrayBufferToBase64(arrayBuffer);
			// Use the validated original type - server will re-compress to WebP anyway
			const uploadType = isAcceptedImageType(processedFile.type) ? processedFile.type : file.type;
			const result = await upload({
				data: base64,
				type: uploadType,
				name: processedFile.name,
				folder,
			});
			value = result.url;
			lastFailedFile = null; // Clear on success
		} catch {
			error = "Upload failed. Please try again.";
			previewUrl = null;
			lastFailedFile = processedFile; // Store for retry
		} finally {
			isUploading = false;
			// Clean up object URL after upload completes
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
				previewUrl = null;
			}
		}
	}

	function handleInput(e: Event) {
		if (!(e.target instanceof HTMLInputElement)) return;
		const file = e.target.files?.[0];
		if (file) handleFile(file).catch(console.error);
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragOver = false;
		const file = e.dataTransfer?.files[0];
		if (file) handleFile(file).catch(console.error);
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		dragOver = true;
	}

	function handleDragLeave() {
		dragOver = false;
	}

	function handleGlobalPaste(e: ClipboardEvent) {
		// Skip if user is typing in an input/textarea
		if (!(e.target instanceof HTMLElement)) return;
		if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

		const items = e.clipboardData?.items;
		if (!items) return;
		for (const item of items) {
			if (item.type.startsWith("image/")) {
				const file = item.getAsFile();
				if (file) {
					e.preventDefault();
					handleFile(file, true).catch(console.error);
					return;
				}
			}
		}
	}

	function clearImage() {
		value = "";
		previewUrl = null;
		error = null;
		lastFailedFile = null;
	}

	function retryUpload() {
		if (!lastFailedFile) return;
		const file = lastFailedFile;
		lastFailedFile = null;
		handleFile(file).catch(console.error);
	}
</script>

<svelte:window onpaste={handleGlobalPaste} />

<div class="space-y-1.5">
	<span class="block text-sm font-medium text-zinc-700">{label}</span>

	{#if displayUrl}
		<!-- Image preview/uploaded state -->
		<div
			class="relative max-w-xs overflow-hidden rounded-lg border transition-all duration-200
        {isUploading ? 'border-primary' : 'border-zinc-200'}"
		>
			<img src={displayUrl} alt="Upload preview" class="w-full object-cover" style="aspect-ratio: {aspect}" />

			{#if isUploading}
				<!-- Upload progress overlay -->
				<div class="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
					<div class="mb-2 flex items-center gap-2">
						<Loader2 class="h-5 w-5 animate-spin text-white" />
						<span class="text-sm font-medium text-white">Uploading...</span>
					</div>
					<!-- Progress bar -->
					<div class="h-1 w-32 overflow-hidden rounded-full bg-white/30">
						<div class="h-full animate-pulse rounded-full bg-primary" style="width: 60%"></div>
					</div>
				</div>
			{:else}
				<!-- Hover controls -->
				<div
					class="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity hover:opacity-100"
				>
					<label
						class="cursor-pointer rounded-lg bg-white px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-primary/5"
					>
						Change
						<input type="file" accept="image/*" class="hidden" oninput={handleInput} />
					</label>
					<button
						type="button"
						onclick={clearImage}
						class="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600"
					>
						Remove
					</button>
				</div>
			{/if}
		</div>
	{:else}
		<!-- Empty/drop state -->
		<label
			class="relative flex max-w-xs cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed transition-all duration-200
        {dragOver
				? 'scale-[1.02] border-primary bg-primary/10'
				: pasteFlash
					? 'border-primary bg-primary/20'
					: 'border-zinc-200 hover:border-primary/30 hover:bg-primary/5'}"
			style="aspect-ratio: {aspect}"
			ondrop={handleDrop}
			ondragover={handleDragOver}
			ondragleave={handleDragLeave}
		>
			{#if isUploading}
				<Loader2 class="mb-2 h-8 w-8 animate-spin text-primary" />
				<span class="text-sm text-zinc-500">Uploading...</span>
			{:else}
				<Upload
					class="mb-2 h-8 w-8 transition-transform duration-200
            {dragOver ? 'scale-110 text-primary' : 'text-zinc-400'}"
				/>
				<span class="text-sm text-zinc-600">
					{#if dragOver}
						Drop to upload
					{:else if pasteFlash}
						Pasting...
					{:else}
						Drop, click, or paste (Ctrl+V)
					{/if}
				</span>
				<span class="mt-1 text-xs text-zinc-500">Any size (auto-compressed to fit limit)</span>
			{/if}
			<input
				type="file"
				accept="image/*"
				class="hidden"
				oninput={handleInput}
				disabled={isUploading}
			/>
		</label>
	{/if}

	<!-- Error message -->
	{#if error}
		<div
			class="animate-in fade-in slide-in-from-top-1 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
		>
			<AlertCircle class="h-4 w-4 shrink-0" />
			<span>{error}</span>
			{#if lastFailedFile}
				<button
					type="button"
					onclick={retryUpload}
					class="ml-auto flex items-center gap-1 rounded px-2 py-1 font-medium text-red-600 hover:bg-primary/5"
					aria-label="Retry upload"
				>
					<RotateCw class="h-3.5 w-3.5" />
					Retry
				</button>
			{/if}
			<button
				type="button"
				onclick={() => (error = null)}
				class="text-red-400 hover:text-red-600"
				aria-label="Dismiss error"
			>
				<X class="h-4 w-4" />
			</button>
		</div>
	{/if}
</div>
