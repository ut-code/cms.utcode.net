<script lang="ts">
	import { BookOpen, Code, Users } from "lucide-svelte";
</script>

<section class="relative overflow-hidden bg-white py-32">
	<!-- Background decoration -->
	<div class="pointer-events-none absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-[#00D372]/5 to-transparent" aria-hidden="true"></div>
	<div class="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[#00D372]/5 to-transparent" aria-hidden="true"></div>

	<!-- Subtle dot pattern -->
	<div
		class="pointer-events-none absolute inset-0 opacity-[0.03]"
		style="background-image: radial-gradient(circle, #000 1px, transparent 1px); background-size: 24px 24px;"
		aria-hidden="true"
	></div>

	<div class="relative mx-auto max-w-6xl px-6">
		<div class="mb-20 text-center">
			<div class="mb-4 font-mono text-sm font-medium uppercase tracking-widest text-[#00D372]">WHAT WE DO</div>
			<h2 class="text-5xl font-bold text-zinc-900 lg:text-6xl">
				活動内容
			</h2>
			<p class="mx-auto mt-6 max-w-2xl text-lg text-zinc-600">
				学習、交流、開発の3つの柱で、実践的なソフトウェアエンジニアリングを体験
			</p>
		</div>

		<div class="grid gap-8 md:grid-cols-3">
			<div class="group relative">
				<div class="relative overflow-hidden rounded-3xl border border-zinc-200/50 bg-white/80 p-8 backdrop-blur-md transition-all hover:border-[#00D372]/30 hover:bg-[#00D372]/5 hover:shadow-xl hover:shadow-[#00D372]/5">
					<div class="relative">
						<div
							class="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00D372] text-white shadow-lg shadow-[#00D372]/30 transition-all group-hover:shadow-xl group-hover:shadow-[#00D372]/40"
						>
							<BookOpen class="h-8 w-8" />
						</div>
						<h3 class="mb-4 text-2xl font-bold text-zinc-900 transition-colors group-hover:text-[#00D372]">
							学習・教育
						</h3>
						<p class="leading-relaxed text-zinc-600">
							プログラミング未経験者から経験者まで、共に学び教え合う学習会を開催。独自の学習コンテンツをオープンソースで公開しています。
						</p>
					</div>
				</div>
			</div>

			<div class="group relative">
				<div class="relative overflow-hidden rounded-3xl border border-zinc-200/50 bg-white/80 p-8 backdrop-blur-md transition-all hover:border-[#00D372]/30 hover:bg-[#00D372]/5 hover:shadow-xl hover:shadow-[#00D372]/5">
					<div class="relative">
						<div
							class="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00D372] text-white shadow-lg shadow-[#00D372]/30 transition-all group-hover:shadow-xl group-hover:shadow-[#00D372]/40"
						>
							<Users class="h-8 w-8" />
						</div>
						<h3 class="mb-4 text-2xl font-bold text-zinc-900 transition-colors group-hover:text-[#00D372]">
							交流
						</h3>
						<p class="leading-relaxed text-zinc-600">
							定期的なイベントでメンバー同士の交流を深めます。集中開発合宿やブレインストーミング大会など様々な活動を実施。
						</p>
					</div>
				</div>
			</div>

			<div class="group relative">
				<div class="relative overflow-hidden rounded-3xl border border-zinc-200/50 bg-white/80 p-8 backdrop-blur-md transition-all hover:border-[#00D372]/30 hover:bg-[#00D372]/5 hover:shadow-xl hover:shadow-[#00D372]/5">
					<div class="relative">
						<div
							class="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00D372] text-white shadow-lg shadow-[#00D372]/30 transition-all group-hover:shadow-xl group-hover:shadow-[#00D372]/40"
						>
							<Code class="h-8 w-8" />
						</div>
						<h3 class="mb-4 text-2xl font-bold text-zinc-900 transition-colors group-hover:text-[#00D372]">
							開発
						</h3>
						<p class="leading-relaxed text-zinc-600">
							大学や社会をより良くするソフトウェアを一緒に開発。Webアプリからモバイル、インフラまで幅広く挑戦しています。
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
