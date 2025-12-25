<script lang="ts">
	import { ArrowRight, Code2, Sparkles } from "lucide-svelte";

	type Props = {
		members: number;
		projects: number;
		years: number;
	};

	const { members, projects, years }: Props = $props();
</script>

<section class="relative min-h-screen overflow-hidden bg-zinc-950">
	<!-- Animated gradient orbs with more vibrant colors -->
	<div class="pointer-events-none absolute inset-0 overflow-hidden">
		<div
			class="absolute -left-1/4 top-0 h-[700px] w-[700px] animate-pulse rounded-full bg-gradient-to-br from-emerald-500/25 to-lime-500/25 blur-3xl"
			style="animation-duration: 4s;"
		></div>
		<div
			class="absolute -right-1/4 top-1/3 h-[600px] w-[600px] animate-pulse rounded-full bg-gradient-to-br from-lime-500/20 to-emerald-500/20 blur-3xl"
			style="animation-duration: 5s; animation-delay: 1s;"
		></div>
		<div
			class="absolute bottom-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 animate-pulse rounded-full bg-gradient-to-br from-lime-500/15 to-emerald-500/15 blur-3xl"
			style="animation-duration: 6s; animation-delay: 2s;"
		></div>
		<!-- Additional accent orb -->
		<div
			class="absolute right-1/4 top-1/2 h-[350px] w-[350px] animate-pulse rounded-full bg-gradient-to-br from-emerald-400/10 to-lime-400/10 blur-3xl"
			style="animation-duration: 7s; animation-delay: 0.5s;"
		></div>
	</div>

	<!-- Noise texture -->
	<div
		class="pointer-events-none absolute inset-0 opacity-[0.02]"
		style="background-image: url('data:image/svg+xml,%3Csvg viewBox=&quot;0 0 200 200&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cfilter id=&quot;noiseFilter&quot;%3E%3CfeTurbulence type=&quot;fractalNoise&quot; baseFrequency=&quot;0.9&quot; numOctaves=&quot;3&quot; stitchTiles=&quot;stitch&quot;/%3E%3C/filter%3E%3Crect width=&quot;100%25&quot; height=&quot;100%25&quot; filter=&quot;url(%23noiseFilter)&quot;/%3E%3C/svg%3E');"
	></div>

	<!-- Grid pattern overlay -->
	<div
		class="pointer-events-none absolute inset-0 opacity-[0.02]"
		style="background-image: linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 50px 50px;"
	></div>

	<div class="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-20">
		<div class="grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
			<!-- Left content -->
			<div class="lg:col-span-7">
				<div class="mb-8 flex flex-wrap items-center gap-3">
					<div
						class="flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 backdrop-blur-sm transition-all hover:border-orange-500/50 hover:bg-orange-500/15"
					>
						<div class="h-2 w-2 animate-pulse rounded-full bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.6)]"></div>
						<span class="font-mono text-xs font-medium text-orange-200">SINCE 2019</span>
					</div>
					<div
						class="flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-800/50 px-4 py-2 backdrop-blur-sm transition-all hover:border-zinc-600 hover:bg-zinc-800/70"
					>
						<Code2 class="h-3.5 w-3.5 text-zinc-400" />
						<span class="font-mono text-xs text-zinc-400">The University of Tokyo</span>
					</div>
				</div>

				<h1
					class="mb-10 font-[clash-display,ui-sans-serif,system-ui,sans-serif] text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl"
				>
					<span class="relative inline-block">
						Build
						<svg
							class="absolute -right-2 -top-2 h-8 w-8 animate-pulse text-orange-400 sm:h-10 sm:w-10"
							fill="currentColor"
							viewBox="0 0 20 20"
							style="animation-duration: 2s;"
						>
							<path
								d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
							/>
						</svg>
					</span>
					<br />
					<span class="text-zinc-400">the</span>
					<span
						class="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent animate-[gradient_3s_ease_infinite]"
						style="background-size: 200% auto;"
					>
						Future
					</span>
					<br />
					<span class="text-zinc-400">with</span> Code<span class="text-orange-400 animate-pulse" style="animation-duration: 1.5s;">;</span>
				</h1>

				<p class="mb-10 max-w-xl font-[dm-sans,ui-sans-serif,system-ui,sans-serif] text-lg leading-relaxed text-zinc-400 sm:text-xl">
					東京大学のソフトウェアエンジニアリングサークル。
					<span class="font-semibold text-zinc-300">学生が実際にプロダクトを作り、世に届ける。</span>
				</p>

				<div class="flex flex-wrap items-center gap-4">
					<a
						href="#join"
						class="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 font-bold text-zinc-950 shadow-lg shadow-orange-500/50 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/70"
					>
						<span class="relative z-10">参加する</span>
						<ArrowRight class="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1" />
						<div
							class="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-400 opacity-0 transition-opacity group-hover:opacity-100"
						></div>
					</a>
					<a
						href="/projects"
						class="group inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/50 px-8 py-4 font-bold text-white backdrop-blur-sm transition-all hover:scale-105 hover:border-zinc-600 hover:bg-zinc-800/70 hover:shadow-lg"
					>
						プロジェクトを見る
						<ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-1" />
					</a>
				</div>
			</div>

			<!-- Right stats card -->
			<div class="lg:col-span-5">
				<div
					class="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900/90 to-zinc-950/90 p-8 backdrop-blur-xl transition-all hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10"
				>
					<!-- Glow effect on hover -->
					<div
						class="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-br from-orange-500/20 via-transparent to-amber-500/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
					></div>

					<!-- Animated border gradient -->
					<div
						class="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
						style="background: linear-gradient(135deg, rgba(249,115,22,0.1), rgba(245,158,11,0.1), transparent, transparent); animation: rotate-gradient 3s linear infinite;"
					></div>

					<div class="relative space-y-6">
						<div class="flex items-center justify-between">
							<span class="font-mono text-xs text-zinc-500">// stats</span>
							<Sparkles class="h-4 w-4 text-orange-400" />
						</div>

						<div class="space-y-4">
							<div class="group/stat">
								<div class="mb-1 font-mono text-xs uppercase tracking-wider text-zinc-500">
									Members
								</div>
								<div class="flex items-baseline gap-2">
									<span
										class="font-[clash-display,ui-sans-serif,system-ui,sans-serif] text-5xl font-bold text-white"
									>
										{members}
									</span>
									<span class="text-2xl text-orange-400">+</span>
								</div>
							</div>

							<div class="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>

							<div class="group/stat">
								<div class="mb-1 font-mono text-xs uppercase tracking-wider text-zinc-500">
									Projects
								</div>
								<div class="flex items-baseline gap-2">
									<span
										class="font-[clash-display,ui-sans-serif,system-ui,sans-serif] text-5xl font-bold text-white"
									>
										{projects}
									</span>
									<span class="text-2xl text-amber-400">+</span>
								</div>
							</div>

							<div class="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>

							<div class="group/stat">
								<div class="mb-1 font-mono text-xs uppercase tracking-wider text-zinc-500">
									Years Active
								</div>
								<div class="flex items-baseline gap-2">
									<span
										class="font-[clash-display,ui-sans-serif,system-ui,sans-serif] text-5xl font-bold text-white"
									>
										{years}
									</span>
									<span class="text-2xl text-yellow-400">+</span>
								</div>
							</div>
						</div>

						<div class="pt-4">
							<div
								class="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 font-mono text-sm text-zinc-400"
							>
								<span class="text-orange-400">"</span>Ship it<span class="text-orange-400">"</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Scroll indicator -->
		<div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
			<div class="flex flex-col items-center gap-2">
				<span class="font-mono text-xs text-zinc-600">scroll</span>
				<div class="h-12 w-6 rounded-full border-2 border-zinc-800">
					<div class="mx-auto mt-2 h-2 w-1 animate-pulse rounded-full bg-orange-400"></div>
				</div>
			</div>
		</div>
	</div>
</section>
