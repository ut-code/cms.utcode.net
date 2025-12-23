<script lang="ts">
	import { ArrowRight, Github, Heart, MessageCircle, Twitter, Users } from "lucide-svelte";
</script>

<svelte:head>
	<title>入部案内 | ut.code();</title>
	<meta property="og:title" content="入部案内 | ut.code();" />
	<meta
		name="description"
		content="ut.code();への参加方法をご案内します。プログラミング、ものづくり、デザインに興味がある学生を広く歓迎しています。"
	/>
</svelte:head>

<!-- Header -->
<section class="border-b border-zinc-200 bg-zinc-50/50 py-16">
	<div class="mx-auto max-w-6xl px-6">
		<div
			class="mb-3 font-[JetBrains_Mono,monospace] text-xs font-medium tracking-widest text-[#00D372] uppercase"
		>
			Join us
		</div>
		<h1 class="mb-2 text-3xl font-bold">入部案内</h1>
		<p class="text-zinc-500">ut.code(); への参加方法をご案内します。</p>
	</div>
</section>

<div class="mx-auto max-w-4xl px-6 py-8 sm:py-12">
	<!-- Welcome message -->
	<div class="mb-8 rounded-2xl border border-[#00D372]/20 bg-[#00D372]/5 p-6 sm:mb-12 sm:p-8">
		<h2 class="mb-3 text-xl font-bold sm:mb-4 sm:text-2xl">ようこそ!</h2>
		<p class="leading-relaxed text-zinc-700">
			ut.code(); は東京大学のソフトウェアエンジニアリングサークルです。
			プログラミング、ものづくり、デザインに興味がある学生を広く歓迎しています。
			初心者から実務経験者まで、学年を問わずどなたでも参加できます。
		</p>
	</div>

	<!-- Requirements -->
	<section class="mb-8 sm:mb-12">
		<h2 class="mb-4 flex items-center gap-2 text-lg font-bold sm:mb-6 sm:text-xl">
			<Users class="h-5 w-5 text-[#00D372]" />
			入部要件
		</h2>
		<div class="rounded-2xl border border-zinc-200/50 bg-white/80 backdrop-blur-md p-6">
			<ul class="space-y-3">
				<li class="flex items-start gap-3">
					<span class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#00D372]"></span>
					<span class="text-zinc-700">基本的に大学生・大学院生が対象です</span>
				</li>
				<li class="flex items-start gap-3">
					<span class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#00D372]"></span>
					<span class="text-zinc-700">大学名による制限はありません（他大学の方も歓迎）</span>
				</li>
				<li class="flex items-start gap-3">
					<span class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#00D372]"></span>
					<span class="text-zinc-700">学年による制限はありません</span>
				</li>
				<li class="flex items-start gap-3">
					<span class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#00D372]"></span>
					<span class="text-zinc-700">プログラミング経験の有無は問いません</span>
				</li>
			</ul>
		</div>
	</section>

	<!-- How to join -->
	<section class="mb-12">
		<h2 class="mb-6 flex items-center gap-2 text-xl font-bold">
			<MessageCircle class="h-5 w-5 text-[#00D372]" />
			入部方法
		</h2>
		<div class="rounded-2xl border border-zinc-200/50 bg-white/80 backdrop-blur-md p-6">
			<div class="space-y-4">
				<div class="flex items-start gap-4">
					<div
						class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#00D372] font-bold text-white"
					>
						1
					</div>
					<div>
						<h3 class="font-semibold text-zinc-900">Discord サーバーに参加</h3>
						<p class="mt-1 text-sm text-zinc-500">
							部員同士の交流やプロジェクトの連絡は主に Discord で行っています。
							新歓期は自由に参加いただけます。
						</p>
					</div>
				</div>
				<div class="flex items-start gap-4">
					<div
						class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#00D372] font-bold text-white"
					>
						2
					</div>
					<div>
						<h3 class="font-semibold text-zinc-900">部員登録フォームを提出</h3>
						<p class="mt-1 text-sm text-zinc-500">
							新歓期に Discord で配布される部員登録フォームを提出すれば入部完了です。
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Activities -->
	<section class="mb-12">
		<h2 class="mb-6 flex items-center gap-2 text-xl font-bold">
			<Heart class="h-5 w-5 text-[#00D372]" />
			活動について
		</h2>
		<div class="grid gap-4 sm:grid-cols-2">
			<div class="rounded-2xl border border-zinc-200/50 bg-white/80 backdrop-blur-md p-6">
				<h3 class="mb-2 font-semibold">学習会</h3>
				<p class="text-sm text-zinc-500">
					プログラミング未経験者から経験者まで、共に学び教え合う学習会を開催しています。
				</p>
			</div>
			<div class="rounded-2xl border border-zinc-200/50 bg-white/80 backdrop-blur-md p-6">
				<h3 class="mb-2 font-semibold">プロジェクト開発</h3>
				<p class="text-sm text-zinc-500">
					大学や社会をより良くするソフトウェアを一緒に開発しています。
				</p>
			</div>
			<div class="rounded-2xl border border-zinc-200/50 bg-white/80 backdrop-blur-md p-6">
				<h3 class="mb-2 font-semibold">交流イベント</h3>
				<p class="text-sm text-zinc-500">
					集中開発合宿やブレインストーミング大会など、様々なイベントを実施しています。
				</p>
			</div>
			<div class="rounded-2xl border border-zinc-200/50 bg-white/80 backdrop-blur-md p-6">
				<h3 class="mb-2 font-semibold">オンライン活動</h3>
				<p class="text-sm text-zinc-500">Discord を中心に、オンラインでも活発に活動しています。</p>
			</div>
		</div>
	</section>

	<!-- Contact -->
	<section class="mb-12">
		<h2 class="mb-6 text-xl font-bold">お問い合わせ</h2>
		<div class="rounded-2xl border border-zinc-200/50 bg-white/80 backdrop-blur-md p-6">
			<p class="mb-4 text-zinc-700">ご質問やお問い合わせは、以下の SNS からお気軽にどうぞ。</p>
			<div class="flex flex-wrap gap-4">
				<a
					href="https://github.com/ut-code"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-900 hover:bg-zinc-900 hover:text-white"
				>
					<Github class="h-4 w-4" />
					GitHub
				</a>
				<a
					href="https://twitter.com/utokyo_code"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white"
				>
					<Twitter class="h-4 w-4" />
					X (Twitter)
				</a>
			</div>
		</div>
	</section>

	<!-- CTA -->
	<div class="rounded-2xl bg-zinc-900 p-6 text-center text-white sm:p-8">
		<h2 class="mb-3 text-xl font-bold sm:mb-4 sm:text-2xl">一緒にソフトウェアを作ろう</h2>
		<p class="mb-6 text-zinc-400">ut.code(); であなたのアイデアを形にしませんか？</p>
		<a
			href="/"
			class="group inline-flex items-center gap-2 rounded-lg bg-[#00D372] px-6 py-3 font-semibold text-zinc-900 transition-all hover:bg-[#00C066]"
		>
			トップページへ戻る
			<ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
		</a>
	</div>
</div>
