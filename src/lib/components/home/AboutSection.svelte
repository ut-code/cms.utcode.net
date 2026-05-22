<script lang="ts">
	import { Github, Twitter } from "lucide-svelte";

	type Props = {
		members: number;
	};

	const { members }: Props = $props();

	const currentYear = new Date().getFullYear();

	type Row = { label: string; value: string };

	const rows: Row[] = $derived([
		{ label: "団体名", value: "ut.code();" },
		{ label: "部員", value: `${members}名程度` },
		{ label: "所属", value: `東京大学工学部丁友会 (${currentYear}年度)` },
		{ label: "部室", value: "駒場キャンパス学生会館 313B 教室" },
		{ label: "活動場所", value: "オンライン, 部室, 本郷図書館プロジェクトボックス等" },
	]);
</script>

<!--
	about --- "spec sheet" treatment. Two-column layout on desktop:
	left = heading + tagline, right = key/value rows like a tech datasheet.
-->
<section class="relative bg-white py-24">
	<div class="mx-auto max-w-6xl px-6">
		<div class="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
			<!-- Left: heading -->
			<div class="lg:sticky lg:top-24 lg:self-start">
				<div
					class="mb-4 flex items-center gap-3 font-mono text-[11px] tracking-widest text-primary uppercase"
				>
					<span class="inline-block h-px w-6 bg-primary"></span>
					<span>// about us</span>
				</div>
				<h2 class="text-4xl leading-[1.1] font-bold tracking-tight text-zinc-900 sm:text-5xl">
					団体概要
				</h2>
				<p class="mt-5 max-w-md leading-relaxed text-zinc-600">
					ut.code(); の組織情報、活動場所、ソーシャル。基礎データをひと目で。
				</p>

				<!-- decorative file-stamp -->
				<div
					class="mt-8 inline-block rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 font-mono text-[11px] tracking-wider text-zinc-500"
				>
					<span class="text-primary">●</span>
					<span class="ml-2">fy{currentYear} / public</span>
				</div>
			</div>

			<!-- Right: spec sheet -->
			<div>
				<dl
					class="divide-y divide-zinc-100 overflow-hidden rounded-2xl border border-zinc-200 bg-white"
				>
					{#each rows as item, i (item.label)}
						<div
							class="grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-1 px-6 py-5 transition-colors hover:bg-zinc-50/50 sm:grid-cols-[10rem_1fr] sm:gap-x-6 sm:px-8 sm:py-6"
						>
							<dt
								class="font-mono text-[11px] tracking-widest text-zinc-400 uppercase sm:text-xs"
							>
								<span class="text-primary">{String(i + 1).padStart(2, "0")}</span>
								<span class="ml-2 text-zinc-500">{item.label}</span>
							</dt>
							<dd class="text-zinc-800">{item.value}</dd>
						</div>
					{/each}
					<div
						class="grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-3 px-6 py-5 transition-colors hover:bg-zinc-50/50 sm:grid-cols-[10rem_1fr] sm:items-center sm:gap-x-6 sm:px-8 sm:py-6"
					>
						<dt
							class="font-mono text-[11px] tracking-widest text-zinc-400 uppercase sm:text-xs"
						>
							<span class="text-primary">{String(rows.length + 1).padStart(2, "0")}</span>
							<span class="ml-2 text-zinc-500">SNS</span>
						</dt>
						<dd class="flex flex-wrap gap-2">
							<a
								href="https://github.com/ut-code"
								target="_blank"
								rel="noopener noreferrer"
								class="group inline-flex min-h-11 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-700 transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
							>
								<Github class="h-4 w-4" />
								<span class="font-mono">ut-code</span>
							</a>
							<a
								href="https://x.com/utokyo_code"
								target="_blank"
								rel="noopener noreferrer"
								class="group inline-flex min-h-11 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-700 transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
							>
								<Twitter class="h-4 w-4" />
								<span class="font-mono">@utokyo_code</span>
							</a>
						</dd>
					</div>
				</dl>
			</div>
		</div>
	</div>
</section>
