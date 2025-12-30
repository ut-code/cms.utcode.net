<script lang="ts">
	import { ArrowLeft, Check, ChevronDown, Loader2, MoreHorizontal, Trash2 } from "lucide-svelte";
	import { goto } from "$app/navigation";
	import { DropdownMenu } from "bits-ui";

	type Member = {
		id: string;
		name: string;
		imageUrl: string | null;
	};

	let {
		isSubmitting,
		submitLabel,
		saveSuccess = $bindable(false),
		leadMemberId = $bindable<string | null>(null),
		members = [],
		onDelete = null,
	}: {
		isSubmitting: boolean;
		submitLabel: string;
		saveSuccess?: boolean;
		leadMemberId?: string | null;
		members?: Member[];
		onDelete?: (() => Promise<void>) | null;
	} = $props();

	let successTimeout: ReturnType<typeof setTimeout> | null = null;
	let moreMenuOpen = $state(false);
	let leadMenuOpen = $state(false);

	$effect(() => {
		if (saveSuccess) {
			if (successTimeout) {
				clearTimeout(successTimeout);
			}
			successTimeout = setTimeout(() => {
				saveSuccess = false;
				successTimeout = null;
			}, 2000);
		}

		return () => {
			if (successTimeout) {
				clearTimeout(successTimeout);
			}
		};
	});

	const selectedLead = $derived(members.find((m) => m.id === leadMemberId));
</script>

<header
	class="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 bg-white px-3 py-2 sm:px-4 sm:py-3"
>
	<div class="flex items-center gap-2 sm:gap-4">
		<button
			type="button"
			onclick={() => goto("/admin/projects")}
			class="flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900"
			aria-label="Back to Projects"
		>
			<ArrowLeft class="h-4 w-4" />
			<span class="hidden sm:inline">Projects</span>
		</button>

		<!-- Lead Member Dropdown -->
		<DropdownMenu.Root bind:open={leadMenuOpen}>
			<DropdownMenu.Trigger
				class="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 sm:px-3"
			>
				{#if selectedLead}
					<span class="max-w-24 truncate sm:max-w-32">{selectedLead.name}</span>
				{:else}
					<span class="text-zinc-400">Select lead</span>
				{/if}
				<ChevronDown class="h-3 w-3 {leadMenuOpen ? 'rotate-180' : ''} transition-transform" />
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="z-50 mt-1 max-h-60 min-w-40 overflow-auto rounded-lg border border-zinc-200 bg-white p-1 shadow-lg"
				sideOffset={4}
			>
				{#each members as member (member.id)}
					<DropdownMenu.Item
						class="cursor-pointer rounded-md px-3 py-2 text-sm text-zinc-900 transition-colors hover:bg-zinc-100 {member.id ===
						leadMemberId
							? 'bg-primary/5 font-medium'
							: ''}"
						onSelect={() => (leadMemberId = member.id)}
					>
						{member.name}
					</DropdownMenu.Item>
				{/each}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>

	<div class="flex items-center gap-1 sm:gap-2">
		<!-- More Menu (Delete) -->
		{#if onDelete}
			<DropdownMenu.Root bind:open={moreMenuOpen}>
				<DropdownMenu.Trigger
					class="flex items-center rounded-lg p-1.5 text-zinc-600 transition-colors hover:bg-zinc-100 sm:p-2"
					aria-label="More options"
				>
					<MoreHorizontal class="h-4 w-4" />
				</DropdownMenu.Trigger>
				<DropdownMenu.Content
					class="z-50 mt-1 min-w-36 rounded-lg border border-zinc-200 bg-white p-1 shadow-lg"
					sideOffset={4}
					align="end"
				>
					<DropdownMenu.Item
						class="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
						onSelect={() => onDelete?.()}
					>
						<Trash2 class="h-4 w-4" />
						Delete project
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		{/if}

		<!-- Save Button -->
		<button
			type="submit"
			disabled={isSubmitting || saveSuccess}
			class="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-semibold text-white transition-all hover:bg-zinc-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:px-4 sm:py-2"
		>
			{#if isSubmitting}
				<Loader2 class="h-4 w-4 animate-spin" />
				<span class="hidden sm:inline">Saving...</span>
				<span class="sm:hidden">...</span>
			{:else if saveSuccess}
				<Check class="h-4 w-4" />
				<span class="hidden sm:inline">Saved</span>
				<span class="sm:hidden">OK</span>
			{:else}
				<span class="hidden sm:inline">{submitLabel}</span>
				<span class="sm:hidden">Save</span>
			{/if}
		</button>
	</div>
</header>
