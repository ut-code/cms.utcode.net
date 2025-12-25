<script lang="ts">
	import { Menu, Search } from "lucide-svelte";
	import logo from "$lib/assets/logo.svg";
	import SiteSearchModal, { openSearch } from "$lib/components/site-search-modal.svelte";
	import { env } from "$env/dynamic/public";

	let { children } = $props();

	const showDevBanner = env.PUBLIC_SHOW_DEV_BANNER === "true";
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
		<!-- Development Alert -->
		{#if showDevBanner}
			<div
				role="alert"
				class="alert fixed top-0 right-0 left-0 z-50 rounded-none border-b border-yellow-600/20 bg-yellow-50 py-3 text-center"
			>
				<span class="font-[JetBrains_Mono,monospace] text-sm text-yellow-900">
					このサイトは開発中です
				</span>
			</div>
		{/if}

		<nav
			class="sticky {showDevBanner ? 'top-12' : 'top-0'} right-0 left-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md"
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
					<button
						type="button"
						onclick={openSearch}
						class="flex w-48 items-center gap-2 rounded-lg border border-zinc-200 bg-white py-1.5 pr-3 pl-2.5 text-left text-sm text-zinc-400 transition-colors hover:border-primary/30 hover:text-primary"
					>
						<Search class="h-4 w-4" />
						<span class="flex-1">検索...</span>
						<kbd
							class="rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-[JetBrains_Mono,monospace] text-[10px]"
							>⌘K</kbd
						>
					</button>
					<a href="/about" class="text-sm text-zinc-500 transition-colors hover:text-zinc-900"
						>About</a
					>
					<a href="/activities" class="text-sm text-zinc-500 transition-colors hover:text-zinc-900"
						>Activities</a
					>
					<a href="/articles" class="text-sm text-zinc-500 transition-colors hover:text-zinc-900"
						>Articles</a
					>
					<a href="/projects" class="text-sm text-zinc-500 transition-colors hover:text-zinc-900"
						>Projects</a
					>
					<a href="/members" class="text-sm text-zinc-500 transition-colors hover:text-zinc-900"
						>Members</a
					>
					<a href="/join" class="text-sm text-zinc-500 transition-colors hover:text-zinc-900"
						>Join</a
					>
				</div>
			</div>
		</nav>

		<main>
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
								class="font-[JetBrains_Mono,monospace] text-xs font-medium tracking-widest text-zinc-500 uppercase"
								>About</span
							>
							<div class="flex flex-col gap-2">
								<a
									href="/about"
									class="text-sm text-zinc-500 transition-colors hover:text-zinc-900">About</a
								>
								<a
									href="/activities"
									class="text-sm text-zinc-500 transition-colors hover:text-zinc-900">Activities</a
								>
								<a
									href="/join"
									class="text-sm text-zinc-500 transition-colors hover:text-zinc-900">Join</a
								>
								<a
									href="/donation"
									class="text-sm text-zinc-500 transition-colors hover:text-zinc-900">Donation</a
								>
							</div>
						</div>
						<div class="flex flex-col items-center gap-2 md:items-start">
							<span
								class="font-[JetBrains_Mono,monospace] text-xs font-medium tracking-widest text-zinc-500 uppercase"
								>Content</span
							>
							<div class="flex flex-col gap-2">
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
								class="font-[JetBrains_Mono,monospace] text-xs font-medium tracking-widest text-zinc-500 uppercase"
								>Social</span
							>
							<div class="flex flex-col gap-2">
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
					<p class="text-sm text-zinc-500">
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
			<button
				type="button"
				onclick={openSearch}
				class="mb-4 flex w-full items-center gap-2 rounded-lg border border-zinc-200 bg-white py-2 pr-3 pl-2.5 text-left text-sm text-zinc-400 transition-colors hover:border-primary/30"
			>
				<Search class="h-4 w-4" />
				<span>検索...</span>
			</button>
			<ul class="space-y-2">
				<li>
					<a
						href="/about"
						class="block rounded-lg px-4 py-2 text-sm text-zinc-600 transition-colors hover:bg-primary/5 hover:text-primary"
						>About</a
					>
				</li>
				<li>
					<a
						href="/activities"
						class="block rounded-lg px-4 py-2 text-sm text-zinc-600 transition-colors hover:bg-primary/5 hover:text-primary"
						>Activities</a
					>
				</li>
				<li>
					<a
						href="/articles"
						class="block rounded-lg px-4 py-2 text-sm text-zinc-600 transition-colors hover:bg-primary/5 hover:text-primary"
						>Articles</a
					>
				</li>
				<li>
					<a
						href="/projects"
						class="block rounded-lg px-4 py-2 text-sm text-zinc-600 transition-colors hover:bg-primary/5 hover:text-primary"
						>Projects</a
					>
				</li>
				<li>
					<a
						href="/members"
						class="block rounded-lg px-4 py-2 text-sm text-zinc-600 transition-colors hover:bg-primary/5 hover:text-primary"
						>Members</a
					>
				</li>
				<li>
					<a
						href="/join"
						class="block rounded-lg px-4 py-2 text-sm text-zinc-600 transition-colors hover:bg-primary/5 hover:text-primary"
						>Join</a
					>
				</li>
			</ul>
		</div>
	</div>
</div>

<SiteSearchModal />
