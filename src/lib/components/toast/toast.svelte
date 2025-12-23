<script lang="ts">
	import type { ToastControls } from "./controls.svelte";

	interface Props {
		controls: ToastControls;
	}

	const { controls }: Props = $props();
</script>

{#if controls.toasts.length > 0}
	<div class="toast toast-end z-50">
		{#each controls.toasts as t (t.id)}
			<div class="alert alert-{t.type}">
				<span>{t.message}</span>
				<button class="btn btn-ghost btn-sm" onclick={() => controls.remove(t.id)}>×</button>
			</div>
		{/each}
	</div>
{/if}
