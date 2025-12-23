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

<svelte:boundary>
	{#snippet pending()}
		<div class="space-y-8">
			<!-- Header skeleton -->
			<div class="h-32 w-full skeleton rounded-2xl"></div>

			<!-- Stats skeleton -->
			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{#each Array.from({ length: 4 }, (_, i) => i) as i (i)}
					<div class="h-28 skeleton rounded-2xl"></div>
				{/each}
			</div>

			<!-- Content skeleton -->
			<div class="grid gap-6 lg:grid-cols-2">
				<div class="h-64 skeleton rounded-2xl"></div>
				<div class="h-64 skeleton rounded-2xl"></div>
			</div>
		</div>
	{/snippet}

	<div class="space-y-8">
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

		<div class="grid gap-6 lg:grid-cols-2">
			<NeedsAttention draftArticles={stats.draftArticles} {formatDate} />

			<RecentActivity
				recentArticles={stats.recentArticles}
				{formatDate}
				hasDrafts={stats.draftArticles.length > 0}
			/>
		</div>

		<QuickActions />
	</div>
</svelte:boundary>
