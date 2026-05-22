<script lang="ts">
	import { ArrowRight } from "lucide-svelte";
</script>

<!--
	hero --- full-bleed image + glass panel.
	Decorations: mono coordinate label (top-left), corner ticks on card,
	primary accent rail running down the left edge of the card.
-->
<section class="relative h-screen overflow-hidden">
	<img
		src="/images/headers/hero.jpg"
		alt=""
		role="presentation"
		class="absolute inset-0 h-full w-full object-cover"
	/>
	<!-- Gradient overlay for text readability + subtle grain at bottom -->
	<div
		class="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent"
	></div>
	<div
		class="pointer-events-none absolute inset-0 opacity-60"
		style="background-image: linear-gradient(180deg, transparent 60%, rgb(0 0 0 / 0.35) 100%);"
		aria-hidden="true"
	></div>

	<!-- Mono coordinate label, top-left of viewport -->
	<div
		class="pointer-events-none absolute top-6 left-4 hidden font-mono text-[11px] tracking-widest text-white/70 sm:left-8 md:block"
		aria-hidden="true"
	>
		<span class="text-primary">●</span>
		<span class="ml-2">UTCODE / 35.7128°N, 139.7621°E</span>
	</div>

	<!-- Mono build stamp, bottom-right -->
	<div
		class="pointer-events-none absolute right-4 bottom-6 hidden font-mono text-[11px] tracking-widest text-white/60 sm:right-8 md:block"
		aria-hidden="true"
	>
		<span>est.2019</span>
		<span class="mx-2 text-white/30">/</span>
		<span>v.{new Date().getFullYear()}</span>
	</div>

	<div
		class="animate-fade-slide-in absolute top-[28%] right-4 left-4 max-w-xl rounded-2xl bg-white/95 p-8 shadow-2xl shadow-black/20 ring-1 ring-zinc-200/60 backdrop-blur-md sm:left-8 sm:p-10 md:left-12 md:right-auto"
	>
		<!-- corner ticks: 4 short hairlines at the corners -->
		<span
			class="pointer-events-none absolute top-0 left-0 h-3 w-3 border-t border-l border-primary"
			aria-hidden="true"
		></span>
		<span
			class="pointer-events-none absolute top-0 right-0 h-3 w-3 border-t border-r border-primary"
			aria-hidden="true"
		></span>
		<span
			class="pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b border-l border-primary"
			aria-hidden="true"
		></span>
		<span
			class="pointer-events-none absolute right-0 bottom-0 h-3 w-3 border-r border-b border-primary"
			aria-hidden="true"
		></span>

		<div class="mb-4 flex items-center gap-3 font-mono text-[11px] tracking-widest text-zinc-500 uppercase">
			<span class="inline-block h-px w-6 bg-primary"></span>
			<span>// university software club</span>
		</div>

		<h1 class="text-3xl leading-[1.15] font-bold tracking-tight text-zinc-900 md:text-4xl">
			東京大学の<br />
			<span class="relative inline-block">
				ソフトウェア開発
				<span
					class="absolute -bottom-1 left-0 h-[6px] w-full bg-primary/30"
					aria-hidden="true"
				></span>
			</span>サークル
		</h1>
		<p class="mt-5 leading-relaxed text-zinc-600">
			ut.code(); は、2019
			年に発足した東京大学のソフトウェアエンジニアリングコミュニティ・プログラミングサークルです。
			プログラミングの学習・教育から、実社会で役立つソフトウェア製作まで、幅広い活動を行っています。
		</p>
		<div class="mt-8 flex flex-wrap gap-3">
			<a
				href="/join"
				class="group inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
			>
				<span>参加する</span>
				<ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-1" />
			</a>
			<a
				href="/projects"
				class="group inline-flex min-h-11 items-center gap-2 rounded-lg bg-zinc-900 px-6 py-3 font-semibold text-white transition-all hover:bg-zinc-800 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
			>
				プロジェクトを見る
				<ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-1" />
			</a>
		</div>
	</div>
</section>
