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

<section class="bg-zinc-50 py-32">
	<div class="mx-auto max-w-6xl px-6">
		<div class="mb-16 text-center">
			<div class="mb-4 font-mono text-sm font-medium uppercase tracking-widest text-[#00D372]">SPONSORS</div>
			<h2 class="text-5xl font-bold text-zinc-900 lg:text-6xl">
				協賛企業様
			</h2>
		</div>

		<div class="mx-auto max-w-5xl">
			<div
				class="flex min-h-64 flex-wrap items-center justify-center gap-16 rounded-3xl border border-zinc-200/50 bg-white/80 p-16 backdrop-blur-md"
			>
				{#if sponsors.length > 0}
					{#each sponsors as sponsor}
						{#if sponsor.websiteUrl}
							<a
								href={sponsor.websiteUrl}
								target="_blank"
								rel="noopener noreferrer"
								class="transition-all hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-[#00D372] focus:ring-offset-2"
							>
								<img
									src={sponsor.logoUrl}
									alt={sponsor.name}
									class="h-32 object-contain sm:h-40"
									loading="lazy"
								/>
							</a>
						{:else}
							<div>
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
							class="inline-block rounded-lg bg-[#00D372] px-8 py-4 font-semibold text-white shadow-lg shadow-[#00D372]/30 transition-all hover:shadow-xl hover:shadow-[#00D372]/40 focus:outline-none focus:ring-2 focus:ring-[#00D372] focus:ring-offset-2"
						>
							寄付について詳しく見る
						</a>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>
