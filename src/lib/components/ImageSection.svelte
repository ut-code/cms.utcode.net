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

<section class="mt-16 lg:grid lg:items-center">
	<div style:grid-area="1 / 1">
		<div
			class="isolate h-[300px] overflow-clip md:h-[400px] lg:h-[500px] lg:w-1/2 xl:h-[600px] {alignImage ===
			'left'
				? 'lg:rounded-r-2xl'
				: 'lg:ml-auto lg:rounded-l-2xl'}"
		>
			<img src={image} alt={imageAlt} class="h-full w-full object-cover" />
		</div>
	</div>
	<div style:grid-area="1 / 1" class="container mx-auto lg:max-w-screen-lg">
		<div class="p-8 lg:w-1/2 {alignImage === 'left' ? 'lg:ml-auto' : ''}">
			<h2 class="text-3xl font-bold text-zinc-900 lg:text-4xl">{title}</h2>
			<div class="mt-4 space-y-4 text-zinc-600">
				{@render children()}
			</div>
		</div>
	</div>
</section>
