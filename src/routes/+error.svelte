<script lang="ts">
  import { page } from "$app/state";

  const errorMessage = $derived(page.error?.message ?? "エラーが発生しました");
</script>

<svelte:head>
  <title>{page.status}: Page Not Found</title>
</svelte:head>

<div class="prose-xl mx-auto mt-40 mb-72 prose text-center">
  <h1 class="mb-4 text-5xl font-bold">{page.status}</h1>
  {#if page.status === 404}
    <p class="mt-8 text-2xl text-gray-500">ページが見つかりませんでした。</p>
    <p class="text-2xl text-gray-500">Sorry, we couldn't find that page.</p>
  {:else}
    <p class="mt-8 text-2xl text-gray-500">{errorMessage}</p>
  {/if}
  <p>
    <a href="/" class="btn btn-primary">ホームに戻る</a>
  </p>
</div>
