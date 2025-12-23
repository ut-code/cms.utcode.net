<script lang="ts">
	import DashboardHeader from "$lib/components/admin-dashboard/DashboardHeader.svelte";
	import NeedsAttention from "$lib/components/admin-dashboard/NeedsAttention.svelte";
	import QuickActions from "$lib/components/admin-dashboard/QuickActions.svelte";
	import RecentActivity from "$lib/components/admin-dashboard/RecentActivity.svelte";
	import StatsGrid from "$lib/components/admin-dashboard/StatsGrid.svelte";
	import { getAdminStats } from "$lib/data/private/stats.remote";

	const stats = $derived(await getAdminStats());

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

	<div class="grid gap-4 sm:gap-6 lg:grid-cols-2">
		<NeedsAttention draftArticles={stats.draftArticles} {formatDate} />

		<RecentActivity
			recentArticles={stats.recentArticles}
			{formatDate}
			hasDrafts={stats.draftArticles.length > 0}
		/>
	</div>

	<QuickActions />
</div>
