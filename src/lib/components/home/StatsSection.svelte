<script lang="ts">
	type Props = {
		members: number;
		projects: number;
		articles: number;
		years: number;
	};

	const { members, projects, articles, years }: Props = $props();

	const stats = $derived([
		{ label: "Members", value: members, href: "/members" },
		{ label: "Projects", value: projects, href: "/projects" },
		{ label: "Articles", value: articles, href: "/articles" },
		{ label: "Years", value: years, href: null },
	]);
</script>

<section class="border-b border-zinc-200 bg-white">
	<div class="mx-auto max-w-6xl px-6">
		<div class="grid grid-cols-2 divide-x divide-zinc-200 lg:grid-cols-4">
			{#each stats as stat (stat.label)}
				{#if stat.href}
					<a
						href={stat.href}
						class="group flex flex-col items-center justify-center py-12 transition-colors hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary lg:py-16"
					>
						<span class="font-mono text-4xl font-bold text-zinc-900 transition-colors group-hover:text-primary sm:text-5xl">
							{stat.value}<span class="text-primary">+</span>
						</span>
						<span class="mt-2 font-mono text-xs uppercase tracking-widest text-zinc-500">
							{stat.label}
						</span>
					</a>
				{:else}
					<div class="flex flex-col items-center justify-center py-12 lg:py-16">
						<span class="font-mono text-4xl font-bold text-zinc-900 sm:text-5xl">
							{stat.value}<span class="text-primary">+</span>
						</span>
						<span class="mt-2 font-mono text-xs uppercase tracking-widest text-zinc-500">
							{stat.label}
						</span>
					</div>
				{/if}
			{/each}
		</div>
	</div>
</section>
