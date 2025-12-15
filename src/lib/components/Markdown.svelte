<script lang="ts">
  import { marked } from "marked";

  interface Props {
    content: string;
  }

  const { content }: Props = $props();

  const html = $derived(marked.parse(content, { async: false }) as string);
</script>

<div class="prose-zinc prose max-w-none">
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html html}
</div>
