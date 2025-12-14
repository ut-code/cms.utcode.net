<script lang="ts">
  import { getMembers } from "$lib/data/members.remote";

  const members = $derived(await getMembers());
</script>

<svelte:head>
  <title>Members - ut.code(); CMS</title>
</svelte:head>

<svelte:boundary>
  {#snippet pending()}
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div class="space-y-2">
          <div class="h-7 w-24 animate-pulse rounded bg-zinc-200"></div>
          <div class="h-4 w-32 animate-pulse rounded bg-zinc-100"></div>
        </div>
        <div class="h-9 w-28 animate-pulse rounded-lg bg-zinc-200"></div>
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        {#each Array.from({ length: 4 }, (_, i) => i) as i (i)}
          <div class="rounded-xl border border-zinc-100 bg-white p-4">
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 animate-pulse rounded-full bg-zinc-100"></div>
              <div class="flex-1 space-y-2">
                <div class="h-4 w-24 animate-pulse rounded bg-zinc-200"></div>
                <div class="h-3 w-16 animate-pulse rounded bg-zinc-100"></div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/snippet}

  <div>
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-zinc-900">Members</h1>
        <p class="mt-0.5 text-sm text-zinc-500">{members.length} members registered</p>
      </div>
      <a
        href="/admin/members/new"
        class="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-all duration-150 hover:bg-zinc-800 hover:shadow active:scale-[0.98]"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add Member
      </a>
    </div>

    {#if members.length === 0}
      <!-- Empty state -->
      <div
        class="rounded-2xl border border-dashed border-zinc-200 bg-white p-12 text-center transition-colors hover:border-zinc-300"
      >
        <div
          class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400"
        >
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            viewBox="0 0 24 24"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <h3 class="mt-4 text-sm font-semibold text-zinc-900">No members yet</h3>
        <p class="mt-1 text-sm text-zinc-500">Get started by adding a member.</p>
        <a
          href="/admin/members/new"
          class="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-all duration-150 hover:bg-zinc-800"
        >
          <svg
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Member
        </a>
      </div>
    {:else}
      <!-- Members grid -->
      <div class="grid gap-3 sm:grid-cols-2">
        {#each members as member, i (member.id)}
          <a
            href="/admin/members/edit/{member.id}"
            class="group flex items-center gap-3 rounded-xl border border-zinc-100 bg-white p-4 transition-all duration-150 hover:border-zinc-200 hover:shadow-sm"
            style="animation: fadeSlideIn 0.2s ease-out {i * 0.03}s both"
          >
            <!-- Avatar -->
            {#if member.imageUrl}
              <img
                src={member.imageUrl}
                alt=""
                class="h-11 w-11 shrink-0 rounded-full ring-2 ring-zinc-100 transition-all duration-150 group-hover:ring-zinc-200"
              />
            {:else}
              <div
                class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200 ring-2 ring-zinc-100 transition-all duration-150 group-hover:ring-zinc-200"
              >
                <span class="text-sm font-semibold text-zinc-500">{member.name.charAt(0)}</span>
              </div>
            {/if}

            <!-- Info -->
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <h3 class="truncate font-medium text-zinc-900">{member.name}</h3>
                {#if member.userId}
                  <span
                    class="shrink-0 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600"
                  >
                    Linked
                  </span>
                {/if}
              </div>
              <p class="mt-0.5 flex items-center gap-1.5 text-sm text-zinc-400">
                <code class="font-[JetBrains_Mono,monospace] text-xs">@{member.slug}</code>
              </p>
              {#if member.bio}
                <p class="mt-1 truncate text-xs text-zinc-400">{member.bio}</p>
              {/if}
            </div>

            <!-- Arrow -->
            <svg
              class="h-4 w-4 shrink-0 text-zinc-300 transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-zinc-400"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </a>
        {/each}
      </div>
    {/if}
  </div>
</svelte:boundary>

<style>
  @keyframes fadeSlideIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
