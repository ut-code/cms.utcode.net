<script lang="ts">
	import { ArrowRight, Heart } from "lucide-svelte";

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

<!--
	sponsors --- understated row of logos OR an inviting empty-state.
	Logos sit in a tall white frame on zinc-50; mono labels frame the block.
-->
<section class="relative bg-zinc-50 py-24">
	<div class="mx-auto max-w-6xl px-6">
		<div class="mb-12 text-center">
			<div
				class="mb-4 inline-flex items-center gap-3 font-mono text-[11px] tracking-widest text-primary uppercase"
			>
				<span class="inline-block h-px w-6 bg-primary"></span>
				<span>// sponsors</span>
				<span class="inline-block h-px w-6 bg-primary"></span>
			</div>
			<h2 class="text-4xl leading-[1.1] font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
				協賛企業様
			</h2>
			<p class="mx-auto mt-4 max-w-xl text-base text-zinc-600">
				ut.code(); の活動を支えてくださっている企業の皆様です。
			</p>
		</div>

		<div class="mx-auto max-w-5xl">
			{#if sponsors.length > 0}
				<div
					class="relative flex min-h-64 flex-wrap items-center justify-center gap-12 rounded-2xl border border-zinc-200 bg-white p-12 sm:gap-16 sm:p-16"
				>
					<!-- corner ticks -->
					<span
						class="pointer-events-none absolute top-0 left-0 h-3 w-3 border-t border-l border-zinc-300"
						aria-hidden="true"
					></span>
					<span
						class="pointer-events-none absolute top-0 right-0 h-3 w-3 border-t border-r border-zinc-300"
						aria-hidden="true"
					></span>
					<span
						class="pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b border-l border-zinc-300"
						aria-hidden="true"
					></span>
					<span
						class="pointer-events-none absolute right-0 bottom-0 h-3 w-3 border-r border-b border-zinc-300"
						aria-hidden="true"
					></span>

					{#each sponsors as sponsor (sponsor.name)}
						{#if sponsor.websiteUrl}
							<a
								href={sponsor.websiteUrl}
								target="_blank"
								rel="noopener noreferrer"
								class="group block transition-all hover:scale-[1.03] focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
							>
								<img
									src={sponsor.logoUrl}
									alt={sponsor.name}
									class="h-28 object-contain opacity-90 transition-opacity group-hover:opacity-100 sm:h-36"
									loading="lazy"
								/>
							</a>
						{:else}
							<div>
								<img
									src={sponsor.logoUrl}
									alt={sponsor.name}
									class="h-28 object-contain opacity-90 sm:h-36"
									loading="lazy"
								/>
							</div>
						{/if}
					{/each}
				</div>

				<!-- subtle call-out below logo strip -->
				<div class="mt-6 text-center">
					<a
						href="/donation"
						class="group inline-flex items-center gap-2 font-mono text-xs tracking-widest text-zinc-500 transition-colors hover:text-primary focus:outline-none"
					>
						<Heart class="h-3.5 w-3.5" />
						<span>協賛・支援について詳しく</span>
						<ArrowRight
							class="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
						/>
					</a>
				</div>
			{:else}
				<div
					class="relative overflow-hidden rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center md:p-16"
				>
					<div
						class="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl border border-primary/30 bg-primary/10"
					>
						<Heart class="h-6 w-6 text-primary" />
					</div>
					<p class="font-mono text-xs tracking-widest text-zinc-400 uppercase">
						// open slot
					</p>
					<p class="mt-3 mb-8 text-xl text-zinc-700">協賛企業を募集中です</p>
					<a
						href="/donation"
						class="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-8 py-4 font-semibold text-zinc-950 shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
					>
						寄付について詳しく見る
						<ArrowRight class="h-5 w-5" />
					</a>
				</div>
			{/if}
		</div>
	</div>
</section>
