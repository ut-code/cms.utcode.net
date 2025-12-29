<script lang="ts">
	import { User } from "lucide-svelte";
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import { confirm } from "$lib/components/confirm-modal.svelte";
	import MemberForm from "$lib/components/MemberForm.svelte";
	import { useToast } from "$lib/components/toast/controls.svelte";
	import { editMember, getMember, removeMember } from "$lib/data/private/members.remote";

	const toast = useToast();
	const id = page.params.id ?? "";
	const member = await getMember(id);
	let isSubmitting = $state(false);

	async function handleSubmit(data: {
		slug: string;
		name: string;
		bio: string;
		imageUrl: string;
		pageContent: string;
	}) {
		if (!member) return;

		try {
			if (data.slug !== member.slug) {
				const confirmed = await confirm({
					title: "Change username?",
					description: `This will break existing links. Change from @${member.slug} to @${data.slug}?`,
					confirmText: "Change",
					variant: "warning",
				});
				if (!confirmed) return;
			}

			await editMember({
				id: member.id,
				data: {
					slug: data.slug,
					name: data.name,
					bio: data.bio || null,
					imageUrl: data.imageUrl || null,
					pageContent: data.pageContent || null,
				},
			});
			toast.show("Saved", "success");
		} catch (error) {
			toast.show(
				error instanceof Error
					? error.message
					: "Failed to save member. Check your connection and try again.",
			);
		}
	}

	async function handleDelete() {
		if (!member) return;

		const confirmed = await confirm({
			title: "Delete member?",
			description: `Delete "${member.name}"? Articles will lose attribution.`,
			confirmText: "Delete",
			variant: "danger",
		});

		if (confirmed) {
			try {
				await removeMember(member.id);
				toast.show("Deleted", "success");
				await goto("/admin/members");
			} catch (error) {
				toast.show(
					error instanceof Error
						? error.message
						: "Failed to delete member. Check your connection and try again.",
				);
			}
		}
	}
</script>

<svelte:head>
	<title>{member?.name ?? "Edit Member"} - ut.code(); CMS</title>
</svelte:head>

{#if !member}
		<div class="flex h-96 flex-col items-center justify-center text-center">
			<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400">
				<User class="h-6 w-6" />
			</div>
			<h2 class="mt-4 font-semibold text-zinc-900">Member not found</h2>
			<p class="mt-1 text-sm text-zinc-500">This member doesn't exist.</p>
			<a
				href="/admin/members"
				class="mt-4 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
			>
				Back to Members
			</a>
		</div>
	{:else}
		<div>
			<MemberForm
				initialData={{
					slug: member.slug,
					name: member.name,
					bio: member.bio ?? "",
					imageUrl: member.imageUrl ?? "",
					pageContent: member.pageContent ?? "",
				}}
				onSubmit={handleSubmit}
				onDelete={handleDelete}
				submitLabel="Save"
				bind:isSubmitting
			/>
		</div>
{/if}
