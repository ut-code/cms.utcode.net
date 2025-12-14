<script lang="ts">
  import "../../app.css";
  import { page } from "$app/state";
  import { getAdminSession } from "$lib/data/auth.remote";
  import ConfirmModal from "$lib/components/confirm-modal.svelte";

  let { children } = $props();
  const session = $derived(await getAdminSession());

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: "grid", exact: true },
    { href: "/admin/members", label: "Members", icon: "users", exact: false },
    { href: "/admin/articles", label: "Articles", icon: "file-text", exact: false },
    { href: "/admin/projects", label: "Projects", icon: "folder", exact: false },
  ];

  function isActive(item: (typeof navItems)[0]) {
    if (item.exact) return page.url.pathname === item.href;
    return page.url.pathname.startsWith(item.href);
  }
</script>

<svelte:boundary>
  {#snippet failed(error)}
    {@const isAuthError = error instanceof Error && error.name === "AuthError"}
    {#if isAuthError}
      <div class="flex min-h-screen items-center justify-center bg-zinc-50">
        <div class="text-center">
          <h1 class="mb-2 text-2xl font-bold text-zinc-900">Access Denied</h1>
          <p class="text-zinc-500">{error.message}</p>
          <a href="/login" class="btn mt-4 btn-primary">Login with GitHub</a>
        </div>
      </div>
    {:else}
      <div class="flex min-h-screen items-center justify-center bg-zinc-50">
        <div class="text-center">
          <h1 class="mb-2 text-2xl font-bold text-zinc-900">Error</h1>
          <p class="alert alert-error">{error}</p>
        </div>
      </div>
    {/if}
  {/snippet}

  <div class="flex min-h-screen bg-[#fafafa]">
    <!-- Sidebar -->
    <aside
      class="fixed top-0 left-0 z-40 flex h-screen w-56 flex-col border-r border-zinc-100 bg-white"
    >
      <div class="flex h-14 shrink-0 items-center px-5">
        <a
          href="/"
          class="group flex items-center gap-2 font-[JetBrains_Mono,monospace] text-base font-semibold transition-opacity hover:opacity-70"
        >
          ut.code<span class="text-[#00D372]">();</span>
        </a>
      </div>

      <nav class="flex-1 overflow-y-auto px-3 py-2">
        <ul class="space-y-0.5">
          {#each navItems as item (item.href)}
            {@const active = isActive(item)}
            <li>
              <a
                href={item.href}
                class="group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150
                  {active
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
              >
                <span
                  class="h-4 w-4 shrink-0 transition-transform duration-150 group-hover:scale-105"
                >
                  {#if item.icon === "grid"}
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="7" height="7" rx="1" />
                      <rect x="14" y="3" width="7" height="7" rx="1" />
                      <rect x="3" y="14" width="7" height="7" rx="1" />
                      <rect x="14" y="14" width="7" height="7" rx="1" />
                    </svg>
                  {:else if item.icon === "users"}
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  {:else if item.icon === "file-text"}
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  {:else if item.icon === "folder"}
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path
                        d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
                      />
                    </svg>
                  {/if}
                </span>
                {item.label}
              </a>
            </li>
          {/each}
        </ul>
      </nav>

      <!-- User info at bottom -->
      <div class="shrink-0 border-t border-zinc-100 p-3">
        <div
          class="flex items-center gap-2.5 rounded-lg p-2 transition-colors duration-150 hover:bg-zinc-50"
        >
          {#if session.user.image}
            <img
              src={session.user.image}
              alt=""
              class="h-8 w-8 rounded-full ring-2 ring-zinc-100 transition-all duration-150 hover:ring-zinc-200"
            />
          {:else}
            <div class="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100">
              <span class="text-sm font-medium text-zinc-600"
                >{session.user.name?.charAt(0) ?? "?"}</span
              >
            </div>
          {/if}
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-zinc-900">{session.user.name}</p>
            <p class="truncate text-xs text-zinc-400">{session.user.email}</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <main class="ml-56 min-h-screen flex-1">
      <div class="mx-auto max-w-5xl px-6 py-8">
        {@render children()}
      </div>
    </main>
  </div>

  <ConfirmModal />
</svelte:boundary>
