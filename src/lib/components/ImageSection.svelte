<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		title: string;
		image: string;
		imageAlt?: string;
		alignImage: "left" | "right";
		children: Snippet;
	}

	const { title, image, imageAlt = "", alignImage, children }: Props = $props();
</script>

<!--
	image-section --- alternating image-and-text block.
	Image gets subtle scale-on-hover. Title has a primary tick prefix.
-->
<section class="mt-16 lg:grid lg:items-center">
	<div style:grid-area="1 / 1">
		<div
			class="group isolate h-[300px] overflow-clip md:h-[400px] lg:h-[500px] lg:w-1/2 xl:h-[600px] {alignImage ===
			'left'
				? 'lg:rounded-r-2xl'
				: 'lg:ml-auto lg:rounded-l-2xl'}"
		>
			<img
				src={image}
				alt={imageAlt}
				loading="lazy"
				decoding="async"
				class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
			/>
		</div>
	</div>
	<div style:grid-area="1 / 1" class="container mx-auto lg:max-w-screen-lg">
		<div class="p-8 lg:w-1/2 {alignImage === 'left' ? 'lg:ml-auto' : ''}">
			<div class="mb-3 flex items-center gap-2 font-mono text-[11px] tracking-widest text-primary uppercase">
				<span class="inline-block h-px w-5 bg-primary"></span>
				<span>topic</span>
			</div>
			<h2 class="text-3xl leading-tight font-bold tracking-tight text-zinc-900 lg:text-4xl">
				{title}
			</h2>
			<div class="mt-5 space-y-4 leading-relaxed text-zinc-600">
				{@render children()}
			</div>
		</div>
	</div>
</section>
