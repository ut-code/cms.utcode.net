<script lang="ts">
	import { ArrowRightLeft, Folder } from "lucide-svelte";
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import { confirm } from "$lib/components/confirm-modal.svelte";
	import ProjectForm from "$lib/components/ProjectForm.svelte";
	import AddMemberModal from "$lib/components/project-edit/AddMemberModal.svelte";
	import TeamMembersBar from "$lib/components/project-edit/TeamMembersBar.svelte";
	import TransferLeadModal from "$lib/components/project-edit/TransferLeadModal.svelte";
	import { useToast } from "$lib/components/toast/controls.svelte";
	import {
		addMember,
		editProject,
		getMembers,
		getProject,
		removeMember,
		removeProject,
		transferLead,
	} from "$lib/data/private/projects.remote";
	import type { ProjectCategory } from "$lib/shared/models/schema";

	const toast = useToast();
	const id = $derived(page.params.id ?? "");
	const project = $derived(await getProject(id));
	const members = $derived(await getMembers());
	let isSubmitting = $state(false);
	let showAddMember = $state(false);
	let showTransferLead = $state(false);

	const currentLead = $derived(project?.projectMembers.find((pm) => pm.role === "lead"));
	const otherMembers = $derived(project?.projectMembers.filter((pm) => pm.role !== "lead") ?? []);
	const canTransferLead = $derived((otherMembers?.length ?? 0) > 0);

	async function handleSubmit(data: {
		slug: string;
		name: string;
		description: string;
		content: string;
		coverUrl: string;
		repoUrl: string;
		demoUrl: string;
		category: ProjectCategory;
		leadMemberId: string | null;
	}) {
		if (!project) return;

		try {
			if (data.slug !== project.slug) {
				const confirmed = await confirm({
					title: "Change URL?",
					description: `This will break existing links. Change from /projects/${project.slug} to /projects/${data.slug}?`,
					confirmText: "Change",
					variant: "warning",
				});
				if (!confirmed) return;
			}

			await editProject({
				id,
				data: {
					slug: data.slug,
					name: data.name,
					description: data.description || null,
					content: data.content || null,
					coverUrl: data.coverUrl || null,
					repoUrl: data.repoUrl || null,
					demoUrl: data.demoUrl || null,
					category: data.category,
				},
			});
			toast.show("Saved", "success");
		} catch (error) {
			toast.show(
				error instanceof Error
					? error.message
					: "Failed to save project. Check your connection and try again.",
			);
		}
	}

	async function handleDelete() {
		if (!project) return;

		const confirmed = await confirm({
			title: "Delete project?",
			description: `Delete "${project.name}"? Team associations will be removed.`,
			confirmText: "Delete",
			variant: "danger",
		});

		if (confirmed) {
			try {
				await removeProject(id);
				toast.show("Deleted", "success");
				await goto("/admin/projects");
			} catch (error) {
				toast.show(
					error instanceof Error
						? error.message
						: "Failed to delete project. Check your connection and try again.",
				);
			}
		}
	}

	async function handleAddMember(memberId: string, role: "member" | "lead") {
		try {
			await addMember({ projectId: id, memberId, role }).updates(getProject(id));
			toast.show("Member added", "success");
		} catch (error) {
			toast.show(
				error instanceof Error
					? error.message
					: "Failed to add member to project. Check your connection and try again.",
			);
		}
	}

	async function handleRemoveMember(memberId: string, memberName: string) {
		const confirmed = await confirm({
			title: "Remove member?",
			description: `Remove ${memberName} from this project?`,
			confirmText: "Remove",
			variant: "danger",
		});

		if (confirmed) {
			try {
				await removeMember({ projectId: id, memberId }).updates(getProject(id));
				toast.show("Member removed", "success");
			} catch (error) {
				toast.show(
					error instanceof Error
						? error.message
						: "Failed to remove member from project. Check your connection and try again.",
				);
			}
		}
	}

	async function handleTransferLead(newLeadMemberId: string) {
		if (!currentLead) return;

		const targetMember = otherMembers.find((m) => m.memberId === newLeadMemberId);
		if (!targetMember) return;

		const confirmed = await confirm({
			title: "Transfer lead role?",
			description: `Transfer lead role from ${currentLead.member.name} to ${targetMember.member.name}?`,
			confirmText: "Transfer",
			variant: "warning",
		});

		if (confirmed) {
			try {
				await transferLead({ projectId: id, newLeadMemberId }).updates(getProject(id));
				toast.show("Lead transferred", "success");
			} catch (error) {
				toast.show(
					error instanceof Error
						? error.message
						: "Failed to transfer lead role. Check your connection and try again.",
				);
			}
		}
	}
</script>

<svelte:head>
	<title>{project?.name ?? "Edit Project"} - ut.code(); CMS</title>
</svelte:head>

{#if !project}
		<div class="flex h-96 flex-col items-center justify-center text-center">
			<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400">
				<Folder class="h-6 w-6" />
			</div>
			<h2 class="mt-4 font-semibold text-zinc-900">Project not found</h2>
			<p class="mt-1 text-sm text-zinc-500">This project doesn't exist.</p>
			<a
				href="/admin/projects"
				class="mt-4 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
			>
				Back to Projects
			</a>
		</div>
	{:else}
		<div class="flex h-[calc(100vh-4rem)] flex-col">
			<TeamMembersBar
				projectMembers={project.projectMembers}
				onAddClick={() => (showAddMember = true)}
				onRemoveMember={handleRemoveMember}
			>
				{#snippet actions()}
					{#if canTransferLead}
						<button
							type="button"
							onclick={() => (showTransferLead = true)}
							class="flex shrink-0 items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 shadow-sm ring-1 ring-zinc-200 transition-colors hover:bg-zinc-50"
						>
							<ArrowRightLeft class="h-3.5 w-3.5" />
							<span class="hidden sm:inline">Transfer Lead</span>
							<span class="sm:hidden">Transfer</span>
						</button>
					{/if}
				{/snippet}
			</TeamMembersBar>

			<!-- Main Form -->
			<div class="flex-1">
				<ProjectForm
					initialData={{
						slug: project.slug,
						name: project.name,
						description: project.description ?? "",
						content: project.content ?? "",
						coverUrl: project.coverUrl ?? "",
						repoUrl: project.repoUrl ?? "",
						demoUrl: project.demoUrl ?? "",
						category: project.category,
						leadMemberId: null,
					}}
					{members}
					onSubmit={handleSubmit}
					onDelete={handleDelete}
					submitLabel="Save"
					bind:isSubmitting
				/>
			</div>
		</div>

		<AddMemberModal
			bind:show={showAddMember}
			{members}
			projectMembers={project.projectMembers}
			onAdd={handleAddMember}
			onCancel={() => (showAddMember = false)}
		/>

		<TransferLeadModal
			bind:show={showTransferLead}
			{otherMembers}
			onTransfer={handleTransferLead}
			onCancel={() => (showTransferLead = false)}
		/>
{/if}
