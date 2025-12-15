<script lang="ts">
  import { getPublicMembers } from "$lib/data/public/index.remote";

  const members = $derived(await getPublicMembers());

  let currentPage = $state(1);
  const itemsPerPage = 12;

  const totalPages = $derived(Math.ceil(members.length / itemsPerPage));
  const paginatedMembers = $derived(
    members.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
  );

  function goToPage(page: number) {
    currentPage = page;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
</script>

<svelte:head>
  <title>メンバー一覧 | ut.code();</title>
  <meta property="og:title" content="メンバー一覧 | ut.code();" />
</svelte:head>

<div class="mx-auto max-w-6xl px-6 py-16">
  <div
    class="mb-3 font-[JetBrains_Mono,monospace] text-xs font-medium tracking-widest text-[#00D372] uppercase"
  >
    Members
  </div>
  <h1 class="mb-8 text-3xl font-bold">メンバー一覧</h1>

  {#if members.length === 0}
    <p class="text-zinc-500">まだメンバーがいません。</p>
  {:else}
    <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {#each paginatedMembers as member (member.id)}
        <a
          href="/members/{member.slug}"
          class="group rounded-xl border border-zinc-200 bg-white p-6 text-center transition-all hover:border-[#00D372] hover:shadow-md"
        >
          {#if member.imageUrl}
            <img
              src={member.imageUrl}
              alt={member.name}
              class="mx-auto mb-4 h-24 w-24 rounded-full object-cover"
            />
          {:else}
            <div
              class="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-zinc-100"
            >
              <span class="text-2xl font-medium text-zinc-600">
                {member.name.charAt(0)}
              </span>
            </div>
          {/if}
          <h2 class="font-semibold group-hover:text-[#00D372]">{member.name}</h2>
          {#if member.bio}
            <p class="mt-2 line-clamp-2 text-sm text-zinc-500">{member.bio}</p>
          {/if}
        </a>
      {/each}
    </div>

    {#if members.length > itemsPerPage}
      <div class="mt-8 flex items-center justify-center gap-2">
        <button
          onclick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          class="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium transition-colors hover:border-[#00D372] hover:text-[#00D372] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-zinc-200 disabled:hover:text-inherit"
        >
          前へ
        </button>

        <div class="flex items-center gap-1">
          {#each Array.from({ length: totalPages }, (_, i) => i + 1) as page (page)}
            <button
              onclick={() => goToPage(page)}
              class="rounded-lg border px-3 py-2 text-sm font-medium transition-colors {currentPage ===
              page
                ? 'border-[#00D372] bg-[#00D372] text-white'
                : 'border-zinc-200 bg-white hover:border-[#00D372] hover:text-[#00D372]'}"
            >
              {page}
            </button>
          {/each}
        </div>

        <button
          onclick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          class="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium transition-colors hover:border-[#00D372] hover:text-[#00D372] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-zinc-200 disabled:hover:text-inherit"
        >
          次へ
        </button>
      </div>
    {/if}
  {/if}
</div>
