<script lang="ts">
	import Pagination from "$lib/components/Pagination.svelte";
	import { ITEMS_PER_PAGE } from "$lib/shared/constants";
	import type { PageData } from "./$types";

	const { data }: { data: PageData } = $props();

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
</svelte:head>

<!-- Header -->
<section class="border-b border-zinc-200 bg-zinc-50/50 py-16">
	<div class="mx-auto max-w-6xl px-6">
		<div
			class="mb-3 font-[JetBrains_Mono,monospace] text-xs font-medium tracking-widest text-primary uppercase"
		>
			Articles
		</div>
		<h1 class="mb-2 text-3xl font-bold">記事一覧</h1>
		<p class="text-zinc-500">ut.code(); メンバーが執筆した記事やニュースをお届けします。</p>
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
					class="group rounded-2xl border border-zinc-200/50 bg-white/80 backdrop-blur-md p-6 transition-all hover:bg-primary/5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
				>
					{#if article.coverUrl}
						<img
							src={article.coverUrl}
							alt={article.title}
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
					<h2 class="mb-2 font-semibold transition-colors group-hover:text-primary">
						{article.title}
					</h2>
					{#if article.excerpt}
						<p class="mb-4 line-clamp-2 text-sm leading-relaxed text-zinc-500">{article.excerpt}</p>
					{/if}
					<div class="flex items-center gap-2 text-xs text-zinc-500">
						{#if article.author}
							<span>{article.author.name}</span>
							<span>·</span>
						{/if}
						{#if article.publishedAt}
							<time datetime={article.publishedAt.toISOString()}>
								{article.publishedAt.toLocaleDateString("ja-JP")}
							</time>
						{/if}
					</div>
				</a>
			{/each}
		</div>

		<Pagination currentPage={data.currentPage} {totalPages} {pageUrl} />
	{/if}
</div>
