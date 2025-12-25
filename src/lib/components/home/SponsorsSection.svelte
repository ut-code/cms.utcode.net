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

<section class="bg-white py-32">
	<div class="mx-auto max-w-7xl px-6">
		<div class="mb-16 text-center">
			<div class="mb-4 font-mono text-sm font-medium text-orange-600">SPONSORS</div>
			<h2 class="font-[clash-display,ui-sans-serif,system-ui,sans-serif] text-5xl font-bold text-zinc-900 lg:text-6xl">
				協賛企業様
			</h2>
		</div>

		<div class="mx-auto max-w-5xl">
			<div
				class="flex min-h-64 flex-wrap items-center justify-center gap-16 rounded-3xl border-2 border-zinc-200 bg-gradient-to-br from-zinc-50 to-white p-16"
			>
				{#if sponsors.length > 0}
					{#each sponsors as sponsor}
						{#if sponsor.websiteUrl}
							<a
								href={sponsor.websiteUrl}
								target="_blank"
								rel="noopener noreferrer"
								class="transition-all hover:scale-105 hover:opacity-80"
							>
								<img
									src={sponsor.logoUrl}
									alt={sponsor.name}
									class="h-32 object-contain sm:h-40"
									loading="lazy"
								/>
							</a>
						{:else}
							<div class="transition-all hover:scale-105">
								<img
									src={sponsor.logoUrl}
									alt={sponsor.name}
									class="h-32 object-contain sm:h-40"
									loading="lazy"
								/>
							</div>
						{/if}
					{/each}
				{:else}
					<div class="text-center">
						<p class="mb-6 text-xl text-zinc-600">協賛企業を募集中です</p>
						<a
							href="/donation"
							class="inline-block rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/40"
						>
							寄付について詳しく見る
						</a>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>
