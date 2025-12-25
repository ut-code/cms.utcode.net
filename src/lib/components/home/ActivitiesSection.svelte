<script lang="ts">
	import { BookOpen, Code, Users } from "lucide-svelte";
</script>

<section class="bg-white py-24">
	<div class="mx-auto max-w-6xl px-6">
		<div class="mb-20 text-center">
			<div class="mb-4 font-mono text-sm font-medium uppercase tracking-widest text-primary">WHAT WE DO</div>
			<h2 class="text-5xl font-bold text-zinc-900 lg:text-6xl">
				活動内容
			</h2>
			<p class="mx-auto mt-6 max-w-2xl text-lg text-zinc-600">
				学習、交流、開発の3つの柱で、実践的なソフトウェアエンジニアリングを体験
			</p>
		</div>

		<div class="grid gap-8 md:grid-cols-3">
			<div class="group">
				<div class="rounded-2xl border border-zinc-200 bg-white p-8 transition-all hover:border-primary/30 hover:bg-primary/5">
					<div
						class="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white"
					>
						<BookOpen class="h-8 w-8" />
					</div>
					<h3 class="mb-4 text-2xl font-bold text-zinc-900">
						学習・教育
					</h3>
					<p class="leading-relaxed text-zinc-600">
						プログラミング未経験者から経験者まで、共に学び教え合う学習会を開催。独自の学習コンテンツをオープンソースで公開しています。
					</p>
				</div>
			</div>

			<div class="group">
				<div class="rounded-2xl border border-zinc-200 bg-white p-8 transition-all hover:border-primary/30 hover:bg-primary/5">
					<div
						class="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white"
					>
						<Users class="h-8 w-8" />
					</div>
					<h3 class="mb-4 text-2xl font-bold text-zinc-900">
						交流
					</h3>
					<p class="leading-relaxed text-zinc-600">
						定期的なイベントでメンバー同士の交流を深めます。集中開発合宿やブレインストーミング大会など様々な活動を実施。
					</p>
				</div>
			</div>

			<div class="group">
				<div class="rounded-2xl border border-zinc-200 bg-white p-8 transition-all hover:border-primary/30 hover:bg-primary/5">
					<div
						class="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white"
					>
						<Code class="h-8 w-8" />
					</div>
					<h3 class="mb-4 text-2xl font-bold text-zinc-900">
						開発
					</h3>
					<p class="leading-relaxed text-zinc-600">
						大学や社会をより良くするソフトウェアを一緒に開発。Webアプリからモバイル、インフラまで幅広く挑戦しています。
					</p>
				</div>
			</div>
		</div>
	</div>
</section>
