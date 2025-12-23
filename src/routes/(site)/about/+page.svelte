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
</script>

<svelte:head>
	<title>団体概要 | ut.code();</title>
	<meta property="og:title" content="団体概要 | ut.code();" />
	<meta
		name="description"
		content="ut.code();は2019年に発足した東京大学のソフトウェアエンジニアリングサークルです。約30名のメンバーが学習・交流・開発の三軸で活動しています。"
	/>
</svelte:head>

<!-- Header -->
<section class="border-b border-zinc-200 bg-zinc-50/50 py-16">
	<div class="mx-auto max-w-6xl px-6">
		<div
			class="mb-3 font-[JetBrains_Mono,monospace] text-xs font-medium tracking-widest text-[#00D372] uppercase"
		>
			About Us
		</div>
		<h1 class="mb-2 text-3xl font-bold">団体概要</h1>
		<p class="text-zinc-500">ut.code(); の活動内容や団体情報をご紹介します。</p>
	</div>
</section>

<div class="mx-auto max-w-4xl px-6 py-8 sm:py-12">
	<!-- Organization Overview -->
	<div class="mb-8 rounded-2xl border border-[#00D372]/20 bg-[#00D372]/5 p-6 sm:mb-12 sm:p-8">
		<h2 class="mb-3 text-xl font-bold sm:mb-4 sm:text-2xl">ut.code(); について</h2>
		<p class="leading-relaxed text-zinc-700">
			ut.code();
			は東京大学のソフトウェアエンジニアリングサークルです。プログラミングを通じて、より良い社会を創ることを目指しています。「学習・教育」「交流」「開発」の三軸を主にして活動しています。
		</p>
	</div>

	<!-- Basic Information -->
	<section class="mb-8 sm:mb-12">
		<h2 class="mb-4 flex items-center gap-2 text-lg font-bold sm:mb-6 sm:text-xl">
			<Building2 class="h-5 w-5 text-[#00D372]" />
			基本情報
		</h2>
		<div class="grid gap-4 rounded-2xl border border-zinc-200/50 bg-white/80 backdrop-blur-md p-6">
			<div class="flex items-start gap-4">
				<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#00D372]/10">
					<Code class="h-5 w-5 text-[#00D372]" />
				</div>
				<div class="flex-1">
					<div class="text-sm text-zinc-500">団体名</div>
					<div class="font-semibold text-zinc-900">ut.code();</div>
				</div>
			</div>
			<div class="flex items-start gap-4">
				<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#00D372]/10">
					<Users class="h-5 w-5 text-[#00D372]" />
				</div>
				<div class="flex-1">
					<div class="text-sm text-zinc-500">構成人数</div>
					<div class="font-semibold text-zinc-900">30 人程度</div>
				</div>
			</div>
			<div class="flex items-start gap-4">
				<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#00D372]/10">
					<Calendar class="h-5 w-5 text-[#00D372]" />
				</div>
				<div class="flex-1">
					<div class="text-sm text-zinc-500">発足</div>
					<div class="font-semibold text-zinc-900">2019 年</div>
				</div>
			</div>
			<div class="flex items-start gap-4">
				<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#00D372]/10">
					<MapPin class="h-5 w-5 text-[#00D372]" />
				</div>
				<div class="flex-1">
					<div class="text-sm text-zinc-500">部室</div>
					<div class="font-semibold text-zinc-900">駒場学生会館 313B</div>
				</div>
			</div>
			<div class="flex items-start gap-4">
				<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#00D372]/10">
					<GraduationCap class="h-5 w-5 text-[#00D372]" />
				</div>
				<div class="flex-1">
					<div class="text-sm text-zinc-500">所属</div>
					<div class="font-semibold text-zinc-900">東京大学工学部丁友会 (2025年度)</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Activities -->
	<section class="mb-12">
		<h2 class="mb-6 flex items-center gap-2 text-xl font-bold">
			<Rocket class="h-5 w-5 text-[#00D372]" />
			活動内容
		</h2>
		<div class="mb-4 rounded-2xl border border-zinc-200/50 bg-white/80 backdrop-blur-md p-6">
			<p class="leading-relaxed text-zinc-700">
				ut.code(); には「学習・教育」「交流」「開発」の三軸を主にして活動しています。
			</p>
		</div>
		<div class="grid gap-4 sm:grid-cols-3">
			<div class="rounded-2xl border border-zinc-200/50 bg-white/80 backdrop-blur-md p-6">
				<h3 class="mb-2 font-semibold">学習・教育</h3>
				<p class="text-sm text-zinc-500">ut.code(); Learn、全ゼミ・自主ゼミ</p>
			</div>
			<div class="rounded-2xl border border-zinc-200/50 bg-white/80 backdrop-blur-md p-6">
				<h3 class="mb-2 font-semibold">交流</h3>
				<p class="text-sm text-zinc-500">五月祭・駒場祭、合宿</p>
			</div>
			<div class="rounded-2xl border border-zinc-200/50 bg-white/80 backdrop-blur-md p-6">
				<h3 class="mb-2 font-semibold">開発</h3>
				<p class="text-sm text-zinc-500">プロジェクト、ハッカソン</p>
			</div>
		</div>
	</section>

	<!-- Location -->
	<section class="mb-12">
		<h2 class="mb-6 flex items-center gap-2 text-xl font-bold">
			<MapPin class="h-5 w-5 text-[#00D372]" />
			活動場所
		</h2>
		<div class="rounded-2xl border border-zinc-200/50 bg-white/80 backdrop-blur-md p-6">
			<ul class="space-y-3">
				<li class="flex items-start gap-3">
					<span class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#00D372]"></span>
					<span class="text-zinc-700">部室: 駒場学生会館 313B</span>
				</li>
				<li class="flex items-start gap-3">
					<span class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#00D372]"></span>
					<span class="text-zinc-700">本郷図書館 プロジェクトボックス</span>
				</li>
				<li class="flex items-start gap-3">
					<span class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#00D372]"></span>
					<span class="text-zinc-700">オンライン (Discord)</span>
				</li>
			</ul>
		</div>
	</section>

	<!-- Tech Stack -->
	<section class="mb-12">
		<h2 class="mb-6 flex items-center gap-2 text-xl font-bold">
			<Code class="h-5 w-5 text-[#00D372]" />
			主な使用技術・スタック
		</h2>
		<div class="mb-4 rounded-2xl border border-[#1DA1F2]/20 bg-[#1DA1F2]/5 p-4">
			<p class="text-sm text-zinc-700">具体的な使用技術はプロジェクトによって異なります。</p>
		</div>
		<div class="rounded-2xl border border-zinc-200/50 bg-white/80 backdrop-blur-md p-6">
			<ul class="space-y-3">
				<li class="flex items-start gap-3">
					<span class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#00D372]"></span>
					<span class="text-zinc-700"><strong>言語:</strong> TypeScript など</span>
				</li>
				<li class="flex items-start gap-3">
					<span class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#00D372]"></span>
					<span class="text-zinc-700"
						><strong>フレームワーク:</strong> React・Next.js, Svelte(Kit) など</span
					>
				</li>
				<li class="flex items-start gap-3">
					<span class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#00D372]"></span>
					<span class="text-zinc-700"><strong>UI:</strong> MUI, Tailwind, DaisyUI など</span>
				</li>
				<li class="flex items-start gap-3">
					<span class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#00D372]"></span>
					<span class="text-zinc-700"
						><strong>バックエンド:</strong> Hono, Express, Prisma, Drizzle など</span
					>
				</li>
				<li class="flex items-start gap-3">
					<span class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#00D372]"></span>
					<span class="text-zinc-700"><strong>データベース:</strong> Supabase, Neon など</span>
				</li>
				<li class="flex items-start gap-3">
					<span class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#00D372]"></span>
					<span class="text-zinc-700"
						><strong>インフラ:</strong> Cloudflare, Fly.io, Render など</span
					>
				</li>
				<li class="flex items-start gap-3">
					<span class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#00D372]"></span>
					<span class="text-zinc-700"><strong>情報:</strong> Notion, Discord, GitHub など</span>
				</li>
			</ul>
		</div>
	</section>

	<!-- FAQ -->
	<section class="mb-12">
		<h2 class="mb-6 text-xl font-bold">FAQ / よくある質問</h2>
		<div class="space-y-4">
			<div class="rounded-2xl border border-zinc-200/50 bg-white/80 backdrop-blur-md p-6">
				<h3 class="mb-2 font-semibold">Q: 活動頻度はどのくらいですか？</h3>
				<p class="text-sm leading-relaxed text-zinc-700">
					A:
					プロジェクトの参加数や各プロジェクトによって異なりますが、一般的には毎週夜のミーティングと月1~2回の作業会になります。
				</p>
			</div>
			<div class="rounded-2xl border border-zinc-200/50 bg-white/80 backdrop-blur-md p-6">
				<h3 class="mb-2 font-semibold">Q: 初心者でも大丈夫ですか？</h3>
				<p class="text-sm leading-relaxed text-zinc-700">
					A: 全く問題ありません！ ut.code();
					は全くの初心者がフルスタックのアプリケーションを作成できるようになる教材を公開しており、その教材を用いた勉強会や講習会も実施しています！
				</p>
			</div>
			<div class="rounded-2xl border border-zinc-200/50 bg-white/80 backdrop-blur-md p-6">
				<h3 class="mb-2 font-semibold">Q: 東京大学ではないです・一年生ではありません・文系です</h3>
				<p class="text-sm leading-relaxed text-zinc-700">
					A: 全く問題ありません！ ut.code(); は大学名・学年・文理による制限は設けていません。
				</p>
			</div>
		</div>
	</section>

	<!-- Video -->
	<section class="mb-12">
		<h2 class="mb-6 text-xl font-bold">紹介動画</h2>
		<div class="overflow-hidden rounded-2xl border border-zinc-200/50 bg-white/80 backdrop-blur-md">
			<iframe
				title="ut.code(); 紹介動画"
				class="aspect-video w-full"
				src="https://www.youtube-nocookie.com/embed/aUoa1AyfbMA?rel=0"
				loading="lazy"
				allow="picture-in-picture; web-share"
				allowfullscreen
			></iframe>
		</div>
	</section>

	<!-- Contact -->
	<section class="mb-12">
		<h2 class="mb-6 flex items-center gap-2 text-xl font-bold">
			<Mail class="h-5 w-5 text-[#00D372]" />
			お問い合わせ・SNS
		</h2>
		<div class="rounded-2xl border border-zinc-200/50 bg-white/80 backdrop-blur-md p-6">
			<div class="mb-4 space-y-3">
				<div class="flex items-center gap-3">
					<Github class="h-5 w-5 text-zinc-500" />
					<span class="text-sm text-zinc-500">GitHub:</span>
					<a
						href="https://github.com/ut-code"
						target="_blank"
						rel="noopener noreferrer"
						class="text-sm font-medium text-[#00D372] hover:underline"
					>
						ut-code
					</a>
				</div>
				<div class="flex items-center gap-3">
					<Twitter class="h-5 w-5 text-zinc-500" />
					<span class="text-sm text-zinc-500">X (Twitter):</span>
					<a
						href="https://x.com/utokyo_code"
						target="_blank"
						rel="noopener noreferrer"
						class="text-sm font-medium text-[#00D372] hover:underline"
					>
						utokyo_code
					</a>
				</div>
				<div class="flex items-center gap-3">
					<Mail class="h-5 w-5 text-zinc-500" />
					<span class="text-sm text-zinc-500">Email:</span>
					<a
						href="mailto:contact@utcode.net"
						class="text-sm font-medium text-[#00D372] hover:underline"
					>
						contact@utcode.net
					</a>
				</div>
			</div>
		</div>
	</section>

	<!-- Donation CTA -->
	<section class="mb-12">
		<h2 class="mb-6 flex items-center gap-2 text-xl font-bold">
			<Heart class="h-5 w-5 text-[#00D372]" />
			ご寄付・ご協賛のお願い
		</h2>
		<div class="rounded-2xl border border-zinc-200/50 bg-white/80 backdrop-blur-md p-6">
			<p class="mb-4 leading-relaxed text-zinc-700">
				ut.code();
				では、活動を支援していただける方を募集しております。詳細につきましては、お問い合わせください。
			</p>
		</div>
	</section>
</div>
