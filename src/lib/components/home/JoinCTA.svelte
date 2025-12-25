<script lang="ts">
	import { ArrowRight, Sparkles } from "lucide-svelte";
</script>

<section id="join" class="bg-zinc-900 py-24">
	<div class="mx-auto max-w-4xl px-6 text-center">
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
