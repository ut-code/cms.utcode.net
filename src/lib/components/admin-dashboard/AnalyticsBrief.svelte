<script lang="ts">
	import { ArrowRight, BarChart3, Eye, FileText, FolderKanban, Users } from "lucide-svelte";
	import ViewTrendChart from "$lib/components/analytics/ViewTrendChart.svelte";

	interface ViewTrendData {
		date: string;
		count: number;
	}

	interface Props {
		totalViews: number;
		totalArticleViews: number;
		totalProjectViews: number;
		totalMemberViews: number;
		viewTrend?: ViewTrendData[];
	}

	const {
		totalViews,
		totalArticleViews,
		totalProjectViews,
		totalMemberViews,
		viewTrend = [],
	}: Props = $props();
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

	<!-- View Trend Chart -->
	{#if viewTrend.length > 0}
		<div class="mb-4">
			<h3 class="mb-2 text-xs font-semibold text-base-content/60">過去30日間の訪問数推移</h3>
			<div class="rounded-lg border border-base-300/50 bg-base-200/30 p-3">
				<ViewTrendChart data={viewTrend} />
			</div>
		</div>
	{/if}

</section>
