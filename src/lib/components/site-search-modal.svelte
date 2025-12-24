<script lang="ts" module>
	export { closeSearch, modalState, openSearch, toggleSearch } from "./search-modal-base.svelte";
</script>

<script lang="ts">
	import { FileText, Folder, User } from "lucide-svelte";
	import { searchPublic } from "$lib/data/public/index.remote";
	import {
		type SearchResult,
		getSearchResultLabel,
		getSearchResultName,
	} from "$lib/shared/logic/search";
	import SearchModalBase from "./search-modal-base.svelte";

	function getResultIcon(result: SearchResult) {
		switch (result.type) {
			case "article":
				return FileText;
			case "project":
				return Folder;
			case "member":
				return User;
		}
	}

	function getResultHref(result: SearchResult) {
		switch (result.type) {
			case "article":
				return `/articles/${result.slug}`;
			case "project":
				return `/projects/${result.slug}`;
			case "member":
				return `/members/${result.slug}`;
		}
	}

	function getResultMeta(result: SearchResult) {
		if (result.type === "article") {
			const parts: string[] = [];
			if (result.author) parts.push(result.author.name);
			if (result.publishedAt) {
				parts.push(result.publishedAt.toLocaleDateString("ja-JP"));
			}
			return parts.join(" · ");
		} else if (result.type === "project") {
			return result.description ?? "";
		} else {
			return result.bio ?? "";
		}
	}
</script>

<SearchModalBase
	searchFn={searchPublic}
	getResultId={(result) => result.id}
	{getResultIcon}
	getResultName={getSearchResultName}
	{getResultHref}
	placeholder="記事、プロジェクト、メンバーを検索..."
	emptyStateText="検索キーワードを入力..."
	noResultsText={(query) => `「${query}」に一致する結果がありません`}
	footerNavigateText="移動"
	footerSelectText="選択"
	footerSearchText="で検索"
	theme={{
		zIndex: "z-[100]",
		backdrop: "bg-zinc-900/50",
		modal: "rounded-2xl border border-zinc-200 bg-white",
		searchBorder: "border-b border-zinc-200",
		searchIcon: "text-zinc-400",
		inputPlaceholder: "placeholder:text-zinc-400",
		kbd: "rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-[JetBrains_Mono,monospace] text-xs text-zinc-500",
		emptyIcon: "text-zinc-300",
		emptyText: "text-zinc-500",
		spinner: "h-6 w-6 animate-spin rounded-full border-2 border-zinc-200 border-t-primary",
		resultSelected: "rounded-xl bg-zinc-900 text-white",
		resultHover: "rounded-xl hover:bg-zinc-100",
		resultIconBg: "bg-zinc-100",
		resultIconBgSelected: "bg-white/10",
		resultIconSize: "h-10 w-10",
		iconSize: "h-5 w-5",
		resultIconText: "text-zinc-500",
		resultIconTextSelected: "text-white",
		enterIcon: "text-white/60",
		footer: "border-t border-zinc-200 bg-zinc-50",
		footerText: "text-zinc-500",
		footerKbd:
			"rounded border border-zinc-200 bg-white px-1.5 py-0.5 font-[JetBrains_Mono,monospace] text-[10px]",
	}}
>
	{#snippet resultMeta(result: SearchResult, isSelected: boolean)}
		<p class="truncate text-xs {isSelected ? 'text-white/70' : 'text-zinc-500'}">
			{getResultMeta(result) || getSearchResultLabel(result.type)}
		</p>
	{/snippet}
</SearchModalBase>
