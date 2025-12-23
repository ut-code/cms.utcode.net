<script lang="ts">
	import { SvelteURLSearchParams } from "svelte/reactivity";
	import { page } from "$app/state";
	import { getPublicMembers } from "$lib/data/public/index.remote";

	const members = $derived(await getPublicMembers());
	const itemsPerPage = 12;

	const currentPage = $derived(Number(page.url.searchParams.get("page")) || 1);
	const totalPages = $derived(Math.ceil(members.length / itemsPerPage));
	const paginatedMembers = $derived(
		members.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
	);

	function pageUrl(pageNum: number): string {
		const params = new SvelteURLSearchParams(page.url.searchParams);
		if (pageNum === 1) {
			params.delete("page");
		} else {
			params.set("page", String(pageNum));
		}
		const query = params.toString();
		return query ? `?${query}` : page.url.pathname;
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
			class="mb-3 font-[JetBrains_Mono,monospace] text-xs font-medium tracking-widest text-[#00D372] uppercase"
		>
			Members
		</div>
		<h1 class="mb-2 text-3xl font-bold">メンバー一覧</h1>
		<p class="text-zinc-500">ut.code(); で活動する仲間たちを紹介します。</p>
	</div>
</section>

<div class="mx-auto max-w-6xl px-6 py-12">
	{#if members.length === 0}
		<p class="text-zinc-500">まだメンバーがいません。</p>
	{:else}
		<div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			{#each paginatedMembers as member (member.id)}
				<a
					href="/members/{member.slug}"
					class="group rounded-2xl border border-zinc-200/50 bg-white/80 backdrop-blur-md p-6 text-center transition-all hover:border-[#00D372] hover:shadow-lg hover:shadow-[#00D372]/5"
				>
					{#if member.imageUrl}
						<img
							src={member.imageUrl}
							alt={member.name}
							class="mx-auto mb-4 h-24 w-24 rounded-full object-cover ring-2 ring-zinc-100 transition-all group-hover:ring-[#00D372]/30"
						/>
					{:else}
						<div
							class="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200 ring-2 ring-zinc-100 transition-all group-hover:from-[#00D372]/10 group-hover:to-[#00D372]/20 group-hover:ring-[#00D372]/30"
						>
							<span
								class="font-[JetBrains_Mono,monospace] text-2xl font-medium text-zinc-600 transition-colors group-hover:text-[#00D372]"
							>
								{member.name.charAt(0)}
							</span>
						</div>
					{/if}
					<h2 class="font-semibold transition-colors group-hover:text-[#00D372]">{member.name}</h2>
					{#if member.bio}
						<p class="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-500">{member.bio}</p>
					{/if}
				</a>
			{/each}
		</div>

		{#if members.length > itemsPerPage}
			<div class="mt-8 flex items-center justify-center gap-2">
				{#if currentPage > 1}
					<a
						href={pageUrl(currentPage - 1)}
						class="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium transition-colors hover:border-[#00D372] hover:text-[#00D372]"
					>
						前へ
					</a>
				{:else}
					<span
						class="cursor-not-allowed rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium opacity-50"
					>
						前へ
					</span>
				{/if}

				<div class="flex items-center gap-1">
					{#each Array.from({ length: totalPages }, (_, i) => i + 1) as pageNum (pageNum)}
						<a
							href={pageUrl(pageNum)}
							class="rounded-lg border px-3 py-2 text-sm font-medium transition-colors {currentPage ===
							pageNum
								? 'border-[#00D372] bg-[#00D372] text-white'
								: 'border-zinc-200 bg-white hover:border-[#00D372] hover:text-[#00D372]'}"
						>
							{pageNum}
						</a>
					{/each}
				</div>

				{#if currentPage < totalPages}
					<a
						href={pageUrl(currentPage + 1)}
						class="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium transition-colors hover:border-[#00D372] hover:text-[#00D372]"
					>
						次へ
					</a>
				{:else}
					<span
						class="cursor-not-allowed rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium opacity-50"
					>
						次へ
					</span>
				{/if}
			</div>
		{/if}
	{/if}
</div>
