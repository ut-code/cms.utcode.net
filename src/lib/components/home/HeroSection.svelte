<script lang="ts">
	import { ArrowRight, Code2 } from "lucide-svelte";
</script>

<section class="relative min-h-screen overflow-hidden bg-white">
	<!-- Subtle gradient mesh background -->
	<div class="pointer-events-none absolute inset-0" aria-hidden="true">
		<div
			class="absolute -left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-[#00D372]/10 blur-3xl"
		></div>
		<div
			class="absolute -right-1/4 top-1/3 h-[500px] w-[500px] rounded-full bg-[#00D372]/5 blur-3xl"
		></div>
	</div>

	<!-- Grid pattern -->
	<div
		class="pointer-events-none absolute inset-0 opacity-[0.03]"
		style="background-image: linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px); background-size: 48px 48px;"
		aria-hidden="true"
	></div>

	<div class="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-20">
		<div class="mx-auto max-w-3xl text-center">
			<div class="mb-8 flex flex-wrap items-center justify-center gap-3">
				<div
					class="flex items-center gap-2 rounded-full border border-[#00D372]/30 bg-[#00D372]/10 px-4 py-2"
				>
					<div class="h-2 w-2 rounded-full bg-[#00D372] shadow-[0_0_8px_rgba(0,211,114,0.6)]"></div>
					<span class="font-mono text-xs font-medium text-zinc-700">SINCE 2019</span>
				</div>
				<div
					class="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2"
				>
					<Code2 class="h-3.5 w-3.5 text-zinc-500" />
					<span class="font-mono text-xs text-zinc-600">The University of Tokyo</span>
				</div>
			</div>

			<h1 class="mb-10 text-5xl font-bold leading-[1.1] tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl">
				Build<br />
				<span class="text-zinc-400">the</span>
				<span class="text-[#00D372]">Future</span><br />
				<span class="text-zinc-400">with</span> Code<span class="text-[#00D372]">;</span>
			</h1>

			<p class="mb-10 mx-auto max-w-2xl text-lg leading-relaxed text-zinc-600 sm:text-xl">
				東京大学のソフトウェアエンジニアリングサークル。
				<span class="font-semibold text-zinc-800">学生が実際にプロダクトを作り、世に届ける。</span>
			</p>

			<div class="flex flex-wrap items-center justify-center gap-4">
				<a
					href="/join"
					class="group inline-flex items-center gap-2 rounded-lg bg-[#00D372] px-8 py-4 font-semibold text-white shadow-lg shadow-[#00D372]/30 transition-all hover:shadow-xl hover:shadow-[#00D372]/40 focus:outline-none focus:ring-2 focus:ring-[#00D372] focus:ring-offset-2"
				>
					<span>参加する</span>
					<ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-1" />
				</a>
				<a
					href="/projects"
					class="group inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-8 py-4 font-semibold text-white transition-all hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#00D372] focus:ring-offset-2"
				>
					プロジェクトを見る
					<ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-1" />
				</a>
			</div>
		</div>
	</div>
</section>
