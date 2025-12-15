<script lang="ts">
  import "../../app.css";
  import { page } from "$app/state";
  import { getAdminSession } from "$lib/data/auth.remote";
  import ConfirmModal from "$lib/components/confirm-modal.svelte";
  import Toast from "$lib/components/toast/toast.svelte";
  import { setupToast } from "$lib/components/toast/controls.svelte";
  import logo from "$lib/assets/favicon.svg";
  import { Menu, LayoutGrid, Users, FileText, Folder, AlertTriangle, Info } from "lucide-svelte";

  let { children } = $props();
  const session = $derived(await getAdminSession());

  // Instantiate toast context for all admin pages
  const toastControls = setupToast();

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutGrid, exact: true },
    { href: "/admin/members", label: "Members", icon: Users, exact: false },
    { href: "/admin/articles", label: "Articles", icon: FileText, exact: false },
    { href: "/admin/projects", label: "Projects", icon: Folder, exact: false },
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
      <div class="flex min-h-screen items-center justify-center bg-base-200">
        <div class="animate-scale-in card bg-base-100 p-8 shadow-lg">
          <div class="text-center">
            <div
              class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-error/10"
            >
              <AlertTriangle class="h-6 w-6 text-error" />
            </div>
            <h1 class="text-xl font-bold text-base-content">Access Denied</h1>
            <p class="mt-2 text-base-content/60">{error.message}</p>
            <a href="/login" class="btn mt-6 btn-primary">Login with GitHub</a>
          </div>
        </div>
      </div>
    {:else}
      <div class="flex min-h-screen items-center justify-center bg-base-200">
        <div class="animate-scale-in card bg-base-100 p-8 shadow-lg">
          <div class="text-center">
            <div
              class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-error/10"
            >
              <Info class="h-6 w-6 text-error" />
            </div>
            <h1 class="text-xl font-bold text-base-content">Error</h1>
            <p class="mt-2 text-error">{error}</p>
          </div>
        </div>
      </div>
    {/if}
  {/snippet}

  <div class="drawer lg:drawer-open">
    <input id="admin-drawer" type="checkbox" class="drawer-toggle" />

    <!-- Main content -->
    <div class="drawer-content bg-base-200">
      <!-- Mobile header -->
      <header
        class="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-base-300 bg-base-100 px-4 lg:hidden"
      >
        <label for="admin-drawer" class="btn btn-square btn-ghost btn-sm">
          <Menu class="h-5 w-5" />
        </label>
        <a href="/" class="flex items-center transition-opacity hover:opacity-70">
          <img src={logo} alt="ut.code();" class="h-7" />
        </a>
      </header>

      <main class="min-h-screen">
        <div class="mx-auto max-w-5xl px-6 py-8">
          {@render children()}
        </div>
      </main>
    </div>

    <!-- Sidebar -->
    <aside class="drawer-side z-40">
      <label for="admin-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
      <nav class="flex h-full min-h-screen w-60 flex-col border-r border-base-300 bg-base-100">
        <!-- Logo -->
        <div class="flex h-14 shrink-0 items-center border-b border-base-300 px-5">
          <a href="/" class="flex items-center transition-opacity hover:opacity-70">
            <img src={logo} alt="ut.code();" class="h-7" />
          </a>
        </div>

        <!-- Navigation -->
        <div class="flex-1 overflow-y-auto px-3 py-4">
          <div class="mb-2 px-3">
            <span
              class="font-mono text-[10px] font-semibold tracking-widest text-base-content/40 uppercase"
            >
              Navigation
            </span>
          </div>
          <ul class="menu gap-1 menu-sm">
            {#each navItems as item (item.href)}
              {@const active = isActive(item)}
              <li>
                <a
                  href={item.href}
                  class="group flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium transition-all duration-150
                    {active
                    ? 'bg-secondary text-secondary-content'
                    : 'text-base-content/70 hover:bg-base-200 hover:text-base-content'}"
                >
                  <item.icon
                    class="h-4 w-4 shrink-0 transition-transform duration-150 group-hover:scale-110"
                  />
                  {item.label}
                </a>
              </li>
            {/each}
          </ul>
        </div>

        <!-- User section -->
        <div class="shrink-0 border-t border-base-300 p-3">
          <div
            class="flex items-center gap-3 rounded-lg p-2 transition-colors duration-150 hover:bg-base-200"
          >
            {#if session.user.image}
              <div class="avatar">
                <div
                  class="w-9 rounded-full ring-2 ring-base-300 ring-offset-2 ring-offset-base-100"
                >
                  <img src={session.user.image} alt={session.user.name ?? "User"} />
                </div>
              </div>
            {:else}
              <div class="placeholder avatar">
                <div class="w-9 rounded-full bg-primary text-primary-content">
                  <span class="text-sm font-semibold">{session.user.name?.charAt(0) ?? "?"}</span>
                </div>
              </div>
            {/if}
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium text-base-content">{session.user.name}</p>
              <p class="truncate text-xs text-base-content/50">{session.user.email}</p>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  </div>

  <ConfirmModal />
  <Toast controls={toastControls} />
</svelte:boundary>
