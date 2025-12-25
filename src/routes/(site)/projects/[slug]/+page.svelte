<script lang="ts">
	import { Github } from "lucide-svelte";
	import Markdown from "$lib/components/Markdown.svelte";
	import { PROJECT_CATEGORIES, type ProjectCategory } from "$lib/shared/models/schema";
	import type { PageData } from "./$types";

	const { data }: { data: PageData } = $props();
	

	const categoryColors: Record<ProjectCategory, string> = {
		active: "bg-emerald-100 text-emerald-700 border-emerald-200",
		ended: "bg-zinc-100 text-zinc-600 border-zinc-200",
		hackathon: "bg-purple-100 text-purple-700 border-purple-200",
		festival: "bg-pink-100 text-pink-700 border-pink-200",
		personal: "bg-amber-100 text-amber-700 border-amber-200",
	};
</script>

<svelte:head>
	{#if data.project}
		<title>{data.project.name} | ut.code();</title>
		<meta property="og:title" content={data.project.name} />
		{#if data.project.description}
			<meta name="description" content={data.project.description} />
			<meta property="og:description" content={data.project.description} />
		{/if}
		{#if data.project.coverUrl}
			<meta property="og:image" content={data.project.coverUrl} />
		{/if}
	{/if}
</svelte:head>

{#if data.project}
	<article class="mx-auto max-w-3xl px-6 py-16">
		<a
			href="/projects"
			class="mb-8 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900"
		>
			← プロジェクト一覧
		</a>

		{#if data.project.coverUrl}
			<img
				src={data.project.coverUrl}
				alt={data.project.name}
				class="mb-6 aspect-[5/3] w-full rounded-xl object-cover sm:mb-8"
				loading="lazy"
			/>
		{/if}

		<div class="mb-3 flex flex-wrap items-center gap-2 sm:mb-4 sm:gap-3">
			<h1 class="text-2xl font-bold sm:text-3xl md:text-4xl">{data.project.name}</h1>
			<span class="rounded border px-2 py-1 text-xs font-medium {categoryColors[data.project.category]}">
				{PROJECT_CATEGORIES[data.project.category]}
			</span>
		</div>

		{#if data.project.description}
			<p class="mb-4 text-base text-zinc-500 sm:mb-6 sm:text-lg">{data.project.description}</p>
		{/if}

		<div class="mb-6 flex flex-wrap gap-2 sm:mb-8 sm:gap-3">
			{#if data.project.repoUrl}
				<a
					href={data.project.repoUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800"
				>
					<Github class="h-4 w-4" />
					GitHub
				</a>
			{/if}
			{#if data.project.demoUrl}
				<a
					href={data.project.demoUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-zinc-900 hover:bg-primary-focus"
				>
					Demo →
				</a>
			{/if}
		</div>

		{#if data.project.content}
			<Markdown content={data.project.content} />
		{/if}

		<section class="mt-8 border-t border-zinc-200 pt-6 sm:mt-12 sm:pt-8">
			<h2 class="mb-3 text-lg font-semibold sm:mb-4 sm:text-xl">メンバー</h2>
			<div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
				{#each data.project.projectMembers as pm (pm.memberId)}
					<a
						href="/members/{pm.member.slug}"
						class="flex items-center gap-3 rounded-lg border border-zinc-200 px-4 py-3 transition-all hover:bg-primary/5 hover:border-primary/30"
					>
						{#if pm.member.imageUrl}
							<img
								src={pm.member.imageUrl}
								alt={pm.member.name}
								class="aspect-square h-10 w-10 rounded-full object-cover"
								loading="lazy"
							/>
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
		<a href="/projects" class="text-primary hover:underline">プロジェクト一覧に戻る</a>
	</div>
{/if}
