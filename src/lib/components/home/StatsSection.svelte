<script lang="ts">
	import { BookOpen, Calendar, Rocket, Users } from "lucide-svelte";

	type Props = {
		members: number;
		projects: number;
		articles: number;
		years: number;
	};

	const { members, projects, articles, years }: Props = $props();

	type Stat = {
		index: string;
		label: string;
		value: number;
		suffix: string;
		href: string | null;
		Icon: typeof Users;
	};

	const stats: Stat[] = $derived([
		{ index: "01", label: "Members", value: members, suffix: "+", href: "/members", Icon: Users },
		{ index: "02", label: "Projects", value: projects, suffix: "+", href: "/projects", Icon: Rocket },
		{ index: "03", label: "Articles", value: articles, suffix: "+", href: "/articles", Icon: BookOpen },
		{ index: "04", label: "Years Active", value: years, suffix: "+", href: null, Icon: Calendar },
	]);
</script>

<!--
	stats --- a "metrics manifest" strip.
	Each card carries a 01/04 mono index, a top accent rail, and a hover
	state that slides a thin primary line across the bottom.
-->
<section class="relative bg-zinc-50 py-24">
	<!-- top divider tick row, signaling the metrics block -->
	<div
		class="pointer-events-none absolute inset-x-0 top-0 mx-auto h-px max-w-6xl bg-gradient-to-r from-transparent via-zinc-200 to-transparent"
		aria-hidden="true"
	></div>

	<div class="mx-auto max-w-6xl px-6">
		<!-- Section header — minimal, contextual, monospace -->
		<div class="mb-10 flex flex-wrap items-end justify-between gap-4">
			<div>
				<div
					class="mb-2 flex items-center gap-3 font-mono text-[11px] tracking-widest text-primary uppercase"
				>
					<span class="inline-block h-px w-6 bg-primary"></span>
					<span>// by the numbers</span>
				</div>
				<h2 class="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
					活動の規模
				</h2>
			</div>
			<div class="font-mono text-xs tracking-widest text-zinc-400">
				updated · {new Date().getFullYear()}.{String(new Date().getMonth() + 1).padStart(2, "0")}
			</div>
		</div>

		<div class="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
			{#each stats as stat (stat.label)}
				{#if stat.href}
					<a
						href={stat.href}
						class="group stat-accent relative isolate flex min-h-[10rem] flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-primary/30 hover:bg-primary/[0.03] hover:shadow-lg hover:shadow-primary/5 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none sm:p-7"
					>
						<div class="mb-6 flex items-start justify-between">
							<div class="font-mono text-[10px] tracking-[0.2em] text-zinc-400">
								{stat.index} / 04
							</div>
							<stat.Icon
								class="h-4 w-4 text-zinc-300 transition-colors group-hover:text-primary"
							/>
						</div>
						<div>
							<div class="flex items-baseline gap-1">
								<span
									class="text-5xl font-bold tracking-tight text-zinc-900 tabular-nums sm:text-6xl"
								>
									{stat.value}
								</span>
								<span class="text-2xl font-bold text-primary">{stat.suffix}</span>
							</div>
							<div
								class="mt-2 font-mono text-[11px] tracking-widest text-zinc-500 uppercase"
							>
								{stat.label}
							</div>
						</div>
						<!-- hover-reveal line at bottom -->
						<span
							class="pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-primary transition-all duration-500 group-hover:w-full"
							aria-hidden="true"
						></span>
					</a>
				{:else}
					<div
						class="group stat-accent relative isolate flex min-h-[10rem] flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-primary/30 hover:bg-primary/[0.03] sm:p-7"
					>
						<div class="mb-6 flex items-start justify-between">
							<div class="font-mono text-[10px] tracking-[0.2em] text-zinc-400">
								{stat.index} / 04
							</div>
							<stat.Icon class="h-4 w-4 text-zinc-300" />
						</div>
						<div>
							<div class="flex items-baseline gap-1">
								<span
									class="text-5xl font-bold tracking-tight text-zinc-900 tabular-nums sm:text-6xl"
								>
									{stat.value}
								</span>
								<span class="text-2xl font-bold text-primary">{stat.suffix}</span>
							</div>
							<div
								class="mt-2 font-mono text-[11px] tracking-widest text-zinc-500 uppercase"
							>
								{stat.label}
							</div>
						</div>
					</div>
				{/if}
			{/each}
		</div>
	</div>
</section>
