<script lang="ts">
  import { getMembers } from "$lib/data/private/members.remote";
  import { Users, Plus, ChevronRight } from "lucide-svelte";

  const members = $derived(await getMembers());
</script>

<svelte:head>
  <title>Members - ut.code(); CMS</title>
</svelte:head>

<svelte:boundary>
  {#snippet pending()}
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 skeleton rounded-xl"></div>
          <div class="space-y-2">
            <div class="h-7 w-24 skeleton"></div>
            <div class="h-4 w-32 skeleton"></div>
          </div>
        </div>
        <div class="h-9 w-28 skeleton rounded-lg"></div>
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        {#each Array.from({ length: 4 }, (_, i) => i) as i (i)}
          <div class="card bg-base-100 shadow-sm">
            <div class="card-body flex-row items-center gap-3 p-4">
              <div class="h-11 w-11 shrink-0 skeleton rounded-full"></div>
              <div class="flex-1 space-y-2">
                <div class="h-4 w-24 skeleton"></div>
                <div class="h-3 w-16 skeleton"></div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/snippet}

  <div class="space-y-6">
    <!-- Header -->
    <header class="animate-fade-slide-in flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
          <Users class="h-5 w-5 text-success" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-base-content">Members</h1>
          <p class="text-sm text-base-content/60">{members.length} members registered</p>
        </div>
      </div>
      <a href="/admin/members/new" class="btn gap-2 btn-sm btn-secondary">
        <Plus class="h-4 w-4" />
        Add Member
      </a>
    </header>

    {#if members.length === 0}
      <!-- Empty state -->
      <div
        class="animate-fade-slide-in stagger-1 card border-2 border-dashed border-base-300 bg-base-100"
      >
        <div class="card-body items-center py-12 text-center">
          <div
            class="flex h-14 w-14 items-center justify-center rounded-2xl bg-base-200 text-base-content/40"
          >
            <Users class="h-7 w-7" />
          </div>
          <h3 class="mt-4 text-lg font-semibold text-base-content">No members yet</h3>
          <p class="text-base-content/60">Get started by adding a member.</p>
          <a href="/admin/members/new" class="btn mt-4 gap-2 btn-secondary">
            <Plus class="h-4 w-4" />
            Add Member
          </a>
        </div>
      </div>
    {:else}
      <!-- Members grid -->
      <div class="grid gap-3 sm:grid-cols-2">
        {#each members as member, i (member.id)}
          <a
            href="/admin/members/edit/{member.id}"
            class="group animate-fade-slide-in card bg-base-100 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            style="animation-delay: {i * 30}ms"
          >
            <div class="card-body flex-row items-center gap-3 p-4">
              <!-- Avatar -->
              {#if member.imageUrl}
                <div class="avatar">
                  <div
                    class="w-11 rounded-full ring-2 ring-base-200 transition-all group-hover:ring-primary/20"
                  >
                    <img src={member.imageUrl} alt={member.name} />
                  </div>
                </div>
              {:else}
                <div class="placeholder avatar">
                  <div
                    class="w-11 rounded-full bg-gradient-to-br from-base-200 to-base-300 text-base-content/60"
                  >
                    <span class="text-sm font-semibold">{member.name.charAt(0)}</span>
                  </div>
                </div>
              {/if}

              <!-- Info -->
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <h3 class="truncate font-medium text-base-content">{member.name}</h3>
                  {#if member.userId}
                    <span class="badge badge-xs badge-success">Linked</span>
                  {/if}
                </div>
                <p class="mt-0.5 flex items-center gap-1.5 text-sm text-base-content/50">
                  <code class="font-mono text-xs">@{member.slug}</code>
                </p>
                {#if member.bio}
                  <p class="mt-1 truncate text-xs text-base-content/40">{member.bio}</p>
                {/if}
              </div>

              <!-- Arrow -->
              <ChevronRight
                class="h-4 w-4 shrink-0 text-base-content/30 transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-base-content/50"
              />
            </div>
          </a>
        {/each}
      </div>
    {/if}
  </div>
</svelte:boundary>
