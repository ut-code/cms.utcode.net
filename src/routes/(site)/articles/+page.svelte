<script lang="ts">
	import Pagination from "$lib/components/Pagination.svelte";
	import { ITEMS_PER_PAGE } from "$lib/shared/constants";
	import { resolveCoverUrl } from "$lib/shared/logic/image";
	import type { PageData } from "./$types";

	const { data }: { data: PageData } = $props();

	// Treat legacy `+/...` URLs as missing so the No-Image placeholder kicks in.
	function hasUsableCover(url: string | null | undefined): url is string {
		return !!url && !url.startsWith("+/");
	}

	const totalPages = $derived(Math.ceil(data.articles.length / ITEMS_PER_PAGE));
	const paginatedArticles = $derived(
		data.articles.slice((data.currentPage - 1) * ITEMS_PER_PAGE, data.currentPage * ITEMS_PER_PAGE),
	);

	function pageUrl(pageNum: number): string {
		return pageNum === 1 ? "/articles" : `/articles?page=${pageNum}`;
	}
</script>

<svelte:head>
	<title>記事一覧 | ut.code();</title>
	<meta property="og:title" content="記事一覧 | ut.code();" />
	<meta name="description" content="ut.code(); メンバーが執筆した記事やニュースをお届けします。" />
	<meta property="og:description" content="ut.code(); メンバーが執筆した記事やニュースをお届けします。" />
</svelte:head>

<!--
  Articles list — editorial register.
  Hero signature: `/// articles` mono eyebrow + entry counter on the right.
  Cards: cover image zooms gently on hover; meta row uses mono dot-separators.
  Scan: Z-pattern (eyebrow ▸ count ▸ title ▸ description ▸ grid).
-->
<!-- Header -->
<section class="relative overflow-hidden border-b border-zinc-200 bg-zinc-50/50 py-16">
	<!-- Subtle dot-grid decoration; muted enough to not compete with content -->
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
				<span aria-hidden="true" class="text-primary/50">///</span>
				<span>articles</span>
			</div>
			<div class="font-[JetBrains_Mono,monospace] text-xs text-zinc-500">
				{data.articles.length}
				<span class="text-zinc-400">entries</span>
			</div>
		</div>
		<h1 class="text-3xl font-bold tracking-tight sm:text-4xl">記事一覧</h1>
		<p class="max-w-2xl text-zinc-500">
			ut.code(); メンバーが執筆した記事やニュースをお届けします。
		</p>
	</div>
</section>

<div class="mx-auto max-w-6xl px-6 py-12">
	{#if data.articles.length === 0}
		<p class="text-zinc-500">まだ記事がありません。</p>
	{:else}
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each paginatedArticles as article (article.id)}
				<a
					href="/articles/{article.slug}"
					class="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200/60 bg-gradient-to-b from-white to-zinc-50/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
				>
					<!-- Image well: clipped so the inner image can scale on hover -->
					<div class="relative aspect-[5/3] w-full overflow-hidden bg-zinc-100">
						{#if hasUsableCover(article.coverUrl)}
							<img
								src={resolveCoverUrl(article.coverUrl)}
								alt={article.title}
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
						<!-- Hover underline rule on image bottom -->
						<div
							aria-hidden="true"
							class="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-primary transition-transform duration-500 motion-reduce:transition-none group-hover:scale-x-100"
						></div>
					</div>

					<div class="flex flex-1 flex-col p-6">
						<h2 class="mb-2 font-semibold leading-snug tracking-tight text-zinc-900 transition-colors group-hover:text-primary">
							{article.title}
						</h2>
						{#if article.excerpt}
							<p class="mb-4 line-clamp-2 text-sm leading-relaxed text-zinc-500">
								{article.excerpt}
							</p>
						{/if}
						<div class="mt-auto flex items-center gap-2 font-[JetBrains_Mono,monospace] text-[11px] text-zinc-500">
							{#if article.author}
								<span class="truncate">{article.author.name}</span>
								<span aria-hidden="true" class="text-zinc-300">·</span>
							{/if}
							{#if article.publishedAt}
								<time datetime={article.publishedAt.toISOString()} class="text-zinc-400">
									{article.publishedAt.toLocaleDateString("ja-JP")}
								</time>
							{/if}
						</div>
					</div>
				</a>
			{/each}
		</div>

		<Pagination currentPage={data.currentPage} {totalPages} {pageUrl} />
	{/if}
</div>
