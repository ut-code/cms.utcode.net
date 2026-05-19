<script lang="ts">
	import { ArrowRight, Sparkles } from "lucide-svelte";
</script>

<section id="join" class="relative overflow-hidden bg-zinc-950 py-32">
	<!-- Gradient orbs -->
	<div
		class="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-primary/20 blur-[100px]"
	></div>
	<div
		class="absolute -right-40 -bottom-40 h-80 w-80 rounded-full bg-primary/10 blur-[100px]"
	></div>

	<!-- Grid pattern -->
	<div
		class="absolute inset-0 opacity-[0.02]"
		style="background-image: url(&quot;data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&quot;)"
	></div>

	<div class="relative mx-auto max-w-4xl px-6 text-center">
		<div class="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
			<Sparkles class="h-4 w-4 text-primary" />
			<span class="font-mono text-sm font-medium text-primary">メンバー募集中</span>
		</div>

		<h2 class="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
			未来のソフトウェアを<br />
			<span class="text-primary">一緒につくろう</span>
		</h2>

		<p class="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-zinc-400">
			初心者から経験者まで、学年を問わずどなたでも大歓迎。<br />
			ut.code(); で、ワクワクするソフトウェアを作りませんか?
		</p>

		<div class="flex flex-wrap items-center justify-center gap-4">
			<a
				href="/join"
				class="group inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/35 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-zinc-950"
			>
				参加する
				<ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-1" />
			</a>
			<a
				href="/about"
				class="group inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900/50 px-8 py-4 font-semibold text-white transition-all hover:border-zinc-600 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-zinc-950"
			>
				もっと詳しく
				<ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-1" />
			</a>
		</div>
	</div>
</section>
