<script lang="ts">
	import Markdown from "../Markdown.svelte";

	let {
		title = $bindable(""),
		content = $bindable(""),
		titleError = null,
		contentError = null,
		onTitleChange,
	}: {
		title?: string;
		content?: string;
		titleError?: string | null;
		contentError?: string | null;
		onTitleChange?: (title: string) => void;
	} = $props();

	let showPreview = $state(false);

	function handleTitleInput() {
		if (onTitleChange) {
			onTitleChange(title);
		}
	}
</script>

<main class="flex flex-1 flex-col overflow-y-auto bg-white">
	<div class="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-8">
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
