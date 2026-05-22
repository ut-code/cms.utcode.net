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
	<meta name="description" content="ut.code(); で活動する仲間たちを紹介します。" />
	<meta property="og:description" content="ut.code(); で活動する仲間たちを紹介します。" />
</svelte:head>

<!--
  Members list — roster/profile register.
  Hero signature: `@members` handle eyebrow + count.
  Cards: avatar with offset ring + decorative scale on hover; bio kept tight.
-->
<!-- Header -->
<section class="relative overflow-hidden border-b border-zinc-200 bg-zinc-50/50 py-16">
	<div
		class="pointer-events-none absolute inset-0 opacity-[0.35]"
		aria-hidden="true"
		style="background-image: radial-gradient(circle, oklch(76% 0.2 153 / 0.18) 1px, transparent 1px); background-size: 24px 24px; mask-image: linear-gradient(to bottom, black, transparent);"
	></div>
	<div class="relative mx-auto flex max-w-6xl flex-col gap-2 px-6">
		<div class="flex items-center justify-between gap-4">
			<div
				class="flex items-center gap-2 font-[JetBrains_Mono,monospace] text-xs font-medium tracking-widest text-primary uppercase"
			>
				<span aria-hidden="true" class="text-primary/50">@</span>
				<span>members</span>
			</div>
			<div class="font-[JetBrains_Mono,monospace] text-xs text-zinc-500">
				{data.members.length}
				<span class="text-zinc-400">people</span>
			</div>
		</div>
		<h1 class="text-3xl font-bold tracking-tight sm:text-4xl">メンバー一覧</h1>
		<p class="max-w-2xl text-zinc-500">ut.code(); で活動する仲間たちを紹介します。</p>
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
					class="group relative flex flex-col items-center rounded-2xl border border-zinc-200/60 bg-gradient-to-b from-white to-zinc-50/40 p-6 text-center backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
				>
					<!-- Avatar wrapper carries the ring + a thin primary outer ring that grows on hover -->
					<div class="relative mb-4">
						<div
							aria-hidden="true"
							class="absolute -inset-1 rounded-full ring-1 ring-transparent transition-all duration-300 motion-reduce:transition-none group-hover:ring-primary/40 group-hover:[box-shadow:0_0_0_4px_oklch(76%_0.2_153/0.08)]"
						></div>
						{#if member.imageUrl}
							<img
								src={member.imageUrl}
								alt={member.name}
								class="relative aspect-square h-24 w-24 rounded-full object-cover ring-2 ring-zinc-100 transition-all duration-300 motion-reduce:transition-none group-hover:scale-[1.03] group-hover:ring-white"
								loading="lazy"
							/>
						{:else}
							<div
								class="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200 ring-2 ring-zinc-100 transition-all duration-300 motion-reduce:transition-none group-hover:scale-[1.03] group-hover:from-primary/10 group-hover:to-primary/20 group-hover:ring-white"
							>
								<span
									class="font-[JetBrains_Mono,monospace] text-2xl font-medium text-zinc-600 transition-colors group-hover:text-primary"
								>
									{member.name.charAt(0)}
								</span>
							</div>
						{/if}
					</div>
					<h2 class="w-full truncate font-semibold tracking-tight text-zinc-900 transition-colors group-hover:text-primary">
						{member.name}
					</h2>
					{#if member.bio}
						<p class="mt-1.5 line-clamp-2 text-sm leading-relaxed text-zinc-500">{member.bio}</p>
					{/if}
					<!-- handle-style slug for identity flavor -->
					<span class="mt-3 font-[JetBrains_Mono,monospace] text-[10px] tracking-wider text-zinc-400 transition-colors group-hover:text-primary/60">
						@{member.slug}
					</span>
				</a>
			{/each}
		</div>

		<Pagination currentPage={data.currentPage} {totalPages} {pageUrl} />
	{/if}
</div>
