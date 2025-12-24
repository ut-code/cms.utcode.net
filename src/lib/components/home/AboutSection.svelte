<script lang="ts">
	import { Github, Twitter } from "lucide-svelte";

	type Props = {
		members: number;
	};

	const { members }: Props = $props();

	const currentYear = new Date().getFullYear();
</script>

<section class="bg-zinc-50 py-24">
	<div class="mx-auto max-w-6xl px-6">
		<div class="mb-12 text-center">
			<div
				class="mb-3 font-[JetBrains_Mono,monospace] text-xs font-medium tracking-widest text-primary uppercase"
			>
				About us
			</div>
			<h2 class="text-3xl font-bold">団体概要</h2>
		</div>
		<div class="mx-auto max-w-3xl">
			<ul class="divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white">
				{#each [{ label: "団体名", value: "ut.code();" }, { label: "部員", value: `${members}名程度` }, { label: "所属", value: `東京大学工学部丁友会 (${currentYear}年度)` }, { label: "部室", value: "駒場キャンパス学生会館 313B 教室" }, { label: "活動場所", value: "オンライン, 部室, 本郷図書館プロジェクトボックス等" }] as item (item.label)}
					<li class="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:gap-0 sm:px-6 sm:py-4">
						<span class="w-full shrink-0 font-medium text-zinc-700 sm:w-28">{item.label}</span>
						<span class="text-zinc-600">{item.value}</span>
					</li>
				{/each}
				<li class="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:gap-0 sm:px-6 sm:py-4">
					<span class="w-full shrink-0 font-medium text-zinc-700 sm:w-28">SNS</span>
					<div class="flex flex-wrap gap-3 sm:gap-4">
						<a
							href="https://github.com/ut-code"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-2 text-zinc-600 transition-colors hover:text-zinc-900"
						>
							<Github class="h-5 w-5" />
							<span>ut-code</span>
						</a>
						<a
							href="https://twitter.com/utokyo_code"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-2 text-zinc-600 transition-colors hover:text-zinc-900"
						>
							<Twitter class="h-5 w-5" />
							<span>@utokyo_code</span>
						</a>
					</div>
				</li>
			</ul>
		</div>
	</div>
</section>
