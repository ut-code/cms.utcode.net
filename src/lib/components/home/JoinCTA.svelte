<script lang="ts">
	import { ArrowRight, Sparkles } from "lucide-svelte";
</script>

<!--
	join-cta --- dark, large-type call to action.
	Layered: radial primary glow + thin grid overlay + corner stamps.
	Headline emphasizes "デザインしよう" with a primary underline ribbon.
-->
<section id="join" class="relative overflow-hidden bg-zinc-950 py-24">
	<!-- subtle dot-grid background -->
	<div
		class="pointer-events-none absolute inset-0 opacity-[0.18]"
		style="background-image: radial-gradient(circle, rgb(255 255 255 / 0.6) 1px, transparent 1px); background-size: 28px 28px;"
		aria-hidden="true"
	></div>
	<!-- soft primary glow from bottom-right -->
	<div
		class="pointer-events-none absolute -right-40 -bottom-40 h-[28rem] w-[28rem] rounded-full"
		style="background: radial-gradient(circle, oklch(76% 0.2 153 / 0.25) 0%, transparent 60%);"
		aria-hidden="true"
	></div>
	<!-- secondary glow from top-left -->
	<div
		class="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full"
		style="background: radial-gradient(circle, oklch(76% 0.2 153 / 0.12) 0%, transparent 65%);"
		aria-hidden="true"
	></div>

	<!-- corner stamps for editorial feel -->
	<div
		class="pointer-events-none absolute top-6 left-4 font-mono text-[10px] tracking-widest text-white/30 sm:left-8"
		aria-hidden="true"
	>
		// recruiting
	</div>
	<div
		class="pointer-events-none absolute right-4 bottom-6 font-mono text-[10px] tracking-widest text-white/30 sm:right-8"
		aria-hidden="true"
	>
		ut.code(); / join
	</div>

	<div class="relative mx-auto max-w-4xl px-6 text-center">
		<div
			class="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 backdrop-blur-sm"
		>
			<Sparkles class="h-4 w-4 text-primary" />
			<span class="font-mono text-xs tracking-widest text-primary uppercase">
				now recruiting · メンバー募集中
			</span>
		</div>

		<h2
			class="mb-8 text-5xl leading-[1.05] font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
		>
			未来のソフトウェアを<br />
			<span class="relative inline-block">
				<span class="text-primary">デザインしよう</span>
				<svg
					class="absolute -bottom-3 left-0 w-full"
					viewBox="0 0 200 12"
					preserveAspectRatio="none"
					aria-hidden="true"
				>
					<path
						d="M2 8 Q 50 2, 100 6 T 198 4"
						stroke="oklch(76% 0.2 153)"
						stroke-width="2.5"
						stroke-linecap="round"
						fill="none"
						opacity="0.6"
					/>
				</svg>
			</span>
		</h2>

		<p class="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
			ut.code(); で一緒にワクワクするソフトウェアを作りませんか?<br />
			初心者から実務経験者、学年を問わずどなたでも大歓迎です。
		</p>

		<div class="flex flex-wrap items-center justify-center gap-3">
			<a
				href="/join"
				class="group inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-8 py-4 font-semibold text-zinc-950 shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/50 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-zinc-950 focus:outline-none"
			>
				<span class="font-mono text-xs tracking-widest opacity-60">[01]</span>
				JOIN US
				<ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-1" />
			</a>
			<a
				href="/about"
				class="group inline-flex min-h-11 items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900/60 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all hover:border-zinc-500 hover:bg-zinc-900 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-zinc-950 focus:outline-none"
			>
				<span class="font-mono text-xs tracking-widest text-white/40">[02]</span>
				もっと詳しく
				<ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-1" />
			</a>
		</div>
	</div>
</section>
