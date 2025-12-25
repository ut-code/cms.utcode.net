<script lang="ts">
	import { Plus, X } from "lucide-svelte";

	interface ProjectMember {
		memberId: string;
		role: string;
		member: {
			id: string;
			name: string;
			imageUrl: string | null;
		};
	}

	interface Props {
		projectMembers: ProjectMember[];
		onAddClick: () => void;
		onRemoveMember: (memberId: string, memberName: string) => Promise<void>;
		actions?: import("svelte").Snippet;
	}

	let { projectMembers, onAddClick, onRemoveMember, actions }: Props = $props();
</script>

<div class="flex flex-col gap-2 border-b border-zinc-200 bg-zinc-50 px-3 py-2 sm:flex-row sm:items-center sm:gap-3 sm:px-4">
	<span class="shrink-0 text-xs font-medium text-zinc-500">Team:</span>
	<div class="flex flex-1 flex-wrap items-center gap-1 overflow-x-auto">
		{#each projectMembers as pm (pm.memberId)}
			<div
				class="group flex shrink-0 items-center gap-1.5 rounded-full bg-white py-1 pr-2 pl-1 text-xs shadow-sm ring-1 ring-zinc-200"
			>
				{#if pm.member.imageUrl}
					<img src={pm.member.imageUrl} alt="" class="aspect-square h-5 w-5 rounded-full object-cover" />
				{:else}
					<div
						class="flex aspect-square h-5 w-5 items-center justify-center rounded-full bg-zinc-200 text-[10px] font-medium"
					>
						{pm.member.name.charAt(0)}
					</div>
				{/if}
				<span class="text-zinc-700">{pm.member.name}</span>
				{#if pm.role === "lead"}
					<span class="rounded bg-purple-100 px-1 py-0.5 text-[10px] font-medium text-purple-700"
						>lead</span
					>
				{/if}
				{#if pm.role !== "lead"}
					<button
						type="button"
						onclick={() => onRemoveMember(pm.memberId, pm.member.name)}
						class="ml-0.5 hidden rounded p-0.5 text-zinc-400 group-hover:block hover:bg-zinc-100 hover:text-red-500"
					>
						<X class="h-3 w-3" />
					</button>
				{/if}
			</div>
		{/each}
		<button
			type="button"
			onclick={onAddClick}
			class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-zinc-400 shadow-sm ring-1 ring-zinc-200 transition-colors hover:bg-zinc-50 hover:text-zinc-600"
		>
			<Plus class="h-4 w-4" />
		</button>
	</div>
	{@render actions?.()}
</div>
