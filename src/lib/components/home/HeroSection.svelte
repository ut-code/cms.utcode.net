<script lang="ts">
	import { ArrowRight } from "lucide-svelte";
</script>

<!-- Full-height hero with background image -->
<section class="relative h-screen">
	<img
		src="/images/headers/hero.jpg"
		alt=""
		class="absolute inset-0 h-full w-full object-cover"
	/>
	<!-- Gradient overlay for text readability -->
	<div class="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>

	<div
		class="absolute top-1/3 left-4 right-4 max-w-lg rounded-2xl bg-white/95 p-8 shadow-xl backdrop-blur-sm sm:left-8 md:left-10 md:right-auto"
	>
		<h1 class="text-2xl font-bold text-zinc-900 md:text-3xl">
			東京大学のソフトウェア開発サークル
		</h1>
		<p class="mt-4 leading-relaxed text-zinc-600">
			ut.code(); は、2019
			年に発足した東京大学のソフトウェアエンジニアリングコミュニティ・プログラミングサークルです。
			プログラミングの学習・教育から、実社会で役立つソフトウェア製作まで、幅広い活動を行っています。
		</p>
		<div class="mt-8 flex flex-wrap gap-4">
			<a
				href="/join"
				class="group inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
			>
				<span>参加する</span>
				<ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-1" />
			</a>
			<a
				href="/projects"
				class="group inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-6 py-3 font-semibold text-white transition-all hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
			>
				プロジェクトを見る
				<ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-1" />
			</a>
		</div>
	</div>
</section>
