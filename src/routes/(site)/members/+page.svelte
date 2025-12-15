<script lang="ts">
  import { getPublicMembers } from "$lib/data/public.remote";

  const members = $derived(await getPublicMembers());
</script>

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
      {#each members as member (member.id)}
        <a
          href="/members/{member.slug}"
          class="group rounded-xl border border-zinc-200 bg-white p-6 text-center transition-all hover:border-[#00D372] hover:shadow-md"
        >
          {#if member.imageUrl}
            <img
              src={member.imageUrl}
              alt=""
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
  {/if}
</div>
