<script lang="ts">
	import { ExternalLink, Github } from "lucide-svelte";
	import {
		PROJECT_CATEGORIES,
		PROJECT_CATEGORY_KEYS,
		type ProjectCategory,
	} from "$lib/shared/models/schema";
	import ImageUpload from "../image-upload.svelte";
	import Markdown from "../Markdown.svelte";

	let {
		name = $bindable(),
		description = $bindable(),
		content = $bindable(),
		slug = $bindable(""),
		coverUrl = $bindable(""),
		category = $bindable<ProjectCategory>("active"),
		repoUrl = $bindable(""),
		demoUrl = $bindable(""),
		errors,
		onNameChange,
	}: {
		name?: string;
		description?: string;
		content?: string;
		slug?: string;
		coverUrl?: string;
		category?: ProjectCategory;
		repoUrl?: string;
		demoUrl?: string;
		errors: Record<string, string>;
		onNameChange: () => void;
	} = $props();

	let showPreview = $state(false);
</script>

<main class="flex-1 bg-white">
	<div class="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-8">
		<!-- Cover Image -->
		<div class="mb-6">
			<ImageUpload bind:value={coverUrl} folder="projects" label="Cover image" aspect="5/3" />
		</div>

		<!-- Slug Input -->
		<div class="mb-6 space-y-2">
			<p
				class="break-all font-mono text-sm"
				class:text-red-500={errors["slug"]}
				class:text-emerald-600={!errors["slug"] && slug.length > 0}
				class:text-zinc-500={!errors["slug"] && slug.length === 0}
			>
				/projects/{slug || "..."}
			</p>
			<div class="flex rounded-lg border border-zinc-200 bg-white">
				<span
					class="shrink-0 border-r border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-500"
				>
					/projects/
				</span>
				<input
					type="text"
					id="slug"
					bind:value={slug}
					class="w-full rounded-r-lg border-none bg-transparent px-3 py-2 font-mono text-sm text-zinc-900 focus:ring-0 focus:outline-none"
					class:text-red-600={errors["slug"]}
					placeholder="my-project"
				/>
			</div>
			{#if errors["slug"]}
				<p class="text-xs text-red-500">{errors["slug"]}</p>
			{/if}
		</div>

		<!-- Category Selector -->
		<div class="mb-6 space-y-2">
			<span class="text-sm font-medium text-zinc-700">Category</span>
			<div class="flex flex-wrap gap-2">
				{#each PROJECT_CATEGORY_KEYS as key (key)}
					<button
						type="button"
						onclick={() => {
							category = key;
						}}
						class="rounded-lg border px-3 py-1.5 text-sm font-medium transition-all {category ===
						key
							? 'border-primary bg-primary/5 text-zinc-900'
							: 'border-zinc-200 bg-white text-zinc-600 hover:border-primary/30'}"
					>
						{PROJECT_CATEGORIES[key]}
					</button>
				{/each}
			</div>
		</div>

		<!-- Name Input -->
		<input
			type="text"
			id="name"
			bind:value={name}
			oninput={onNameChange}
			class="w-full border-none bg-transparent text-3xl font-bold text-zinc-900 placeholder:text-zinc-300 focus:ring-0 focus:outline-none"
			class:text-red-600={errors["name"]}
			placeholder="Project Name"
		/>
		{#if errors["name"]}
			<p class="mt-1 text-sm text-red-500">{errors["name"]}</p>
		{/if}

		<!-- Description -->
		<textarea
			id="description"
			bind:value={description}
			rows={2}
			class="mt-4 w-full resize-none border-none bg-transparent text-lg text-zinc-500 placeholder:text-zinc-300 focus:ring-0 focus:outline-none"
			placeholder="Short description..."
		></textarea>

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
					{#if content && content.trim()}
						<Markdown {content} />
					{:else}
						<p class="text-zinc-500">Nothing to preview</p>
					{/if}
				</div>
			{:else}
				<textarea
					id="content"
					bind:value={content}
					class="min-h-[50vh] w-full resize-none border-none bg-transparent font-[JetBrains_Mono,monospace] text-base leading-relaxed text-zinc-900 placeholder:text-zinc-300 focus:ring-0 focus:outline-none"
					placeholder="Write detailed project content here..."
				></textarea>
			{/if}
		</div>

		<!-- Repo & Demo URLs -->
		<div class="mt-8 space-y-4 border-t border-zinc-100 pt-6">
			<div class="space-y-2">
				<label for="repoUrl" class="text-sm font-medium text-zinc-700">Repository</label>
				<div class="flex rounded-lg border border-zinc-200 bg-white">
					<span class="shrink-0 border-r border-zinc-200 bg-zinc-50 px-3 py-2">
						<Github class="h-4 w-4 text-zinc-500" />
					</span>
					<input
						type="url"
						id="repoUrl"
						bind:value={repoUrl}
						class="w-full rounded-r-lg border-none bg-transparent px-3 py-2 text-sm text-zinc-900 focus:ring-0 focus:outline-none"
						placeholder="https://github.com/..."
					/>
				</div>
			</div>

			<div class="space-y-2">
				<label for="demoUrl" class="text-sm font-medium text-zinc-700">Demo</label>
				<div class="flex rounded-lg border border-zinc-200 bg-white">
					<span class="shrink-0 border-r border-zinc-200 bg-zinc-50 px-3 py-2">
						<ExternalLink class="h-4 w-4 text-zinc-500" />
					</span>
					<input
						type="url"
						id="demoUrl"
						bind:value={demoUrl}
						class="w-full rounded-r-lg border-none bg-transparent px-3 py-2 text-sm text-zinc-900 focus:ring-0 focus:outline-none"
						placeholder="https://..."
					/>
				</div>
			</div>
		</div>
	</div>
</main>
