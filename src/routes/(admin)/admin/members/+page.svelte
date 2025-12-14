<script lang="ts">
  import { getMembers } from "$lib/data/members.remote";

  const members = $derived(await getMembers());
</script>

<svelte:head>
  <title>Members - ut.code(); CMS</title>
</svelte:head>

<svelte:boundary>
  {#snippet pending()}
    <div class="flex h-64 items-center justify-center">
      <span class="loading loading-md loading-spinner"></span>
    </div>
  {/snippet}

  <div>
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-zinc-900">Members</h1>
        <p class="text-zinc-500">{members.length} members registered</p>
      </div>
      <a
        href="/admin/members/new"
        class="inline-flex items-center gap-2 rounded-lg bg-[#00D372] px-4 py-2 text-sm font-semibold text-zinc-900 transition-colors hover:bg-[#00C066]"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add Member
      </a>
    </div>

    {#if members.length === 0}
      <div class="rounded-xl border border-zinc-200 bg-white p-12 text-center">
        <svg
          class="mx-auto h-12 w-12 text-zinc-300"
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
        <h3 class="mt-4 font-semibold text-zinc-900">No members yet</h3>
        <p class="mt-1 text-sm text-zinc-500">Get started by adding a member.</p>
        <a
          href="/admin/members/new"
          class="mt-4 inline-block rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Add Member
        </a>
      </div>
    {:else}
      <div class="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table class="w-full">
          <thead class="border-b border-zinc-200 bg-zinc-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium tracking-wider text-zinc-500 uppercase"
              >
                Member
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium tracking-wider text-zinc-500 uppercase"
              >
                Slug
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium tracking-wider text-zinc-500 uppercase"
              >
                Linked
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium tracking-wider text-zinc-500 uppercase"
              >
                Created
              </th>
              <th class="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-200">
            {#each members as member (member.id)}
              <tr class="hover:bg-zinc-50">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    {#if member.imageUrl}
                      <img src={member.imageUrl} alt="" class="h-10 w-10 rounded-full" />
                    {:else}
                      <div
                        class="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200"
                      >
                        <span class="text-sm font-medium text-zinc-600">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    {/if}
                    <div>
                      <p class="font-medium text-zinc-900">{member.name}</p>
                      {#if member.bio}
                        <p class="max-w-xs truncate text-sm text-zinc-500">{member.bio}</p>
                      {/if}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <code
                    class="rounded bg-zinc-100 px-2 py-1 font-[JetBrains_Mono,monospace] text-sm"
                  >
                    {member.slug}
                  </code>
                </td>
                <td class="px-6 py-4">
                  {#if member.userId}
                    <span
                      class="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700"
                    >
                      Linked
                    </span>
                  {:else}
                    <span
                      class="inline-flex items-center rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-500"
                    >
                      Not linked
                    </span>
                  {/if}
                </td>
                <td class="px-6 py-4 text-sm text-zinc-500">
                  {new Date(member.createdAt).toLocaleDateString()}
                </td>
                <td class="px-6 py-4 text-right">
                  <a
                    href="/admin/members/edit/{member.id}"
                    class="text-sm text-[#00D372] hover:underline"
                  >
                    Edit
                  </a>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</svelte:boundary>
