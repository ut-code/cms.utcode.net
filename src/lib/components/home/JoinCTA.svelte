<script lang="ts">
	import { ArrowRight, Sparkles } from "lucide-svelte";
</script>

<section id="join" class="relative overflow-hidden bg-zinc-900 py-32">
	<!-- Decorative elements -->
	<div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
		<div
			class="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
		></div>
		<div
			class="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl"
		></div>
	</div>

	<!-- Grid pattern -->
	<div
		class="pointer-events-none absolute inset-0 opacity-[0.02]"
		style="background-image: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 48px 48px;"
		aria-hidden="true"
	></div>

	<div class="relative z-10 mx-auto max-w-4xl px-6 text-center">
		<div class="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
			<Sparkles class="h-4 w-4 text-primary" />
			<span class="font-mono text-sm font-medium text-primary">メンバー募集中</span>
		</div>

		<h2 class="mb-6 text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">
			未来のソフトウェアを<br />
			<span class="text-primary">デザインしよう</span>
		</h2>

		<p class="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
			ut.code(); で一緒にワクワクするソフトウェアを作りませんか?<br />
			初心者から実務経験者、学年を問わずどなたでも大歓迎です。
		</p>

		<div class="flex flex-wrap items-center justify-center gap-4">
			<a
				href="/join"
				class="group inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
			>
				JOIN US
				<ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-1" />
			</a>
			<a
				href="/about"
				class="group inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/50 px-8 py-4 font-semibold text-white transition-all hover:border-zinc-600 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
			>
				もっと詳しく
				<ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-1" />
			</a>
		</div>
	</div>
</section>
