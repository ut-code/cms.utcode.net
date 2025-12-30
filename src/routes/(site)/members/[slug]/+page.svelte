<script lang="ts">
	import { Github, Globe, Twitter } from "lucide-svelte";
	import Markdown from "$lib/components/Markdown.svelte";
	import type { PageData } from "./$types";

	const { data }: { data: PageData } = $props();

	const hasSocialLinks = $derived(
		data.member?.githubUrl || data.member?.twitterUrl || data.member?.websiteUrl,
	);
</script>

<svelte:head>
	{#if data.member}
		<title>{data.member.name} | ut.code();</title>
		<meta property="og:title" content={data.member.name} />
		{#if data.member.bio}
			<meta name="description" content={data.member.bio} />
			<meta property="og:description" content={data.member.bio} />
		{/if}
		{#if data.member.imageUrl}
			<meta property="og:image" content={data.member.imageUrl} />
		{/if}
	{/if}
</svelte:head>

{#if data.member}
	<article class="mx-auto max-w-3xl px-6 py-16">
		<a
			href="/members"
			class="mb-8 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900"
		>
			← メンバー一覧
		</a>

		<div class="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
			{#if data.member.imageUrl}
				<img
					src={data.member.imageUrl}
					alt={data.member.name}
					class="mb-4 aspect-square h-16 w-16 rounded-full object-cover sm:mb-6 sm:mr-6 sm:h-20 sm:w-20 md:mb-0"
					loading="lazy"
				/>
			{:else}
				<div
					class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 sm:mb-6 sm:mr-6 sm:h-20 sm:w-20 md:mb-0"
				>
					<span class="text-xl font-medium text-zinc-600 sm:text-2xl">
						{data.member.name.charAt(0)}
					</span>
				</div>
			{/if}

			<div>
				<h1 class="mb-2 text-2xl font-bold sm:text-3xl">{data.member.name}</h1>
				{#if data.member.bio}
					<p class="text-sm text-zinc-500 sm:text-base">{data.member.bio}</p>
				{/if}
				{#if hasSocialLinks}
					<div class="mt-3 flex gap-3">
						{#if data.member.githubUrl}
							<a
								href={data.member.githubUrl}
								target="_blank"
								rel="noopener noreferrer"
								class="text-zinc-400 transition-colors hover:text-zinc-900"
								aria-label="GitHub"
							>
								<Github class="h-5 w-5" />
							</a>
						{/if}
						{#if data.member.twitterUrl}
							<a
								href={data.member.twitterUrl}
								target="_blank"
								rel="noopener noreferrer"
								class="text-zinc-400 transition-colors hover:text-zinc-900"
								aria-label="Twitter"
							>
								<Twitter class="h-5 w-5" />
							</a>
						{/if}
						{#if data.member.websiteUrl}
							<a
								href={data.member.websiteUrl}
								target="_blank"
								rel="noopener noreferrer"
								class="text-zinc-400 transition-colors hover:text-zinc-900"
								aria-label="Website"
							>
								<Globe class="h-5 w-5" />
							</a>
						{/if}
					</div>
				{/if}
			</div>
		</div>

		{#if data.member.pageContent}
			<section class="mt-8 border-t border-zinc-200 pt-6 sm:mt-12 sm:pt-8">
				<Markdown content={data.member.pageContent} />
			</section>
		{/if}

		{#if data.member.projectMembers && data.member.projectMembers.length > 0}
			<section class="mt-8 border-t border-zinc-200 pt-6 sm:mt-12 sm:pt-8">
				<h2 class="mb-3 text-lg font-semibold sm:mb-4 sm:text-xl">参加プロジェクト</h2>
				<div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
					{#each data.member.projectMembers as pm (pm.projectId)}
						<a
							href="/projects/{pm.project.slug}"
							class="flex items-center gap-3 rounded-lg border border-zinc-200 px-4 py-3 transition-all hover:bg-primary/5 hover:border-primary/30"
						>
							{#if pm.project.coverUrl}
								<img
									src={pm.project.coverUrl}
									alt={pm.project.name}
									class="h-10 w-16 rounded object-cover"
									loading="lazy"
								/>
							{:else}
								<div class="flex h-10 w-10 items-center justify-center rounded bg-zinc-100">
									<span class="text-sm font-medium text-zinc-600">
										{pm.project.name.charAt(0)}
									</span>
								</div>
							{/if}
							<div>
								<div class="font-medium">{pm.project.name}</div>
								{#if pm.role}
									<div class="text-xs text-zinc-500">{pm.role}</div>
								{/if}
							</div>
						</a>
					{/each}
				</div>
			</section>
		{/if}
	</article>
{:else}
	<div class="mx-auto max-w-3xl px-6 py-16 text-center">
		<h1 class="mb-4 text-2xl font-bold">メンバーが見つかりません</h1>
		<a href="/members" class="text-primary hover:underline">メンバー一覧に戻る</a>
	</div>
{/if}
