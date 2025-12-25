<script lang="ts">
	import { Eye, FileText, FolderKanban, TrendingUp, Users } from "lucide-svelte";
	import { getAnalytics, getViewTrend } from "$lib/data/private/analytics.remote";
	import ViewTrendChart from "$lib/components/analytics/ViewTrendChart.svelte";

	const analytics = await getAnalytics();
	const viewTrend = await getViewTrend(30);
</script>

<svelte:head>
	<title>Analytics - ut.code(); CMS</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-3xl font-bold">Analytics</h1>
	</div>

	<!-- Total Views Summary -->
	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<div class="card bg-base-100 shadow-md">
			<div class="card-body">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-base-content/60">Total Views</p>
						<p class="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</p>
					</div>
					<Eye class="h-8 w-8 text-primary" />
				</div>
			</div>
		</div>

		<div class="card bg-base-100 shadow-md">
			<div class="card-body">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-base-content/60">Article Views</p>
						<p class="text-2xl font-bold">{analytics.totalArticleViews.toLocaleString()}</p>
					</div>
					<FileText class="h-8 w-8 text-secondary" />
				</div>
			</div>
		</div>

		<div class="card bg-base-100 shadow-md">
			<div class="card-body">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-base-content/60">Project Views</p>
						<p class="text-2xl font-bold">{analytics.totalProjectViews.toLocaleString()}</p>
					</div>
					<FolderKanban class="h-8 w-8 text-accent" />
				</div>
			</div>
		</div>

		<div class="card bg-base-100 shadow-md">
			<div class="card-body">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-base-content/60">Member Views</p>
						<p class="text-2xl font-bold">{analytics.totalMemberViews.toLocaleString()}</p>
					</div>
					<Users class="h-8 w-8 text-info" />
				</div>
			</div>
		</div>
	</div>

	<!-- View Trends Section -->
	<div class="card bg-base-100 shadow-md">
		<div class="card-body">
			<div class="mb-6 flex items-center gap-2">
				<TrendingUp class="h-5 w-5 text-primary" />
				<h2 class="text-xl font-bold">全体の訪問数推移</h2>
			</div>
			<p class="mb-4 text-sm text-zinc-500">過去30日間の訪問数の推移を表示しています</p>
			<ViewTrendChart data={viewTrend} />
		</div>
	</div>
</div>
