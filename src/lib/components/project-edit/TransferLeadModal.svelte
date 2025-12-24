<script lang="ts">
	interface ProjectMember {
		memberId: string;
		member: {
			name: string;
		};
	}

	interface Props {
		show: boolean;
		otherMembers: ProjectMember[];
		onTransfer: (memberId: string) => Promise<void>;
		onCancel: () => void;
	}

	let { show = $bindable(), otherMembers, onTransfer, onCancel }: Props = $props();
	let transferTargetId = $state<string | null>(null);

	async function handleTransfer() {
		if (!transferTargetId) return;
		await onTransfer(transferTargetId);
		transferTargetId = null;
		show = false;
	}

	function handleCancel() {
		transferTargetId = null;
		onCancel();
	}
</script>

{#if show}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
		<div class="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl">
			<h3 class="font-semibold text-zinc-900">Transfer lead role</h3>
			<div class="mt-4 space-y-1.5">
				<label for="transferTarget" class="text-sm font-medium text-zinc-700"
					>New lead member</label
				>
				<select
					id="transferTarget"
					bind:value={transferTargetId}
					class="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900"
				>
					<option value={null}>Select</option>
					{#each otherMembers as pm (pm.memberId)}
						<option value={pm.memberId}>{pm.member.name}</option>
					{/each}
				</select>
			</div>
			<div class="mt-5 flex justify-end gap-2">
				<button
					type="button"
					onclick={handleCancel}
					class="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100"
				>
					Cancel
				</button>
				<button
					type="button"
					onclick={handleTransfer}
					disabled={!transferTargetId}
					class="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
				>
					Transfer
				</button>
			</div>
		</div>
	</div>
{/if}
