<script lang="ts">
  import logo from "$lib/assets/favicon.svg";
  import { Menu, Search } from "lucide-svelte";
  import { goto } from "$app/navigation";

  let { children } = $props();

  let searchQuery = $state("");

  function handleSearch(e: Event) {
    e.preventDefault();
    if (searchQuery.trim()) {
      goto(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }
</script>

<svelte:head>
  <meta name="description" content="東京大学のソフトウェアエンジニアリングサークル ut.code();" />
  <meta property="og:site_name" content="ut.code();" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="drawer min-h-screen bg-white font-[DM_Sans,system-ui,sans-serif] text-zinc-900">
  <input id="site-drawer" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content">
    <nav
      class="fixed top-0 right-0 left-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md"
    >
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div class="flex items-center gap-4">
          <label for="site-drawer" class="btn btn-ghost btn-sm md:hidden">
            <Menu class="h-5 w-5" />
          </label>
          <a href="/" class="flex items-center">
            <img src={logo} alt="ut.code();" class="h-8" />
          </a>
        </div>
        <div class="hidden items-center gap-4 md:flex">
          <form onsubmit={handleSearch} class="relative">
            <input
              type="search"
              bind:value={searchQuery}
              placeholder="検索..."
              class="w-48 rounded-lg border border-zinc-200 bg-white py-1.5 pr-3 pl-9 text-sm transition-all placeholder:text-zinc-400 focus:w-64 focus:border-[#00D372] focus:ring-1 focus:ring-[#00D372] focus:outline-none"
            />
            <Search class="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          </form>
          <a href="/articles" class="text-sm text-zinc-500 transition-colors hover:text-zinc-900"
            >Articles</a
          >
          <a href="/projects" class="text-sm text-zinc-500 transition-colors hover:text-zinc-900"
            >Projects</a
          >
          <a href="/members" class="text-sm text-zinc-500 transition-colors hover:text-zinc-900"
            >Members</a
          >
          <a
            href="/admin"
            class="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white transition-colors hover:bg-zinc-800"
          >
            Admin
          </a>
        </div>
      </div>
    </nav>

    <main class="pt-16">
      {@render children()}
    </main>

    <footer class="border-t border-zinc-200 bg-zinc-50/50 py-12">
      <div class="mx-auto max-w-6xl px-6">
        <div class="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
          <div>
            <img src={logo} alt="ut.code();" class="h-8" />
            <p class="mt-2 text-sm text-zinc-500">東京大学のソフトウェアエンジニアリングサークル</p>
          </div>
          <div class="flex flex-col items-center gap-6 md:flex-row md:items-start">
            <div class="flex flex-col items-center gap-2 md:items-start">
              <span
                class="font-[JetBrains_Mono,monospace] text-xs font-medium tracking-widest text-zinc-400 uppercase"
                >Links</span
              >
              <div class="flex gap-4">
                <a
                  href="/articles"
                  class="text-sm text-zinc-500 transition-colors hover:text-zinc-900">Articles</a
                >
                <a
                  href="/projects"
                  class="text-sm text-zinc-500 transition-colors hover:text-zinc-900">Projects</a
                >
                <a
                  href="/members"
                  class="text-sm text-zinc-500 transition-colors hover:text-zinc-900">Members</a
                >
              </div>
            </div>
            <div class="flex flex-col items-center gap-2 md:items-start">
              <span
                class="font-[JetBrains_Mono,monospace] text-xs font-medium tracking-widest text-zinc-400 uppercase"
                >Social</span
              >
              <div class="flex gap-4">
                <a
                  href="https://github.com/ut-code"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-sm text-zinc-500 transition-colors hover:text-zinc-900">GitHub</a
                >
                <a
                  href="https://twitter.com/utokyo_code"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-sm text-zinc-500 transition-colors hover:text-zinc-900">Twitter</a
                >
              </div>
            </div>
          </div>
        </div>
        <div class="mt-8 border-t border-zinc-200 pt-6 text-center">
          <p class="text-sm text-zinc-400">
            © {new Date().getFullYear()} ut.code(); — The University of Tokyo
          </p>
        </div>
      </div>
    </footer>
  </div>
  <div class="drawer-side">
    <label for="site-drawer" class="drawer-overlay"></label>
    <div class="min-h-full w-64 bg-white p-4">
      <img src={logo} alt="ut.code();" class="mb-6 h-8" />
      <form onsubmit={handleSearch} class="relative mb-4">
        <input
          type="search"
          bind:value={searchQuery}
          placeholder="検索..."
          class="w-full rounded-lg border border-zinc-200 bg-white py-2 pr-3 pl-9 text-sm transition-colors placeholder:text-zinc-400 focus:border-[#00D372] focus:ring-1 focus:ring-[#00D372] focus:outline-none"
        />
        <Search class="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-zinc-400" />
      </form>
      <ul class="space-y-2">
        <li>
          <a
            href="/articles"
            class="block rounded-lg px-4 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
            >Articles</a
          >
        </li>
        <li>
          <a
            href="/projects"
            class="block rounded-lg px-4 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
            >Projects</a
          >
        </li>
        <li>
          <a
            href="/members"
            class="block rounded-lg px-4 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
            >Members</a
          >
        </li>
        <li>
          <a
            href="/admin"
            class="block rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white transition-colors hover:bg-zinc-800"
          >
            Admin
          </a>
        </li>
      </ul>
    </div>
  </div>
</div>
