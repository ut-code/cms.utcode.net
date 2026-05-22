<script lang="ts">
	import Markdown from "$lib/components/Markdown.svelte";
	import { resolveCoverUrl } from "$lib/shared/logic/image";
	import { safeJsonLd } from "$lib/shared/logic/json-ld";
	import type { PageData } from "./$types";

	const { data }: { data: PageData } = $props();

	// Normalize cover URL (handles legacy `+/...` migration values and nulls).
	// See `resolveCoverUrl` for context.
	const coverUrl = $derived(data.article ? resolveCoverUrl(data.article.coverUrl) : null);
</script>

<svelte:head>
	{#if data.article}
		<title>{data.article.title} | ut.code();</title>
		<meta property="og:title" content={data.article.title} />
		<meta property="og:type" content="article" />
		{#if data.article.excerpt}
			<meta name="description" content={data.article.excerpt} />
			<meta property="og:description" content={data.article.excerpt} />
			<meta name="twitter:description" content={data.article.excerpt} />
		{/if}
		{#if coverUrl}
			<meta property="og:image" content={coverUrl} />
			<meta name="twitter:image" content={coverUrl} />
		{/if}
		<meta name="twitter:title" content={data.article.title} />
		{#if data.article.publishedAt}
			<meta property="article:published_time" content={data.article.publishedAt.toISOString()} />
		{/if}
		{@html `<script type="application/ld+json">${safeJsonLd({
			"@context": "https://schema.org",
			"@type": "Article",
			headline: data.article.title,
			...(data.article.excerpt && { description: data.article.excerpt }),
			...(coverUrl && { image: coverUrl }),
			...(data.article.publishedAt && { datePublished: data.article.publishedAt.toISOString() }),
			dateModified: data.article.updatedAt.toISOString(),
			...(data.article.author && {
				author: {
					"@type": "Person",
					name: data.article.author.name,
					url: `https://cms.utcode.net/members/${data.article.author.slug}`,
				},
			}),
			publisher: {
				"@type": "Organization",
				name: "ut.code();",
				logo: { "@type": "ImageObject", url: "https://cms.utcode.net/og-image.svg" },
			},
			mainEntityOfPage: `https://cms.utcode.net/articles/${data.article.slug}`,
		})}</script>`}
	{/if}
</svelte:head>

<!--
  Article detail — editorial register.
  Hero scan: back-link ▸ mono eyebrow w/ date ▸ title ▸ author row ▸ cover (anchor) ▸ body.
  Cover is placed AFTER title for an editorial cadence (title-first scan).
-->
{#if data.article}
	<article class="mx-auto max-w-3xl px-6 pt-12 pb-16 sm:pt-16">
		<a
			href="/articles"
			class="group mb-10 inline-flex items-center gap-2 font-[JetBrains_Mono,monospace] text-xs tracking-wider text-zinc-500 uppercase transition-colors hover:text-zinc-900"
		>
			<span aria-hidden="true" class="transition-transform group-hover:-translate-x-0.5">←</span>
			articles
		</a>

		<!-- Eyebrow with type + date for editorial header -->
		<div class="mb-4 flex items-center gap-3 font-[JetBrains_Mono,monospace] text-[11px] tracking-widest text-primary uppercase">
			<span aria-hidden="true" class="text-primary/50">///</span>
			<span>article</span>
			{#if data.article.publishedAt}
				<span aria-hidden="true" class="text-zinc-300">·</span>
				<time
					datetime={data.article.publishedAt.toISOString()}
					class="text-zinc-500 normal-case"
				>
					{data.article.publishedAt.toLocaleDateString("ja-JP", {
						year: "numeric",
						month: "long",
						day: "numeric",
					})}
				</time>
			{/if}
		</div>

		<h1 class="mb-6 text-3xl font-bold leading-tight tracking-tight text-zinc-900 sm:mb-8 sm:text-4xl md:text-5xl">
			{data.article.title}
		</h1>

		{#if data.article.author}
			<div class="mb-8 flex items-center gap-3 border-y border-zinc-200/70 py-4 sm:mb-10">
				<a
					href="/members/{data.article.author.slug}"
					class="group flex items-center gap-3 text-sm text-zinc-600 transition-colors hover:text-zinc-900"
				>
					{#if data.article.author.imageUrl}
						<img
							src={data.article.author.imageUrl}
							alt={data.article.author.name}
							class="aspect-square h-9 w-9 rounded-full object-cover ring-2 ring-zinc-100 transition-all group-hover:ring-primary/30"
							loading="lazy"
						/>
					{:else}
						<div class="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 ring-2 ring-zinc-100 transition-all group-hover:ring-primary/30">
							<span class="font-[JetBrains_Mono,monospace] text-sm font-medium text-zinc-600">
								{data.article.author.name.charAt(0)}
							</span>
						</div>
					{/if}
					<div class="flex flex-col">
						<span class="font-medium text-zinc-900 transition-colors group-hover:text-primary">
							{data.article.author.name}
						</span>
						<span class="font-[JetBrains_Mono,monospace] text-[10px] tracking-wider text-zinc-400 uppercase">
							author
						</span>
					</div>
				</a>
			</div>
		{/if}

		{#if coverUrl}
			<figure class="mb-10 sm:mb-12">
				<img
					src={coverUrl}
					alt={data.article.title}
					class="aspect-[5/3] w-full rounded-xl border border-zinc-200/60 object-cover shadow-sm"
					loading="lazy"
				/>
			</figure>
		{/if}

		<Markdown content={data.article.content} />
	</article>

	{#if data.relatedArticles.length > 0}
		<section class="mx-auto max-w-3xl px-6 pb-16">
			<div class="border-t border-zinc-200 pt-10 sm:pt-12">
				<div class="mb-6 flex items-center gap-2 font-[JetBrains_Mono,monospace] text-xs tracking-widest text-primary uppercase">
					<span aria-hidden="true" class="text-primary/50">↳</span>
					<span>related</span>
				</div>
				<h2 class="mb-6 text-xl font-bold tracking-tight sm:text-2xl">関連記事</h2>
				<div class="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
					{#each data.relatedArticles as relatedArticle (relatedArticle.id)}
						<a
							href="/articles/{relatedArticle.slug}"
							class="group flex flex-col overflow-hidden rounded-xl border border-zinc-200/60 bg-gradient-to-b from-white to-zinc-50/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
						>
							<div class="aspect-[5/3] w-full overflow-hidden bg-zinc-100">
								<img
									src={resolveCoverUrl(relatedArticle.coverUrl)}
									alt={relatedArticle.title}
									class="h-full w-full object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-[1.04]"
									loading="lazy"
								/>
							</div>
							<div class="flex flex-1 flex-col p-4">
								<h3 class="mb-2 font-semibold leading-snug text-zinc-900 transition-colors group-hover:text-primary">
									{relatedArticle.title}
								</h3>
								{#if relatedArticle.excerpt}
									<p class="mb-3 line-clamp-2 text-sm text-zinc-500">{relatedArticle.excerpt}</p>
								{/if}
								<div class="mt-auto flex items-center gap-2 font-[JetBrains_Mono,monospace] text-[11px] text-zinc-500">
									{#if relatedArticle.author}
										<span class="truncate">{relatedArticle.author.name}</span>
										<span aria-hidden="true" class="text-zinc-300">·</span>
									{/if}
									{#if relatedArticle.publishedAt}
										<time datetime={relatedArticle.publishedAt.toISOString()} class="text-zinc-400">
											{relatedArticle.publishedAt.toLocaleDateString("ja-JP")}
										</time>
									{/if}
								</div>
							</div>
						</a>
					{/each}
				</div>
			</div>
		</section>
	{/if}
{:else}
	<div class="mx-auto max-w-3xl px-6 py-24 text-center">
		<div class="mb-3 font-[JetBrains_Mono,monospace] text-xs tracking-widest text-primary uppercase">
			404
		</div>
		<h1 class="mb-4 text-2xl font-bold">記事が見つかりません</h1>
		<a
			href="/articles"
			class="inline-flex items-center gap-2 font-[JetBrains_Mono,monospace] text-sm text-primary hover:underline"
		>
			<span aria-hidden="true">←</span>
			記事一覧に戻る
		</a>
	</div>
{/if}
