<script lang="ts">
	import { ArrowRight, Terminal } from "lucide-svelte";
</script>

<section class="relative min-h-[100svh] overflow-hidden bg-zinc-950">
	<!-- Background image with overlay -->
	<img
		src="/images/headers/hero.jpg"
		alt=""
		class="absolute inset-0 h-full w-full object-cover opacity-40"
	/>
	<div class="absolute inset-0 bg-gradient-to-b from-zinc-950/60 via-zinc-950/40 to-zinc-950"></div>

	<!-- Grid pattern overlay -->
	<div
		class="absolute inset-0 opacity-[0.03]"
		style="background-image: url(&quot;data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&quot;)"
	></div>

	<!-- Content -->
	<div class="relative flex min-h-[100svh] flex-col justify-center px-6 py-24">
		<div class="mx-auto w-full max-w-6xl">
			<!-- Terminal badge -->
			<div class="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
				<Terminal class="h-4 w-4 text-primary" />
				<span class="font-mono text-sm text-primary">東京大学ソフトウェアエンジニアリングサークル</span>
			</div>

			<!-- Main heading -->
			<h1 class="mb-6 max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
				コードで、<br />
				<span class="text-primary">未来をつくる。</span>
			</h1>

			<!-- Description -->
			<p class="mb-10 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
				ut.code(); は、プログラミングの学習・教育から実社会で役立つソフトウェア製作まで、幅広い活動を行う東京大学の技術コミュニティです。
			</p>

			<!-- CTAs -->
			<div class="flex flex-wrap gap-4">
				<a
					href="/join"
					class="group inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-zinc-950"
				>
					<span>参加する</span>
					<ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-1" />
				</a>
				<a
					href="/projects"
					class="group inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/50 px-8 py-4 font-semibold text-white transition-all hover:border-zinc-600 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-zinc-950"
				>
					プロジェクトを見る
					<ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-1" />
				</a>
			</div>
		</div>
	</div>

	<!-- Scroll indicator -->
	<div class="absolute bottom-8 left-1/2 -translate-x-1/2">
		<div class="flex flex-col items-center gap-2 text-zinc-500">
			<span class="font-mono text-xs uppercase tracking-widest">Scroll</span>
			<div class="h-12 w-px bg-gradient-to-b from-zinc-500 to-transparent"></div>
		</div>
	</div>
</section>
