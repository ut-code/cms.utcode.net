<script lang="ts">
	import { ArrowRight } from "lucide-svelte";
	import type { getPublicProjects } from "$lib/data/public/index.remote";
	import { PROJECT_CATEGORIES } from "$lib/shared/models/schema";

	type PublicProject = Awaited<ReturnType<typeof getPublicProjects>>[number];

	type Props = {
		projects: PublicProject[];
	};

	const { projects }: Props = $props();

	const featured = $derived(projects[0]);
	const others = $derived(projects.slice(1));
</script>

<section class="bg-white py-24">
	<div class="mx-auto max-w-6xl px-6">
		<div class="mb-16 flex items-end justify-between">
			<div>
				<div class="mb-4 font-mono text-sm font-medium uppercase tracking-widest text-primary">
					PROJECTS
				</div>
				<h2 class="text-4xl font-bold text-zinc-900 sm:text-5xl lg:text-6xl">つくったもの</h2>
			</div>
			<a
				href="/projects"
				class="group hidden items-center gap-2 rounded-lg bg-zinc-900 px-6 py-3 font-semibold text-white transition-all hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:flex"
			>
				すべて見る
				<ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-1" />
			</a>
		</div>

		{#if featured}
			<!-- Featured project - large card -->
			<a
				href="/projects/{featured.slug}"
				class="group mb-6 block overflow-hidden rounded-2xl bg-zinc-900 transition-all hover:shadow-2xl hover:shadow-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
			>
				<div class="grid lg:grid-cols-2">
					{#if featured.coverUrl}
						<div class="aspect-[4/3] overflow-hidden lg:aspect-auto">
							<img
								src={featured.coverUrl}
								alt={featured.name}
								class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
								loading="lazy"
							/>
						</div>
					{:else}
						<div class="flex aspect-[4/3] items-center justify-center bg-zinc-800 lg:aspect-auto">
							<span class="font-mono text-sm font-medium text-zinc-500">No Image</span>
						</div>
					{/if}
					<div class="flex flex-col justify-center p-8 lg:p-12">
						<div class="mb-4 inline-flex">
							<span class="rounded-lg bg-primary/20 px-3 py-1 font-mono text-xs text-primary">
								Featured
							</span>
						</div>
						<h3 class="mb-4 text-2xl font-bold text-white lg:text-3xl">
							{featured.name}
						</h3>
						{#if featured.description}
							<p class="mb-6 line-clamp-3 leading-relaxed text-zinc-400">
								{featured.description}
							</p>
						{/if}
						<div class="flex items-center gap-2 text-primary">
							<span class="font-semibold">詳しく見る</span>
							<ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
						</div>
					</div>
				</div>
			</a>
		{/if}

		<!-- Other projects - grid -->
		{#if others.length > 0}
			<div class="grid gap-6 sm:grid-cols-2">
				{#each others as project (project.id)}
					<a
						href="/projects/{project.slug}"
						class="group flex gap-4 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4 transition-all hover:border-primary/30 hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
					>
						{#if project.coverUrl}
							<div class="h-24 w-24 shrink-0 overflow-hidden rounded-xl">
								<img
									src={project.coverUrl}
									alt={project.name}
									class="h-full w-full object-cover"
									loading="lazy"
								/>
							</div>
						{:else}
							<div class="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-zinc-100">
								<span class="font-mono text-xs text-zinc-400">No Image</span>
							</div>
						{/if}
						<div class="flex flex-col justify-center">
							<h3 class="mb-1 font-bold text-zinc-900">{project.name}</h3>
							{#if project.description}
								<p class="line-clamp-2 text-sm text-zinc-600">{project.description}</p>
							{/if}
							<span class="mt-2 font-mono text-xs text-zinc-400">
								{PROJECT_CATEGORIES[project.category]}
							</span>
						</div>
					</a>
				{/each}
			</div>
		{/if}

		<a
			href="/projects"
			class="mt-8 flex items-center justify-center gap-2 font-semibold text-zinc-600 transition-colors hover:text-primary sm:hidden"
		>
			すべて見る
			<ArrowRight class="h-5 w-5" />
		</a>
	</div>
</section>
