<script lang="ts">
	import { ArrowRight } from "lucide-svelte";
</script>

<section class="bg-white py-32">
	<div class="mx-auto max-w-6xl px-6">
		<div class="mx-auto max-w-4xl text-center">
			<div class="mb-6 font-mono text-sm font-medium uppercase tracking-widest text-primary">SINCE 2019</div>

			<h1 class="mb-8 text-5xl font-bold leading-tight text-zinc-900 sm:text-6xl lg:text-7xl">
				Build the <span class="text-primary">Future</span><br />
				with Code<span class="text-primary">;</span>
			</h1>

			<p class="mb-4 text-xl leading-relaxed text-zinc-600">
				東京大学のソフトウェアエンジニアリングサークル。
			</p>
			<p class="mb-12 text-lg font-medium leading-relaxed text-zinc-700">
				学生が実際にプロダクトを作り、世に届ける。
			</p>

			<div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
				<a
					href="/join"
					class="group inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
				>
					<span>参加する</span>
					<ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-1" />
				</a>
				<a
					href="/projects"
					class="group inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-8 py-4 font-semibold text-white transition-all hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
				>
					プロジェクトを見る
					<ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-1" />
				</a>
			</div>
		</div>
	</div>
</section>
