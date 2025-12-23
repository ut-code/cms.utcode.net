<script lang="ts">
	import { ExternalLink, Folder, LayoutGrid, TrendingUp, Users } from "lucide-svelte";

	interface Props {
		publishedArticles: number;
		members: number;
		projects: number;
	}

	const { publishedArticles, members, projects }: Props = $props();
</script>

<header class="animate-fade-slide-in gradient-dark relative overflow-hidden rounded-2xl p-4 sm:p-6 lg:p-8">
	<!-- Decorative elements -->
	<div class="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary/30 blur-3xl"></div>
	<div class="absolute -bottom-10 left-1/4 h-32 w-32 rounded-full bg-info/20 blur-3xl"></div>

	<div class="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
		<div>
			<div class="mb-2 flex items-center gap-2">
				<div
					class="gradient-primary glow-primary flex h-8 w-8 items-center justify-center rounded-xl sm:h-10 sm:w-10"
				>
					<LayoutGrid class="h-4 w-4 text-white sm:h-5 sm:w-5" />
				</div>
				<span class="font-mono text-xs font-semibold tracking-wider text-primary uppercase">
					Dashboard
				</span>
			</div>
			<h1 class="text-xl font-bold text-white sm:text-2xl lg:text-3xl">Welcome back</h1>
			<p class="mt-1 text-xs text-white/60 sm:text-sm lg:text-base">Here's what's happening with your content</p>
		</div>
		<a
			href="/"
			target="_blank"
			class="btn gap-2 border-white/20 bg-white/10 text-white btn-sm hover:bg-white/20 sm:btn-md"
		>
			<ExternalLink class="h-3 w-3 sm:h-4 sm:w-4" />
			<span class="hidden sm:inline">View Site</span>
			<span class="sm:hidden">Site</span>
		</a>
	</div>

	<!-- Quick stats row -->
	<div class="relative mt-4 flex flex-wrap items-center gap-2 sm:mt-6 sm:gap-3 lg:gap-6">
		<div class="flex items-center gap-1.5 text-white/80 sm:gap-2">
			<TrendingUp class="h-3.5 w-3.5 text-primary sm:h-4 sm:w-4" />
			<span class="text-xs font-medium sm:text-sm">{publishedArticles} published</span>
		</div>
		<div class="hidden h-4 w-px bg-white/20 sm:block"></div>
		<div class="flex items-center gap-1.5 text-white/80 sm:gap-2">
			<Users class="h-3.5 w-3.5 text-info sm:h-4 sm:w-4" />
			<span class="text-xs font-medium sm:text-sm">{members} members</span>
		</div>
		<div class="hidden h-4 w-px bg-white/20 sm:block"></div>
		<div class="flex items-center gap-1.5 text-white/80 sm:gap-2">
			<Folder class="h-3.5 w-3.5 text-secondary-content sm:h-4 sm:w-4" />
			<span class="text-xs font-medium sm:text-sm">{projects} projects</span>
		</div>
	</div>
</header>
