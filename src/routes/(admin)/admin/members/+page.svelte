<script lang="ts">
	import { ChevronRight, Link2, Plus, Search, Sparkles, Users, X } from "lucide-svelte";
	import { getMembers } from "$lib/data/private/members.remote";

	const allMembers = await getMembers();
	let searchQuery = $state("");

	const members = $derived(
		searchQuery.trim() === ""
			? allMembers
			: allMembers.filter((m) => {
					const query = searchQuery.toLowerCase();
					return (
						m.name.toLowerCase().includes(query) ||
						m.slug.toLowerCase().includes(query) ||
						m.bio?.toLowerCase().includes(query)
					);
				}),
	);
</script>

<svelte:head>
	<title>Members - ut.code(); CMS</title>
</svelte:head>

<div class="space-y-4 sm:space-y-6">
		<!-- Header -->
		<header class="animate-fade-slide-in gradient-dark relative overflow-hidden rounded-2xl p-4 sm:p-6 lg:p-8">
			<!-- Decorative elements -->
			<div class="absolute top-0 -right-10 h-32 w-32 rounded-full bg-error/20 blur-3xl"></div>

			<div class="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div class="flex items-center gap-3 sm:gap-4">
					<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-error/20 sm:h-12 sm:w-12">
						<Users class="h-5 w-5 text-error sm:h-6 sm:w-6" />
					</div>
					<div>
						<h1 class="text-xl font-bold text-white sm:text-2xl">Members</h1>
						<p class="text-xs text-white/60 sm:text-sm">{members.length} members registered</p>
					</div>
				</div>
				<a
					href="/admin/members/new"
					class="btn btn-primary btn-sm gap-2 sm:btn-md"
				>
					<Plus class="h-4 w-4" />
					<span class="hidden sm:inline">Add Member</span>
					<span class="sm:hidden">Add</span>
				</a>
			</div>

			<!-- Search input -->
			<div class="relative mt-4 sm:mt-6">
				<div class="relative">
					<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
					<input
						type="text"
						placeholder="Search members by name, slug, or bio..."
						bind:value={searchQuery}
						class="w-full rounded-lg border-0 bg-white/10 py-2 pl-10 pr-10 text-sm text-white placeholder-white/40 outline-none transition-all focus:bg-white/15 focus:ring-2 focus:ring-white/20"
					/>
					{#if searchQuery}
						<button
							onclick={() => (searchQuery = "")}
							class="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition-colors hover:text-white"
							aria-label="Clear search"
						>
							<X class="h-4 w-4" />
						</button>
					{/if}
				</div>
			</div>
		</header>

		{#if members.length === 0}
			<!-- Empty state -->
			<div
				class="animate-fade-slide-in stagger-1 rounded-2xl border-2 border-dashed border-base-300 bg-base-100 p-12 text-center"
			>
				<div
					class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-base-200 text-base-content/40"
				>
					{#if searchQuery}
						<Search class="h-8 w-8" />
					{:else}
						<Users class="h-8 w-8" />
					{/if}
				</div>
				{#if searchQuery}
					<h3 class="mt-4 text-lg font-semibold text-base-content">No members found</h3>
					<p class="mt-1 text-base-content/60">Try a different search term.</p>
					<button onclick={() => (searchQuery = "")} class="btn btn-outline mt-6 gap-2">
						<X class="h-4 w-4" />
						Clear search
					</button>
				{:else}
					<h3 class="mt-4 text-lg font-semibold text-base-content">No members yet</h3>
					<p class="mt-1 text-base-content/60">Get started by adding a member.</p>
					<a href="/admin/members/new" class="btn btn-primary mt-6 gap-2">
						<Plus class="h-4 w-4" />
						Add Member
					</a>
				{/if}
			</div>
		{:else}
			<!-- Members grid -->
			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each members as member, i (member.id)}
					<a
						href="/admin/members/edit/{member.id}"
						class="group animate-fade-slide-in card-hover glow-soft relative overflow-hidden rounded-2xl bg-base-100 p-5"
						style="animation-delay: {i * 40}ms"
					>
						<!-- Accent border -->
						<div
							class="gradient-primary absolute inset-x-0 top-0 h-1 opacity-0 transition-opacity group-hover:opacity-100"
						></div>

						<div class="flex items-start gap-4">
							<!-- Avatar -->
							{#if member.imageUrl}
								<div class="avatar">
									<div
										class="aspect-square w-14 rounded-full ring-2 ring-base-200 transition-all group-hover:ring-primary/30"
									>
										<img src={member.imageUrl} alt={member.name} class="h-full w-full object-cover" />
									</div>
								</div>
							{:else}
								<div class="placeholder avatar">
									<div class="gradient-primary aspect-square w-14 rounded-full text-white">
										<span class="text-lg font-bold">{member.name.charAt(0)}</span>
									</div>
								</div>
							{/if}

							<!-- Info -->
							<div class="min-w-0 flex-1">
								<div class="flex items-center gap-2">
									<h3 class="truncate font-semibold text-base-content">{member.name}</h3>
									{#if member.userId}
										<span
											class="flex h-5 w-5 items-center justify-center rounded-full bg-success/10"
											title="Linked to account"
										>
											<Link2 class="h-3 w-3 text-success" />
										</span>
									{/if}
								</div>
								<code class="mt-1 block font-mono text-xs text-base-content/50">@{member.slug}</code
								>
								{#if member.bio}
									<p class="mt-2 line-clamp-2 text-sm text-base-content/60">{member.bio}</p>
								{/if}
							</div>
						</div>

						<!-- Footer -->
						<div class="mt-4 flex items-center justify-between border-t border-base-200 pt-4">
							<span class="text-xs text-base-content/40">
								{#if member.userId}
									<span class="flex items-center gap-1 text-success">
										<Sparkles class="h-3 w-3" />
										Active member
									</span>
								{:else}
									Profile only
								{/if}
							</span>
							<ChevronRight
								class="h-4 w-4 text-base-content/30 transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary"
							/>
						</div>
					</a>
				{/each}
			</div>
		{/if}
</div>
