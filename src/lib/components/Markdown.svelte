<script lang="ts">
  import { marked } from "marked";
  import DOMPurify from "isomorphic-dompurify";

  interface Props {
    content: string;
  }

  const { content }: Props = $props();

  const html = $derived.by(() => {
    const rawHtml = marked.parse(content, { async: false });
    return DOMPurify.sanitize(rawHtml);
  });
</script>

<div class="prose max-w-none prose-zinc">
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html html}
</div>
