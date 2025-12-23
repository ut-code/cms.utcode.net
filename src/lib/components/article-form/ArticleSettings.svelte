<script lang="ts">
	import { Eye, EyeOff, X } from "lucide-svelte";
	import ImageUpload from "../image-upload.svelte";

	type Author = {
		id: string;
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
		authors = [],
		slugError = null,
		onDelete = null,
	}: {
		show?: boolean;
		published?: boolean;
		slug?: string;
		authorId?: string | null;
		excerpt?: string;
		coverUrl?: string;
		authors?: Author[];
		slugError?: string | null;
		onDelete?: (() => Promise<void>) | null;
	} = $props();
</script>

{#if show}
	<aside class="fixed inset-0 z-30 overflow-y-auto bg-zinc-50 lg:static lg:w-80 lg:shrink-0 lg:border-l lg:border-zinc-200 lg:bg-zinc-50/50 xl:w-96">
		<div
			class="sticky top-0 flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-4 py-3 backdrop-blur-sm lg:bg-zinc-50/80"
		>
			<h2 class="font-semibold text-zinc-900">Settings</h2>
			<button
				type="button"
				onclick={() => (show = false)}
				class="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-600"
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
						onclick={() => (published = false)}
						class="rounded-lg border-2 p-3 text-left transition-all {!published
							? 'border-zinc-900 bg-white'
							: 'border-zinc-200 bg-white hover:border-zinc-300'}"
					>
						<EyeOff class="mb-1 h-4 w-4 {!published ? 'text-zinc-900' : 'text-zinc-400'}" />
						<span class="block text-sm font-medium {!published ? 'text-zinc-900' : 'text-zinc-600'}"
							>Draft</span
						>
					</button>
					<button
						type="button"
						onclick={() => (published = true)}
						class="rounded-lg border-2 p-3 text-left transition-all {published
							? 'border-emerald-500 bg-emerald-50'
							: 'border-zinc-200 bg-white hover:border-zinc-300'}"
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
				<label for="slug" class="text-sm font-medium text-zinc-700">URL path</label>
				<div class="flex rounded-lg border border-zinc-200 bg-white">
					<span
						class="shrink-0 border-r border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-400"
					>
						/articles/
					</span>
					<input
						type="text"
						id="slug"
						bind:value={slug}
						class="w-full rounded-r-lg border-none bg-transparent px-3 py-2 font-mono text-sm text-zinc-900 focus:ring-0 focus:outline-none"
						class:text-red-600={slugError}
						placeholder="my-article"
					/>
				</div>
				{#if slugError}
					<p class="text-xs text-red-500">{slugError}</p>
				{/if}
			</div>

			<!-- Author -->
			<div class="space-y-2">
				<label for="author" class="text-sm font-medium text-zinc-700">Author</label>
				<select
					id="author"
					bind:value={authorId}
					class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-400 focus:ring-0 focus:outline-none"
				>
					<option value={null}>No author</option>
					{#each authors as author (author.id)}
						<option value={author.id}>{author.name}</option>
					{/each}
				</select>
			</div>

			<!-- Excerpt -->
			<div class="space-y-2">
				<label for="excerpt" class="text-sm font-medium text-zinc-700">
					Excerpt
					<span class="font-normal text-zinc-400">(for cards)</span>
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
