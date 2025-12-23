<script lang="ts">
	import { Github } from "lucide-svelte";
	import { page } from "$app/state";
	import Markdown from "$lib/components/Markdown.svelte";
	import { getPublicProject } from "$lib/data/public/index.remote";
	import { PROJECT_CATEGORIES, type ProjectCategory } from "$lib/shared/models/schema";

	const slug = $derived(page.params.slug ?? "");
	const project = $derived(await getPublicProject(slug));

	const categoryColors: Record<ProjectCategory, string> = {
		active: "bg-emerald-100 text-emerald-700 border-emerald-200",
		ended: "bg-zinc-100 text-zinc-600 border-zinc-200",
		hackathon: "bg-purple-100 text-purple-700 border-purple-200",
		festival: "bg-pink-100 text-pink-700 border-pink-200",
		personal: "bg-amber-100 text-amber-700 border-amber-200",
	};
</script>

<svelte:head>
	{#if project}
		<title>{project.name} | ut.code();</title>
		<meta property="og:title" content={project.name} />
		{#if project.description}
			<meta name="description" content={project.description} />
			<meta property="og:description" content={project.description} />
		{/if}
		{#if project.coverUrl}
			<meta property="og:image" content={project.coverUrl} />
		{/if}
	{/if}
</svelte:head>

{#if project}
	<article class="mx-auto max-w-3xl px-6 py-16">
		<a
			href="/projects"
			class="mb-8 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900"
		>
			← プロジェクト一覧
		</a>

		{#if project.coverUrl}
			<img
				src={project.coverUrl}
				alt={project.name}
				class="mb-8 aspect-video w-full rounded-xl object-cover"
			/>
		{/if}

		<div class="mb-4 flex flex-wrap items-center gap-3">
			<h1 class="text-4xl font-bold">{project.name}</h1>
			<span class="rounded border px-2 py-1 text-xs font-medium {categoryColors[project.category]}">
				{PROJECT_CATEGORIES[project.category]}
			</span>
		</div>

		{#if project.description}
			<p class="mb-6 text-lg text-zinc-500">{project.description}</p>
		{/if}

		<div class="mb-8 flex flex-wrap gap-3">
			{#if project.repoUrl}
				<a
					href={project.repoUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800"
				>
					<Github class="h-4 w-4" />
					GitHub
				</a>
			{/if}
			{#if project.demoUrl}
				<a
					href={project.demoUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-2 rounded-lg bg-[#00D372] px-4 py-2 text-sm text-zinc-900 hover:bg-[#00C066]"
				>
					Demo →
				</a>
			{/if}
		</div>

		{#if project.content}
			<Markdown content={project.content} />
		{/if}

		<section class="mt-12 border-t border-zinc-200 pt-8">
			<h2 class="mb-4 text-xl font-semibold">メンバー</h2>
			<div class="flex flex-wrap gap-4">
				{#each project.projectMembers as pm (pm.memberId)}
					<a
						href="/members/{pm.member.slug}"
						class="flex items-center gap-3 rounded-lg border border-zinc-200 px-4 py-3 hover:border-[#00D372]"
					>
						{#if pm.member.imageUrl}
							<img src={pm.member.imageUrl} alt={pm.member.name} class="h-10 w-10 rounded-full" />
						{:else}
							<div class="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100">
								<span class="text-sm font-medium text-zinc-600">
									{pm.member.name.charAt(0)}
								</span>
							</div>
						{/if}
						<div>
							<div class="font-medium">{pm.member.name}</div>
							{#if pm.role}
								<div class="text-xs text-zinc-500">{pm.role}</div>
							{/if}
						</div>
					</a>
				{/each}
			</div>
		</section>
	</article>
{:else}
	<div class="mx-auto max-w-3xl px-6 py-16 text-center">
		<h1 class="mb-4 text-2xl font-bold">プロジェクトが見つかりません</h1>
		<a href="/projects" class="text-[#00D372] hover:underline">プロジェクト一覧に戻る</a>
	</div>
{/if}
