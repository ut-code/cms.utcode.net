<script lang="ts">
	import { ArrowLeft, Loader2, MoreHorizontal, Trash2 } from "lucide-svelte";
	import { goto } from "$app/navigation";
	import { DropdownMenu } from "bits-ui";

	let {
		isSubmitting = false,
		submitLabel = "Save",
		onDelete = null,
	}: {
		isSubmitting?: boolean;
		submitLabel?: string;
		onDelete?: (() => Promise<void>) | null;
	} = $props();

	let moreMenuOpen = $state(false);
</script>

<header
	class="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 bg-white px-3 py-2 sm:px-4 sm:py-3"
>
	<div class="flex items-center gap-2 sm:gap-4">
		<button
			type="button"
			onclick={() => goto("/admin/members")}
			class="flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900"
			aria-label="Back to Members"
		>
			<ArrowLeft class="h-4 w-4" />
			<span class="hidden sm:inline">Members</span>
		</button>
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
						Delete member
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		{/if}

		<!-- Save Button -->
		<button
			type="submit"
			disabled={isSubmitting}
			class="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-semibold text-white transition-all hover:bg-zinc-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:px-4 sm:py-2"
		>
			{#if isSubmitting}
				<Loader2 class="h-4 w-4 animate-spin" />
			{/if}
			<span class="hidden sm:inline">{submitLabel}</span>
			<span class="sm:hidden">Save</span>
		</button>
	</div>
</header>
