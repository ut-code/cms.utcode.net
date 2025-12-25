<script lang="ts">
	import { X } from "lucide-svelte";
	import ImageUpload from "../image-upload.svelte";

	let {
		show = $bindable(false),
		slug = $bindable(""),
		imageUrl = $bindable(""),
		slugError = null,
		viewCount = 0,
		onDelete = null,
	}: {
		show?: boolean;
		slug?: string;
		imageUrl?: string;
		slugError?: string | null;
		viewCount?: number;
		onDelete?: (() => Promise<void>) | null;
	} = $props();
</script>

{#if show}
	<aside class="fixed inset-0 z-30 w-full overflow-y-auto bg-zinc-50 lg:static lg:w-80 lg:shrink-0 lg:border-l lg:border-zinc-200 lg:bg-zinc-50/50 xl:w-96">
		<div
			class="sticky top-0 flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-4 py-3 backdrop-blur-sm lg:bg-zinc-50/80"
		>
			<h2 class="font-semibold text-zinc-900">Settings</h2>
			<button
				type="button"
				onclick={() => (show = false)}
				class="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-600"
			>
				<X class="h-4 w-4" />
			</button>
		</div>

		<div class="space-y-6 p-4">
			<!-- Username -->
			<div class="space-y-2">
				<label for="slug" class="text-sm font-medium text-zinc-700">Username</label>
				<div class="flex rounded-lg border border-zinc-200 bg-white">
					<span
						class="shrink-0 border-r border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-500"
					>
						@
					</span>
					<input
						type="text"
						id="slug"
						bind:value={slug}
						class="w-full rounded-r-lg border-none bg-transparent px-3 py-2 font-mono text-sm text-zinc-900 focus:ring-0 focus:outline-none"
						class:text-red-600={slugError}
						placeholder="username"
					/>
				</div>
				{#if slugError}
					<p class="text-xs text-red-500">{slugError}</p>
				{/if}
			</div>

			<!-- Profile Image -->
			<div class="space-y-2">
				<ImageUpload
					bind:value={imageUrl}
					folder="members"
					label="Profile image"
					aspect="1/1"
				/>
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
					<p class="mt-1 text-xs text-zinc-500">
						Articles by this member will lose attribution.
					</p>
					<button
						type="button"
						onclick={onDelete}
						class="mt-3 w-full rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
					>
						Delete member
					</button>
				</div>
			{/if}
		</div>
	</aside>
{/if}
