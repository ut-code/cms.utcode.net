<script lang="ts">
	import AnalyticsBrief from "$lib/components/admin-dashboard/AnalyticsBrief.svelte";
	import DashboardHeader from "$lib/components/admin-dashboard/DashboardHeader.svelte";
	import NeedsAttention from "$lib/components/admin-dashboard/NeedsAttention.svelte";
	import QuickActions from "$lib/components/admin-dashboard/QuickActions.svelte";
	import StatsGrid from "$lib/components/admin-dashboard/StatsGrid.svelte";
	import { getAdminStats } from "$lib/data/private/stats.remote";
	import { ITEMS_PER_PAGE } from "$lib/shared/constants";
	import type { PageData } from "./$types";

	const { data }: { data: PageData } = $props();
	const stats = await getAdminStats();

	const totalPages = $derived(Math.ceil(stats.draftArticles.length / ITEMS_PER_PAGE));
	const paginatedDrafts = $derived(
		stats.draftArticles.slice(
			(data.currentPage - 1) * ITEMS_PER_PAGE,
			data.currentPage * ITEMS_PER_PAGE,
		),
	);

	function formatDate(date: Date): string {
		const now = new Date();
		const diff = now.getTime() - new Date(date).getTime();
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));
		if (days === 0) return "Today";
		if (days === 1) return "Yesterday";
		if (days < 7) return `${days} days ago`;
		return new Date(date).toLocaleDateString("ja-JP");
	}
</script>

<svelte:head>
	<title>Dashboard - ut.code(); CMS</title>
</svelte:head>

<div class="space-y-4 sm:space-y-6 lg:space-y-8">
	<DashboardHeader
		publishedArticles={stats.publishedArticles}
		members={stats.members}
		projects={stats.projects}
	/>

	<StatsGrid
		publishedArticles={stats.publishedArticles}
		totalArticles={stats.articles}
		projects={stats.projects}
		members={stats.members}
	/>

	<QuickActions />

	<div class="grid gap-4 sm:gap-6 lg:grid-cols-2">
		<NeedsAttention
			draftArticles={paginatedDrafts}
			{formatDate}
			currentPage={data.currentPage}
			{totalPages}
		/>

		<AnalyticsBrief
			totalViews={stats.analytics.totalViews}
			totalArticleViews={stats.analytics.totalArticleViews}
			totalProjectViews={stats.analytics.totalProjectViews}
			totalMemberViews={stats.analytics.totalMemberViews}
			topArticles={stats.analytics.topArticles}
			topProjects={stats.analytics.topProjects}
			topMembers={stats.analytics.topMembers}
			viewTrend={stats.analytics.viewTrend}
		/>
	</div>
</div>
