<script lang="ts">
	import { tick } from "svelte";

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
	let cancelButtonRef = $state<HTMLButtonElement | null>(null);
	let addButtonRef = $state<HTMLButtonElement | null>(null);
	let memberSelectRef = $state<HTMLSelectElement | null>(null);

	$effect(() => {
		if (show && cancelButtonRef) {
			tick().then(() => {
				cancelButtonRef?.focus();
			}).catch(console.error);
		}
	});

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

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "Escape") handleCancel();
	}

	function handleModalKeydown(e: KeyboardEvent) {
		if (e.key !== "Tab") return;

		const focusableElements = [cancelButtonRef, addButtonRef, memberSelectRef].filter(
			(el): el is HTMLButtonElement | HTMLSelectElement => el !== null,
		);

		if (focusableElements.length === 0) return;

		const currentIndex = focusableElements.indexOf(
			document.activeElement as HTMLButtonElement | HTMLSelectElement,
		);

		e.preventDefault();

		if (e.shiftKey) {
			const prevIndex =
				currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1;
			const prevElement = focusableElements[prevIndex];
			if (prevElement) prevElement.focus();
		} else {
			const nextIndex = (currentIndex + 1) % focusableElements.length;
			const nextElement = focusableElements[nextIndex];
			if (nextElement) nextElement.focus();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if show}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
		<div
			class="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl"
			onkeydown={handleModalKeydown}
			role="dialog"
			aria-modal="true"
			aria-labelledby="add-member-modal-title"
			tabindex="-1"
		>
			<h3 id="add-member-modal-title" class="font-semibold text-zinc-900">Add member</h3>
			<div class="mt-4 space-y-4">
				<div class="space-y-1.5">
					<label for="newMember" class="text-sm font-medium text-zinc-700">Member</label>
					<select
						bind:this={memberSelectRef}
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
					bind:this={cancelButtonRef}
					type="button"
					onclick={handleCancel}
					class="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100"
				>
					Cancel
				</button>
				<button
					bind:this={addButtonRef}
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
