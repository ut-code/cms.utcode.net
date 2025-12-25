<script lang="ts">
	import { Search } from "lucide-svelte";
	import type { PageData } from "./$types";

	const { data }: { data: PageData } = $props();

	const articleResults = $derived(data.results.filter((r) => r.type === "article"));
	const projectResults = $derived(data.results.filter((r) => r.type === "project"));
	const memberResults = $derived(data.results.filter((r) => r.type === "member"));
</script>

<svelte:head>
	<title>検索{data.query ? `: ${data.query}` : ""} | ut.code();</title>
	<meta property="og:title" content="検索{data.query ? `: ${data.query}` : ''} | ut.code();" />
</svelte:head>

<div class="mx-auto max-w-6xl px-6 py-16">
	<div
		class="mb-3 font-[JetBrains_Mono,monospace] text-xs font-medium tracking-widest text-primary uppercase"
	>
		Search
	</div>
	<h1 class="mb-8 text-3xl font-bold">検索結果</h1>

	{#if !data.query}
		<div class="flex flex-col items-center gap-4 py-16 text-center">
			<Search class="h-12 w-12 text-zinc-300" />
			<p class="text-zinc-500">検索キーワードを入力してください</p>
		</div>
	{:else if data.results.length === 0}
		<div class="flex flex-col items-center gap-4 py-16 text-center">
			<Search class="h-12 w-12 text-zinc-300" />
			<p class="text-zinc-500">「{data.query}」に一致する結果が見つかりませんでした</p>
		</div>
	{:else}
		<p class="mb-6 text-sm text-zinc-500">
			「{data.query}」の検索結果: {data.results.length}件
		</p>

		{#if articleResults.length > 0}
			<section class="mb-12">
				<h2 class="mb-4 text-xl font-semibold">記事 ({articleResults.length}件)</h2>
				<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{#each articleResults as article (article.id)}
						<a
							href="/articles/{article.slug}"
							class="group rounded-xl border border-zinc-200/50 bg-white/80 backdrop-blur-md p-6 transition-all hover:bg-primary/5 hover:border-primary/30 hover:shadow-md"
						>
							{#if article.coverUrl}
								<img
									src={article.coverUrl}
									alt={article.title}
									class="mb-4 aspect-[5/3] w-full rounded-lg object-cover"
									loading="lazy"
								/>
							{:else}
								<div
									class="mb-4 flex aspect-[5/3] w-full items-center justify-center rounded-lg bg-gradient-to-br from-zinc-100 to-zinc-200"
								>
									<span class="font-[JetBrains_Mono,monospace] text-sm font-medium text-zinc-400">
										No Image
									</span>
								</div>
							{/if}
							<h3 class="mb-2 font-semibold group-hover:text-primary">{article.title}</h3>
							{#if article.excerpt}
								<p class="mb-4 line-clamp-2 text-sm text-zinc-500">{article.excerpt}</p>
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
			</section>
		{/if}

		{#if projectResults.length > 0}
			<section class="mb-12">
				<h2 class="mb-4 text-xl font-semibold">プロジェクト ({projectResults.length}件)</h2>
				<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{#each projectResults as project (project.id)}
						<a
							href="/projects/{project.slug}"
							class="group rounded-xl border border-zinc-200/50 bg-white/80 backdrop-blur-md p-6 transition-all hover:bg-primary/5 hover:border-primary/30 hover:shadow-md"
						>
							{#if project.coverUrl}
								<img
									src={project.coverUrl}
									alt={project.name}
									class="mb-4 aspect-[5/3] w-full rounded-lg object-cover"
									loading="lazy"
								/>
							{:else}
								<div
									class="mb-4 flex aspect-[5/3] w-full items-center justify-center rounded-lg bg-gradient-to-br from-zinc-100 to-zinc-200"
								>
									<span class="font-[JetBrains_Mono,monospace] text-sm font-medium text-zinc-400">
										No Image
									</span>
								</div>
							{/if}
							<h3 class="mb-2 font-semibold group-hover:text-primary">{project.name}</h3>
							{#if project.description}
								<p class="mb-4 line-clamp-2 text-sm text-zinc-500">{project.description}</p>
							{/if}
						</a>
					{/each}
				</div>
			</section>
		{/if}

		{#if memberResults.length > 0}
			<section>
				<h2 class="mb-4 text-xl font-semibold">メンバー ({memberResults.length}件)</h2>
				<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{#each memberResults as member (member.id)}
						<a
							href="/members/{member.slug}"
							class="group rounded-xl border border-zinc-200/50 bg-white/80 backdrop-blur-md p-6 transition-all hover:bg-primary/5 hover:border-primary/30 hover:shadow-md"
						>
							<h3 class="mb-2 font-semibold group-hover:text-primary">{member.name}</h3>
							{#if member.bio}
								<p class="mb-4 line-clamp-2 text-sm text-zinc-500">{member.bio}</p>
							{/if}
						</a>
					{/each}
				</div>
			</section>
		{/if}
	{/if}
</div>
