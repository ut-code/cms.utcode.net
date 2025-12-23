<script lang="ts">
	import { ArrowRight, Clock, FileText, SquarePen } from "lucide-svelte";

	interface RecentArticle {
		id: string;
		title: string;
		updatedAt: Date;
		published: boolean;
	}

	interface Props {
		recentArticles: RecentArticle[];
		formatDate: (date: Date) => string;
		hasDrafts: boolean;
	}

	const { recentArticles, formatDate, hasDrafts }: Props = $props();
</script>

<section
	class="animate-fade-slide-in stagger-5 glow-soft rounded-2xl bg-base-100 p-4 sm:p-6 {hasDrafts
		? ''
		: 'lg:col-span-2'}"
>
	<div class="mb-4 flex flex-wrap items-center gap-2 sm:gap-3">
		<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
			<Clock class="h-4 w-4 text-primary" />
		</div>
		<h2 class="font-semibold text-base-content">Recent Activity</h2>
	</div>
	<div class="space-y-2">
		{#each recentArticles as article (article.id)}
			<a
				href="/admin/articles/edit/{article.id}"
				class="group flex items-center gap-3 rounded-xl bg-base-200/50 p-3 transition-all hover:bg-base-200"
			>
				<div
					class="flex h-9 w-9 items-center justify-center rounded-lg {article.published
						? 'bg-success/10'
						: 'bg-warning/10'}"
				>
					{#if article.published}
						<FileText class="h-4 w-4 text-success" />
					{:else}
						<SquarePen class="h-4 w-4 text-warning" />
					{/if}
				</div>
				<div class="min-w-0 flex-1">
					<p class="truncate text-sm font-medium text-base-content">{article.title}</p>
					<p class="flex items-center gap-2 text-xs text-base-content/40">
						<span>{formatDate(article.updatedAt)}</span>
						{#if article.published}
							<span
								class="rounded bg-success/10 px-1.5 py-0.5 text-[10px] font-medium text-success"
							>
								Published
							</span>
						{:else}
							<span
								class="rounded bg-warning/10 px-1.5 py-0.5 text-[10px] font-medium text-warning"
							>
								Draft
							</span>
						{/if}
					</p>
				</div>
				<ArrowRight
					class="h-4 w-4 text-base-content/20 transition-all group-hover:translate-x-1 group-hover:text-primary"
				/>
			</a>
		{/each}
	</div>
</section>
