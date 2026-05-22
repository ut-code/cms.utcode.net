<script lang="ts">
	import DOMPurify from "isomorphic-dompurify";
	import { marked } from "marked";

	interface Props {
		content: string;
	}

	const { content }: Props = $props();

	const html = $derived.by(() => {
		const rawHtml = marked.parse(content, { async: false });
		return DOMPurify.sanitize(rawHtml);
	});
</script>

<!--
  Editorial prose for site content. Tuned for "developer-editorial" feel:
  - h2 has a thin bottom rule; h3 carries a primary section mark
  - inline code uses zinc-100 chip with mono; code blocks use zinc-900 panel
  - blockquote takes a primary left bar
  - links use offset underline with primary decoration on hover
-->
<div class="markdown-prose prose max-w-none prose-zinc
	prose-headings:text-zinc-900 prose-headings:font-semibold prose-headings:tracking-tight
	prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-2 prose-h2:text-2xl prose-h2:border-b prose-h2:border-zinc-200
	prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-xl
	prose-p:text-zinc-700 prose-p:leading-relaxed
	prose-a:text-primary prose-a:no-underline hover:prose-a:underline hover:prose-a:underline-offset-4
	prose-strong:text-zinc-900
	prose-blockquote:border-l-2 prose-blockquote:border-primary prose-blockquote:bg-zinc-50/60 prose-blockquote:py-1 prose-blockquote:not-italic prose-blockquote:text-zinc-600
	prose-code:before:content-none prose-code:after:content-none prose-code:bg-zinc-100 prose-code:text-zinc-800 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[0.875em] prose-code:font-medium
	prose-pre:bg-zinc-900 prose-pre:text-zinc-100 prose-pre:rounded-xl prose-pre:shadow-inner prose-pre:border prose-pre:border-zinc-800
	prose-img:rounded-xl prose-img:border prose-img:border-zinc-200/60
	prose-hr:border-zinc-200
	prose-li:marker:text-primary/70">
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html html}
</div>

<style>
	/* H3 section mark — a subtle § that signals depth without shouting. */
	.markdown-prose :global(h3::before) {
		content: "§";
		color: oklch(76% 0.2 153);
		margin-right: 0.5rem;
		font-weight: 500;
		opacity: 0.7;
	}

	/* Code blocks: nudge inline children back to inherit so the chip-style
	   prose-code rule doesn't compete with the dark pre background. */
	.markdown-prose :global(pre code) {
		background-color: transparent;
		color: inherit;
		padding: 0;
		font-size: 0.875em;
		font-weight: 400;
	}
</style>
