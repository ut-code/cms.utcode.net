<script lang="ts">
	import { ExternalLink, Github, X } from "lucide-svelte";
	import {
		PROJECT_CATEGORIES,
		PROJECT_CATEGORY_KEYS,
		type ProjectCategory,
	} from "$lib/shared/models/schema";
	import ImageUpload from "../image-upload.svelte";

	type Member = {
		id: string;
		name: string;
		imageUrl: string | null;
	};

	let {
		show,
		category = $bindable(),
		slug = $bindable(),
		leadMemberId = $bindable(),
		coverUrl = $bindable(),
		repoUrl = $bindable(),
		demoUrl = $bindable(),
		members,
		errors,
		isNew,
		onClose,
		onDelete = null,
	}: {
		show: boolean;
		category?: ProjectCategory;
		slug?: string;
		leadMemberId?: string | null;
		coverUrl?: string;
		repoUrl?: string;
		demoUrl?: string;
		members: Member[];
		errors: Record<string, string>;
		isNew: boolean;
		onClose: () => void;
		onDelete?: (() => Promise<void>) | null;
	} = $props();
</script>

{#if show}
	<aside class="w-80 shrink-0 overflow-y-auto border-l border-zinc-200 bg-zinc-50/50 lg:w-96">
		<div
			class="sticky top-0 flex items-center justify-between border-b border-zinc-200 bg-zinc-50/80 px-4 py-3 backdrop-blur-sm"
		>
			<h2 class="font-semibold text-zinc-900">Settings</h2>
			<button
				type="button"
				onclick={onClose}
				class="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-600"
			>
				<X class="h-4 w-4" />
			</button>
		</div>

		<div class="space-y-6 p-4">
			<div class="space-y-2">
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
								? 'border-emerald-500 bg-emerald-50 text-emerald-700'
								: 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300'}"
						>
							{PROJECT_CATEGORIES[key]}
						</button>
					{/each}
				</div>
			</div>

			<div class="space-y-2">
				<label for="slug" class="text-sm font-medium text-zinc-700">URL path</label>
				<div class="flex rounded-lg border border-zinc-200 bg-white">
					<span
						class="shrink-0 border-r border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-400"
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

			{#if isNew}
				<div class="space-y-2">
					<label for="leadMemberId" class="text-sm font-medium text-zinc-700">Lead member</label>
					<select
						id="leadMemberId"
						bind:value={leadMemberId}
						class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-400 focus:ring-0 focus:outline-none"
						class:border-red-300={errors["leadMemberId"]}
					>
						<option value={null}>Select a lead</option>
						{#each members as member (member.id)}
							<option value={member.id}>{member.name}</option>
						{/each}
					</select>
					{#if errors["leadMemberId"]}
						<p class="text-xs text-red-500">{errors["leadMemberId"]}</p>
					{/if}
				</div>
			{/if}

			<div class="space-y-2">
				<ImageUpload bind:value={coverUrl} folder="projects" label="Cover image" />
			</div>

			<div class="space-y-2">
				<label for="repoUrl" class="text-sm font-medium text-zinc-700">Repository</label>
				<div class="flex rounded-lg border border-zinc-200 bg-white">
					<span class="shrink-0 border-r border-zinc-200 bg-zinc-50 px-3 py-2">
						<Github class="h-4 w-4 text-zinc-400" />
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
						<ExternalLink class="h-4 w-4 text-zinc-400" />
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

			{#if onDelete}
				<div class="border-t border-zinc-200 pt-6">
					<p class="text-sm font-medium text-red-600">Danger zone</p>
					<p class="mt-1 text-xs text-zinc-500">Team associations will be removed.</p>
					<button
						type="button"
						onclick={onDelete}
						class="mt-3 w-full rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
					>
						Delete project
					</button>
				</div>
			{/if}
		</div>
	</aside>
{/if}
