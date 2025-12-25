<script lang="ts">
	import { ArrowRight } from "lucide-svelte";
	import type { getPublicProjects } from "$lib/data/public/index.remote";
	import { PROJECT_CATEGORIES } from "$lib/shared/models/schema";

	type PublicProject = Awaited<ReturnType<typeof getPublicProjects>>[number];

	type Props = {
		featuredProject: PublicProject | undefined;
		projects: PublicProject[];
	};

	const { featuredProject, projects }: Props = $props();
</script>

<section class="bg-zinc-950 py-32">
	<div class="mx-auto max-w-7xl px-6">
		<div class="mb-20 flex items-end justify-between">
			<div>
				<div class="mb-4 font-mono text-sm font-medium uppercase tracking-widest text-orange-400">PROJECTS</div>
				<h2 class="font-[clash-display,ui-sans-serif,system-ui,sans-serif] text-5xl font-bold text-white lg:text-6xl">
					つくったもの
				</h2>
				<p class="mt-4 max-w-2xl text-lg text-zinc-400">
					実際に使われるプロダクトを開発し、世に届ける
				</p>
			</div>
			<a
				href="/projects"
				class="group hidden items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 px-6 py-3 font-bold text-zinc-300 transition-all hover:border-orange-500/50 hover:bg-zinc-800/70 hover:text-white sm:flex"
			>
				すべて見る
				<ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-1" />
			</a>
		</div>
		<div class="grid gap-6 lg:grid-cols-3">
			{#if featuredProject}
				<a
					href="/projects/{featuredProject.slug}"
					class="group relative flex flex-col overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8 text-white transition-all hover:scale-[1.02] hover:border-orange-500/60 hover:shadow-2xl hover:shadow-orange-500/20 lg:row-span-2"
				>
					<div
						class="pointer-events-none absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-500/0 opacity-0 transition-all duration-500 group-hover:from-orange-500/15 group-hover:to-transparent group-hover:opacity-100"
					></div>
					<div class="relative">
						<span
							class="inline-block animate-pulse rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-1 font-mono text-xs font-bold text-zinc-950 shadow-lg shadow-orange-500/50"
							style="animation-duration: 3s;"
						>
							FEATURED
						</span>
						{#if featuredProject.coverUrl}
							<div class="mt-6 overflow-hidden rounded-2xl ring-1 ring-white/10 transition-all group-hover:ring-2 group-hover:ring-orange-500/50">
								<img
									src={featuredProject.coverUrl}
									alt={featuredProject.name}
									class="aspect-[5/3] w-full object-cover transition-transform duration-500 group-hover:scale-110"
								/>
							</div>
						{/if}
						<div class="mt-8">
							<h3 class="mb-3 font-[clash-display,ui-sans-serif,system-ui,sans-serif] text-2xl font-bold transition-colors duration-300 group-hover:text-orange-400">
								{featuredProject.name}
							</h3>
							{#if featuredProject.description}
								<p class="mb-4 leading-relaxed text-zinc-400">{featuredProject.description}</p>
							{/if}
							<div class="flex flex-wrap gap-2">
								<span
									class="rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-1 font-mono text-xs text-zinc-400"
								>
									{PROJECT_CATEGORIES[featuredProject.category]}
								</span>
							</div>
						</div>
					</div>
				</a>
			{/if}
			{#each projects as project (project.id)}
				<a
					href="/projects/{project.slug}"
					class="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm transition-all hover:scale-105 hover:border-amber-500/60 hover:shadow-xl hover:shadow-amber-500/10"
				>
					<div
						class="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/0 opacity-0 transition-all duration-500 group-hover:from-amber-500/15 group-hover:to-transparent group-hover:opacity-100"
					></div>
					<div class="relative">
						{#if project.coverUrl}
							<div class="mb-4 overflow-hidden rounded-2xl ring-1 ring-white/10 transition-all group-hover:ring-2 group-hover:ring-amber-500/50">
								<img
									src={project.coverUrl}
									alt={project.name}
									class="aspect-[5/3] w-full object-cover transition-transform duration-500 group-hover:scale-110"
								/>
							</div>
						{/if}
						<h3 class="mb-2 font-[clash-display,ui-sans-serif,system-ui,sans-serif] text-xl font-bold text-white transition-colors duration-300 group-hover:text-amber-400">
							{project.name}
						</h3>
						{#if project.description}
							<p class="mb-4 line-clamp-2 text-sm leading-relaxed text-zinc-400">{project.description}</p>
						{/if}
						<div class="flex flex-wrap gap-2">
							<span
								class="rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-1 font-mono text-xs text-zinc-500"
							>
								{PROJECT_CATEGORIES[project.category]}
							</span>
						</div>
					</div>
				</a>
			{/each}
		</div>
		<a
			href="/projects"
			class="mt-8 flex items-center justify-center gap-2 font-bold text-zinc-400 transition-colors hover:text-white sm:hidden"
		>
			すべて見る
			<ArrowRight class="h-5 w-5" />
		</a>
	</div>
</section>
