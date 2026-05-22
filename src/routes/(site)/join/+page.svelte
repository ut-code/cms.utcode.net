<script lang="ts">
	import { ExternalLink, Github, Twitter } from "lucide-svelte";

	const month = new Date().getMonth();
	const isRecruitmentSeason = month === 3 || month === 4; // April and May only

	type Activity = { title: string; description: string };
	const activities: Activity[] = [
		{
			title: "学習会",
			description:
				"Web開発の基礎から応用まで、部員同士で教え合いながら学んでいます。初心者向けの講習会も定期的に開催しています。",
		},
		{
			title: "プロジェクト開発",
			description:
				"チームでWebアプリやツールを開発しています。企画から設計、実装、運用まで一通り経験できます。",
		},
		{
			title: "交流イベント",
			description:
				"開発合宿やハッカソン、ブレインストーミング大会など、楽しみながら技術を磨くイベントがあります。",
		},
		{
			title: "オンライン活動",
			description: "Discord を中心に、オンラインでも活発に活動しています。",
		},
	];

	type Step = { num: string; text: string };
	const steps: Step[] = [
		{
			num: "01",
			text: "まずは Discord サーバーに参加してください。雰囲気を見てから決めていただいて構いません。",
		},
		{
			num: "02",
			text: "正式に入部する場合は、新歓期に Discord で配布される部員登録フォームを提出してください。それだけで手続きは完了です。",
		},
	];
</script>

<svelte:head>
	<title>入部案内 | ut.code();</title>
	<meta property="og:title" content="入部案内 | ut.code();" />
	<meta
		name="description"
		content="ut.code();への参加方法をご案内します。プログラミングに興味がある学生を広く歓迎しています。"
	/>
	<meta
		property="og:description"
		content="ut.code();への参加方法をご案内します。プログラミングに興味がある学生を広く歓迎しています。"
	/>
</svelte:head>

<!--
	join page — minimal vertical narrative.
	Header with dot-grid backdrop. Each section divided by mono chapter
	labels. Steps render as numbered timeline.
-->

<section class="relative overflow-hidden border-b border-zinc-200 bg-zinc-50/60 py-20">
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
			<span>// join us</span>
			{#if isRecruitmentSeason}
				<span
					class="ml-2 inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-0.5 text-primary"
				>
					<span class="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-primary"></span>
					recruiting
				</span>
			{/if}
		</div>
		<h1 class="text-4xl leading-tight font-bold tracking-tight text-zinc-900 sm:text-5xl">
			入部案内
		</h1>
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
			<div
				class="relative overflow-hidden rounded-2xl border border-[#5865F2]/30 bg-gradient-to-br from-[#5865F2]/15 via-[#5865F2]/[0.04] to-transparent p-8"
			>
				<span
					class="pointer-events-none absolute top-0 left-0 h-3 w-3 border-t border-l border-[#5865F2]"
					aria-hidden="true"
				></span>
				<span
					class="pointer-events-none absolute right-0 bottom-0 h-3 w-3 border-r border-b border-[#5865F2]"
					aria-hidden="true"
				></span>
				<div
					class="mb-2 font-mono text-[11px] tracking-widest text-[#5865F2] uppercase"
				>
					// discord
				</div>
				<h2 class="mb-3 text-xl font-bold tracking-tight">Discord に参加する</h2>
				<p class="mb-6 text-zinc-600">
					活動はすべて Discord 上で行われています。イベント案内や部員登録もこちらから。
				</p>
				<a
					href="https://discord.gg/JvhPrySrJE"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#5865F2] px-6 py-3 font-semibold text-white transition-all hover:bg-[#4752C4] focus:ring-2 focus:ring-[#5865F2] focus:ring-offset-2 focus:outline-none"
				>
					Discord を開く
					<ExternalLink class="h-4 w-4" />
				</a>
			</div>
		</section>
	{/if}

	<!-- Who can join -->
	<section class="border-t border-zinc-100 py-16">
		<div
			class="mb-6 font-mono text-[11px] tracking-widest text-primary uppercase"
		>
			// who can join · 01
		</div>
		<h2 class="mb-8 text-2xl font-bold tracking-tight">参加できる人</h2>
		<div class="space-y-5 text-zinc-600">
			<p>大学生・大学院生であれば、どなたでも参加できます。東京大学以外の方も歓迎です。</p>
			<p>学年は問いません。1年生から院生まで、幅広い学年のメンバーが在籍しています。</p>
			<p>
				プログラミング経験も不問です。まったくの初心者から実務経験のある人まで、それぞれのペースで活動しています。
			</p>
		</div>
	</section>

	<!-- Activities -->
	<section class="border-t border-zinc-100 py-16">
		<div
			class="mb-6 font-mono text-[11px] tracking-widest text-primary uppercase"
		>
			// activities · 02
		</div>
		<h2 class="mb-8 text-2xl font-bold tracking-tight">主な活動</h2>
		<div class="space-y-6">
			{#each activities as activity, i (activity.title)}
				<div class="flex gap-5">
					<div
						class="shrink-0 font-mono text-[11px] tracking-widest text-zinc-400"
					>
						{String(i + 1).padStart(2, "0")}
					</div>
					<div>
						<h3 class="mb-2 font-semibold">{activity.title}</h3>
						<p class="text-zinc-600">{activity.description}</p>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- How to join — timeline -->
	<section class="border-t border-zinc-100 py-16">
		<div
			class="mb-6 font-mono text-[11px] tracking-widest text-primary uppercase"
		>
			// how to join · 03
		</div>
		<h2 class="mb-8 text-2xl font-bold tracking-tight">入部の流れ</h2>
		<ol class="relative space-y-8">
			<!-- vertical timeline line -->
			<span
				class="pointer-events-none absolute top-2 bottom-2 left-[15px] w-px bg-zinc-200"
				aria-hidden="true"
			></span>
			{#each steps as step (step.num)}
				<li class="relative flex gap-5 pl-2">
					<div
						class="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-white font-mono text-[11px] font-medium text-primary"
					>
						{step.num}
					</div>
					<p class="pt-1 leading-relaxed text-zinc-600">{step.text}</p>
				</li>
			{/each}
		</ol>
	</section>

	<!-- Contact -->
	<section class="border-t border-zinc-100 py-16">
		<div
			class="mb-6 font-mono text-[11px] tracking-widest text-primary uppercase"
		>
			// contact · 04
		</div>
		<h2 class="mb-8 text-2xl font-bold tracking-tight">お問い合わせ</h2>
		<p class="mb-6 text-zinc-600">ご質問があれば、SNS からお気軽にどうぞ。</p>
		<div class="flex flex-wrap gap-3">
			<a
				href="https://x.com/utokyo_code"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex min-h-11 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
			>
				<Twitter class="h-4 w-4" />
				<span class="font-mono">X (Twitter)</span>
			</a>
			<a
				href="https://github.com/ut-code"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex min-h-11 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
			>
				<Github class="h-4 w-4" />
				<span class="font-mono">GitHub</span>
			</a>
		</div>
	</section>
</div>
