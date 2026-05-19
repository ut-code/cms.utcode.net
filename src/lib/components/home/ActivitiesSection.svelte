<script lang="ts">
	import { ArrowRight } from "lucide-svelte";

	const activities = [
		{
			number: "01",
			title: "学習・教育",
			description:
				"プログラミング未経験者から経験者まで、共に学び教え合う学習会を開催。独自の学習コンテンツをオープンソースで公開しています。",
			keywords: ["勉強会", "教材開発", "ハンズオン"],
		},
		{
			number: "02",
			title: "交流",
			description:
				"定期的なイベントでメンバー同士の交流を深めます。集中開発合宿やブレインストーミング大会など様々な活動を実施。",
			keywords: ["合宿", "LT会", "ハッカソン"],
		},
		{
			number: "03",
			title: "開発",
			description:
				"大学や社会をより良くするソフトウェアを一緒に開発。Webアプリからモバイル、インフラまで幅広く挑戦しています。",
			keywords: ["Web", "モバイル", "OSS"],
		},
	];
</script>

<section class="bg-zinc-50 py-24">
	<div class="mx-auto max-w-6xl px-6">
		<div class="mb-16 flex items-end justify-between">
			<div>
				<div class="mb-4 font-mono text-sm font-medium uppercase tracking-widest text-primary">
					WHAT WE DO
				</div>
				<h2 class="text-4xl font-bold text-zinc-900 sm:text-5xl lg:text-6xl">活動内容</h2>
			</div>
			<a
				href="/activities"
				class="group hidden items-center gap-2 font-semibold text-zinc-600 transition-colors hover:text-primary sm:flex"
			>
				詳しく見る
				<ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
			</a>
		</div>

		<div class="grid gap-6 lg:grid-cols-3">
			{#each activities as activity (activity.number)}
				<div
					class="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-8 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
				>
					<!-- Large number background -->
					<span
						class="absolute -top-4 -right-4 font-mono text-[8rem] font-bold leading-none text-zinc-100 transition-colors group-hover:text-primary/10"
					>
						{activity.number}
					</span>

					<div class="relative">
						<h3 class="mb-4 text-2xl font-bold text-zinc-900">{activity.title}</h3>
						<p class="mb-6 leading-relaxed text-zinc-600">{activity.description}</p>
						<div class="flex flex-wrap gap-2">
							{#each activity.keywords as keyword}
								<span class="rounded-lg bg-zinc-100 px-3 py-1 font-mono text-xs text-zinc-600">
									{keyword}
								</span>
							{/each}
						</div>
					</div>
				</div>
			{/each}
		</div>

		<a
			href="/activities"
			class="mt-8 flex items-center justify-center gap-2 font-semibold text-zinc-600 transition-colors hover:text-primary sm:hidden"
		>
			詳しく見る
			<ArrowRight class="h-4 w-4" />
		</a>
	</div>
</section>
