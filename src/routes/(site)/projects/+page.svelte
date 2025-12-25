<script lang="ts">
	import { SvelteURLSearchParams } from "svelte/reactivity";
	import { page } from "$app/state";
	import { getPublicProjects } from "$lib/data/public/index.remote";
	import {
		PROJECT_CATEGORIES,
		PROJECT_CATEGORY_KEYS,
		type ProjectCategory,
	} from "$lib/shared/models/schema";

	const projects = await getPublicProjects();
	const itemsPerPage = 12;

	const categoryParam = $derived(page.url.searchParams.get("category"));
	const selectedCategory = $derived(
		PROJECT_CATEGORY_KEYS.find((k) => k === categoryParam) ?? "all",
	);
	const currentPage = $derived(Number(page.url.searchParams.get("page")) || 1);

	const filteredProjects = $derived(
		selectedCategory === "all" ? projects : projects.filter((p) => p.category === selectedCategory),
	);

	const totalPages = $derived(Math.ceil(filteredProjects.length / itemsPerPage));
	const paginatedProjects = $derived(
		filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
	);

	const categoryColors: Record<ProjectCategory, string> = {
		active: "bg-emerald-100 text-emerald-700 border-emerald-200",
		ended: "bg-zinc-100 text-zinc-600 border-zinc-200",
		hackathon: "bg-purple-100 text-purple-700 border-purple-200",
		festival: "bg-pink-100 text-pink-700 border-pink-200",
		personal: "bg-amber-100 text-amber-700 border-amber-200",
	};

	function categoryUrl(category: ProjectCategory | "all"): string {
		const params = new SvelteURLSearchParams();
		if (category !== "all") {
			params.set("category", category);
		}
		const query = params.toString();
		return query ? `?${query}` : page.url.pathname;
	}

	function pageUrl(pageNum: number): string {
		const params = new SvelteURLSearchParams(page.url.searchParams);
		if (pageNum === 1) {
			params.delete("page");
		} else {
			params.set("page", String(pageNum));
		}
		const query = params.toString();
		return query ? `?${query}` : page.url.pathname;
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
							class="shrink-0 rounded-lg border px-2 py-0.5 text-[10px] font-medium {categoryColors[
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

		{#if filteredProjects.length > itemsPerPage}
			<div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
				{#if currentPage > 1}
					<a
						href={pageUrl(currentPage - 1)}
						class="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-center text-sm font-medium transition-colors hover:bg-primary/5 hover:border-primary/30 hover:text-primary focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 sm:w-auto"
					>
						前へ
					</a>
				{:else}
					<span
						class="w-full cursor-not-allowed rounded-lg border border-zinc-200 bg-white px-4 py-2 text-center text-sm font-medium opacity-50 sm:w-auto"
					>
						前へ
					</span>
				{/if}

				<div class="flex flex-1 flex-wrap items-center justify-center gap-1 sm:flex-initial">
					{#each Array.from({ length: totalPages }, (_, i) => i + 1) as pageNum (pageNum)}
						{#if totalPages <= 7 || pageNum === 1 || pageNum === totalPages || Math.abs(pageNum - currentPage) <= 1}
							<a
								href={pageUrl(pageNum)}
								class="min-w-[2.5rem] rounded-lg border px-3 py-2 text-center text-sm font-medium transition-colors focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 {currentPage ===
								pageNum
									? 'border-primary bg-primary text-white'
									: 'border-zinc-200 bg-white hover:bg-primary/5 hover:border-primary/30 hover:text-primary'}"
							>
								{pageNum}
							</a>
						{:else if pageNum === currentPage - 2 || pageNum === currentPage + 2}
							<span class="px-1 text-zinc-500">...</span>
						{/if}
					{/each}
				</div>

				{#if currentPage < totalPages}
					<a
						href={pageUrl(currentPage + 1)}
						class="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-center text-sm font-medium transition-colors hover:bg-primary/5 hover:border-primary/30 hover:text-primary focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 sm:w-auto"
					>
						次へ
					</a>
				{:else}
					<span
						class="w-full cursor-not-allowed rounded-lg border border-zinc-200 bg-white px-4 py-2 text-center text-sm font-medium opacity-50 sm:w-auto"
					>
						次へ
					</span>
				{/if}
			</div>
		{/if}
	{/if}
</div>
