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

<section class="bg-zinc-50 py-24">
	<div class="mx-auto max-w-6xl px-6">
		<div class="mb-8 flex items-end justify-between">
			<div>
				<div
					class="mb-3 font-[JetBrains_Mono,monospace] text-xs font-medium tracking-widest text-[#00D372] uppercase"
				>
					Projects
				</div>
				<h2 class="text-3xl font-bold">つくったもの</h2>
			</div>
			<a
				href="/projects"
				class="group hidden items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-900 sm:flex"
			>
				すべて見る
				<ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
			</a>
		</div>
		<div class="grid gap-6 lg:grid-cols-3">
			{#if featuredProject}
				<a
					href="/projects/{featuredProject.slug}"
					class="group flex flex-col rounded-2xl bg-zinc-900 p-8 text-white transition-all hover:shadow-2xl lg:row-span-2"
				>
					<span
						class="inline-block self-start rounded-lg bg-[#00D372] px-3 py-1 font-[JetBrains_Mono,monospace] text-xs font-medium text-zinc-900"
					>
						Featured
					</span>
					{#if featuredProject.coverUrl}
						<img
							src={featuredProject.coverUrl}
							alt={featuredProject.name}
							class="mt-6 aspect-video w-full rounded-xl object-cover"
						/>
					{/if}
					<div class="mt-auto pt-8">
						<h3 class="mb-2 text-xl font-semibold transition-colors group-hover:text-[#00D372]">
							{featuredProject.name}
						</h3>
						{#if featuredProject.description}
							<p class="mb-4 text-sm text-zinc-400">{featuredProject.description}</p>
						{/if}
						<div class="flex flex-wrap gap-2">
							<span
								class="rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1 font-[JetBrains_Mono,monospace] text-xs text-zinc-400"
							>
								{PROJECT_CATEGORIES[featuredProject.category]}
							</span>
						</div>
					</div>
				</a>
			{/if}
			{#each projects as project (project.id)}
				<a
					href="/projects/{project.slug}"
					class="group rounded-2xl border border-zinc-200/50 bg-white/80 backdrop-blur-md p-6 transition-all hover:border-[#00D372] hover:shadow-md"
				>
					{#if project.coverUrl}
						<img
							src={project.coverUrl}
							alt={project.name}
							class="mb-4 aspect-video w-full rounded-xl object-cover"
						/>
					{/if}
					<h3 class="mb-2 font-semibold transition-colors group-hover:text-[#00D372]">
						{project.name}
					</h3>
					{#if project.description}
						<p class="mb-4 line-clamp-2 text-sm text-zinc-500">{project.description}</p>
					{/if}
					<div class="flex flex-wrap gap-2">
						<span
							class="rounded-lg bg-zinc-100 px-2 py-1 font-[JetBrains_Mono,monospace] text-xs text-zinc-600"
						>
							{PROJECT_CATEGORIES[project.category]}
						</span>
					</div>
				</a>
			{/each}
		</div>
		<a
			href="/projects"
			class="mt-8 flex items-center justify-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-900 sm:hidden"
		>
			すべて見る
			<ArrowRight class="h-4 w-4" />
		</a>
	</div>
</section>
