<script lang="ts">
	import { Github, Twitter } from "lucide-svelte";

	type Props = {
		members: number;
	};

	const { members }: Props = $props();

	const currentYear = new Date().getFullYear();
</script>

<section class="bg-zinc-900 py-32">
	<div class="mx-auto max-w-7xl px-6">
		<div class="mb-16 text-center">
			<div class="mb-4 font-mono text-sm font-medium text-orange-400">ABOUT US</div>
			<h2 class="font-[clash-display,ui-sans-serif,system-ui,sans-serif] text-5xl font-bold text-white lg:text-6xl">
				団体概要
			</h2>
		</div>
		<div class="mx-auto max-w-4xl">
			<div class="divide-y divide-zinc-800 rounded-3xl border border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
				{#each [{ label: "団体名", value: "ut.code();" }, { label: "部員", value: `${members}名程度` }, { label: "所属", value: `東京大学工学部丁友会 (${currentYear}年度)` }, { label: "部室", value: "駒場キャンパス学生会館 313B 教室" }, { label: "活動場所", value: "オンライン, 部室, 本郷図書館プロジェクトボックス等" }] as item (item.label)}
					<div class="flex flex-col gap-2 px-6 py-5 sm:flex-row sm:gap-0 sm:px-8 sm:py-6">
						<span class="w-full shrink-0 font-mono text-sm font-medium text-orange-400 sm:w-36">{item.label}</span>
						<span class="text-zinc-300">{item.value}</span>
					</div>
				{/each}
				<div class="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:gap-0 sm:px-8 sm:py-6">
					<span class="w-full shrink-0 font-mono text-sm font-medium text-orange-400 sm:w-36">SNS</span>
					<div class="flex flex-wrap gap-4">
						<a
							href="https://github.com/ut-code"
							target="_blank"
							rel="noopener noreferrer"
							class="group flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-zinc-300 transition-all hover:border-zinc-600 hover:bg-zinc-800 hover:text-white"
						>
							<Github class="h-5 w-5" />
							<span>ut-code</span>
						</a>
						<a
							href="https://twitter.com/utokyo_code"
							target="_blank"
							rel="noopener noreferrer"
							class="group flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-zinc-300 transition-all hover:border-zinc-600 hover:bg-zinc-800 hover:text-white"
						>
							<Twitter class="h-5 w-5" />
							<span>@utokyo_code</span>
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
