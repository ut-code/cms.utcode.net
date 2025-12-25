<script lang="ts">
	import { FileText, Folder, SquarePen, Users } from "lucide-svelte";
	import StatCard from "./StatCard.svelte";

	interface Props {
		publishedArticles: number;
		totalArticles: number;
		projects: number;
		members: number;
	}

	const { publishedArticles, totalArticles, projects, members }: Props = $props();

	const draftArticles = $derived(totalArticles - publishedArticles);
</script>

<section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
	<StatCard
		label="Published"
		value={publishedArticles}
		sublabel="articles"
		href="/admin/articles?status=published"
		icon={FileText}
		iconColor="success"
		accentColor="oklch(72% 0.19 145)"
		stagger={1}
	/>

	<StatCard
		label="Drafts"
		value={draftArticles}
		sublabel="articles"
		href="/admin/articles?status=draft"
		icon={SquarePen}
		iconColor="warning"
		accentColor="oklch(75% 0.18 75)"
		stagger={2}
	/>

	<StatCard
		label="Projects"
		value={projects}
		sublabel="projects"
		href="/admin/projects"
		icon={Folder}
		iconColor="info"
		accentColor="oklch(60% 0.05 260)"
		stagger={3}
	/>

	<StatCard
		label="Members"
		value={members}
		sublabel="members"
		href="/admin/members"
		icon={Users}
		iconColor="error"
		accentColor="oklch(65% 0.22 25)"
		stagger={4}
	/>
</section>
