<script lang="ts">
	interface Props {
		currentPage: number;
		totalPages: number;
		pageUrl: (page: number) => string;
	}

	const { currentPage, totalPages, pageUrl }: Props = $props();
</script>

{#if totalPages > 1}
	<div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
		{#if currentPage > 1}
			<a
				href={pageUrl(currentPage - 1)}
				class="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-center text-sm font-medium transition-colors hover:bg-primary/5 hover:border-primary/30 hover:text-primary focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 sm:w-auto"
			>
				前へ
			</a>
		{:else}
			<span
				class="w-full cursor-not-allowed rounded-lg border border-zinc-200 bg-white px-4 py-2 text-center text-sm font-medium opacity-50 sm:w-auto"
			>
				前へ
			</span>
		{/if}

		<div class="flex flex-1 flex-wrap items-center justify-center gap-1 sm:flex-initial">
			{#each Array.from({ length: totalPages }, (_, i) => i + 1) as pageNum (pageNum)}
				{#if totalPages <= 7 || pageNum === 1 || pageNum === totalPages || Math.abs(pageNum - currentPage) <= 1}
					<a
						href={pageUrl(pageNum)}
						class="min-w-[2.5rem] rounded-lg border px-3 py-2 text-center text-sm font-medium transition-colors focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 {currentPage ===
						pageNum
							? 'border-primary bg-primary text-white'
							: 'border-zinc-200 bg-white hover:bg-primary/5 hover:border-primary/30 hover:text-primary'}"
					>
						{pageNum}
					</a>
				{:else if pageNum === currentPage - 2 || pageNum === currentPage + 2}
					<span class="px-1 text-zinc-500">...</span>
				{/if}
			{/each}
		</div>

		{#if currentPage < totalPages}
			<a
				href={pageUrl(currentPage + 1)}
				class="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-center text-sm font-medium transition-colors hover:bg-primary/5 hover:border-primary/30 hover:text-primary focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 sm:w-auto"
			>
				次へ
			</a>
		{:else}
			<span
				class="w-full cursor-not-allowed rounded-lg border border-zinc-200 bg-white px-4 py-2 text-center text-sm font-medium opacity-50 sm:w-auto"
			>
				次へ
			</span>
		{/if}
	</div>
{/if}
