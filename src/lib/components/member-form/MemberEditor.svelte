<script lang="ts">
	import { Github, Globe, Twitter } from "lucide-svelte";
	import Markdown from "../Markdown.svelte";
	import ImageUpload from "../image-upload.svelte";
	import { generateSlug, validateSlug } from "$lib/shared/logic/slugs";

	let {
		name = $bindable(""),
		slug = $bindable(""),
		bio = $bindable(""),
		imageUrl = $bindable(""),
		githubUrl = $bindable(""),
		twitterUrl = $bindable(""),
		websiteUrl = $bindable(""),
		pageContent = $bindable(""),
		nameError = null,
		slugError = null,
		onNameChange,
	}: {
		name?: string;
		slug?: string;
		bio?: string;
		imageUrl?: string;
		githubUrl?: string;
		twitterUrl?: string;
		websiteUrl?: string;
		pageContent?: string;
		nameError?: string | null;
		slugError?: string | null;
		onNameChange?: () => void;
	} = $props();

	let showPageContentPreview = $state(false);

	// Real-time slug validation
	let isSlugValid = $derived(slug.length === 0 || validateSlug(slug));
	let validationError = $derived.by(() => {
		if (slug.length === 0) return null;
		if (!validateSlug(slug)) {
			return "Lowercase letters, numbers, and hyphens only";
		}
		return null;
	});
	let displayError = $derived(slugError || validationError);

	function handleNameInput() {
		if (onNameChange) {
			onNameChange();
		}
	}

	function handleSlugInput(e: Event) {
		const input = e.target as HTMLInputElement;
		slug = generateSlug(input.value);
	}
</script>

<main class="flex-1 bg-white">
	<div class="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-8">
		<!-- Profile Image -->
		<div class="mb-8 flex justify-center">
			<ImageUpload bind:value={imageUrl} folder="members" label="Profile image" aspect="1/1" />
		</div>

		<!-- Name Input -->
		<input
			type="text"
			id="name"
			bind:value={name}
			oninput={handleNameInput}
			class="w-full border-none bg-transparent text-center text-3xl font-bold text-zinc-900 placeholder:text-zinc-300 focus:ring-0 focus:outline-none"
			class:text-red-600={nameError}
			placeholder="Name"
		/>
		{#if nameError}
			<p class="mt-1 text-center text-sm text-red-500">{nameError}</p>
		{/if}

		<!-- Username/Slug Input -->
		<div class="mt-4 space-y-1">
			<p
				class="text-center font-mono text-sm"
				class:text-red-500={displayError}
				class:text-emerald-600={isSlugValid && slug.length > 0}
				class:text-zinc-500={!displayError && !isSlugValid}
			>
				/members/{slug || "..."}
			</p>
			<div class="mx-auto flex max-w-xs rounded-lg border border-zinc-200 bg-white">
				<span class="shrink-0 border-r border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-500">
					@
				</span>
				<input
					type="text"
					value={slug}
					oninput={handleSlugInput}
					class="w-full rounded-r-lg border-none bg-transparent px-3 py-2 font-mono text-sm text-zinc-900 focus:ring-0 focus:outline-none"
					class:text-red-600={displayError}
					placeholder="username"
				/>
			</div>
			{#if displayError}
				<p class="text-center text-xs text-red-500">{displayError}</p>
			{/if}
		</div>

		<!-- Bio -->
		<div class="mt-8">
			<label for="bio" class="mb-2 block text-sm font-medium text-zinc-700">Bio</label>
			<textarea
				id="bio"
				bind:value={bio}
				rows={6}
				class="w-full resize-none rounded-lg border border-zinc-200 bg-white px-4 py-3 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-0 focus:outline-none"
				placeholder="A short bio about this member..."
			></textarea>
		</div>

		<!-- Social Links -->
		<div class="mt-8">
			<p class="mb-3 text-sm font-medium text-zinc-700">Social Links</p>
			<div class="space-y-3">
				<div class="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2">
					<Github class="h-5 w-5 shrink-0 text-zinc-400" />
					<input
						type="url"
						bind:value={githubUrl}
						class="w-full border-none bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:ring-0 focus:outline-none"
						placeholder="https://github.com/username"
					/>
				</div>
				<div class="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2">
					<Twitter class="h-5 w-5 shrink-0 text-zinc-400" />
					<input
						type="url"
						bind:value={twitterUrl}
						class="w-full border-none bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:ring-0 focus:outline-none"
						placeholder="https://x.com/username"
					/>
				</div>
				<div class="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2">
					<Globe class="h-5 w-5 shrink-0 text-zinc-400" />
					<input
						type="url"
						bind:value={websiteUrl}
						class="w-full border-none bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:ring-0 focus:outline-none"
						placeholder="https://example.com"
					/>
				</div>
			</div>
		</div>

		<!-- Page Content -->
		<div class="mt-8 border-t border-zinc-200 pt-8">
			<div class="mb-4 flex items-center justify-between">
				<label for="pageContent" class="block text-sm font-medium text-zinc-700">
					自己紹介ページ
				</label>
				<div class="flex items-center gap-2">
					<button
						type="button"
						onclick={() => (showPageContentPreview = false)}
						class="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors {!showPageContentPreview
							? 'bg-zinc-100 text-zinc-900'
							: 'text-zinc-500 hover:text-zinc-700'}"
					>
						Write
					</button>
					<button
						type="button"
						onclick={() => (showPageContentPreview = true)}
						class="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors {showPageContentPreview
							? 'bg-zinc-100 text-zinc-900'
							: 'text-zinc-500 hover:text-zinc-700'}"
					>
						Preview
					</button>
				</div>
			</div>
			<p class="mb-3 text-xs text-zinc-500">
				Markdown supported - This will be displayed on your public profile page
			</p>
			{#if showPageContentPreview}
				<div class="min-h-[40vh] rounded-lg border border-zinc-200 bg-white px-4 py-3">
					{#if pageContent.trim()}
						<Markdown content={pageContent} />
					{:else}
						<p class="text-zinc-500">Nothing to preview</p>
					{/if}
				</div>
			{:else}
				<textarea
					id="pageContent"
					bind:value={pageContent}
					class="min-h-[40vh] w-full resize-none rounded-lg border border-zinc-200 bg-white px-4 py-3 font-[JetBrains_Mono,monospace] text-sm leading-relaxed text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-0 focus:outline-none"
					placeholder="Write detailed information about yourself using Markdown..."
				></textarea>
			{/if}
		</div>
	</div>
</main>
