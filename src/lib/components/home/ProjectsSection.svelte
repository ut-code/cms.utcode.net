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

<section class="bg-zinc-50 py-32">
	<div class="mx-auto max-w-6xl px-6">
		<div class="mb-20 flex items-end justify-between">
			<div>
				<div class="mb-4 font-mono text-sm font-medium uppercase tracking-widest text-primary">PROJECTS</div>
				<h2 class="text-5xl font-bold text-zinc-900 lg:text-6xl">
					つくったもの
				</h2>
				<p class="mt-4 max-w-2xl text-lg text-zinc-600">
					実際に使われるプロダクトを開発し、世に届ける
				</p>
			</div>
			<a
				href="/projects"
				class="group hidden items-center gap-2 rounded-lg bg-zinc-900 px-6 py-3 font-semibold text-white transition-all hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:flex"
			>
				すべて見る
				<ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-1" />
			</a>
		</div>
		<div class="grid gap-6 lg:grid-cols-3">
			{#if featuredProject}
				<a
					href="/projects/{featuredProject.slug}"
					class="group relative flex flex-col overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-900 p-8 text-white transition-all hover:shadow-2xl hover:shadow-zinc-900/20 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 lg:row-span-2"
				>
					<div class="relative">
						<span
							class="inline-block rounded-lg bg-primary px-3 py-1 font-mono text-xs font-bold text-white shadow-lg shadow-primary/30"
						>
							FEATURED
						</span>
						{#if featuredProject.coverUrl}
							<div class="mt-6 overflow-hidden rounded-2xl ring-1 ring-white/10 transition-all group-hover:ring-2 group-hover:ring-primary/50">
								<img
									src={featuredProject.coverUrl}
									alt={featuredProject.name}
									class="aspect-[5/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
								/>
							</div>
						{/if}
						<div class="mt-8">
							<h3 class="mb-3 text-2xl font-bold transition-colors duration-300 group-hover:text-primary">
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
					class="group relative overflow-hidden rounded-3xl border border-zinc-200/50 bg-white/80 p-6 backdrop-blur-md transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
				>
					<div class="relative">
						{#if project.coverUrl}
							<div class="mb-4 overflow-hidden rounded-2xl ring-1 ring-zinc-100 transition-all group-hover:ring-2 group-hover:ring-primary/30">
								<img
									src={project.coverUrl}
									alt={project.name}
									class="aspect-[5/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
								/>
							</div>
						{/if}
						<h3 class="mb-2 text-xl font-bold text-zinc-900 transition-colors duration-300 group-hover:text-primary">
							{project.name}
						</h3>
						{#if project.description}
							<p class="mb-4 line-clamp-2 text-sm leading-relaxed text-zinc-600">{project.description}</p>
						{/if}
						<div class="flex flex-wrap gap-2">
							<span
								class="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1 font-mono text-xs text-zinc-500"
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
			class="mt-8 flex items-center justify-center gap-2 font-bold text-zinc-600 transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:hidden"
		>
			すべて見る
			<ArrowRight class="h-5 w-5" />
		</a>
	</div>
</section>
