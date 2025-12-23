<script lang="ts">
	type Sponsor = {
		name: string;
		logoUrl: string;
		websiteUrl?: string;
	};

	const sponsors: Sponsor[] = [
		{
			name: "GMOメディア株式会社",
			logoUrl: "/images/gmo-media.png",
			websiteUrl: "https://www.gmo.media/",
		},
		{
			name: "RIZAPテクノロジーズ株式会社",
			logoUrl: "/images/rizap-technologies.png",
		},
	];
</script>

<section class="bg-zinc-50 py-24">
	<div class="mx-auto max-w-6xl px-6">
		<div class="mb-12 text-center">
			<div
				class="mb-3 font-[JetBrains_Mono,monospace] text-xs font-medium tracking-widest text-[#00D372] uppercase"
			>
				Sponsors
			</div>
			<h2 class="text-3xl font-bold">協賛企業様</h2>
		</div>

		<div class="mx-auto max-w-4xl">
			<div
				class="flex min-h-48 flex-wrap items-center justify-center gap-12 rounded-2xl border border-zinc-200 bg-white p-12"
			>
				{#if sponsors.length > 0}
					{#each sponsors as sponsor}
						{#if sponsor.websiteUrl}
							<a
								href={sponsor.websiteUrl}
								target="_blank"
								rel="noopener noreferrer"
								class="transition-opacity hover:opacity-70"
							>
								<img
									src={sponsor.logoUrl}
									alt={sponsor.name}
									class="h-16 object-contain"
									loading="lazy"
								/>
							</a>
						{:else}
							<div>
								<img
									src={sponsor.logoUrl}
									alt={sponsor.name}
									class="h-16 object-contain"
									loading="lazy"
								/>
							</div>
						{/if}
					{/each}
				{:else}
					<div class="text-center text-zinc-400">
						<p class="mb-4 text-lg">協賛企業を募集中です</p>
						<a
							href="/donation"
							class="inline-block rounded-lg bg-zinc-100 px-6 py-3 font-medium text-zinc-700 transition-colors hover:bg-zinc-200"
						>
							寄付について詳しく見る
						</a>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>
