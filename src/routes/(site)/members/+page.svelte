<script lang="ts">
	import Pagination from "$lib/components/Pagination.svelte";
	import { ITEMS_PER_PAGE } from "$lib/shared/constants";
	import type { PageData } from "./$types";

	const { data }: { data: PageData } = $props();

	const totalPages = $derived(Math.ceil(data.members.length / ITEMS_PER_PAGE));
	const paginatedMembers = $derived(
		data.members.slice((data.currentPage - 1) * ITEMS_PER_PAGE, data.currentPage * ITEMS_PER_PAGE),
	);

	function pageUrl(pageNum: number): string {
		return pageNum === 1 ? "/members" : `/members?page=${pageNum}`;
	}
</script>

<svelte:head>
	<title>メンバー一覧 | ut.code();</title>
	<meta property="og:title" content="メンバー一覧 | ut.code();" />
</svelte:head>

<!-- Header -->
<section class="border-b border-zinc-200 bg-zinc-50/50 py-16">
	<div class="mx-auto max-w-6xl px-6">
		<div
			class="mb-3 font-[JetBrains_Mono,monospace] text-xs font-medium tracking-widest text-primary uppercase"
		>
			Members
		</div>
		<h1 class="mb-2 text-3xl font-bold">メンバー一覧</h1>
		<p class="text-zinc-500">ut.code(); で活動する仲間たちを紹介します。</p>
	</div>
</section>

<div class="mx-auto max-w-6xl px-6 py-12">
	{#if data.members.length === 0}
		<p class="text-zinc-500">まだメンバーがいません。</p>
	{:else}
		<div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			{#each paginatedMembers as member (member.id)}
				<a
					href="/members/{member.slug}"
					class="group rounded-2xl border border-zinc-200/50 bg-white/80 backdrop-blur-md p-6 text-center transition-all hover:bg-primary/5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
				>
					{#if member.imageUrl}
						<img
							src={member.imageUrl}
							alt={member.name}
							class="mx-auto mb-4 aspect-square h-24 w-24 rounded-full object-cover ring-2 ring-zinc-100 transition-all group-hover:ring-primary/30"
							loading="lazy"
						/>
					{:else}
						<div
							class="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200 ring-2 ring-zinc-100 transition-all group-hover:from-primary/10 group-hover:to-primary/20 group-hover:ring-primary/30"
						>
							<span
								class="font-[JetBrains_Mono,monospace] text-2xl font-medium text-zinc-600 transition-colors group-hover:text-primary"
							>
								{member.name.charAt(0)}
							</span>
						</div>
					{/if}
					<h2 class="font-semibold transition-colors group-hover:text-primary">{member.name}</h2>
					{#if member.bio}
						<p class="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-500">{member.bio}</p>
					{/if}
				</a>
			{/each}
		</div>

		<Pagination currentPage={data.currentPage} {totalPages} {pageUrl} />
	{/if}
</div>
