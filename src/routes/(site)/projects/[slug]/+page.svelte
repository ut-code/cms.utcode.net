<script lang="ts">
	import { Github } from "lucide-svelte";
	import Markdown from "$lib/components/Markdown.svelte";
	import { CATEGORY_COLORS } from "$lib/shared/constants";
	import { PROJECT_CATEGORIES } from "$lib/shared/models/schema";
	import type { PageData } from "./$types";

	const { data }: { data: PageData } = $props();
</script>

<svelte:head>
	{#if data.project}
		<title>{data.project.name} | ut.code();</title>
		<meta property="og:title" content="{data.project.name} | ut.code();" />
		<meta name="twitter:title" content="{data.project.name} | ut.code();" />
		{#if data.project.description}
			<meta name="description" content={data.project.description} />
			<meta property="og:description" content={data.project.description} />
			<meta name="twitter:description" content={data.project.description} />
		{/if}
		{#if data.project.coverUrl}
			<meta property="og:image" content={data.project.coverUrl} />
			<meta name="twitter:image" content={data.project.coverUrl} />
		{/if}
	{/if}
</svelte:head>

<!--
  Project detail — product-launch register.
  Hero scan: back-link ▸ category eyebrow ▸ name (big) ▸ description ▸ CTA row (primary action wins) ▸ cover ▸ body ▸ members.
-->
{#if data.project}
	<article class="mx-auto max-w-3xl px-6 pt-12 pb-16 sm:pt-16">
		<a
			href="/projects"
			class="group mb-10 inline-flex items-center gap-2 font-[JetBrains_Mono,monospace] text-xs tracking-wider text-zinc-500 uppercase transition-colors hover:text-zinc-900"
		>
			<span aria-hidden="true" class="transition-transform group-hover:-translate-x-0.5">←</span>
			projects
		</a>

		<!-- Eyebrow: project tag + category badge -->
		<div class="mb-4 flex flex-wrap items-center gap-3">
			<div class="flex items-center gap-2 font-[JetBrains_Mono,monospace] text-[11px] tracking-widest text-primary uppercase">
				<span aria-hidden="true" class="text-primary/50">&lt;</span>
				<span>project</span>
				<span aria-hidden="true" class="text-primary/50">/&gt;</span>
			</div>
			<span
				class="inline-flex items-center rounded-md border px-2 py-0.5 font-[JetBrains_Mono,monospace] text-[10px] font-medium {CATEGORY_COLORS[data.project.category]}"
			>
				{PROJECT_CATEGORIES[data.project.category]}
			</span>
		</div>

		<h1 class="mb-5 text-3xl font-bold leading-tight tracking-tight text-zinc-900 sm:mb-6 sm:text-4xl md:text-5xl">
			{data.project.name}
		</h1>

		{#if data.project.description}
			<p class="mb-8 max-w-2xl text-base leading-relaxed text-zinc-600 sm:text-lg">
				{data.project.description}
			</p>
		{/if}

		{#if data.project.repoUrl || data.project.demoUrl}
			<div class="mb-10 flex flex-wrap gap-3 sm:mb-12">
				{#if data.project.demoUrl}
					<a
						href={data.project.demoUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="group inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-zinc-900 shadow-md shadow-primary/20 transition-all hover:-translate-y-px hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
					>
						Live Demo
						<span aria-hidden="true" class="transition-transform group-hover:translate-x-0.5">→</span>
					</a>
				{/if}
				{#if data.project.repoUrl}
					<a
						href={data.project.repoUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex min-h-11 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-900 transition-all hover:-translate-y-px hover:border-zinc-900 hover:bg-zinc-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
					>
						<Github class="h-4 w-4" />
						View on GitHub
					</a>
				{/if}
			</div>
		{/if}

		{#if data.project.coverUrl}
			<figure class="mb-10 sm:mb-12">
				<img
					src={data.project.coverUrl}
					alt={data.project.name}
					class="w-full rounded-xl border border-zinc-200/60 shadow-sm"
					loading="lazy"
				/>
			</figure>
		{/if}

		{#if data.project.content}
			<Markdown content={data.project.content} />
		{/if}

		{#if data.project.projectMembers.length > 0}
			<section class="mt-10 border-t border-zinc-200 pt-8 sm:mt-12 sm:pt-10">
				<div class="mb-6 flex items-center gap-2 font-[JetBrains_Mono,monospace] text-xs tracking-widest text-primary uppercase">
					<span aria-hidden="true" class="text-primary/50">@</span>
					<span>team · {data.project.projectMembers.length}</span>
				</div>
				<h2 class="mb-5 text-lg font-semibold tracking-tight sm:text-xl">メンバー</h2>
				<div class="grid gap-3 sm:grid-cols-2">
					{#each data.project.projectMembers as pm (pm.memberId)}
						<a
							href="/members/{pm.member.slug}"
							class="group flex items-center gap-3 rounded-xl border border-zinc-200/60 bg-white px-4 py-3 transition-all hover:-translate-y-0.5 hover:bg-primary/5 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
						>
							{#if pm.member.imageUrl}
								<img
									src={pm.member.imageUrl}
									alt={pm.member.name}
									class="aspect-square h-11 w-11 rounded-full object-cover ring-2 ring-zinc-100 transition-all group-hover:ring-primary/30"
									loading="lazy"
								/>
							{:else}
								<div class="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200 ring-2 ring-zinc-100 transition-all group-hover:ring-primary/30">
									<span class="font-[JetBrains_Mono,monospace] text-sm font-medium text-zinc-600">
										{pm.member.name.charAt(0)}
									</span>
								</div>
							{/if}
							<div class="min-w-0">
								<div class="truncate font-medium text-zinc-900 transition-colors group-hover:text-primary">
									{pm.member.name}
								</div>
								{#if pm.role}
									<div class="truncate font-[JetBrains_Mono,monospace] text-[11px] text-zinc-500">
										{pm.role}
									</div>
								{/if}
							</div>
						</a>
					{/each}
				</div>
			</section>
		{/if}
	</article>
{:else}
	<div class="mx-auto max-w-3xl px-6 py-24 text-center">
		<div class="mb-3 font-[JetBrains_Mono,monospace] text-xs tracking-widest text-primary uppercase">
			404
		</div>
		<h1 class="mb-4 text-2xl font-bold">プロジェクトが見つかりません</h1>
		<a
			href="/projects"
			class="inline-flex items-center gap-2 font-[JetBrains_Mono,monospace] text-sm text-primary hover:underline"
		>
			<span aria-hidden="true">←</span>
			プロジェクト一覧に戻る
		</a>
	</div>
{/if}
