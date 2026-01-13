<script lang="ts">
	import { ExternalLink, Github, Twitter } from "lucide-svelte";

	const month = new Date().getMonth();
	const isRecruitmentSeason = month === 3 || month === 4; // April and May only
</script>

<svelte:head>
	<title>入部案内 | ut.code();</title>
	<meta property="og:title" content="入部案内 | ut.code();" />
	<meta
		name="description"
		content="ut.code();への参加方法をご案内します。プログラミングに興味がある学生を広く歓迎しています。"
	/>
</svelte:head>

<section class="border-b border-zinc-200 bg-zinc-50/50 py-16">
	<div class="mx-auto max-w-6xl px-6">
		<div
			class="mb-3 font-[JetBrains_Mono,monospace] text-xs font-medium tracking-widest text-primary uppercase"
		>
			Join us
		</div>
		<h1 class="mb-2 text-3xl font-bold">入部案内</h1>
	</div>
</section>

<div class="mx-auto max-w-2xl px-6">
	<!-- Intro -->
	<section class="py-16">
		<p class="text-lg leading-relaxed text-zinc-600">
			ut.code();
			は東京大学のソフトウェアエンジニアリングサークルです。プログラミングを学びたい人、ものづくりが好きな人、仲間と一緒に開発したい人を歓迎しています。
		</p>
	</section>

	<!-- Discord CTA -->
	{#if isRecruitmentSeason}
		<section class="pb-16">
			<div class="rounded-2xl border border-[#5865F2]/20 bg-[#5865F2]/5 p-8">
				<h2 class="mb-3 text-xl font-bold">Discord に参加する</h2>
				<p class="mb-6 text-zinc-600">
					活動はすべて Discord 上で行われています。イベント案内や部員登録もこちらから。
				</p>
				<a
					href="https://discord.gg/q3w3gfZfjy"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-2 rounded-lg bg-[#5865F2] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#4752C4]"
				>
					Discord を開く
					<ExternalLink class="h-4 w-4" />
				</a>
			</div>
		</section>
	{/if}

	<!-- Who can join -->
	<section class="border-t border-zinc-100 py-16">
		<h2 class="mb-8 text-xl font-bold">参加できる人</h2>
		<div class="space-y-6 text-zinc-600">
			<p>大学生・大学院生であれば、どなたでも参加できます。東京大学以外の方も歓迎です。</p>
			<p>学年は問いません。1年生から院生まで、幅広い学年のメンバーが在籍しています。</p>
			<p>
				プログラミング経験も不問です。まったくの初心者から実務経験のある人まで、それぞれのペースで活動しています。
			</p>
		</div>
	</section>

	<!-- Activities -->
	<section class="border-t border-zinc-100 py-16">
		<h2 class="mb-8 text-xl font-bold">主な活動</h2>
		<div class="space-y-8">
			<div>
				<h3 class="mb-2 font-semibold">学習会</h3>
				<p class="text-zinc-600">
					Web開発の基礎から応用まで、部員同士で教え合いながら学んでいます。初心者向けの講習会も定期的に開催しています。
				</p>
			</div>
			<div>
				<h3 class="mb-2 font-semibold">プロジェクト開発</h3>
				<p class="text-zinc-600">
					チームでWebアプリやツールを開発しています。企画から設計、実装、運用まで一通り経験できます。
				</p>
			</div>
			<div>
				<h3 class="mb-2 font-semibold">交流イベント</h3>
				<p class="text-zinc-600">
					開発合宿やハッカソン、ブレインストーミング大会など、楽しみながら技術を磨くイベントがあります。
				</p>
			</div>
			<div>
				<h3 class="mb-2 font-semibold">オンライン活動</h3>
				<p class="text-zinc-600">Discord を中心に、オンラインでも活発に活動しています。</p>
			</div>
		</div>
	</section>

	<!-- How to join -->
	<section class="border-t border-zinc-100 py-16">
		<h2 class="mb-8 text-xl font-bold">入部の流れ</h2>
		<div class="space-y-6 text-zinc-600">
			<p>まずは Discord サーバーに参加してください。雰囲気を見てから決めていただいて構いません。</p>
			<p>
				正式に入部する場合は、新歓期に Discord
				で配布される部員登録フォームを提出してください。それだけで手続きは完了です。
			</p>
		</div>
	</section>

	<!-- Contact -->
	<section class="border-t border-zinc-100 py-16">
		<h2 class="mb-8 text-xl font-bold">お問い合わせ</h2>
		<p class="mb-6 text-zinc-600">ご質問があれば、SNS からお気軽にどうぞ。</p>
		<div class="flex flex-wrap gap-4">
			<a
				href="https://twitter.com/utokyo_code"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
			>
				<Twitter class="h-4 w-4" />
				X (Twitter)
			</a>
			<a
				href="https://github.com/ut-code"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
			>
				<Github class="h-4 w-4" />
				GitHub
			</a>
		</div>
	</section>
</div>
