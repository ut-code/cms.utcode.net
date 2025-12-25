<script lang="ts">
	import { Settings } from "lucide-svelte";
	import { useToast } from "$lib/components/toast/controls.svelte";
	import { getMembers } from "$lib/data/private/members.remote";
	import {
		getMyPreference,
		updateDefaultAuthor,
	} from "$lib/data/private/user-preferences.remote";

	const toast = useToast();
	const members = await getMembers();
	const preference = await getMyPreference();

	let defaultAuthorId = $state(preference?.defaultAuthorId ?? null);
	let isSubmitting = $state(false);

	async function handleSubmit() {
		isSubmitting = true;
		try {
			await updateDefaultAuthor(defaultAuthorId);
			toast.show("Personal settings saved", "success");
		} catch (error) {
			toast.show(
				error instanceof Error ? error.message : "Failed to save personal settings",
			);
		} finally {
			isSubmitting = false;
		}
	}
</script>

<svelte:head>
	<title>Personal Settings - ut.code(); CMS</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center gap-3">
		<div class="gradient-primary flex h-10 w-10 items-center justify-center rounded-lg">
			<Settings class="h-5 w-5 text-white" />
		</div>
		<div>
			<h1 class="text-2xl font-bold text-base-content">Personal Settings</h1>
			<p class="text-sm text-base-content/60">Manage your personal preferences</p>
		</div>
	</div>

	<div class="card glass border-base-300">
		<div class="card-body">
			<h2 class="card-title text-base-content">Article Preferences</h2>
			<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-4">
				<div class="form-control w-full">
					<label for="defaultAuthor" class="label">
						<span class="label-text font-medium">Default Author</span>
					</label>
					<select
						id="defaultAuthor"
						bind:value={defaultAuthorId}
						class="select select-bordered w-full"
					>
						<option value={null}>None</option>
						{#each members as member}
							<option value={member.id}>{member.name}</option>
						{/each}
					</select>
					<label for="defaultAuthor" class="label">
						<span class="label-text-alt text-base-content/60">
							This author will be pre-selected when creating new articles
						</span>
					</label>
				</div>

				<div class="card-actions">
					<button type="submit" class="btn btn-primary" disabled={isSubmitting}>
						{isSubmitting ? "Saving..." : "Save"}
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
