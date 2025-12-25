<script lang="ts">
	import AboutSection from "$lib/components/home/AboutSection.svelte";
	import ActivitiesSection from "$lib/components/home/ActivitiesSection.svelte";
	import ArticlesSection from "$lib/components/home/ArticlesSection.svelte";
	import HeroSection from "$lib/components/home/HeroSection.svelte";
	import JoinCTA from "$lib/components/home/JoinCTA.svelte";
	import ProjectsSection from "$lib/components/home/ProjectsSection.svelte";
	import SponsorsSection from "$lib/components/home/SponsorsSection.svelte";
	import StatsSection from "$lib/components/home/StatsSection.svelte";
	import type { PageData } from "./$types";

	const { data }: { data: PageData } = $props();

	const featuredProject = $derived(data.allProjects.find((p) => p.category === "active"));
	const projects = $derived(data.allProjects.filter((p) => p.id !== featuredProject?.id).slice(0, 4));

	const currentYear = new Date().getFullYear();
	const years = currentYear - 2019;
</script>

<svelte:head>
	<title>ut.code(); - 東京大学ソフトウェアエンジニアリングサークル</title>
	<meta property="og:title" content="ut.code(); - 東京大学ソフトウェアエンジニアリングサークル" />
</svelte:head>

<HeroSection />

<StatsSection members={data.stats.members} projects={data.stats.projects} articles={data.stats.articles} {years} />

<ActivitiesSection />

<ProjectsSection {featuredProject} {projects} />

<ArticlesSection articles={data.articles} />

<JoinCTA />

<SponsorsSection />

<AboutSection members={data.stats.members} />
