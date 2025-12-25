<script lang="ts">
	import { ArrowRight, Code2 } from "lucide-svelte";
</script>

<section class="relative min-h-screen overflow-hidden bg-white">
	<!-- Ambient background layers -->
	<div class="pointer-events-none absolute inset-0" aria-hidden="true">
		<!-- Primary gradient mesh -->
		<div
			class="absolute right-0 top-0 h-[800px] w-[800px] rounded-full bg-primary/[0.08] blur-3xl"
			style="transform: translate(30%, -20%);"
		></div>
		<!-- Secondary accent -->
		<div
			class="absolute bottom-0 left-0 h-[600px] w-[600px] rounded-full bg-primary/[0.04] blur-3xl"
			style="transform: translate(-40%, 20%);"
		></div>
	</div>

	<div class="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-20 lg:px-12">
		<!-- Mobile: centered layout -->
		<div class="lg:hidden mx-auto max-w-xl text-center">
			<div class="mb-8 flex flex-wrap items-center justify-center gap-3">
				<div
					class="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2"
				>
					<div class="h-2 w-2 rounded-full bg-primary shadow-primary/60 shadow-[0_0_8px]"></div>
					<span class="font-mono text-xs font-medium text-zinc-700">SINCE 2019</span>
				</div>
				<div
					class="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2"
				>
					<Code2 class="h-3.5 w-3.5 text-zinc-500" />
					<span class="font-mono text-xs text-zinc-600">The University of Tokyo</span>
				</div>
			</div>

			<h1 class="mb-10 text-5xl font-bold leading-[1.1] tracking-tight text-zinc-900 sm:text-6xl">
				Build<br />
				<span class="text-zinc-400">the</span>
				<span class="text-primary">Future</span><br />
				<span class="text-zinc-400">with</span> Code<span class="text-primary">;</span>
			</h1>

			<p class="mb-10 mx-auto max-w-md text-lg leading-relaxed text-zinc-600">
				東京大学のソフトウェアエンジニアリングサークル。
				<span class="font-semibold text-zinc-800">学生が実際にプロダクトを作り、世に届ける。</span>
			</p>

			<div class="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
				<a
					href="/join"
					class="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-primary px-8 py-4 font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
				>
					<span>参加する</span>
					<ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-1" />
				</a>
				<a
					href="/projects"
					class="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-zinc-900 px-8 py-4 font-semibold text-white transition-all hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
				>
					プロジェクトを見る
					<ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-1" />
				</a>
			</div>
		</div>

		<!-- Desktop: asymmetric layout -->
		<div class="hidden lg:grid lg:grid-cols-2 lg:gap-16 xl:gap-24 lg:items-center">
			<!-- Left column: Content -->
			<div class="space-y-12 animate-fade-in-up">
				<!-- Meta badges -->
				<div class="flex flex-wrap items-center gap-3">
					<div
						class="flex items-center gap-2.5 rounded-full border border-primary/30 bg-primary/[0.08] px-5 py-2.5 backdrop-blur-sm"
					>
						<div class="h-2 w-2 rounded-full bg-primary shadow-primary/70 shadow-[0_0_10px]"></div>
						<span class="font-mono text-sm font-medium text-zinc-700 tracking-wide">SINCE 2019</span>
					</div>
					<div
						class="flex items-center gap-2.5 rounded-full border border-zinc-200/80 bg-white/60 px-5 py-2.5 backdrop-blur-sm"
					>
						<Code2 class="h-4 w-4 text-zinc-500" />
						<span class="font-mono text-sm text-zinc-600">The University of Tokyo</span>
					</div>
				</div>

				<!-- Headline -->
				<div class="space-y-4">
					<h1 class="text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight text-zinc-900">
						Build the <span class="text-primary">Future</span><br />
						with Code<span class="text-primary">;</span>
					</h1>
				</div>

				<!-- Description -->
				<div class="space-y-6 max-w-xl">
					<p class="text-xl leading-relaxed text-zinc-600">
						東京大学のソフトウェアエンジニアリングサークル。
					</p>
					<p class="text-lg leading-relaxed text-zinc-700 font-medium">
						学生が実際にプロダクトを作り、世に届ける。
					</p>
				</div>

				<!-- CTAs -->
				<div class="flex flex-wrap items-center gap-4 pt-4">
					<a
						href="/join"
						class="group inline-flex items-center gap-2.5 rounded-lg bg-primary px-8 py-4 font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
					>
						<span>参加する</span>
						<ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-1" />
					</a>
					<a
						href="/projects"
						class="group inline-flex items-center gap-2.5 rounded-lg border border-zinc-900 bg-zinc-900 px-8 py-4 font-semibold text-white transition-all hover:bg-zinc-800 hover:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
					>
						<span>プロジェクトを見る</span>
						<ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-1" />
					</a>
				</div>
			</div>

			<!-- Right column: Visual elements -->
			<div class="relative animate-fade-in-right">
				<!-- Floating card stack -->
				<div class="relative h-[600px]">
					<!-- Card 1: Code snippet -->
					<div
						class="absolute left-0 top-0 w-full rounded-2xl border border-zinc-200/80 bg-white/80 p-8 shadow-2xl shadow-zinc-900/5 backdrop-blur-sm animate-float"
					>
						<div class="flex items-center justify-between mb-6">
							<div class="flex items-center gap-2">
								<div class="h-3 w-3 rounded-full bg-[#ff5f57]"></div>
								<div class="h-3 w-3 rounded-full bg-[#febc2e]"></div>
								<div class="h-3 w-3 rounded-full bg-[#28c840]"></div>
							</div>
							<span class="font-mono text-xs text-zinc-400">main.ts</span>
						</div>
						<pre class="font-mono text-sm leading-relaxed text-zinc-700"><code>{@html `<span class="text-zinc-500">const</span> <span class="text-zinc-900">mission</span> = {
  <span class="text-primary">learn</span>: <span class="text-zinc-600">"最新技術"</span>,
  <span class="text-primary">build</span>: <span class="text-zinc-600">"実用プロダクト"</span>,
  <span class="text-primary">share</span>: <span class="text-zinc-600">"知見と経験"</span>
};`}</code></pre>
					</div>

					<!-- Card 2: Stats -->
					<div
						class="absolute right-0 top-48 w-80 rounded-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-xl shadow-zinc-900/5 backdrop-blur-sm animate-float"
					>
						<div class="space-y-4">
							<div class="flex items-baseline gap-3">
								<div class="text-4xl font-bold text-zinc-900">100+</div>
								<div class="font-mono text-sm text-zinc-500">メンバー</div>
							</div>
							<div class="flex items-baseline gap-3">
								<div class="text-4xl font-bold text-primary">50+</div>
								<div class="font-mono text-sm text-zinc-500">プロジェクト</div>
							</div>
							<div class="flex items-baseline gap-3">
								<div class="text-4xl font-bold text-zinc-900">6</div>
								<div class="font-mono text-sm text-zinc-500">年の実績</div>
							</div>
						</div>
					</div>

					<!-- Card 3: Tech tags -->
					<div
						class="absolute left-12 bottom-0 rounded-2xl border border-zinc-200/80 bg-white/80 p-6 shadow-xl shadow-zinc-900/5 backdrop-blur-sm animate-float"
					>
						<div class="flex flex-wrap gap-2">
							<span class="rounded-lg bg-zinc-100 px-3 py-1.5 font-mono text-xs text-zinc-700">TypeScript</span>
							<span class="rounded-lg bg-zinc-100 px-3 py-1.5 font-mono text-xs text-zinc-700">React</span>
							<span class="rounded-lg bg-zinc-100 px-3 py-1.5 font-mono text-xs text-zinc-700">Svelte</span>
							<span class="rounded-lg bg-zinc-100 px-3 py-1.5 font-mono text-xs text-zinc-700">Python</span>
							<span class="rounded-lg bg-zinc-100 px-3 py-1.5 font-mono text-xs text-zinc-700">Go</span>
							<span class="rounded-lg bg-primary/10 px-3 py-1.5 font-mono text-xs text-primary font-medium">+More</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	/* Fade in animations */
	@keyframes fade-in-up {
		from {
			opacity: 0;
			transform: translateY(24px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes fade-in-right {
		from {
			opacity: 0;
			transform: translateX(-24px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	.animate-fade-in-up {
		animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	.animate-fade-in-right {
		animation: fade-in-right 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
		opacity: 0;
	}

	/* Floating cards */
	@keyframes float {
		0%, 100% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-12px);
		}
	}

	.animate-float {
		animation: float 8s ease-in-out infinite;
	}
</style>
