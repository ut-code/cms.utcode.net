<script lang="ts">
	import { page } from "$app/state";
	import Markdown from "$lib/components/Markdown.svelte";
	import { getPublicMember } from "$lib/data/public/index.remote";

	const slug = $derived(page.params.slug ?? "");
	const member = $derived(await getPublicMember(slug));
</script>

<svelte:head>
	{#if member}
		<title>{member.name} | ut.code();</title>
		<meta property="og:title" content={member.name} />
		{#if member.bio}
			<meta name="description" content={member.bio} />
			<meta property="og:description" content={member.bio} />
		{/if}
		{#if member.imageUrl}
			<meta property="og:image" content={member.imageUrl} />
		{/if}
	{/if}
</svelte:head>

{#if member}
	<article class="mx-auto max-w-3xl px-6 py-16">
		<a
			href="/members"
			class="mb-8 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900"
		>
			← メンバー一覧
		</a>

		<div class="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
			{#if member.imageUrl}
				<img
					src={member.imageUrl}
					alt={member.name}
					class="mb-6 h-20 w-20 rounded-full object-cover sm:mr-6 sm:mb-0"
				/>
			{:else}
				<div
					class="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 sm:mr-6 sm:mb-0"
				>
					<span class="text-2xl font-medium text-zinc-600">
						{member.name.charAt(0)}
					</span>
				</div>
			{/if}

			<div>
				<h1 class="mb-2 text-3xl font-bold">{member.name}</h1>
				{#if member.bio}
					<p class="text-zinc-500">{member.bio}</p>
				{/if}
			</div>
		</div>

		{#if member.pageContent}
			<section class="mt-12 border-t border-zinc-200 pt-8">
				<Markdown content={member.pageContent} />
			</section>
		{/if}

		{#if member.projectMembers && member.projectMembers.length > 0}
			<section class="mt-12 border-t border-zinc-200 pt-8">
				<h2 class="mb-4 text-xl font-semibold">参加プロジェクト</h2>
				<div class="flex flex-wrap gap-4">
					{#each member.projectMembers as pm (pm.projectId)}
						<a
							href="/projects/{pm.project.slug}"
							class="flex items-center gap-3 rounded-lg border border-zinc-200 px-4 py-3 hover:border-[#00D372]"
						>
							{#if pm.project.coverUrl}
								<img
									src={pm.project.coverUrl}
									alt={pm.project.name}
									class="h-10 w-10 rounded object-cover"
								/>
							{:else}
								<div class="flex h-10 w-10 items-center justify-center rounded bg-zinc-100">
									<span class="text-sm font-medium text-zinc-600">
										{pm.project.name.charAt(0)}
									</span>
								</div>
							{/if}
							<div>
								<div class="font-medium">{pm.project.name}</div>
								{#if pm.role}
									<div class="text-xs text-zinc-500">{pm.role}</div>
								{/if}
							</div>
						</a>
					{/each}
				</div>
			</section>
		{/if}
	</article>
{:else}
	<div class="mx-auto max-w-3xl px-6 py-16 text-center">
		<h1 class="mb-4 text-2xl font-bold">メンバーが見つかりません</h1>
		<a href="/members" class="text-[#00D372] hover:underline">メンバー一覧に戻る</a>
	</div>
{/if}
