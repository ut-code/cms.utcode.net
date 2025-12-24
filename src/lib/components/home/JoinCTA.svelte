<script lang="ts">
	import { ArrowRight } from "lucide-svelte";
</script>

<section id="join" class="relative overflow-hidden bg-zinc-900 py-16 text-white sm:py-24 md:py-32">
	<!-- Background decoration -->
	<div
		class="pointer-events-none absolute inset-0 opacity-10"
		style="background-image: radial-gradient(circle at 20% 50%, oklch(72% 0.19 145) 0%, transparent 50%), radial-gradient(circle at 80% 50%, oklch(72% 0.19 145) 0%, transparent 50%);"
	></div>

	<div class="relative z-10 mx-auto max-w-6xl px-6 text-center">
		<h2 class="mb-4 text-2xl font-bold sm:mb-6 sm:text-3xl md:text-4xl lg:text-5xl">
			<span class="inline-block border-b-2 border-primary pb-1 sm:border-b-4 sm:pb-2">未来のソフトウェア</span>を<br
			/>デザインしよう
		</h2>
		<p class="mx-auto mb-8 max-w-xl text-base leading-relaxed text-zinc-500 sm:mb-10 sm:text-lg">
			ut.code(); で一緒にワクワクするソフトウェアを作りませんか?
			初心者から実務経験者、学年を問わずどなたでも大歓迎です。
		</p>
		<a
			href="/join"
			class="group inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-zinc-900 shadow-lg shadow-primary/25 transition-all hover:bg-primary-focus hover:shadow-xl sm:px-8 sm:py-4 sm:text-lg"
		>
			JOIN US
			<ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-0.5 sm:h-5 sm:w-5" />
		</a>
	</div>
</section>
