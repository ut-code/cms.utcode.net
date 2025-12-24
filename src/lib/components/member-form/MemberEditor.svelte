<script lang="ts">
	import Markdown from "../Markdown.svelte";

	let {
		name = $bindable(""),
		slug = "",
		bio = $bindable(""),
		imageUrl = "",
		pageContent = $bindable(""),
		nameError = null,
		onNameChange,
	}: {
		name?: string;
		slug?: string;
		bio?: string;
		imageUrl?: string;
		pageContent?: string;
		nameError?: string | null;
		onNameChange?: () => void;
	} = $props();

	let showPageContentPreview = $state(false);

	function handleNameInput() {
		if (onNameChange) {
			onNameChange();
		}
	}
</script>

<main class="flex flex-1 flex-col overflow-y-auto bg-white">
	<div class="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-8">
		<!-- Profile Image -->
		<div class="mb-8 flex justify-center">
			{#if imageUrl}
				<img
					src={imageUrl}
					alt={name || "Profile"}
					class="h-32 w-32 rounded-full object-cover ring-4 ring-zinc-100"
				/>
			{:else}
				<div
					class="flex h-32 w-32 items-center justify-center rounded-full bg-zinc-100 text-4xl font-bold text-zinc-300"
				>
					{name ? name.charAt(0).toUpperCase() : "?"}
				</div>
			{/if}
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

		<!-- Username -->
		<p class="mt-2 text-center text-sm text-zinc-500">
			@{slug || "username"}
		</p>

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
