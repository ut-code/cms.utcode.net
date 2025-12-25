<script lang="ts">
	import Pagination from "$lib/components/Pagination.svelte";
	import { CATEGORY_COLORS, ITEMS_PER_PAGE } from "$lib/shared/constants";
	import {
		PROJECT_CATEGORIES,
		PROJECT_CATEGORY_KEYS,
		type ProjectCategory,
	} from "$lib/shared/models/schema";
	import type { PageData } from "./$types";

	const { data }: { data: PageData } = $props();

	const selectedCategory = $derived(
		PROJECT_CATEGORY_KEYS.find((k) => k === data.categoryParam) ?? "all",
	);

	const filteredProjects = $derived(
		selectedCategory === "all" ? data.projects : data.projects.filter((p) => p.category === selectedCategory),
	);

	const totalPages = $derived(Math.ceil(filteredProjects.length / ITEMS_PER_PAGE));
	const paginatedProjects = $derived(
		filteredProjects.slice((data.currentPage - 1) * ITEMS_PER_PAGE, data.currentPage * ITEMS_PER_PAGE),
	);

	function categoryUrl(category: ProjectCategory | "all"): string {
		return category === "all" ? "/projects" : `/projects?category=${category}`;
	}

	function pageUrl(pageNum: number): string {
		const base = data.categoryParam ? `/projects?category=${data.categoryParam}` : "/projects";
		return pageNum === 1 ? base : `${base}${data.categoryParam ? "&" : "?"}page=${pageNum}`;
	}
</script>

<svelte:head>
	<title>プロジェクト一覧 | ut.code();</title>
	<meta property="og:title" content="プロジェクト一覧 | ut.code();" />
</svelte:head>

<!-- Header -->
<section class="border-b border-zinc-200 bg-zinc-50/50 py-16">
	<div class="mx-auto max-w-6xl px-6">
		<div
			class="mb-3 font-[JetBrains_Mono,monospace] text-xs font-medium tracking-widest text-primary uppercase"
		>
			Projects
		</div>
		<h1 class="mb-2 text-3xl font-bold">プロジェクト一覧</h1>
		<p class="text-zinc-500">ut.code(); が手がける様々なソフトウェアプロジェクト。</p>
	</div>
</section>

<div class="mx-auto max-w-6xl px-6 py-12">
	<!-- Category filter -->
	<div class="mb-8 flex flex-wrap gap-2">
		<a
			href={categoryUrl("all")}
			class="rounded-lg border px-3 py-1.5 text-sm font-medium transition-all hover:bg-primary/5 {selectedCategory === 'all'
				? 'border-primary bg-primary text-white'
				: 'border-zinc-200 bg-white text-zinc-700 hover:border-primary/30'}"
		>
			すべて
		</a>
		{#each PROJECT_CATEGORY_KEYS as key (key)}
			<a
				href={categoryUrl(key)}
				class="rounded-lg border px-3 py-1.5 text-sm font-medium transition-all hover:bg-primary/5 {selectedCategory === key
					? 'border-primary bg-primary text-white'
					: 'border-zinc-200 bg-white text-zinc-700 hover:border-primary/30'}"
			>
				{PROJECT_CATEGORIES[key]}
			</a>
		{/each}
	</div>

	{#if filteredProjects.length === 0}
		<p class="text-zinc-500">該当するプロジェクトがありません。</p>
	{:else}
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each paginatedProjects as project (project.id)}
				<a
					href="/projects/{project.slug}"
					class="group rounded-2xl border border-zinc-200/50 bg-white/80 backdrop-blur-md p-6 transition-all hover:bg-primary/5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
				>
					{#if project.coverUrl}
						<img
							src={project.coverUrl}
							alt={project.name}
							class="mb-4 aspect-[5/3] w-full rounded-xl object-cover"
							loading="lazy"
						/>
					{:else}
						<div
							class="mb-4 flex aspect-[5/3] w-full items-center justify-center rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-200"
						>
							<span class="font-[JetBrains_Mono,monospace] text-sm font-medium text-zinc-400">
								No Image
							</span>
						</div>
					{/if}
					<div class="mb-2 flex items-start justify-between gap-2">
						<h2 class="font-semibold transition-colors group-hover:text-primary">
							{project.name}
						</h2>
						<span
							class="shrink-0 rounded-lg border px-2 py-0.5 text-[10px] font-medium {CATEGORY_COLORS[
								project.category
							]}"
						>
							{PROJECT_CATEGORIES[project.category]}
						</span>
					</div>
					{#if project.description}
						<p class="mb-4 line-clamp-2 text-sm leading-relaxed text-zinc-500">
							{project.description}
						</p>
					{/if}
					<div class="flex flex-wrap gap-2">
						{#each project.projectMembers.slice(0, 3) as pm (pm.memberId)}
							<span
								class="rounded-lg bg-zinc-100 px-2 py-1 font-[JetBrains_Mono,monospace] text-xs text-zinc-600"
							>
								{pm.member.name}
							</span>
						{/each}
						{#if project.projectMembers.length > 3}
							<span
								class="rounded-lg bg-zinc-100 px-2 py-1 font-[JetBrains_Mono,monospace] text-xs text-zinc-600"
							>
								+{project.projectMembers.length - 3}
							</span>
						{/if}
					</div>
				</a>
			{/each}
		</div>

		<Pagination currentPage={data.currentPage} {totalPages} {pageUrl} />
	{/if}
</div>
