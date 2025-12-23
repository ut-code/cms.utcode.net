<script lang="ts">
	import { Search } from "lucide-svelte";
	import { page } from "$app/state";
	import { searchPublic } from "$lib/data/public/index.remote";

	const query = $derived(page.url.searchParams.get("q") || "");
	const results = $derived(query ? await searchPublic(query) : []);

	const articleResults = $derived(results.filter((r) => r.type === "article"));
	const projectResults = $derived(results.filter((r) => r.type === "project"));
</script>

<svelte:head>
	<title>検索{query ? `: ${query}` : ""} | ut.code();</title>
	<meta property="og:title" content="検索{query ? `: ${query}` : ''} | ut.code();" />
</svelte:head>

<div class="mx-auto max-w-6xl px-6 py-16">
	<div
		class="mb-3 font-[JetBrains_Mono,monospace] text-xs font-medium tracking-widest text-[#00D372] uppercase"
	>
		Search
	</div>
	<h1 class="mb-8 text-3xl font-bold">検索結果</h1>

	{#if !query}
		<div class="flex flex-col items-center gap-4 py-16 text-center">
			<Search class="h-12 w-12 text-zinc-300" />
			<p class="text-zinc-500">検索キーワードを入力してください</p>
		</div>
	{:else if results.length === 0}
		<div class="flex flex-col items-center gap-4 py-16 text-center">
			<Search class="h-12 w-12 text-zinc-300" />
			<p class="text-zinc-500">「{query}」に一致する結果が見つかりませんでした</p>
		</div>
	{:else}
		<p class="mb-6 text-sm text-zinc-500">
			「{query}」の検索結果: {results.length}件
		</p>

		{#if articleResults.length > 0}
			<section class="mb-12">
				<h2 class="mb-4 text-xl font-semibold">記事 ({articleResults.length}件)</h2>
				<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{#each articleResults as article (article.id)}
						<a
							href="/articles/{article.slug}"
							class="group rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:border-[#00D372] hover:shadow-md"
						>
							{#if article.coverUrl}
								<img
									src={article.coverUrl}
									alt={article.title}
									class="mb-4 aspect-video w-full rounded-lg object-cover"
								/>
							{/if}
							<h3 class="mb-2 font-semibold group-hover:text-[#00D372]">{article.title}</h3>
							{#if article.excerpt}
								<p class="mb-4 line-clamp-2 text-sm text-zinc-500">{article.excerpt}</p>
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
			</section>
		{/if}

		{#if projectResults.length > 0}
			<section>
				<h2 class="mb-4 text-xl font-semibold">プロジェクト ({projectResults.length}件)</h2>
				<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{#each projectResults as project (project.id)}
						<a
							href="/projects/{project.slug}"
							class="group rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:border-[#00D372] hover:shadow-md"
						>
							{#if project.coverUrl}
								<img
									src={project.coverUrl}
									alt={project.name}
									class="mb-4 aspect-video w-full rounded-lg object-cover"
								/>
							{/if}
							<h3 class="mb-2 font-semibold group-hover:text-[#00D372]">{project.name}</h3>
							{#if project.description}
								<p class="mb-4 line-clamp-2 text-sm text-zinc-500">{project.description}</p>
							{/if}
						</a>
					{/each}
				</div>
			</section>
		{/if}
	{/if}
</div>
