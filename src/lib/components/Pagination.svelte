<!--
  Pagination
  - Visual rhythm: prev/next anchored by mono arrows; current page lifted with subtle ring + shadow
  - Page number cells are square-ish for typographic rhythm; mono numerals reinforce data feel
  - Touch targets ≥ 44px via min-h-11 on all interactive cells
-->
<script lang="ts">
	interface Props {
		currentPage: number;
		totalPages: number;
		pageUrl: (page: number) => string;
	}

	const { currentPage, totalPages, pageUrl }: Props = $props();
</script>

{#if totalPages > 1}
	<nav
		aria-label="ページネーション"
		class="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-2"
	>
		{#if currentPage > 1}
			<a
				href={pageUrl(currentPage - 1)}
				class="group inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium transition-all hover:bg-primary/5 hover:border-primary/30 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-auto"
				rel="prev"
			>
				<span aria-hidden="true" class="font-[JetBrains_Mono,monospace] transition-transform group-hover:-translate-x-0.5">←</span>
				前へ
			</a>
		{:else}
			<span
				class="inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium opacity-40 sm:w-auto"
				aria-hidden="true"
			>
				<span class="font-[JetBrains_Mono,monospace]">←</span>
				前へ
			</span>
		{/if}

		<div class="flex flex-1 flex-wrap items-center justify-center gap-1 sm:mx-2 sm:flex-initial">
			{#each Array.from({ length: totalPages }, (_, i) => i + 1) as pageNum (pageNum)}
				{#if totalPages <= 7 || pageNum === 1 || pageNum === totalPages || Math.abs(pageNum - currentPage) <= 1}
					<a
						href={pageUrl(pageNum)}
						aria-current={currentPage === pageNum ? "page" : undefined}
						aria-label="ページ {pageNum}"
						class="flex min-h-11 min-w-11 items-center justify-center rounded-lg border px-3 py-2 text-center font-[JetBrains_Mono,monospace] text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 {currentPage ===
						pageNum
							? 'border-primary bg-primary text-white shadow-md shadow-primary/20'
							: 'border-zinc-200 bg-white text-zinc-700 hover:bg-primary/5 hover:border-primary/30 hover:text-primary hover:-translate-y-px'}"
					>
						{pageNum}
					</a>
				{:else if pageNum === currentPage - 2 || pageNum === currentPage + 2}
					<span
						class="flex min-h-11 w-6 items-center justify-center font-[JetBrains_Mono,monospace] text-zinc-400"
						aria-hidden="true">···</span
					>
				{/if}
			{/each}
		</div>

		{#if currentPage < totalPages}
			<a
				href={pageUrl(currentPage + 1)}
				class="group inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium transition-all hover:bg-primary/5 hover:border-primary/30 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-auto"
				rel="next"
			>
				次へ
				<span aria-hidden="true" class="font-[JetBrains_Mono,monospace] transition-transform group-hover:translate-x-0.5">→</span>
			</a>
		{:else}
			<span
				class="inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium opacity-40 sm:w-auto"
				aria-hidden="true"
			>
				次へ
				<span class="font-[JetBrains_Mono,monospace]">→</span>
			</span>
		{/if}
	</nav>

	<p class="mt-3 text-center font-[JetBrains_Mono,monospace] text-[11px] text-zinc-400">
		page {currentPage} / {totalPages}
	</p>
{/if}
