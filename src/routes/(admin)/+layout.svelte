<script lang="ts">
  import "../../app.css";
  import { getAdminSession } from "$lib/data/auth.remote";

  let { children } = $props();
  const session = $derived(await getAdminSession());

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: "grid" },
    { href: "/admin/members", label: "Members", icon: "users" },
    { href: "/admin/articles", label: "Articles", icon: "file-text" },
    { href: "/admin/projects", label: "Projects", icon: "folder" },
  ];
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

  <div class="flex min-h-screen bg-zinc-50">
    <!-- Sidebar -->
    <aside class="fixed top-0 left-0 z-40 h-screen w-64 border-r border-zinc-200 bg-white">
      <div class="flex h-16 items-center border-b border-zinc-200 px-6">
        <a href="/" class="font-[JetBrains_Mono,monospace] text-lg font-semibold">
          ut.code<span class="text-[#00D372]">();</span>
        </a>
        <span class="ml-2 rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">CMS</span>
      </div>

      <nav class="p-4">
        <ul class="space-y-1">
          {#each navItems as item (item.href)}
            <li>
              <a
                href={item.href}
                class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
              >
                <span class="h-5 w-5">
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
                      <polyline points="10 9 9 9 8 9" />
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
      <div class="absolute right-0 bottom-0 left-0 border-t border-zinc-200 p-4">
        <div class="flex items-center gap-3">
          {#if session.user.image}
            <img src={session.user.image} alt="" class="h-8 w-8 rounded-full" />
          {:else}
            <div class="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200">
              <span class="text-sm text-zinc-600">{session.user.name?.charAt(0) ?? "?"}</span>
            </div>
          {/if}
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-zinc-900">{session.user.name}</p>
            <p class="truncate text-xs text-zinc-500">{session.user.email}</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <main class="ml-64 flex-1 p-8">
      {@render children()}
    </main>
  </div>
</svelte:boundary>
