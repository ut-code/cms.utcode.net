<script lang="ts">
	import { Github, Globe, Twitter } from "lucide-svelte";
	import Markdown from "$lib/components/Markdown.svelte";
	import { safeJsonLd } from "$lib/shared/logic/json-ld";
	import type { PageData } from "./$types";

	const { data }: { data: PageData } = $props();

	const hasSocialLinks = $derived(
		data.member?.githubUrl || data.member?.twitterUrl || data.member?.websiteUrl,
	);
</script>

<svelte:head>
	{#if data.member}
		<title>{data.member.name} | ut.code();</title>
		<meta property="og:title" content="{data.member.name} | ut.code();" />
		<meta name="twitter:title" content="{data.member.name} | ut.code();" />
		{#if data.member.bio}
			<meta name="description" content={data.member.bio} />
			<meta property="og:description" content={data.member.bio} />
			<meta name="twitter:description" content={data.member.bio} />
		{/if}
		{#if data.member.imageUrl}
			<meta property="og:image" content={data.member.imageUrl} />
			<meta name="twitter:image" content={data.member.imageUrl} />
		{/if}
		{@html `<script type="application/ld+json">${safeJsonLd({
			"@context": "https://schema.org",
			"@type": "Person",
			name: data.member.name,
			...(data.member.bio && { description: data.member.bio }),
			...(data.member.imageUrl && { image: data.member.imageUrl }),
			url: `https://cms.utcode.net/members/${data.member.slug}`,
			memberOf: { "@type": "Organization", name: "ut.code();" },
			...(data.member.githubUrl && { sameAs: [data.member.githubUrl, data.member.twitterUrl, data.member.websiteUrl].filter(Boolean) }),
		})}</script>`}
	{/if}
</svelte:head>

<!--
  Member detail — profile register.
  Hero: avatar lifted with outer ring + offset shadow. Handle (@slug) is shown in mono under the name.
  Social row uses labeled pills (not bare icons) for clearer affordance.
-->
{#if data.member}
	<article class="mx-auto max-w-3xl px-6 pt-12 pb-16 sm:pt-16">
		<a
			href="/members"
			class="group mb-10 inline-flex items-center gap-2 font-[JetBrains_Mono,monospace] text-xs tracking-wider text-zinc-500 uppercase transition-colors hover:text-zinc-900"
		>
			<span aria-hidden="true" class="transition-transform group-hover:-translate-x-0.5">←</span>
			members
		</a>

		<div class="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
			<!-- Avatar wrapper with halo ring -->
			<div class="relative mb-5 sm:mb-0 sm:mr-7">
				<div
					aria-hidden="true"
					class="absolute -inset-2 rounded-full ring-1 ring-primary/20 [box-shadow:0_0_0_6px_oklch(76%_0.2_153/0.05)]"
				></div>
				{#if data.member.imageUrl}
					<img
						src={data.member.imageUrl}
						alt={data.member.name}
						class="relative aspect-square h-24 w-24 rounded-full object-cover ring-2 ring-white shadow-md sm:h-28 sm:w-28"
						loading="lazy"
						decoding="async"
					/>
				{:else}
					<div class="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200 ring-2 ring-white shadow-md sm:h-28 sm:w-28">
						<span class="font-[JetBrains_Mono,monospace] text-3xl font-medium text-zinc-600 sm:text-4xl">
							{data.member.name.charAt(0)}
						</span>
					</div>
				{/if}
			</div>

			<div class="min-w-0 flex-1">
				<!-- Mono handle eyebrow -->
				<div class="mb-2 font-[JetBrains_Mono,monospace] text-[11px] tracking-widest text-primary uppercase">
					<span aria-hidden="true" class="text-primary/50">@</span>{data.member.slug}
				</div>
				<h1 class="mb-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl md:text-4xl">
					{data.member.name}
				</h1>
				{#if data.member.bio}
					<p class="text-sm leading-relaxed text-zinc-600 break-words sm:text-base">
						{data.member.bio}
					</p>
				{/if}
				{#if hasSocialLinks}
					<div class="mt-5 flex flex-wrap justify-center gap-2 sm:justify-start">
						{#if data.member.githubUrl}
							<a
								href={data.member.githubUrl}
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex min-h-11 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 font-[JetBrains_Mono,monospace] text-xs text-zinc-600 transition-all hover:-translate-y-px hover:border-zinc-900 hover:bg-zinc-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
								aria-label="GitHub"
							>
								<Github class="h-4 w-4" />
								github
							</a>
						{/if}
						{#if data.member.twitterUrl}
							<a
								href={data.member.twitterUrl}
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex min-h-11 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 font-[JetBrains_Mono,monospace] text-xs text-zinc-600 transition-all hover:-translate-y-px hover:border-primary/40 hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
								aria-label="Twitter"
							>
								<Twitter class="h-4 w-4" />
								twitter
							</a>
						{/if}
						{#if data.member.websiteUrl}
							<a
								href={data.member.websiteUrl}
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex min-h-11 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 font-[JetBrains_Mono,monospace] text-xs text-zinc-600 transition-all hover:-translate-y-px hover:border-primary/40 hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
								aria-label="Website"
							>
								<Globe class="h-4 w-4" />
								website
							</a>
						{/if}
					</div>
				{/if}
			</div>
		</div>

		{#if data.member.pageContent}
			<section class="mt-10 border-t border-zinc-200 pt-8 sm:mt-12 sm:pt-10">
				<Markdown content={data.member.pageContent} />
			</section>
		{/if}

		{#if data.member.projectMembers && data.member.projectMembers.length > 0}
			<section class="mt-10 border-t border-zinc-200 pt-8 sm:mt-12 sm:pt-10">
				<div class="mb-5 flex items-center gap-2 font-[JetBrains_Mono,monospace] text-xs tracking-widest text-primary uppercase">
					<span aria-hidden="true" class="text-primary/50">&lt;</span>
					<span>projects · {data.member.projectMembers.length}</span>
					<span aria-hidden="true" class="text-primary/50">/&gt;</span>
				</div>
				<h2 class="mb-5 text-lg font-semibold tracking-tight sm:text-xl">参加プロジェクト</h2>
				<div class="grid gap-3 sm:grid-cols-2">
					{#each data.member.projectMembers as pm (pm.projectId)}
						<a
							href="/projects/{pm.project.slug}"
							class="group flex items-center gap-3 overflow-hidden rounded-xl border border-zinc-200/60 bg-white px-3 py-3 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
						>
							{#if pm.project.coverUrl}
								<img
									src={pm.project.coverUrl}
									alt={pm.project.name}
									class="aspect-[5/3] h-12 w-20 rounded-md border border-zinc-200/60 object-cover"
									loading="lazy"
								/>
							{:else}
								<div class="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-br from-zinc-100 to-zinc-200">
									<span class="font-[JetBrains_Mono,monospace] text-sm font-medium text-zinc-600">
										{pm.project.name.charAt(0)}
									</span>
								</div>
							{/if}
							<div class="min-w-0 flex-1">
								<div class="truncate font-medium text-zinc-900 transition-colors group-hover:text-primary">
									{pm.project.name}
								</div>
								{#if pm.role}
									<div class="truncate font-[JetBrains_Mono,monospace] text-[11px] text-zinc-500">
										{pm.role}
									</div>
								{/if}
							</div>
							<span aria-hidden="true" class="font-[JetBrains_Mono,monospace] text-zinc-300 transition-all group-hover:translate-x-0.5 group-hover:text-primary">→</span>
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
		<h1 class="mb-4 text-2xl font-bold">メンバーが見つかりません</h1>
		<a
			href="/members"
			class="inline-flex items-center gap-2 font-[JetBrains_Mono,monospace] text-sm text-primary hover:underline"
		>
			<span aria-hidden="true">←</span>
			メンバー一覧に戻る
		</a>
	</div>
{/if}
