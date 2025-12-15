<script lang="ts">
  import { page } from "$app/state";
  import { getPublicMember } from "$lib/data/public.remote";

  const slug = $derived(page.params.slug ?? "");
  const member = $derived(await getPublicMember(slug));
</script>

<svelte:head>
  {#if member}
    <title>{member.name} | ut.code();</title>
    <meta property="og:title" content={member.name} />
    {#if member.bio}
      <meta name="description" content={member.bio} />
      <meta property="og:description" content={member.bio} />
    {/if}
    {#if member.imageUrl}
      <meta property="og:image" content={member.imageUrl} />
    {/if}
  {/if}
</svelte:head>

{#if member}
  <article class="mx-auto max-w-3xl px-6 py-16">
    <a
      href="/members"
      class="mb-8 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900"
    >
      ← メンバー一覧
    </a>

    <div class="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
      {#if member.imageUrl}
        <img
          src={member.imageUrl}
          alt=""
          class="mb-6 h-32 w-32 rounded-full object-cover sm:mr-8 sm:mb-0"
        />
      {:else}
        <div
          class="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-zinc-100 sm:mr-8 sm:mb-0"
        >
          <span class="text-4xl font-medium text-zinc-600">
            {member.name.charAt(0)}
          </span>
        </div>
      {/if}

      <div>
        <h1 class="mb-2 text-3xl font-bold">{member.name}</h1>
        {#if member.bio}
          <p class="text-zinc-500">{member.bio}</p>
        {/if}
      </div>
    </div>
  </article>
{:else}
  <div class="mx-auto max-w-3xl px-6 py-16 text-center">
    <h1 class="mb-4 text-2xl font-bold">メンバーが見つかりません</h1>
    <a href="/members" class="text-[#00D372] hover:underline">メンバー一覧に戻る</a>
  </div>
{/if}
