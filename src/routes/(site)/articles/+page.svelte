<script lang="ts">
	import { SvelteURLSearchParams } from "svelte/reactivity";
	import { page } from "$app/state";
	import { getPublicArticles } from "$lib/data/public/index.remote";

	const articles = $derived(await getPublicArticles());
	const itemsPerPage = 12;

	const currentPage = $derived(Number(page.url.searchParams.get("page")) || 1);
	const totalPages = $derived(Math.ceil(articles.length / itemsPerPage));
	const paginatedArticles = $derived(
		articles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
	);

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
	<title>記事一覧 | ut.code();</title>
	<meta property="og:title" content="記事一覧 | ut.code();" />
</svelte:head>

<!-- Header -->
<section class="border-b border-zinc-200 bg-zinc-50/50 py-16">
	<div class="mx-auto max-w-6xl px-6">
		<div
			class="mb-3 font-[JetBrains_Mono,monospace] text-xs font-medium tracking-widest text-[#00D372] uppercase"
		>
			Articles
		</div>
		<h1 class="mb-2 text-3xl font-bold">記事一覧</h1>
		<p class="text-zinc-500">ut.code(); メンバーが執筆した記事やニュースをお届けします。</p>
	</div>
</section>

<div class="mx-auto max-w-6xl px-6 py-12">
	{#if articles.length === 0}
		<p class="text-zinc-500">まだ記事がありません。</p>
	{:else}
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each paginatedArticles as article (article.id)}
				<a
					href="/articles/{article.slug}"
					class="group rounded-2xl border border-zinc-200/50 bg-white/80 backdrop-blur-md p-6 transition-all hover:border-[#00D372] hover:shadow-lg hover:shadow-[#00D372]/5"
				>
					{#if article.coverUrl}
						<img
							src={article.coverUrl}
							alt={article.title}
							class="mb-4 aspect-video w-full rounded-xl object-cover"
						/>
					{/if}
					<h2 class="mb-2 font-semibold transition-colors group-hover:text-[#00D372]">
						{article.title}
					</h2>
					{#if article.excerpt}
						<p class="mb-4 line-clamp-2 text-sm leading-relaxed text-zinc-500">{article.excerpt}</p>
					{/if}
					<div class="flex items-center gap-2 text-xs text-zinc-400">
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

		{#if articles.length > itemsPerPage}
			<div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-2">
				{#if currentPage > 1}
					<a
						href={pageUrl(currentPage - 1)}
						class="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-center text-sm font-medium transition-colors hover:border-[#00D372] hover:text-[#00D372] sm:w-auto"
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

				<div class="flex flex-wrap items-center justify-center gap-1">
					{#each Array.from({ length: totalPages }, (_, i) => i + 1) as pageNum (pageNum)}
						{#if totalPages <= 7 || pageNum === 1 || pageNum === totalPages || Math.abs(pageNum - currentPage) <= 1}
							<a
								href={pageUrl(pageNum)}
								class="min-w-[2.5rem] rounded-lg border px-3 py-2 text-center text-sm font-medium transition-colors {currentPage ===
								pageNum
									? 'border-[#00D372] bg-[#00D372] text-white'
									: 'border-zinc-200 bg-white hover:border-[#00D372] hover:text-[#00D372]'}"
							>
								{pageNum}
							</a>
						{:else if pageNum === currentPage - 2 || pageNum === currentPage + 2}
							<span class="px-1 text-zinc-400">...</span>
						{/if}
					{/each}
				</div>

				{#if currentPage < totalPages}
					<a
						href={pageUrl(currentPage + 1)}
						class="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-center text-sm font-medium transition-colors hover:border-[#00D372] hover:text-[#00D372] sm:w-auto"
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
