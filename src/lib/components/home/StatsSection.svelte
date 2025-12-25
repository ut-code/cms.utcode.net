<script lang="ts">
	import { Users, Rocket, BookOpen, Calendar } from "lucide-svelte";

	type Props = {
		members: number;
		projects: number;
		articles: number;
		years: number;
	};

	const { members, projects, articles, years }: Props = $props();
</script>

<section class="bg-zinc-50 py-24">
	<div class="mx-auto max-w-6xl px-6">
		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
			<a
				href="/members"
				class="group relative overflow-hidden rounded-2xl border border-zinc-200/50 bg-white/80 p-8 backdrop-blur-md transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
			>
				<div class="relative">
					<div class="mb-4 flex items-center justify-between">
						<div class="font-mono text-xs uppercase tracking-wider text-zinc-400">Members</div>
						<div class="rounded-lg bg-primary/10 p-2 transition-all group-hover:bg-primary/20">
							<Users class="h-5 w-5 text-primary" />
						</div>
					</div>
					<div class="flex items-baseline gap-2">
						<span class="text-5xl font-bold text-zinc-900 transition-all group-hover:text-primary">
							{members}
						</span>
						<span class="text-2xl font-bold text-primary">+</span>
					</div>
				</div>
			</a>

			<a
				href="/projects"
				class="group relative overflow-hidden rounded-2xl border border-zinc-200/50 bg-white/80 p-8 backdrop-blur-md transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
			>
				<div class="relative">
					<div class="mb-4 flex items-center justify-between">
						<div class="font-mono text-xs uppercase tracking-wider text-zinc-400">Projects</div>
						<div class="rounded-lg bg-primary/10 p-2 transition-all group-hover:bg-primary/20">
							<Rocket class="h-5 w-5 text-primary" />
						</div>
					</div>
					<div class="flex items-baseline gap-2">
						<span class="text-5xl font-bold text-zinc-900 transition-all group-hover:text-primary">
							{projects}
						</span>
						<span class="text-2xl font-bold text-primary">+</span>
					</div>
				</div>
			</a>

			<a
				href="/articles"
				class="group relative overflow-hidden rounded-2xl border border-zinc-200/50 bg-white/80 p-8 backdrop-blur-md transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
			>
				<div class="relative">
					<div class="mb-4 flex items-center justify-between">
						<div class="font-mono text-xs uppercase tracking-wider text-zinc-400">Articles</div>
						<div class="rounded-lg bg-primary/10 p-2 transition-all group-hover:bg-primary/20">
							<BookOpen class="h-5 w-5 text-primary" />
						</div>
					</div>
					<div class="flex items-baseline gap-2">
						<span class="text-5xl font-bold text-zinc-900 transition-all group-hover:text-primary">
							{articles}
						</span>
						<span class="text-2xl font-bold text-primary">+</span>
					</div>
				</div>
			</a>

			<div
				class="group relative overflow-hidden rounded-2xl border border-zinc-200/50 bg-white/80 p-8 backdrop-blur-md transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/5"
			>
				<div class="relative">
					<div class="mb-4 flex items-center justify-between">
						<div class="font-mono text-xs uppercase tracking-wider text-zinc-400">Years Active</div>
						<div class="rounded-lg bg-primary/10 p-2 transition-all group-hover:bg-primary/20">
							<Calendar class="h-5 w-5 text-primary" />
						</div>
					</div>
					<div class="flex items-baseline gap-2">
						<span class="text-5xl font-bold text-zinc-900 transition-all group-hover:text-primary">
							{years}
						</span>
						<span class="text-2xl font-bold text-primary">+</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
