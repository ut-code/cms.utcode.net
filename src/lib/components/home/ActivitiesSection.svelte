<script lang="ts">
	import { ArrowUpRight, BookOpen, Code, Users } from "lucide-svelte";

	type Activity = {
		index: string;
		label: string;
		title: string;
		description: string;
		Icon: typeof BookOpen;
		href: string;
	};

	const activities: Activity[] = [
		{
			index: "01",
			label: "Learn",
			title: "学習・教育",
			description:
				"プログラミング未経験者から経験者まで、共に学び教え合う学習会を開催。独自の学習コンテンツをオープンソースで公開しています。",
			Icon: BookOpen,
			href: "/activities#learn",
		},
		{
			index: "02",
			label: "Share",
			title: "交流",
			description:
				"定期的なイベントでメンバー同士の交流を深めます。集中開発合宿やブレインストーミング大会など様々な活動を実施。",
			Icon: Users,
			href: "/activities#share",
		},
		{
			index: "03",
			label: "Develop",
			title: "開発",
			description:
				"大学や社会をより良くするソフトウェアを一緒に開発。Webアプリからモバイル、インフラまで幅広く挑戦しています。",
			Icon: Code,
			href: "/activities#develop",
		},
	];
</script>

<!--
	activities --- "three pillars" block.
	Each card: monospace index + label pair, large icon in tinted square,
	chevron that lifts on hover. The card itself slides up subtly.
-->
<section class="relative bg-white py-24">
	<div class="mx-auto max-w-6xl px-6">
		<div class="mb-16 max-w-3xl">
			<div
				class="mb-4 flex items-center gap-3 font-mono text-[11px] tracking-widest text-primary uppercase"
			>
				<span class="inline-block h-px w-6 bg-primary"></span>
				<span>// what we do</span>
			</div>
			<h2 class="text-4xl leading-[1.1] font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
				学習、交流、開発。<br />
				<span class="text-zinc-400">三つの柱で動く。</span>
			</h2>
			<p class="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600">
				実践的なソフトウェアエンジニアリングを、それぞれのペースで体験できる場所です。
			</p>
		</div>

		<div class="grid gap-4 md:grid-cols-3">
			{#each activities as activity (activity.label)}
				<a
					href={activity.href}
					class="group relative isolate flex min-h-[18rem] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/[0.03] hover:shadow-xl hover:shadow-primary/5 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
				>
					<!-- Top row: mono index pair + chevron -->
					<div class="mb-8 flex items-start justify-between">
						<div class="font-mono text-[10px] tracking-[0.2em] text-zinc-400">
							{activity.index} / 03
							<span class="mx-2 text-zinc-300">·</span>
							<span class="text-primary">{activity.label}</span>
						</div>
						<ArrowUpRight
							class="h-5 w-5 text-zinc-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
						/>
					</div>

					<!-- Icon block: outline on rest, filled on hover -->
					<div
						class="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-white"
					>
						<activity.Icon class="h-6 w-6" />
					</div>

					<h3 class="mb-3 text-2xl font-bold tracking-tight text-zinc-900">
						{activity.title}
					</h3>
					<p class="leading-relaxed text-zinc-600">
						{activity.description}
					</p>

					<!-- bottom-creeping primary line -->
					<span
						class="pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-primary transition-all duration-500 group-hover:w-full"
						aria-hidden="true"
					></span>
				</a>
			{/each}
		</div>
	</div>
</section>
