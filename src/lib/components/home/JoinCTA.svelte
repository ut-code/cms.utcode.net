<script lang="ts">
	import { ArrowRight, Sparkles } from "lucide-svelte";
</script>

<section id="join" class="relative overflow-hidden bg-gradient-to-br from-orange-600 to-amber-600 py-32">
	<!-- Animated background elements -->
	<div class="pointer-events-none absolute inset-0 overflow-hidden">
		<div
			class="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-white/5 blur-3xl"
		></div>
		<div
			class="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-white/5 blur-3xl"
		></div>
	</div>

	<!-- Noise texture -->
	<div
		class="pointer-events-none absolute inset-0 opacity-[0.02]"
		style="background-image: url('data:image/svg+xml,%3Csvg viewBox=&quot;0 0 200 200&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cfilter id=&quot;noiseFilter&quot;%3E%3CfeTurbulence type=&quot;fractalNoise&quot; baseFrequency=&quot;0.9&quot; numOctaves=&quot;3&quot; stitchTiles=&quot;stitch&quot;/%3E%3C/filter%3E%3Crect width=&quot;100%25&quot; height=&quot;100%25&quot; filter=&quot;url(%23noiseFilter)&quot;/%3E%3C/svg%3E');"
	></div>

	<div class="relative z-10 mx-auto max-w-4xl px-6 text-center">
		<div class="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
			<Sparkles class="h-4 w-4 text-white" />
			<span class="font-mono text-sm font-medium text-white">WE'RE HIRING</span>
		</div>

		<h2 class="mb-6 font-[clash-display,ui-sans-serif,system-ui,sans-serif] text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">
			未来のソフトウェアを<br />
			<span class="relative inline-block">
				デザインしよう
				<svg class="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
					<path d="M2 10C50 5 100 2 150 5C200 8 250 3 298 7" stroke="white" stroke-width="4" stroke-linecap="round"/>
				</svg>
			</span>
		</h2>

		<p class="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl">
			ut.code(); で一緒にワクワクするソフトウェアを作りませんか?<br />
			初心者から実務経験者、学年を問わずどなたでも大歓迎です。
		</p>

		<div class="flex flex-wrap items-center justify-center gap-4">
			<a
				href="/join"
				class="group inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-8 py-4 font-bold text-white shadow-2xl shadow-zinc-950/50 transition-all hover:bg-zinc-900 hover:shadow-zinc-950/60"
			>
				JOIN US
				<ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-1" />
			</a>
			<a
				href="/about"
				class="group inline-flex items-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/20"
			>
				もっと詳しく
				<ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-1" />
			</a>
		</div>
	</div>
</section>
