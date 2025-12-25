<script lang="ts">
	import { ArrowRight, Calendar, User } from "lucide-svelte";
	import type { getPublicArticles } from "$lib/data/public/index.remote";

	type Props = {
		articles: Awaited<ReturnType<typeof getPublicArticles>>;
	};

	const { articles }: Props = $props();
</script>

<section class="bg-zinc-900 py-32">
	<div class="mx-auto max-w-7xl px-6">
		<div class="mb-16 flex items-end justify-between">
			<div>
				<div class="mb-4 font-mono text-sm font-medium text-orange-400">NEWS & ARTICLES</div>
				<h2 class="font-[clash-display,ui-sans-serif,system-ui,sans-serif] text-5xl font-bold text-white lg:text-6xl">
					最新情報
				</h2>
			</div>
			<a
				href="/articles"
				class="group hidden items-center gap-2 font-bold text-zinc-400 transition-colors hover:text-white sm:flex"
			>
				すべて見る
				<ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-1" />
			</a>
		</div>
		{#if articles.length > 0}
			<div class="grid gap-6 md:grid-cols-3">
				{#each articles as article (article.id)}
					<a
						href="/articles/{article.slug}"
						class="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/50 backdrop-blur-sm transition-all hover:border-yellow-500/50"
					>
						<div
							class="pointer-events-none absolute inset-0 bg-gradient-to-br from-yellow-500/0 to-yellow-500/0 opacity-0 transition-all group-hover:from-yellow-500/10 group-hover:to-transparent group-hover:opacity-100"
						></div>
						<div class="relative">
							{#if article.coverUrl}
								<img
									src={article.coverUrl}
									alt={article.title}
									class="aspect-[5/3] w-full object-cover"
								/>
							{/if}
							<div class="p-6">
								<h3 class="mb-3 font-[clash-display,ui-sans-serif,system-ui,sans-serif] text-xl font-bold text-white transition-colors group-hover:text-yellow-400">
									{article.title}
								</h3>
								{#if article.excerpt}
									<p class="mb-4 line-clamp-2 text-sm leading-relaxed text-zinc-400">{article.excerpt}</p>
								{/if}
								<div class="flex items-center gap-4 text-xs text-zinc-500">
									{#if article.author}
										<div class="flex items-center gap-1.5">
											<User class="h-3.5 w-3.5" />
											<span>{article.author.name}</span>
										</div>
									{/if}
									{#if article.publishedAt}
										<div class="flex items-center gap-1.5">
											<Calendar class="h-3.5 w-3.5" />
											<time datetime={article.publishedAt.toISOString()}>
												{article.publishedAt.toLocaleDateString("ja-JP")}
											</time>
										</div>
									{/if}
								</div>
							</div>
						</div>
					</a>
				{/each}
			</div>
		{:else}
			<p class="text-zinc-400">まだ記事がありません。</p>
		{/if}
		<a
			href="/articles"
			class="mt-8 flex items-center justify-center gap-2 font-bold text-zinc-400 transition-colors hover:text-white sm:hidden"
		>
			すべて見る
			<ArrowRight class="h-5 w-5" />
		</a>
	</div>
</section>
