<script lang="ts">
	import {
		Building2,
		Calendar,
		Code,
		Github,
		GraduationCap,
		Heart,
		Mail,
		MapPin,
		Rocket,
		Twitter,
		Users,
	} from "lucide-svelte";
	import type { PageData } from "./$types";

	const { data }: { data: PageData } = $props();
	const fiscalYear = new Date().getFullYear();

	type TechRow = { label: string; value: string };
	const techStack: TechRow[] = [
		{ label: "言語", value: "TypeScript など" },
		{ label: "フレームワーク", value: "React・Next.js, Svelte(Kit) など" },
		{ label: "UI", value: "MUI, Tailwind, DaisyUI など" },
		{ label: "バックエンド", value: "Hono, Express, Prisma, Drizzle など" },
		{ label: "データベース", value: "Supabase, Neon など" },
		{ label: "インフラ", value: "Cloudflare, Fly.io, Render など" },
		{ label: "情報", value: "Notion, Discord, GitHub など" },
	];

	type Location = string;
	const locations: Location[] = [
		"部室: 駒場学生会館 313B",
		"本郷図書館 プロジェクトボックス",
		"オンライン (Discord)",
	];
</script>

<svelte:head>
	<title>団体概要 | ut.code();</title>
	<meta property="og:title" content="団体概要 | ut.code();" />
	<meta
		name="description"
		content="ut.code();は2019年に発足した東京大学のソフトウェアエンジニアリングサークルです。約30名のメンバーが学習・交流・開発の三軸で活動しています。"
	/>
	<meta
		property="og:description"
		content="ut.code();は2019年に発足した東京大学のソフトウェアエンジニアリングサークルです。約30名のメンバーが学習・交流・開発の三軸で活動しています。"
	/>
</svelte:head>

<!--
	about page — editorial layout.
	Hero header carries a coordinate stamp + heading.
	Body alternates between datasheet rows and card grids.
-->

<!-- Header -->
<section class="relative overflow-hidden border-b border-zinc-200 bg-zinc-50/60 py-20">
	<!-- subtle dot-grid -->
	<div
		class="pointer-events-none absolute inset-0 opacity-50"
		style="background-image: radial-gradient(circle, rgb(24 24 27 / 0.08) 1px, transparent 1px); background-size: 24px 24px;"
		aria-hidden="true"
	></div>
	<div class="relative mx-auto max-w-6xl px-6">
		<div
			class="mb-3 flex items-center gap-3 font-mono text-[11px] tracking-widest text-primary uppercase"
		>
			<span class="inline-block h-px w-6 bg-primary"></span>
			<span>// about us</span>
		</div>
		<h1 class="text-4xl leading-tight font-bold tracking-tight text-zinc-900 sm:text-5xl">
			団体概要
		</h1>
		<p class="mt-4 max-w-2xl text-lg text-zinc-600">
			ut.code(); の活動内容や団体情報をご紹介します。
		</p>
	</div>
</section>

<div class="mx-auto max-w-4xl px-6 py-12 sm:py-16">
	<!-- Organization Overview — highlighted block -->
	<div
		class="relative mb-12 overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/[0.04] to-transparent p-8 sm:p-10"
	>
		<span
			class="pointer-events-none absolute top-0 left-0 h-3 w-3 border-t border-l border-primary"
			aria-hidden="true"
		></span>
		<span
			class="pointer-events-none absolute right-0 bottom-0 h-3 w-3 border-r border-b border-primary"
			aria-hidden="true"
		></span>
		<div class="mb-2 font-mono text-[11px] tracking-widest text-primary uppercase">
			// statement
		</div>
		<h2 class="mb-4 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
			ut.code(); について
		</h2>
		<p class="leading-relaxed text-zinc-700">
			ut.code();
			は東京大学のソフトウェアエンジニアリングサークルです。プログラミングを通じて、より良い社会を創ることを目指しています。「学習・教育」「交流」「開発」の三軸を主にして活動しています。
		</p>
	</div>

	<!-- Basic Information — datasheet -->
	<section class="mb-14">
		<div class="mb-6 flex items-center gap-3">
			<Building2 class="h-5 w-5 text-primary" />
			<h2 class="text-xl font-bold tracking-tight">基本情報</h2>
			<div
				class="flex-1 border-t border-dashed border-zinc-200"
				aria-hidden="true"
			></div>
			<span class="font-mono text-[11px] tracking-widest text-zinc-400">01</span>
		</div>
		<dl
			class="grid gap-px overflow-hidden rounded-2xl bg-zinc-200/70 sm:grid-cols-2"
		>
			<div class="flex items-start gap-4 bg-white p-6">
				<div
					class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10"
				>
					<Code class="h-5 w-5 text-primary" />
				</div>
				<div class="flex-1">
					<dt class="font-mono text-[11px] tracking-widest text-zinc-400 uppercase">
						team
					</dt>
					<dd class="mt-1 font-semibold text-zinc-900">ut.code();</dd>
				</div>
			</div>
			<div class="flex items-start gap-4 bg-white p-6">
				<div
					class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10"
				>
					<Users class="h-5 w-5 text-primary" />
				</div>
				<div class="flex-1">
					<dt class="font-mono text-[11px] tracking-widest text-zinc-400 uppercase">
						members
					</dt>
					<dd class="mt-1 font-semibold text-zinc-900">{data.memberCount} 人程度</dd>
				</div>
			</div>
			<div class="flex items-start gap-4 bg-white p-6">
				<div
					class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10"
				>
					<Calendar class="h-5 w-5 text-primary" />
				</div>
				<div class="flex-1">
					<dt class="font-mono text-[11px] tracking-widest text-zinc-400 uppercase">
						founded
					</dt>
					<dd class="mt-1 font-semibold text-zinc-900">2019 年</dd>
				</div>
			</div>
			<div class="flex items-start gap-4 bg-white p-6">
				<div
					class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10"
				>
					<MapPin class="h-5 w-5 text-primary" />
				</div>
				<div class="flex-1">
					<dt class="font-mono text-[11px] tracking-widest text-zinc-400 uppercase">
						clubroom
					</dt>
					<dd class="mt-1 font-semibold text-zinc-900">駒場学生会館 313B</dd>
				</div>
			</div>
			<div class="flex items-start gap-4 bg-white p-6 sm:col-span-2">
				<div
					class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10"
				>
					<GraduationCap class="h-5 w-5 text-primary" />
				</div>
				<div class="flex-1">
					<dt class="font-mono text-[11px] tracking-widest text-zinc-400 uppercase">
						affiliation
					</dt>
					<dd class="mt-1 font-semibold text-zinc-900">
						東京大学工学部丁友会 ({fiscalYear}年度)
					</dd>
				</div>
			</div>
		</dl>
	</section>

	<!-- Activities -->
	<section class="mb-14">
		<div class="mb-6 flex items-center gap-3">
			<Rocket class="h-5 w-5 text-primary" />
			<h2 class="text-xl font-bold tracking-tight">活動内容</h2>
			<div
				class="flex-1 border-t border-dashed border-zinc-200"
				aria-hidden="true"
			></div>
			<span class="font-mono text-[11px] tracking-widest text-zinc-400">02</span>
		</div>
		<div class="mb-4 rounded-2xl border border-zinc-200 bg-white p-6">
			<p class="leading-relaxed text-zinc-700">
				ut.code(); には「学習・教育」「交流」「開発」の三軸を主にして活動しています。
			</p>
		</div>
		<div class="grid gap-3 sm:grid-cols-3">
			<div
				class="group rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-primary/30 hover:bg-primary/[0.03]"
			>
				<div class="mb-2 font-mono text-[10px] tracking-[0.2em] text-zinc-400">
					01 / <span class="text-primary">LEARN</span>
				</div>
				<h3 class="mb-2 font-semibold tracking-tight">学習・教育</h3>
				<p class="text-sm text-zinc-500">ut.code(); Learn、全ゼミ・自主ゼミ</p>
			</div>
			<div
				class="group rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-primary/30 hover:bg-primary/[0.03]"
			>
				<div class="mb-2 font-mono text-[10px] tracking-[0.2em] text-zinc-400">
					02 / <span class="text-primary">SHARE</span>
				</div>
				<h3 class="mb-2 font-semibold tracking-tight">交流</h3>
				<p class="text-sm text-zinc-500">五月祭・駒場祭、合宿</p>
			</div>
			<div
				class="group rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-primary/30 hover:bg-primary/[0.03]"
			>
				<div class="mb-2 font-mono text-[10px] tracking-[0.2em] text-zinc-400">
					03 / <span class="text-primary">DEVELOP</span>
				</div>
				<h3 class="mb-2 font-semibold tracking-tight">開発</h3>
				<p class="text-sm text-zinc-500">プロジェクト、ハッカソン</p>
			</div>
		</div>
	</section>

	<!-- Location -->
	<section class="mb-14">
		<div class="mb-6 flex items-center gap-3">
			<MapPin class="h-5 w-5 text-primary" />
			<h2 class="text-xl font-bold tracking-tight">活動場所</h2>
			<div
				class="flex-1 border-t border-dashed border-zinc-200"
				aria-hidden="true"
			></div>
			<span class="font-mono text-[11px] tracking-widest text-zinc-400">03</span>
		</div>
		<div class="rounded-2xl border border-zinc-200 bg-white p-6">
			<ul class="space-y-3">
				{#each locations as loc (loc)}
					<li class="flex items-start gap-3">
						<span
							class="mt-2 inline-block h-px w-3 shrink-0 bg-primary"
							aria-hidden="true"
						></span>
						<span class="text-zinc-700">{loc}</span>
					</li>
				{/each}
			</ul>
		</div>
	</section>

	<!-- Tech Stack -->
	<section class="mb-14">
		<div class="mb-6 flex items-center gap-3">
			<Code class="h-5 w-5 text-primary" />
			<h2 class="text-xl font-bold tracking-tight">主な使用技術・スタック</h2>
			<div
				class="flex-1 border-t border-dashed border-zinc-200"
				aria-hidden="true"
			></div>
			<span class="font-mono text-[11px] tracking-widest text-zinc-400">04</span>
		</div>
		<div
			class="mb-4 rounded-2xl border border-zinc-200 bg-zinc-50/60 p-4 font-mono text-xs text-zinc-600"
		>
			<span class="text-primary">//</span> 具体的な使用技術はプロジェクトによって異なります
		</div>
		<dl
			class="divide-y divide-zinc-100 overflow-hidden rounded-2xl border border-zinc-200 bg-white"
		>
			{#each techStack as row (row.label)}
				<div
					class="grid grid-cols-[7rem_1fr] items-baseline gap-x-4 px-6 py-4 transition-colors hover:bg-zinc-50/50"
				>
					<dt class="font-mono text-[11px] tracking-widest text-zinc-500 uppercase">
						{row.label}
					</dt>
					<dd class="text-sm text-zinc-700">{row.value}</dd>
				</div>
			{/each}
		</dl>
	</section>

	<!-- FAQ -->
	<section class="mb-14">
		<div class="mb-6 flex items-center gap-3">
			<h2 class="text-xl font-bold tracking-tight">FAQ / よくある質問</h2>
			<div
				class="flex-1 border-t border-dashed border-zinc-200"
				aria-hidden="true"
			></div>
			<span class="font-mono text-[11px] tracking-widest text-zinc-400">05</span>
		</div>
		<div class="space-y-3">
			<div class="rounded-2xl border border-zinc-200 bg-white p-6">
				<h3 class="mb-2 font-semibold">
					<span class="font-mono text-primary">Q.</span> 活動頻度はどのくらいですか?
				</h3>
				<p class="text-sm leading-relaxed text-zinc-700">
					<span class="font-mono text-zinc-400">A.</span>
					プロジェクトの参加数や各プロジェクトによって異なりますが、一般的には毎週夜のミーティングと月1~2回の作業会になります。
				</p>
			</div>
			<div class="rounded-2xl border border-zinc-200 bg-white p-6">
				<h3 class="mb-2 font-semibold">
					<span class="font-mono text-primary">Q.</span> 初心者でも大丈夫ですか?
				</h3>
				<p class="text-sm leading-relaxed text-zinc-700">
					<span class="font-mono text-zinc-400">A.</span>
					全く問題ありません! ut.code();
					は全くの初心者がフルスタックのアプリケーションを作成できるようになる教材を公開しており、その教材を用いた勉強会や講習会も実施しています!
				</p>
			</div>
			<div class="rounded-2xl border border-zinc-200 bg-white p-6">
				<h3 class="mb-2 font-semibold">
					<span class="font-mono text-primary">Q.</span> 東京大学ではないです・一年生ではありません・文系です
				</h3>
				<p class="text-sm leading-relaxed text-zinc-700">
					<span class="font-mono text-zinc-400">A.</span>
					全く問題ありません! ut.code(); は大学名・学年・文理による制限は設けていません。
				</p>
			</div>
		</div>
		<div class="mt-6 text-center">
			<a
				href="/about/faq"
				class="inline-flex min-h-11 items-center gap-2 rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-zinc-800 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
			>
				すべての質問を見る
				<span aria-hidden="true">→</span>
			</a>
		</div>
	</section>

	<!-- Video -->
	<section class="mb-14">
		<div class="mb-6 flex items-center gap-3">
			<h2 class="text-xl font-bold tracking-tight">紹介動画</h2>
			<div
				class="flex-1 border-t border-dashed border-zinc-200"
				aria-hidden="true"
			></div>
			<span class="font-mono text-[11px] tracking-widest text-zinc-400">06</span>
		</div>
		<div
			class="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"
		>
			<iframe
				title="ut.code(); 紹介動画"
				class="aspect-video w-full"
				src="https://www.youtube-nocookie.com/embed/aUoa1AyfbMA?rel=0"
				style="border:0"
				allow="picture-in-picture; web-share"
				allowfullscreen
			></iframe>
		</div>
	</section>

	<!-- Contact -->
	<section class="mb-14">
		<div class="mb-6 flex items-center gap-3">
			<Mail class="h-5 w-5 text-primary" />
			<h2 class="text-xl font-bold tracking-tight">お問い合わせ・SNS</h2>
			<div
				class="flex-1 border-t border-dashed border-zinc-200"
				aria-hidden="true"
			></div>
			<span class="font-mono text-[11px] tracking-widest text-zinc-400">07</span>
		</div>
		<div class="rounded-2xl border border-zinc-200 bg-white p-6">
			<div class="space-y-3">
				<div class="flex items-center gap-3">
					<Github class="h-5 w-5 text-zinc-400" />
					<span class="font-mono text-[11px] tracking-widest text-zinc-500 uppercase">
						github
					</span>
					<a
						href="https://github.com/ut-code"
						target="_blank"
						rel="noopener noreferrer"
						class="font-mono text-sm font-medium text-primary hover:underline"
					>
						ut-code
					</a>
				</div>
				<div class="flex items-center gap-3">
					<Twitter class="h-5 w-5 text-zinc-400" />
					<span class="font-mono text-[11px] tracking-widest text-zinc-500 uppercase">
						x / twitter
					</span>
					<a
						href="https://x.com/utokyo_code"
						target="_blank"
						rel="noopener noreferrer"
						class="font-mono text-sm font-medium text-primary hover:underline"
					>
						utokyo_code
					</a>
				</div>
				<div class="flex items-center gap-3">
					<Mail class="h-5 w-5 text-zinc-400" />
					<span class="font-mono text-[11px] tracking-widest text-zinc-500 uppercase">
						email
					</span>
					<a
						href="mailto:contact@utcode.net"
						class="font-mono text-sm font-medium text-primary hover:underline"
					>
						contact@utcode.net
					</a>
				</div>
			</div>
			<p class="mt-5 border-t border-zinc-100 pt-4 text-xs text-zinc-400">
				※ 宣伝掲載は協賛企業・団体に限らせていただいております。協賛を伴わない宣伝依頼にはお応えできませんのでご了承ください。
			</p>
		</div>
	</section>

	<!-- Donation CTA -->
	<section class="mb-12">
		<div class="mb-6 flex items-center gap-3">
			<Heart class="h-5 w-5 text-primary" />
			<h2 class="text-xl font-bold tracking-tight">ご寄付・ご協賛のお願い</h2>
			<div
				class="flex-1 border-t border-dashed border-zinc-200"
				aria-hidden="true"
			></div>
			<span class="font-mono text-[11px] tracking-widest text-zinc-400">08</span>
		</div>
		<div
			class="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6"
		>
			<p class="leading-relaxed text-zinc-700">
				ut.code();
				では、活動を支援していただける方を募集しております。詳細につきましては、お問い合わせください。
			</p>
			<a
				href="/donation"
				class="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
			>
				寄付ページを見る
				<span aria-hidden="true">→</span>
			</a>
		</div>
	</section>
</div>
