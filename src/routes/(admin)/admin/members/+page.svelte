<script lang="ts">
  import { getMembers } from "$lib/data/private/members.remote";
  import { Users, Plus, ChevronRight, Link2, Sparkles } from "lucide-svelte";

  const members = $derived(await getMembers());
</script>

<svelte:head>
  <title>Members - ut.code(); CMS</title>
</svelte:head>

<svelte:boundary>
  {#snippet pending()}
    <div class="space-y-6">
      <div class="h-24 w-full skeleton rounded-2xl"></div>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {#each Array.from({ length: 6 }, (_, i) => i) as i (i)}
          <div class="h-32 skeleton rounded-2xl"></div>
        {/each}
      </div>
    </div>
  {/snippet}

  <div class="space-y-6">
    <!-- Header -->
    <header class="animate-fade-slide-in gradient-dark relative overflow-hidden rounded-2xl p-6">
      <!-- Decorative elements -->
      <div class="absolute top-0 -right-10 h-32 w-32 rounded-full bg-error/20 blur-3xl"></div>

      <div class="relative flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-error/20">
            <Users class="h-6 w-6 text-error" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-white">Members</h1>
            <p class="text-sm text-white/60">{members.length} members registered</p>
          </div>
        </div>
        <a
          href="/admin/members/new"
          class="gradient-primary glow-primary btn gap-2 border-none text-white"
        >
          <Plus class="h-4 w-4" />
          Add Member
        </a>
      </div>
    </header>

    {#if members.length === 0}
      <!-- Empty state -->
      <div
        class="animate-fade-slide-in stagger-1 rounded-2xl border-2 border-dashed border-base-300 bg-base-100 p-12 text-center"
      >
        <div
          class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-base-200 text-base-content/40"
        >
          <Users class="h-8 w-8" />
        </div>
        <h3 class="mt-4 text-lg font-semibold text-base-content">No members yet</h3>
        <p class="mt-1 text-base-content/60">Get started by adding a member.</p>
        <a href="/admin/members/new" class="gradient-primary btn mt-6 gap-2 text-white">
          <Plus class="h-4 w-4" />
          Add Member
        </a>
      </div>
    {:else}
      <!-- Members grid -->
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {#each members as member, i (member.id)}
          <a
            href="/admin/members/edit/{member.id}"
            class="group animate-fade-slide-in card-hover glow-soft relative overflow-hidden rounded-2xl bg-base-100 p-5"
            style="animation-delay: {i * 40}ms"
          >
            <!-- Accent border -->
            <div
              class="gradient-primary absolute inset-x-0 top-0 h-1 opacity-0 transition-opacity group-hover:opacity-100"
            ></div>

            <div class="flex items-start gap-4">
              <!-- Avatar -->
              {#if member.imageUrl}
                <div class="avatar">
                  <div
                    class="w-14 rounded-xl ring-2 ring-base-200 transition-all group-hover:ring-primary/30"
                  >
                    <img src={member.imageUrl} alt={member.name} />
                  </div>
                </div>
              {:else}
                <div class="placeholder avatar">
                  <div class="gradient-primary w-14 rounded-xl text-white">
                    <span class="text-lg font-bold">{member.name.charAt(0)}</span>
                  </div>
                </div>
              {/if}

              <!-- Info -->
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <h3 class="truncate font-semibold text-base-content">{member.name}</h3>
                  {#if member.userId}
                    <span
                      class="flex h-5 w-5 items-center justify-center rounded-full bg-success/10"
                      title="Linked to account"
                    >
                      <Link2 class="h-3 w-3 text-success" />
                    </span>
                  {/if}
                </div>
                <code class="mt-1 block font-mono text-xs text-base-content/50">@{member.slug}</code
                >
                {#if member.bio}
                  <p class="mt-2 line-clamp-2 text-sm text-base-content/60">{member.bio}</p>
                {/if}
              </div>
            </div>

            <!-- Footer -->
            <div class="mt-4 flex items-center justify-between border-t border-base-200 pt-4">
              <span class="text-xs text-base-content/40">
                {#if member.userId}
                  <span class="flex items-center gap-1 text-success">
                    <Sparkles class="h-3 w-3" />
                    Active member
                  </span>
                {:else}
                  Profile only
                {/if}
              </span>
              <ChevronRight
                class="h-4 w-4 text-base-content/30 transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary"
              />
            </div>
          </a>
        {/each}
      </div>
    {/if}
  </div>
</svelte:boundary>
