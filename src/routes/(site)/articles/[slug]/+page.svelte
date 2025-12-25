<script lang="ts">
	import Markdown from "$lib/components/Markdown.svelte";
	import type { PageData } from "./$types";

	const { data }: { data: PageData } = $props();
	
</script>

<svelte:head>
	{#if data.article}
		<title>{data.article.title} | ut.code();</title>
		<meta property="og:title" content={data.article.title} />
		{#if data.article.excerpt}
			<meta name="description" content={data.article.excerpt} />
			<meta property="og:description" content={data.article.excerpt} />
		{/if}
		{#if data.article.coverUrl}
			<meta property="og:image" content={data.article.coverUrl} />
		{/if}
		<meta property="og:type" content="article" />
	{/if}
</svelte:head>

{#if data.article}
	<article class="mx-auto max-w-3xl px-6 py-16">
		<a
			href="/articles"
			class="mb-8 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900"
		>
			← 記事一覧
		</a>

		{#if data.article.coverUrl}
			<img
				src={data.article.coverUrl}
				alt={data.article.title}
				class="mb-6 aspect-[5/3] w-full rounded-xl object-cover sm:mb-8"
				loading="lazy"
			/>
		{/if}

		<h1 class="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl md:text-4xl">{data.article.title}</h1>

		<div class="mb-6 flex flex-wrap items-center gap-3 text-sm text-zinc-500 sm:mb-8 sm:gap-4">
			{#if data.article.author}
				<a
					href="/members/{data.article.author.slug}"
					class="flex items-center gap-2 hover:text-zinc-900"
				>
					{#if data.article.author.imageUrl}
						<img
							src={data.article.author.imageUrl}
							alt={data.article.author.name}
							class="aspect-square h-6 w-6 rounded-full object-cover"
							loading="lazy"
						/>
					{/if}
					{data.article.author.name}
				</a>
			{/if}
			{#if data.article.publishedAt}
				<time datetime={data.article.publishedAt.toISOString()}>
					{data.article.publishedAt.toLocaleDateString("ja-JP")}
				</time>
			{/if}
		</div>

		<Markdown content={data.article.content} />
	</article>

	{#if data.relatedArticles.length > 0}
		<section class="mx-auto max-w-3xl px-6 pb-16">
			<div class="border-t border-zinc-200 pt-8 sm:pt-12">
				<h2 class="mb-4 text-xl font-bold sm:mb-6 sm:text-2xl">関連記事</h2>
				<div class="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
					{#each data.relatedArticles as relatedArticle (relatedArticle.id)}
						<a
							href="/articles/{relatedArticle.slug}"
							class="group rounded-xl border border-zinc-200/50 bg-white/80 backdrop-blur-md p-4 transition-all hover:bg-primary/5 hover:border-primary/30 hover:shadow-md"
						>
							{#if relatedArticle.coverUrl}
								<img
									src={relatedArticle.coverUrl}
									alt={relatedArticle.title}
									class="mb-3 aspect-[5/3] w-full rounded-lg object-cover"
									loading="lazy"
								/>
							{/if}
							<h3 class="mb-2 font-semibold group-hover:text-primary">
								{relatedArticle.title}
							</h3>
							{#if relatedArticle.excerpt}
								<p class="mb-3 line-clamp-2 text-sm text-zinc-500">{relatedArticle.excerpt}</p>
							{/if}
							<div class="flex items-center gap-2 text-xs text-zinc-500">
								{#if relatedArticle.author}
									<span>{relatedArticle.author.name}</span>
									<span>·</span>
								{/if}
								{#if relatedArticle.publishedAt}
									<time datetime={relatedArticle.publishedAt.toISOString()}>
										{relatedArticle.publishedAt.toLocaleDateString("ja-JP")}
									</time>
								{/if}
							</div>
						</a>
					{/each}
				</div>
			</div>
		</section>
	{/if}
{:else}
	<div class="mx-auto max-w-3xl px-6 py-16 text-center">
		<h1 class="mb-4 text-2xl font-bold">記事が見つかりません</h1>
		<a href="/articles" class="text-primary hover:underline">記事一覧に戻る</a>
	</div>
{/if}
