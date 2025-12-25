<script lang="ts">
	import { ChevronRight, ExternalLink, Folder, Github, Plus, Search, Users, X } from "lucide-svelte";
	import { getProjects } from "$lib/data/private/projects.remote";
	import { PROJECT_CATEGORIES, type ProjectCategory } from "$lib/shared/models/schema";

	const allProjects = await getProjects();
	let searchQuery = $state("");

	const projects = $derived(
		searchQuery.trim() === ""
			? allProjects
			: allProjects.filter((p) => {
					const query = searchQuery.toLowerCase();
					return (
						p.name.toLowerCase().includes(query) ||
						p.slug.toLowerCase().includes(query) ||
						p.description?.toLowerCase().includes(query)
					);
				}),
	);

	const categoryColors: Record<ProjectCategory, { bg: string; text: string }> = {
		active: { bg: "bg-emerald-500/10", text: "text-emerald-600" },
		ended: { bg: "bg-zinc-500/10", text: "text-zinc-600" },
		hackathon: { bg: "bg-purple-500/10", text: "text-purple-600" },
		festival: { bg: "bg-pink-500/10", text: "text-pink-600" },
		personal: { bg: "bg-amber-500/10", text: "text-amber-600" },
	};
</script>

<svelte:head>
	<title>Projects - ut.code(); CMS</title>
</svelte:head>

<div class="space-y-4 sm:space-y-6">
		<!-- Header -->
		<header class="animate-fade-slide-in gradient-dark relative overflow-hidden rounded-2xl p-4 sm:p-6 lg:p-8">
			<!-- Decorative elements -->
			<div class="absolute top-0 -right-10 h-32 w-32 rounded-full bg-secondary/30 blur-3xl"></div>
			<div
				class="absolute -bottom-10 left-1/3 h-24 w-24 rounded-full bg-purple-500/20 blur-3xl"
			></div>

			<div class="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div class="flex items-center gap-3 sm:gap-4">
					<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 sm:h-12 sm:w-12">
						<Folder class="h-5 w-5 text-white sm:h-6 sm:w-6" />
					</div>
					<div>
						<h1 class="text-xl font-bold text-white sm:text-2xl">Projects</h1>
						<p class="text-xs text-white/60 sm:text-sm">{projects.length} projects registered</p>
					</div>
				</div>
				<a
					href="/admin/projects/new"
					class="btn btn-primary btn-sm gap-2 sm:btn-md"
				>
					<Plus class="h-4 w-4" />
					<span class="hidden sm:inline">New Project</span>
					<span class="sm:hidden">New</span>
				</a>
			</div>

			<!-- Search input -->
			<div class="relative mt-4 sm:mt-6">
				<div class="relative">
					<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
					<input
						type="text"
						placeholder="Search projects by name, slug, or description..."
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

		{#if projects.length === 0}
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
						<Folder class="h-8 w-8" />
					{/if}
				</div>
				{#if searchQuery}
					<h3 class="mt-4 text-lg font-semibold text-base-content">No projects found</h3>
					<p class="mt-1 text-base-content/60">Try a different search term.</p>
					<button onclick={() => (searchQuery = "")} class="btn btn-outline mt-6 gap-2">
						<X class="h-4 w-4" />
						Clear search
					</button>
				{:else}
					<h3 class="mt-4 text-lg font-semibold text-base-content">No projects yet</h3>
					<p class="mt-1 text-base-content/60">Get started by creating a project.</p>
					<a href="/admin/projects/new" class="btn btn-primary mt-6 gap-2">
						<Plus class="h-4 w-4" />
						New Project
					</a>
				{/if}
			</div>
		{:else}
			<!-- Projects grid -->
			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each projects as project, i (project.id)}
					<a
						href="/admin/projects/edit/{project.id}"
						class="group animate-fade-slide-in card-hover glow-soft relative flex flex-col overflow-hidden rounded-2xl bg-base-100"
						style="animation-delay: {i * 40}ms"
					>
						<!-- Cover -->
						{#if project.coverUrl}
							<figure class="relative aspect-[5/3] overflow-hidden">
								<img
									src={project.coverUrl}
									alt={project.name}
									class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
									loading="lazy"
								/>
								<div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
							</figure>
						{:else}
							<figure
								class="relative flex aspect-[5/3] items-center justify-center bg-gradient-to-br from-base-200 via-base-200 to-base-300"
							>
								<Folder
									class="h-12 w-12 text-base-content/10 transition-transform duration-300 group-hover:scale-110"
								/>
								<div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
							</figure>
						{/if}

						<!-- Category badge overlaid -->
						<span
							class="absolute top-3 right-3 rounded-lg px-2.5 py-1 text-xs font-semibold backdrop-blur-sm {categoryColors[
								project.category
							].bg} {categoryColors[project.category].text}"
						>
							{PROJECT_CATEGORIES[project.category]}
						</span>

						<!-- Content -->
						<div class="flex flex-1 flex-col p-5">
							<h3 class="line-clamp-1 font-semibold text-base-content">
								{project.name}
							</h3>
							<code class="mt-1 font-mono text-xs text-base-content/40">/{project.slug}</code>

							{#if project.description}
								<p class="mt-3 line-clamp-2 flex-1 text-sm text-base-content/60">
									{project.description}
								</p>
							{:else}
								<div class="mt-3 flex-1"></div>
							{/if}

							<!-- Footer -->
							<div class="mt-4 flex items-center justify-between border-t border-base-200 pt-4">
								<!-- Members -->
								<div class="flex items-center gap-2">
									{#if project.projectMembers.length > 0}
										<div class="avatar-group -space-x-2">
											{#each project.projectMembers.slice(0, 3) as pm (pm.memberId)}
												{#if pm.member.imageUrl}
													<div class="avatar border-base-100">
														<div class="aspect-square w-6 rounded-full">
															<img
																src={pm.member.imageUrl}
																alt={pm.member.name}
																title={pm.member.name}
																class="h-full w-full object-cover"
															/>
														</div>
													</div>
												{:else}
													<div class="placeholder avatar border-base-100">
														<div class="gradient-primary aspect-square w-6 rounded-full text-white">
															<span class="text-[9px] font-bold">{pm.member.name.charAt(0)}</span>
														</div>
													</div>
												{/if}
											{/each}
											{#if project.projectMembers.length > 3}
												<div class="placeholder avatar border-base-100">
													<div class="w-6 bg-base-200 text-base-content/50">
														<span class="text-[9px]">+{project.projectMembers.length - 3}</span>
													</div>
												</div>
											{/if}
										</div>
										<span class="text-xs text-base-content/40">
											{project.projectMembers.length} member{project.projectMembers.length > 1
												? "s"
												: ""}
										</span>
									{:else}
										<div class="flex items-center gap-1 text-xs text-base-content/30">
											<Users class="h-3 w-3" />
											No members
										</div>
									{/if}
								</div>

								<!-- Links & Arrow -->
								<div class="flex items-center gap-2">
									{#if project.repoUrl}
										<Github class="h-4 w-4 text-base-content/30" />
									{/if}
									{#if project.demoUrl}
										<ExternalLink class="h-4 w-4 text-base-content/30" />
									{/if}
									<ChevronRight
										class="h-4 w-4 text-base-content/20 transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary"
									/>
								</div>
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}
</div>
