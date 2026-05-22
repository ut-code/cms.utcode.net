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

<div class="prose max-w-none prose-zinc prose-headings:text-zinc-900 prose-p:text-zinc-700 prose-a:text-primary hover:prose-a:underline">
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html html}
</div>
