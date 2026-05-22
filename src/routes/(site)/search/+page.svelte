<!--
  Search — terminal/query register.
  Hero scan: eyebrow ▸ title ▸ search input (autofocus when no query) ▸ results.
  Results are grouped by type with a mono section header carrying a type glyph.
  Empty state uses a blinking caret to suggest "type a query".
-->
<script lang="ts">
	import { goto } from "$app/navigation";
	import { FileText, Folder, Search, User } from "lucide-svelte";
	import { resolveCoverUrl } from "$lib/shared/logic/image";
	import type { PageData } from "./$types";

	const { data }: { data: PageData } = $props();

	// Treat legacy `+/...` URLs (migration artifact) as missing.
	function hasUsableCover(url: string | null | undefined): url is string {
		return !!url && !url.startsWith("+/");
	}

	let inputValue = $state(getQuery());

	function getQuery() {
		return data.query;
	}

	const articleResults = $derived(data.results.filter((r) => r.type === "article"));
	const projectResults = $derived(data.results.filter((r) => r.type === "project"));
	const memberResults = $derived(data.results.filter((r) => r.type === "member"));

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		const trimmed = inputValue.trim();
		if (trimmed) goto(`/search?q=${encodeURIComponent(trimmed)}`);
	}
</script>

<svelte:head>
	<title>検索{data.query ? `: ${data.query}` : ""} | ut.code();</title>
	<meta property="og:title" content="検索{data.query ? `: ${data.query}` : ''} | ut.code();" />
</svelte:head>

<div class="mx-auto max-w-6xl px-6 py-16">
	<div class="mb-3 flex items-center gap-2 font-[JetBrains_Mono,monospace] text-xs font-medium tracking-widest text-primary uppercase">
		<span aria-hidden="true" class="text-primary/50">~/</span>
		<span>search</span>
	</div>
	<h1 class="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">検索結果</h1>

	<form onsubmit={handleSubmit} class="mb-10">
		<label class="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 transition-all focus-within:border-primary/50 focus-within:shadow-md focus-within:shadow-primary/5">
			<Search class="h-5 w-5 shrink-0 text-zinc-400" aria-hidden="true" />
			<span class="font-[JetBrains_Mono,monospace] text-sm text-zinc-300 select-none" aria-hidden="true">$</span>
			<input
				type="text"
				bind:value={inputValue}
				placeholder="記事、プロジェクト、メンバーを検索..."
				aria-label="検索キーワード"
				class="min-h-9 w-full bg-transparent font-[JetBrains_Mono,monospace] text-sm outline-none placeholder:font-[DM_Sans,sans-serif] placeholder:text-zinc-400"
			/>
		</label>
	</form>

	{#if !data.query}
		<div class="flex flex-col items-center gap-4 py-20 text-center">
			<div class="font-[JetBrains_Mono,monospace] text-2xl text-zinc-400 sm:text-3xl">
				<span aria-hidden="true" class="text-primary/60">&gt;</span>
				<span class="search-caret ml-2 inline-block h-7 w-2 align-middle bg-zinc-400 sm:h-8" aria-hidden="true"></span>
			</div>
			<p class="font-[JetBrains_Mono,monospace] text-sm text-zinc-500">awaiting query...</p>
			<p class="max-w-md text-sm text-zinc-400">検索キーワードを入力してください。</p>
		</div>
	{:else if data.results.length === 0}
		<div class="flex flex-col items-center gap-4 py-20 text-center">
			<div class="font-[JetBrains_Mono,monospace] text-xl text-zinc-400 sm:text-2xl">
				<span aria-hidden="true" class="text-primary/50">&gt;</span> 0 results
			</div>
			<p class="font-medium text-zinc-700">「{data.query}」に一致する結果が見つかりませんでした</p>
			<p class="text-sm text-zinc-500">別のキーワードで検索してみてください</p>
		</div>
	{:else}
		<div class="mb-8 flex items-center justify-between gap-4 border-b border-zinc-200 pb-4">
			<p class="text-sm text-zinc-600">
				「<span class="font-medium text-zinc-900">{data.query}</span>」の検索結果
			</p>
			<span class="font-[JetBrains_Mono,monospace] text-xs text-zinc-500">
				{data.results.length}
				<span class="text-zinc-400">results</span>
			</span>
		</div>

		{#if articleResults.length > 0}
			<section class="mb-14">
				<div class="mb-5 flex items-center gap-2.5">
					<FileText class="h-4 w-4 text-primary" aria-hidden="true" />
					<h2 class="font-[JetBrains_Mono,monospace] text-xs font-semibold tracking-widest text-zinc-900 uppercase">
						articles
					</h2>
					<span class="font-[JetBrains_Mono,monospace] text-xs text-zinc-400">· {articleResults.length}</span>
					<div class="ml-2 h-px flex-1 bg-zinc-200"></div>
				</div>
				<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{#each articleResults as article (article.id)}
						<a
							href="/articles/{article.slug}"
							class="group flex flex-col overflow-hidden rounded-xl border border-zinc-200/60 bg-gradient-to-b from-white to-zinc-50/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
						>
							<div class="aspect-[5/3] w-full overflow-hidden bg-zinc-100">
								{#if hasUsableCover(article.coverUrl)}
									<img
										src={resolveCoverUrl(article.coverUrl)}
										alt={article.title}
										class="h-full w-full object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-[1.04]"
										loading="lazy"
									/>
								{:else}
									<div class="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200">
										<span class="font-[JetBrains_Mono,monospace] text-sm font-medium text-zinc-400">No Image</span>
									</div>
								{/if}
							</div>
							<div class="flex flex-1 flex-col p-5">
								<h3 class="mb-2 font-semibold leading-snug text-zinc-900 group-hover:text-primary">
									{article.title}
								</h3>
								{#if article.excerpt}
									<p class="mb-4 line-clamp-2 text-sm leading-relaxed text-zinc-500">{article.excerpt}</p>
								{/if}
								<div class="mt-auto flex items-center gap-2 font-[JetBrains_Mono,monospace] text-[11px] text-zinc-500">
									{#if article.author}
										<span>{article.author.name}</span>
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
			</section>
		{/if}

		{#if projectResults.length > 0}
			<section class="mb-14">
				<div class="mb-5 flex items-center gap-2.5">
					<Folder class="h-4 w-4 text-primary" aria-hidden="true" />
					<h2 class="font-[JetBrains_Mono,monospace] text-xs font-semibold tracking-widest text-zinc-900 uppercase">
						projects
					</h2>
					<span class="font-[JetBrains_Mono,monospace] text-xs text-zinc-400">· {projectResults.length}</span>
					<div class="ml-2 h-px flex-1 bg-zinc-200"></div>
				</div>
				<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{#each projectResults as project (project.id)}
						<a
							href="/projects/{project.slug}"
							class="group flex flex-col overflow-hidden rounded-xl border border-zinc-200/60 bg-gradient-to-b from-white to-zinc-50/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
						>
							<div class="aspect-[5/3] w-full overflow-hidden bg-zinc-100">
								{#if project.coverUrl}
									<img
										src={project.coverUrl}
										alt={project.name}
										class="h-full w-full object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-[1.04]"
										loading="lazy"
									/>
								{:else}
									<div class="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200">
										<span class="font-[JetBrains_Mono,monospace] text-sm font-medium text-zinc-400">No Image</span>
									</div>
								{/if}
							</div>
							<div class="flex flex-1 flex-col p-5">
								<h3 class="mb-2 font-semibold leading-snug text-zinc-900 group-hover:text-primary">
									{project.name}
								</h3>
								{#if project.description}
									<p class="line-clamp-2 text-sm leading-relaxed text-zinc-500">{project.description}</p>
								{/if}
							</div>
						</a>
					{/each}
				</div>
			</section>
		{/if}

		{#if memberResults.length > 0}
			<section>
				<div class="mb-5 flex items-center gap-2.5">
					<User class="h-4 w-4 text-primary" aria-hidden="true" />
					<h2 class="font-[JetBrains_Mono,monospace] text-xs font-semibold tracking-widest text-zinc-900 uppercase">
						members
					</h2>
					<span class="font-[JetBrains_Mono,monospace] text-xs text-zinc-400">· {memberResults.length}</span>
					<div class="ml-2 h-px flex-1 bg-zinc-200"></div>
				</div>
				<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{#each memberResults as member (member.id)}
						<a
							href="/members/{member.slug}"
							class="group flex flex-col rounded-xl border border-zinc-200/60 bg-gradient-to-b from-white to-zinc-50/40 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
						>
							<div class="mb-2 font-[JetBrains_Mono,monospace] text-[10px] tracking-wider text-zinc-400">
								@{member.slug}
							</div>
							<h3 class="mb-2 font-semibold text-zinc-900 group-hover:text-primary">
								{member.name}
							</h3>
							{#if member.bio}
								<p class="line-clamp-2 text-sm leading-relaxed text-zinc-500">{member.bio}</p>
							{/if}
						</a>
					{/each}
				</div>
			</section>
		{/if}
	{/if}
</div>

<style>
	/* Empty-state caret — pulses to suggest "type a query".
	   Respects prefers-reduced-motion. */
	.search-caret {
		animation: search-caret-blink 1.05s steps(2, start) infinite;
	}

	@keyframes search-caret-blink {
		to {
			visibility: hidden;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.search-caret {
			animation: none;
		}
	}
</style>
