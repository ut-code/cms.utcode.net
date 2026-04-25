<script lang="ts">
  import AboutSection from "$lib/components/home/AboutSection.svelte";
  import ActivitiesSection from "$lib/components/home/ActivitiesSection.svelte";
  import ArticlesSection from "$lib/components/home/ArticlesSection.svelte";
  import HeroSection from "$lib/components/home/HeroSection.svelte";
  import JoinCTA from "$lib/components/home/JoinCTA.svelte";
  import ProjectsSection from "$lib/components/home/ProjectsSection.svelte";
  import SponsorsSection from "$lib/components/home/SponsorsSection.svelte";
  import StatsSection from "$lib/components/home/StatsSection.svelte";
  import { UTCODE_FOUNDING_YEAR } from "$lib/shared/constants";
  import { safeJsonLd } from "$lib/shared/logic/json-ld";
  import type { PageData } from "./$types";

  const { data }: { data: PageData } = $props();

  const currentYear = new Date().getFullYear();
  const years = currentYear - UTCODE_FOUNDING_YEAR;
</script>

<svelte:head>
  <title>ut.code(); - 東京大学ソフトウェアエンジニアリングサークル</title>
  <meta property="og:title" content="ut.code(); - 東京大学ソフトウェアエンジニアリングサークル" />
  <meta name="description" content="ut.code();は東京大学のソフトウェアエンジニアリングサークルです。学習・交流・開発を通じてプログラミングの魅力を届けます。" />
  <meta property="og:description" content="ut.code();は東京大学のソフトウェアエンジニアリングサークルです。学習・交流・開発を通じてプログラミングの魅力を届けます。" />
  {@html `<script type="application/ld+json">${safeJsonLd({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ut.code();",
    url: "https://cms.utcode.net",
    logo: "https://cms.utcode.net/og-image.svg",
    description: "東京大学のソフトウェアエンジニアリングサークル",
    foundingDate: "2019",
    sameAs: ["https://github.com/ut-code", "https://x.com/utokyo_code"],
  })}</script>`}
</svelte:head>

<HeroSection />

<StatsSection
  members={data.stats.members}
  projects={data.stats.projects}
  articles={data.stats.articles}
  {years}
/>

<ActivitiesSection />

<ProjectsSection projects={data.featuredProjects} />

<ArticlesSection articles={data.articles} />

<JoinCTA />

<SponsorsSection />

<AboutSection members={data.stats.members} />
