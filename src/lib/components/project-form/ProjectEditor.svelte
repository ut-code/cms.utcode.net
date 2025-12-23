<script lang="ts">
	import Markdown from "../Markdown.svelte";

	let {
		name = $bindable(),
		description = $bindable(),
		content = $bindable(),
		errors,
		onNameChange,
	}: {
		name?: string;
		description?: string;
		content?: string;
		errors: Record<string, string>;
		onNameChange: () => void;
	} = $props();

	let showPreview = $state(false);
</script>

<main class="flex flex-1 flex-col overflow-y-auto bg-white">
	<div class="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-8">
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

		<textarea
			id="description"
			bind:value={description}
			rows={2}
			class="mt-4 w-full resize-none border-none bg-transparent text-lg text-zinc-500 placeholder:text-zinc-300 focus:ring-0 focus:outline-none"
			placeholder="Short description..."
		></textarea>

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
			<span class="ml-auto text-xs text-zinc-400">Markdown supported</span>
		</div>

		<div class="mt-4 flex-1">
			{#if showPreview}
				<div class="prose max-w-none prose-zinc">
					{#if content && content.trim()}
						<Markdown {content} />
					{:else}
						<p class="text-zinc-400">Nothing to preview</p>
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
	</div>
</main>
