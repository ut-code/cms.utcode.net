<script lang="ts">
	import Pagination from "$lib/components/Pagination.svelte";
	import { CATEGORY_COLORS, ITEMS_PER_PAGE } from "$lib/shared/constants";
	import {
		PROJECT_CATEGORIES,
		PROJECT_KIND_KEYS,
		PROJECT_KIND_LABELS,
		projectCategoryToKind,
		type ProjectKind,
	} from "$lib/shared/models/schema";
	import type { PageData } from "./$types";

	const { data }: { data: PageData } = $props();

	// 公開側はカテゴリ単体ではなく上位 kind (long-term / festival / hackathon) でフィルタする。
	// long-term は active/paused/completed の集合。
	// 旧 utcode.net 互換: ?category=festival|hackathon|long-term をそのまま受ける。
	const selectedKind = $derived<ProjectKind | "all">(
		PROJECT_KIND_KEYS.find((k) => k === data.kindParam) ?? "all",
	);

	const filteredProjects = $derived(
		selectedKind === "all"
			? data.projects
			: data.projects.filter((p) => projectCategoryToKind(p.category) === selectedKind),
	);

	const totalPages = $derived(Math.ceil(filteredProjects.length / ITEMS_PER_PAGE));
	const paginatedProjects = $derived(
		filteredProjects.slice((data.currentPage - 1) * ITEMS_PER_PAGE, data.currentPage * ITEMS_PER_PAGE),
	);

	function kindUrl(kind: ProjectKind | "all"): string {
		return kind === "all" ? "/projects" : `/projects?category=${kind}`;
	}

	function pageUrl(pageNum: number): string {
		const base = data.kindParam ? `/projects?category=${data.kindParam}` : "/projects";
		return pageNum === 1 ? base : `${base}${data.kindParam ? "&" : "?"}page=${pageNum}`;
	}

	const updatedAtFormatter = new Intl.DateTimeFormat("ja-JP", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	function formatUpdatedAt(d: Date): string {
		return updatedAtFormatter.format(d);
	}
</script>

<svelte:head>
	<title>プロジェクト一覧 | ut.code();</title>
	<meta property="og:title" content="プロジェクト一覧 | ut.code();" />
	<meta name="description" content="ut.code(); が手がける様々なソフトウェアプロジェクト。" />
	<meta property="og:description" content="ut.code(); が手がける様々なソフトウェアプロジェクト。" />
</svelte:head>

<!--
  Projects list — product-launch register.
  Hero signature: `<projects />` tag eyebrow + filtered count.
  Filter pills are mono-cased for a "tag-selector" feel.
  Cards: cover zoom, category badge inline with title, member chips as tech-tags, mono "updated" timestamp.
-->
<!-- Header -->
<section class="relative overflow-hidden border-b border-zinc-200 bg-zinc-50/50 py-16">
	<div
		class="pointer-events-none absolute inset-0 opacity-[0.35]"
		aria-hidden="true"
		style="background-image: radial-gradient(circle, oklch(76% 0.2 153 / 0.18) 1px, transparent 1px); background-size: 24px 24px; mask-image: linear-gradient(to bottom, black, transparent);"
	></div>
	<div class="relative mx-auto flex max-w-6xl flex-col gap-2 px-6">
		<div class="flex items-center justify-between gap-4">
			<div
				class="flex items-center gap-2 font-[JetBrains_Mono,monospace] text-xs font-medium tracking-widest text-primary uppercase"
			>
				<span aria-hidden="true" class="text-primary/50">&lt;</span>
				<span>projects</span>
				<span aria-hidden="true" class="text-primary/50">/&gt;</span>
			</div>
			<div class="font-[JetBrains_Mono,monospace] text-xs text-zinc-500">
				{filteredProjects.length}
				<span class="text-zinc-400">/ {data.projects.length} total</span>
			</div>
		</div>
		<h1 class="text-3xl font-bold tracking-tight sm:text-4xl">プロジェクト一覧</h1>
		<p class="max-w-2xl text-zinc-500">ut.code(); が手がける様々なソフトウェアプロジェクト。</p>
	</div>
</section>

<div class="mx-auto max-w-6xl px-6 py-12">
	<!-- Kind filter — pills shaped as tag-selectors -->
	<div class="mb-8 flex flex-wrap items-center gap-2">
		<span class="mr-1 font-[JetBrains_Mono,monospace] text-[10px] tracking-widest text-zinc-400 uppercase">
			filter:
		</span>
		<a
			href={kindUrl("all")}
			class="inline-flex min-h-9 items-center rounded-lg border px-3 py-1.5 text-sm font-medium transition-all hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 {selectedKind === 'all'
				? 'border-primary bg-primary text-white shadow-sm shadow-primary/20'
				: 'border-zinc-200 bg-white text-zinc-700 hover:border-primary/30'}"
			aria-current={selectedKind === "all" ? "page" : undefined}
		>
			すべて
		</a>
		{#each PROJECT_KIND_KEYS as key (key)}
			<a
				href={kindUrl(key)}
				class="inline-flex min-h-9 items-center rounded-lg border px-3 py-1.5 text-sm font-medium transition-all hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 {selectedKind === key
					? 'border-primary bg-primary text-white shadow-sm shadow-primary/20'
					: 'border-zinc-200 bg-white text-zinc-700 hover:border-primary/30'}"
				aria-current={selectedKind === key ? "page" : undefined}
			>
				{PROJECT_KIND_LABELS[key]}
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
					class="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200/60 bg-gradient-to-b from-white to-zinc-50/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
				>
					<div class="relative aspect-[5/3] w-full overflow-hidden bg-zinc-100">
						{#if project.coverUrl}
							<img
								src={project.coverUrl}
								alt={project.name}
								class="h-full w-full object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-[1.04]"
								loading="lazy"
							/>
						{:else}
							<div
								class="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200"
							>
								<span class="font-[JetBrains_Mono,monospace] text-sm font-medium text-zinc-400">
									No Image
								</span>
							</div>
						{/if}
						<!-- Category badge floats on the cover (top-right) for product-launch feel -->
						<span
							class="absolute top-3 right-3 rounded-md border px-2 py-0.5 font-[JetBrains_Mono,monospace] text-[10px] font-medium backdrop-blur-md {CATEGORY_COLORS[
								project.category
							]}"
						>
							{PROJECT_CATEGORIES[project.category]}
						</span>
					</div>

					<div class="flex flex-1 flex-col p-6">
						<h2 class="mb-2 font-semibold leading-snug tracking-tight text-zinc-900 transition-colors group-hover:text-primary">
							{project.name}
						</h2>
						{#if project.description}
							<p class="mb-4 line-clamp-2 text-sm leading-relaxed text-zinc-500">
								{project.description}
							</p>
						{/if}
						{#if project.projectMembers.length > 0}
							<div class="mb-4 flex flex-wrap gap-1.5">
								{#each project.projectMembers.slice(0, 3) as pm (pm.memberId)}
									<span
										class="rounded-md bg-zinc-100 px-2 py-0.5 font-[JetBrains_Mono,monospace] text-[11px] text-zinc-600 transition-colors group-hover:bg-zinc-200/70"
									>
										{pm.member.name}
									</span>
								{/each}
								{#if project.projectMembers.length > 3}
									<span
										class="rounded-md bg-zinc-100 px-2 py-0.5 font-[JetBrains_Mono,monospace] text-[11px] text-zinc-500"
									>
										+{project.projectMembers.length - 3}
									</span>
								{/if}
							</div>
						{/if}
						<p class="mt-auto flex items-center gap-1.5 font-[JetBrains_Mono,monospace] text-[11px] text-zinc-400">
							<span aria-hidden="true" class="inline-block h-1 w-1 rounded-full bg-zinc-300"></span>
							updated {formatUpdatedAt(project.updatedAt)}
						</p>
					</div>
				</a>
			{/each}
		</div>

		<Pagination currentPage={data.currentPage} {totalPages} {pageUrl} />
	{/if}
</div>
