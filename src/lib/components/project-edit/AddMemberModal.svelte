<script lang="ts">
	interface Member {
		id: string;
		name: string;
	}

	interface ProjectMember {
		memberId: string;
	}

	interface Props {
		show: boolean;
		members: Member[];
		projectMembers: ProjectMember[];
		onAdd: (memberId: string, role: "member" | "lead") => Promise<void>;
		onCancel: () => void;
	}

	let { show = $bindable(), members, projectMembers, onAdd, onCancel }: Props = $props();
	let newMemberId = $state<string | null>(null);
	let newMemberRole = $state<"member" | "lead">("member");

	async function handleAdd() {
		if (!newMemberId) return;
		await onAdd(newMemberId, newMemberRole);
		newMemberId = null;
		newMemberRole = "member";
		show = false;
	}

	function handleCancel() {
		newMemberId = null;
		newMemberRole = "member";
		onCancel();
	}
</script>

{#if show}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
		<div class="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl">
			<h3 class="font-semibold text-zinc-900">Add member</h3>
			<div class="mt-4 space-y-4">
				<div class="space-y-1.5">
					<label for="newMember" class="text-sm font-medium text-zinc-700">Member</label>
					<select
						id="newMember"
						bind:value={newMemberId}
						class="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900"
					>
						<option value={null}>Select</option>
						{#each members.filter((m) => !projectMembers.some((pm) => pm.memberId === m.id)) as member (member.id)}
							<option value={member.id}>{member.name}</option>
						{/each}
					</select>
				</div>
				<div class="space-y-1.5">
					<label for="role" class="text-sm font-medium text-zinc-700">Role</label>
					<select
						id="role"
						bind:value={newMemberRole}
						class="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900"
					>
						<option value="member">Member</option>
						<option value="lead">Lead</option>
					</select>
				</div>
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
					onclick={handleAdd}
					disabled={!newMemberId}
					class="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
				>
					Add
				</button>
			</div>
		</div>
	</div>
{/if}
