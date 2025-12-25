<script lang="ts">
	import { ArrowRight, Calendar, User } from "lucide-svelte";
	import type { getPublicArticles } from "$lib/data/public/index.remote";

	type Props = {
		articles: Awaited<ReturnType<typeof getPublicArticles>>;
	};

	const { articles }: Props = $props();
</script>

<section class="bg-white py-32">
	<div class="mx-auto max-w-6xl px-6">
		<div class="mb-16 flex items-end justify-between">
			<div>
				<div class="mb-4 font-mono text-sm font-medium uppercase tracking-widest text-primary">NEWS & ARTICLES</div>
				<h2 class="text-5xl font-bold text-zinc-900 lg:text-6xl">
					最新情報
				</h2>
			</div>
			<a
				href="/articles"
				class="group hidden items-center gap-2 rounded-lg bg-zinc-900 px-6 py-3 font-semibold text-white transition-all hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:flex"
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
						class="group relative overflow-hidden rounded-3xl border border-zinc-200/50 bg-white/80 backdrop-blur-md transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
					>
						<div class="relative">
							{#if article.coverUrl}
								<img
									src={article.coverUrl}
									alt={article.title}
									class="aspect-[5/3] w-full object-cover"
								/>
							{/if}
							<div class="p-6">
								<h3 class="mb-3 text-xl font-bold text-zinc-900 transition-colors group-hover:text-primary">
									{article.title}
								</h3>
								{#if article.excerpt}
									<p class="mb-4 line-clamp-2 text-sm leading-relaxed text-zinc-600">{article.excerpt}</p>
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
			<p class="text-zinc-600">まだ記事がありません。</p>
		{/if}
		<a
			href="/articles"
			class="mt-8 flex items-center justify-center gap-2 font-bold text-zinc-600 transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:hidden"
		>
			すべて見る
			<ArrowRight class="h-5 w-5" />
		</a>
	</div>
</section>
