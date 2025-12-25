<script lang="ts">
  import "../../app.css";
  import {
    BarChart3,
    DatabaseBackup,
    FileText,
    Folder,
    LayoutGrid,
    LogOut,
    Menu,
    Search,
    Sparkles,
    Users,
  } from "lucide-svelte";
  import { page } from "$app/state";
  import logo from "$lib/assets/logo.svg";
  import AdminSearchModal, { openSearch } from "$lib/components/admin-search-modal.svelte";
  import ConfirmModal from "$lib/components/confirm-modal.svelte";
  import { setupToast } from "$lib/components/toast/controls.svelte";
  import Toast from "$lib/components/toast/toast.svelte";

  let { children, data } = $props();

  // Instantiate toast context for all admin pages (must be called before any await)
  const toastControls = setupToast();

  const session = $derived(data.session);

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutGrid, exact: true },
    { href: "/admin/members", label: "Members", icon: Users, exact: false },
    { href: "/admin/articles", label: "Articles", icon: FileText, exact: false },
    { href: "/admin/projects", label: "Projects", icon: Folder, exact: false },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3, exact: false },
    { href: "/admin/migrate", label: "Migration", icon: DatabaseBackup, exact: false },
  ] as const;

  function isActive(path: string, exact: boolean) {
    if (exact) return page.url.pathname === path;
    return page.url.pathname.startsWith(path);
  }
</script>

<div class="drawer lg:drawer-open">
  <input id="admin-drawer" type="checkbox" class="drawer-toggle" />

  <!-- Main content -->
  <div class="gradient-mesh relative drawer-content">
    <!-- Mobile header -->
    <header class="sticky top-0 z-30 flex h-14 items-center gap-4 glass px-4 lg:hidden">
      <label for="admin-drawer" class="btn btn-square btn-ghost btn-sm">
        <Menu class="h-5 w-5" />
      </label>
      <a href="/" class="flex flex-1 items-center transition-opacity hover:opacity-70">
        <img src={logo} alt="ut.code();" class="h-7" />
      </a>
      <button type="button" onclick={openSearch} class="btn btn-square btn-ghost btn-sm">
        <Search class="h-5 w-5" />
      </button>
    </header>

    <main class="min-h-screen">
      <div class="mx-auto max-w-5xl px-4 py-4 sm:px-6 sm:py-6 lg:py-8">
        {@render children()}
      </div>
    </main>
  </div>

  <!-- Sidebar -->
  <aside class="drawer-side z-40">
    <label for="admin-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
    <nav class="gradient-dark relative flex h-full min-h-screen w-64 flex-col overflow-hidden">
      <!-- Decorative gradient orbs -->
      <div class="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/20 blur-3xl"></div>
      <div class="absolute top-1/3 -left-10 h-32 w-32 rounded-full bg-info/10 blur-3xl"></div>

      <!-- Logo -->
      <div class="relative flex h-16 shrink-0 items-center gap-3 px-5">
        <a href="/" class="flex items-center gap-2 transition-all hover:opacity-80">
          <img src={logo} alt="ut.code();" class="h-8" />
        </a>
        <span class="gradient-primary badge badge-xs text-[10px] font-bold text-white"> CMS </span>
      </div>

      <!-- Search -->
      <div class="relative px-4 pt-2">
        <button
          type="button"
          onclick={openSearch}
          class="flex w-full items-center gap-3 rounded-xl bg-white/5 px-4 py-2.5 text-left text-sm text-white/50 transition-all hover:bg-white/10 hover:text-white/70"
        >
          <Search class="h-4 w-4" />
          <span class="flex-1">Search...</span>
          <kbd
            class="hidden rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-white/40 lg:inline"
          >
            ⌘K
          </kbd>
        </button>
      </div>

      <!-- Navigation -->
      <div class="relative flex-1 overflow-y-auto px-3 py-6">
        <div class="mb-3 px-3">
          <span class="font-mono text-[10px] font-semibold tracking-widest text-white/30 uppercase">
            Menu
          </span>
        </div>
        <ul class="space-y-1">
          {#each navItems as item (item.href)}
            {@const active = isActive(item.href, item.exact)}
            <li>
              <a
                href={item.href}
                class="group flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-200
                  {active
                  ? 'nav-active bg-white/10 text-white'
                  : 'text-white/60 hover:bg-white/5 hover:text-white/90'}"
              >
                <div
                  class="flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200
                    {active
                    ? 'gradient-primary glow-primary'
                    : 'bg-white/5 group-hover:bg-white/10'}"
                >
                  <item.icon class="h-4 w-4 {active ? 'text-white' : 'text-white/70'}" />
                </div>
                {item.label}
                {#if active}
                  <Sparkles class="ml-auto h-3 w-3 animate-pulse text-primary" />
                {/if}
              </a>
            </li>
          {/each}
        </ul>
      </div>

      <!-- User section -->
      <div class="relative shrink-0 border-t border-white/10 p-4">
        <div
          class="flex items-center gap-3 rounded-xl bg-white/5 p-3 transition-colors duration-150"
        >
          <a
            href="/admin/settings"
            class="group flex min-w-0 flex-1 items-center gap-3 transition-opacity hover:opacity-80"
            title="Personal Settings"
          >
            {#if session.user.image}
              <div class="avatar">
                <div
                  class="aspect-square w-10 rounded-full ring-2 ring-primary/50 ring-offset-2 ring-offset-neutral"
                >
                  <img
                    src={session.user.image}
                    alt={session.user.name ?? "User"}
                    class="h-full w-full object-cover"
                  />
                </div>
              </div>
            {:else}
              <div class="placeholder avatar">
                <div class="gradient-primary aspect-square w-10 rounded-full text-white">
                  <span class="text-sm font-bold">{session.user.name?.charAt(0) ?? "?"}</span>
                </div>
              </div>
            {/if}
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-semibold text-white">{session.user.name}</p>
              <p class="truncate text-xs text-white/40">{session.user.email}</p>
            </div>
          </a>
          <a
            href="/api/auth/sign-out"
            class="btn btn-circle text-white/40 btn-ghost btn-sm hover:bg-white/10 hover:text-white"
            title="Sign out"
          >
            <LogOut class="h-4 w-4" />
          </a>
        </div>
      </div>
    </nav>
  </aside>
</div>

<ConfirmModal />
<Toast controls={toastControls} />
<AdminSearchModal />
