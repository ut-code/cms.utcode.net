<script lang="ts">
	import { Calendar, Check, ChevronRight, Eye, FileText, Plus, SquarePen } from "lucide-svelte";
	import { page } from "$app/state";
	import { getArticles } from "$lib/data/private/articles.remote";

	const allArticles = $derived(await getArticles());
	const statusFilter = $derived(page.url.searchParams.get("status"));
	const articles = $derived(
		statusFilter === "published"
			? allArticles.filter((a) => a.published)
			: statusFilter === "draft"
				? allArticles.filter((a) => !a.published)
				: allArticles,
	);
	const publishedCount = $derived(allArticles.filter((a) => a.published).length);
	const draftCount = $derived(allArticles.length - publishedCount);

	function formatDate(date: Date): string {
		return new Date(date).toLocaleDateString("ja-JP", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	}
</script>

<svelte:head>
	<title>Articles - ut.code(); CMS</title>
</svelte:head>

<div class="space-y-6">
		<!-- Header -->
		<header class="animate-fade-slide-in gradient-dark relative overflow-hidden rounded-2xl p-6">
			<!-- Decorative elements -->
			<div class="absolute top-0 -right-10 h-32 w-32 rounded-full bg-info/20 blur-3xl"></div>
			<div class="absolute -bottom-10 left-1/4 h-24 w-24 rounded-full bg-primary/15 blur-3xl"></div>

			<div class="relative flex flex-wrap items-center justify-between gap-4">
				<div class="flex items-center gap-4">
					<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-info/20">
						<FileText class="h-6 w-6 text-info" />
					</div>
					<div>
						<h1 class="text-2xl font-bold text-white">Articles</h1>
						<p class="text-sm text-white/60">
							{publishedCount} published · {draftCount} drafts
						</p>
					</div>
				</div>
				<a
					href="/admin/articles/new"
					class="gradient-primary glow-primary btn gap-2 border-none text-white"
				>
					<Plus class="h-4 w-4" />
					New Article
				</a>
			</div>

			<!-- Filter tabs -->
			<div class="relative mt-6 flex gap-2">
				<a
					href="/admin/articles"
					class="rounded-lg px-4 py-2 text-sm font-medium transition-all
            {!statusFilter
						? 'bg-white/20 text-white'
						: 'text-white/60 hover:bg-white/10 hover:text-white'}"
				>
					All ({allArticles.length})
				</a>
				<a
					href="/admin/articles?status=published"
					class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all
            {statusFilter === 'published'
						? 'bg-success/20 text-success'
						: 'text-white/60 hover:bg-white/10 hover:text-white'}"
				>
					<Check class="h-3 w-3" />
					Published ({publishedCount})
				</a>
				<a
					href="/admin/articles?status=draft"
					class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all
            {statusFilter === 'draft'
						? 'bg-warning/20 text-warning'
						: 'text-white/60 hover:bg-white/10 hover:text-white'}"
				>
					<SquarePen class="h-3 w-3" />
					Drafts ({draftCount})
				</a>
			</div>
		</header>

		{#if articles.length === 0}
			<!-- Empty state -->
			<div
				class="animate-fade-slide-in stagger-1 rounded-2xl border-2 border-dashed border-base-300 bg-base-100 p-12 text-center"
			>
				<div
					class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-base-200 text-base-content/40"
				>
					<FileText class="h-8 w-8" />
				</div>
				{#if statusFilter === "published"}
					<h3 class="mt-4 text-lg font-semibold text-base-content">No published articles</h3>
					<p class="mt-1 text-base-content/60">Publish your first article to see it here.</p>
					{#if draftCount > 0}
						<a href="/admin/articles?status=draft" class="btn mt-6 gap-2 btn-outline">
							View {draftCount} draft{draftCount > 1 ? "s" : ""}
						</a>
					{/if}
				{:else if statusFilter === "draft"}
					<h3 class="mt-4 text-lg font-semibold text-base-content">No drafts</h3>
					<p class="mt-1 text-base-content/60">All articles are published!</p>
					<a href="/admin/articles/new" class="gradient-primary btn mt-6 gap-2 text-white">
						<Plus class="h-4 w-4" />
						New Article
					</a>
				{:else}
					<h3 class="mt-4 text-lg font-semibold text-base-content">No articles yet</h3>
					<p class="mt-1 text-base-content/60">Get started by writing your first article.</p>
					<a href="/admin/articles/new" class="gradient-primary btn mt-6 gap-2 text-white">
						<Plus class="h-4 w-4" />
						New Article
					</a>
				{/if}
			</div>
		{:else}
			<!-- Article list -->
			<div class="space-y-4">
				{#each articles as article, i (article.id)}
					<a
						href="/admin/articles/edit/{article.id}"
						class="group animate-fade-slide-in card-hover glow-soft relative flex gap-4 overflow-hidden rounded-2xl bg-base-100 p-4"
						style="animation-delay: {i * 40}ms"
					>
						<!-- Cover thumbnail -->
						{#if article.coverUrl}
							<figure class="h-24 w-36 shrink-0 overflow-hidden rounded-xl bg-base-200">
								<img
									src={article.coverUrl}
									alt={article.title}
									class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
									loading="lazy"
								/>
							</figure>
						{:else}
							<div
								class="flex h-24 w-36 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-base-200 to-base-300"
							>
								<FileText class="h-8 w-8 text-base-content/20" />
							</div>
						{/if}

						<!-- Content -->
						<div class="min-w-0 flex-1 py-1">
							<div class="flex items-start justify-between gap-4">
								<div class="min-w-0 flex-1">
									<h3 class="truncate text-lg font-semibold text-base-content">
										{article.title}
									</h3>
									<div class="mt-1 flex flex-wrap items-center gap-3 text-sm text-base-content/50">
										<code class="font-mono text-xs">/{article.slug}</code>
										<span class="flex items-center gap-1">
											<Calendar class="h-3 w-3" />
											{formatDate(article.updatedAt)}
										</span>
									</div>
								</div>

								<!-- Status badge -->
								{#if article.published}
									<span
										class="flex items-center gap-1 rounded-lg bg-success/10 px-2.5 py-1 text-xs font-medium text-success"
									>
										<Check class="h-3 w-3" />
										Published
									</span>
								{:else}
									<span
										class="flex items-center gap-1 rounded-lg bg-warning/10 px-2.5 py-1 text-xs font-medium text-warning"
									>
										<SquarePen class="h-3 w-3" />
										Draft
									</span>
								{/if}
							</div>

							<!-- Meta info -->
							<div class="mt-3 flex items-center gap-4">
								{#if article.author}
									<div class="flex items-center gap-2">
										{#if article.author.imageUrl}
											<div class="avatar">
												<div class="w-5 rounded-full ring-1 ring-base-200">
													<img src={article.author.imageUrl} alt={article.author.name} />
												</div>
											</div>
										{/if}
										<span class="text-xs text-base-content/50">{article.author.name}</span>
									</div>
								{/if}

								<div class="flex items-center gap-1 text-xs text-base-content/50">
									<Eye class="h-3.5 w-3.5" />
									<span>{article.viewCount.toLocaleString()} views</span>
								</div>

								<ChevronRight
									class="ml-auto h-4 w-4 text-base-content/20 transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary"
								/>
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}
</div>
