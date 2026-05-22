<script lang="ts">
	import { ArrowRight, Calendar, User } from "lucide-svelte";
	import type { getPublicArticles } from "$lib/data/public/index.remote";
	import { resolveCoverUrl } from "$lib/shared/logic/image";

	type Props = {
		articles: Awaited<ReturnType<typeof getPublicArticles>>;
	};

	const { articles }: Props = $props();

	// Treat legacy `+/...` URLs (migration artifact) as missing.
	function hasUsableCover(url: string | null | undefined): url is string {
		return !!url && !url.startsWith("+/");
	}
</script>

<!--
	articles --- "what we wrote" grid, mirrors projects but on white bg.
	Card cover scales subtly on hover, title shifts to primary.
-->
<section class="relative bg-white py-24">
	<div class="mx-auto max-w-6xl px-6">
		<div class="mb-14 flex flex-wrap items-end justify-between gap-6">
			<div>
				<div
					class="mb-4 flex items-center gap-3 font-mono text-[11px] tracking-widest text-primary uppercase"
				>
					<span class="inline-block h-px w-6 bg-primary"></span>
					<span>// news &amp; articles</span>
				</div>
				<h2 class="text-4xl leading-[1.1] font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
					最新情報
				</h2>
			</div>
			<a
				href="/articles"
				class="group hidden min-h-11 items-center gap-2 rounded-lg bg-zinc-900 px-6 py-3 font-semibold text-white transition-all hover:bg-zinc-800 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none sm:flex"
			>
				<span class="font-mono text-xs tracking-widest opacity-60">View all</span>
				<span>すべて見る</span>
				<ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
			</a>
		</div>
		{#if articles.length > 0}
			<div class="grid gap-5 md:grid-cols-3">
				{#each articles as article (article.id)}
					<a
						href="/articles/{article.slug}"
						class="group relative isolate flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
					>
						<div class="relative overflow-hidden">
							{#if hasUsableCover(article.coverUrl)}
								<img
									src={resolveCoverUrl(article.coverUrl)}
									alt={article.title}
									class="aspect-[5/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
									loading="lazy"
								/>
							{:else}
								<div
									class="flex aspect-[5/3] w-full items-center justify-center bg-zinc-100"
								>
									<span class="font-mono text-sm font-medium text-zinc-400">
										No Image
									</span>
								</div>
							{/if}
						</div>
						<div class="flex flex-1 flex-col p-6">
							<h3
								class="mb-3 text-lg leading-snug font-bold tracking-tight text-zinc-900 transition-colors group-hover:text-primary"
							>
								{article.title}
							</h3>
							{#if article.excerpt}
								<p class="mb-4 line-clamp-2 text-sm leading-relaxed text-zinc-600">
									{article.excerpt}
								</p>
							{/if}
							<div
								class="mt-auto flex items-center gap-3 border-t border-zinc-100 pt-3 font-mono text-[11px] tracking-wide text-zinc-500"
							>
								{#if article.author}
									<div class="flex items-center gap-1.5">
										<User class="h-3 w-3" />
										<span>{article.author.name}</span>
									</div>
								{/if}
								{#if article.publishedAt}
									<span class="text-zinc-300">/</span>
									<div class="flex items-center gap-1.5">
										<Calendar class="h-3 w-3" />
										<time datetime={article.publishedAt.toISOString()}>
											{article.publishedAt.toLocaleDateString("ja-JP")}
										</time>
									</div>
								{/if}
							</div>
						</div>
					</a>
				{/each}
			</div>
		{:else}
			<div
				class="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 p-12 text-center"
			>
				<p class="font-mono text-sm tracking-wide text-zinc-400">
					// no articles yet
				</p>
				<p class="mt-2 text-zinc-600">記事は近日公開予定です。</p>
			</div>
		{/if}
		<a
			href="/articles"
			class="mt-8 flex min-h-11 items-center justify-center gap-2 font-bold text-zinc-600 transition-colors hover:text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none sm:hidden"
		>
			すべて見る
			<ArrowRight class="h-5 w-5" />
		</a>
	</div>
</section>
