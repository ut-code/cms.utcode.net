<script lang="ts">
	import { ArrowRight, BarChart3, Eye, FileText, FolderKanban, Users } from "lucide-svelte";

	interface TopItem {
		id: string;
		slug: string;
		viewCount: number;
	}

	interface TopArticle extends TopItem {
		title: string;
		author?: { name: string } | null;
	}

	interface TopProject extends TopItem {
		name: string;
	}

	interface TopMember extends TopItem {
		name: string;
	}

	interface Props {
		totalViews: number;
		totalArticleViews: number;
		totalProjectViews: number;
		totalMemberViews: number;
		topArticles: TopArticle[];
		topProjects: TopProject[];
		topMembers: TopMember[];
	}

	const {
		totalViews,
		totalArticleViews,
		totalProjectViews,
		totalMemberViews,
		topArticles,
		topProjects,
		topMembers,
	}: Props = $props();

	const topThreeArticles = $derived(topArticles.slice(0, 3));
	const topThreeProjects = $derived(topProjects.slice(0, 3));
	const topThreeMembers = $derived(topMembers.slice(0, 3));
</script>

<section class="animate-fade-slide-in stagger-5 glow-soft rounded-2xl bg-base-100 p-4 sm:p-6">
	<div class="mb-4 flex items-center justify-between">
		<div class="flex items-center gap-3">
			<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
				<BarChart3 class="h-4 w-4 text-primary" />
			</div>
			<h2 class="font-semibold text-base-content">Analytics Overview</h2>
		</div>
		<a href="/admin/analytics" class="btn btn-ghost btn-sm gap-1">
			View all
			<ArrowRight class="h-4 w-4" />
		</a>
	</div>

	<!-- Mini Stats Grid -->
	<div class="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
		<div class="rounded-lg bg-base-200/50 p-3">
			<div class="flex items-center gap-2">
				<Eye class="h-4 w-4 text-primary" />
				<span class="text-xs text-base-content/60">Total</span>
			</div>
			<p class="mt-1 text-lg font-bold">{totalViews.toLocaleString()}</p>
		</div>
		<div class="rounded-lg bg-base-200/50 p-3">
			<div class="flex items-center gap-2">
				<FileText class="h-4 w-4 text-secondary" />
				<span class="text-xs text-base-content/60">Articles</span>
			</div>
			<p class="mt-1 text-lg font-bold">{totalArticleViews.toLocaleString()}</p>
		</div>
		<div class="rounded-lg bg-base-200/50 p-3">
			<div class="flex items-center gap-2">
				<FolderKanban class="h-4 w-4 text-accent" />
				<span class="text-xs text-base-content/60">Projects</span>
			</div>
			<p class="mt-1 text-lg font-bold">{totalProjectViews.toLocaleString()}</p>
		</div>
		<div class="rounded-lg bg-base-200/50 p-3">
			<div class="flex items-center gap-2">
				<Users class="h-4 w-4 text-info" />
				<span class="text-xs text-base-content/60">Members</span>
			</div>
			<p class="mt-1 text-lg font-bold">{totalMemberViews.toLocaleString()}</p>
		</div>
	</div>

	<!-- Top Content Lists -->
	<div class="space-y-4">
		<!-- Top Articles -->
		{#if topThreeArticles.length > 0}
			<div>
				<h3 class="mb-2 text-xs font-semibold text-base-content/60">Top Articles</h3>
				<div class="space-y-2">
					{#each topThreeArticles as article, index (article.id)}
						<a
							href="/articles/{article.slug}"
							target="_blank"
							class="group flex items-center gap-2 rounded-lg border border-base-300/50 bg-base-200/50 p-2 transition-all hover:border-primary/30 hover:bg-primary/5"
						>
							<span
								class="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-secondary/10 text-xs font-bold text-secondary"
							>
								{index + 1}
							</span>
							<div class="min-w-0 flex-1">
								<p class="truncate text-sm font-medium">{article.title}</p>
								{#if article.author}
									<p class="text-xs text-base-content/40">{article.author.name}</p>
								{/if}
							</div>
							<div class="flex items-center gap-1 text-xs text-base-content/60">
								<Eye class="h-3 w-3" />
								<span>{article.viewCount.toLocaleString()}</span>
							</div>
						</a>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Top Projects -->
		{#if topThreeProjects.length > 0}
			<div>
				<h3 class="mb-2 text-xs font-semibold text-base-content/60">Top Projects</h3>
				<div class="space-y-2">
					{#each topThreeProjects as project, index (project.id)}
						<a
							href="/projects/{project.slug}"
							target="_blank"
							class="group flex items-center gap-2 rounded-lg border border-base-300/50 bg-base-200/50 p-2 transition-all hover:border-primary/30 hover:bg-primary/5"
						>
							<span
								class="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-accent/10 text-xs font-bold text-accent"
							>
								{index + 1}
							</span>
							<div class="min-w-0 flex-1">
								<p class="truncate text-sm font-medium">{project.name}</p>
							</div>
							<div class="flex items-center gap-1 text-xs text-base-content/60">
								<Eye class="h-3 w-3" />
								<span>{project.viewCount.toLocaleString()}</span>
							</div>
						</a>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Top Members -->
		{#if topThreeMembers.length > 0}
			<div>
				<h3 class="mb-2 text-xs font-semibold text-base-content/60">Top Member Pages</h3>
				<div class="space-y-2">
					{#each topThreeMembers as member, index (member.id)}
						<a
							href="/members/{member.slug}"
							target="_blank"
							class="group flex items-center gap-2 rounded-lg border border-base-300/50 bg-base-200/50 p-2 transition-all hover:border-primary/30 hover:bg-primary/5"
						>
							<span
								class="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-info/10 text-xs font-bold text-info"
							>
								{index + 1}
							</span>
							<div class="min-w-0 flex-1">
								<p class="truncate text-sm font-medium">{member.name}</p>
							</div>
							<div class="flex items-center gap-1 text-xs text-base-content/60">
								<Eye class="h-3 w-3" />
								<span>{member.viewCount.toLocaleString()}</span>
							</div>
						</a>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</section>
