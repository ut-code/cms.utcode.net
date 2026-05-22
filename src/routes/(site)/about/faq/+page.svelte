<script lang="ts">
	import { HelpCircle, MessageCircle } from "lucide-svelte";
	import { safeJsonLd } from "$lib/shared/logic/json-ld";

	type FAQ = {
		question: string;
		answer: string;
	};

	const faqs: FAQ[] = [
		{
			question: "ut.code(); とはどのようなサークルですか?",
			answer:
				"ut.code(); は東京大学のソフトウェアエンジニアリングサークルです。プログラミング、ものづくり、デザインに興味がある学生が集まり、学習会やプロジェクト開発、交流イベントなどを通じて共に成長しています。",
		},
		{
			question: "プログラミング未経験でも参加できますか?",
			answer:
				"はい、もちろん参加できます。プログラミング経験の有無は問いません。未経験者向けの学習会も開催しており、経験者が丁寧にサポートします。初心者から実務経験者まで、幅広いレベルのメンバーが在籍しています。",
		},
		{
			question: "東京大学の学生でなくても入部できますか?",
			answer:
				"はい、入部できます。ut.code(); は東京大学を中心としたサークルですが、大学名による制限はありません。他大学の学生も歓迎しています。基本的に大学生・大学院生が対象です。",
		},
		{
			question: "どのような活動をしていますか?",
			answer:
				"主な活動は3つあります。(1) 学習会: プログラミングの基礎から応用まで学べる学習会を開催し、独自の学習コンテンツをオープンソースで公開しています。(2) プロジェクト開発: 大学や社会をより良くするソフトウェアを一緒に開発しています。(3) 交流イベント: 集中開発合宿やブレインストーミング大会など、様々なイベントを実施しています。",
		},
		{
			question: "どのくらいの頻度で活動していますか?",
			answer:
				"活動頻度はメンバーによって異なります。学習会やイベントは月に数回開催されますが、参加は任意です。Discord でのオンライン交流は日常的に行われており、自分のペースで参加できます。プロジェクトも自分の興味や時間に合わせて選べます。",
		},
		{
			question: "入部するにはどうすればいいですか?",
			answer:
				"入部は簡単です。(1) まず Discord サーバーに参加してください。新歓期は自由に参加いただけます。(2) Discord で配布される部員登録フォームを提出すれば入部完了です。詳しくは入部案内ページをご覧ください。",
		},
		{
			question: "活動場所はどこですか?",
			answer:
				"Discord を中心にオンラインで活発に活動しています。対面イベントや学習会は主に東京大学のキャンパスや周辺で開催されることが多いですが、オンライン参加も可能な場合があります。",
		},
		{
			question: "学年による制限はありますか?",
			answer:
				"学年による制限は一切ありません。1年生から大学院生まで、様々な学年のメンバーが在籍しています。学年を超えた交流も ut.code(); の魅力の一つです。",
		},
		{
			question: "どのようなプロジェクトがありますか?",
			answer:
				"Web アプリケーション、モバイルアプリ、インフラ構築など、幅広いプロジェクトがあります。大学や社会の課題を解決するソフトウェアを開発しています。詳しくはプロジェクト一覧ページをご覧ください。",
		},
		{
			question: "どのような技術スタックを使っていますか?",
			answer:
				"プロジェクトによって様々ですが、TypeScript、React、Svelte、Next.js、Node.js、Python、Go などを使用しています。新しい技術にも積極的に挑戦しており、学習しながらプロジェクトを進めることもできます。",
		},
		{
			question: "質問や相談はどこにすればいいですか?",
			answer:
				"GitHub や X (Twitter) の公式アカウントからお気軽にお問い合わせください。また、Discord サーバーに参加していただければ、メンバーに直接質問することもできます。",
		},
	];
</script>

<svelte:head>
	<title>よくある質問 (FAQ) | ut.code();</title>
	<meta property="og:title" content="よくある質問 (FAQ) | ut.code();" />
	<meta
		name="description"
		content="ut.code(); についてよくある質問とその回答をまとめました。入部方法、活動内容、参加条件などについてご確認いただけます。"
	/>
	<meta
		property="og:description"
		content="ut.code(); についてよくある質問とその回答をまとめました。入部方法、活動内容、参加条件などについてご確認いただけます。"
	/>
	{@html `<script type="application/ld+json">${safeJsonLd({
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: faqs.map((faq) => ({
			"@type": "Question",
			name: faq.question,
			acceptedAnswer: { "@type": "Answer", text: faq.answer },
		})),
	})}</script>`}
</svelte:head>

<!--
	faq page — page with accordion of Q&A.
	Header has dot-grid backdrop + mono coordinate label.
	Each item uses mono "Q. / A." prefixes for a technical doc feel.
-->

<!-- Header -->
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
			<span>// faq</span>
			<span class="text-zinc-400">· {faqs.length} questions</span>
		</div>
		<h1 class="text-4xl leading-tight font-bold tracking-tight text-zinc-900 sm:text-5xl">
			よくある質問
		</h1>
		<p class="mt-4 max-w-2xl text-lg text-zinc-600">
			ut.code(); についてよくある質問とその回答をまとめました。
		</p>
	</div>
</section>

<div class="mx-auto max-w-4xl px-6 py-12">
	<!-- Introduction -->
	<div
		class="relative mb-10 overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/[0.04] to-transparent p-8"
	>
		<span
			class="pointer-events-none absolute top-0 left-0 h-3 w-3 border-t border-l border-primary"
			aria-hidden="true"
		></span>
		<span
			class="pointer-events-none absolute right-0 bottom-0 h-3 w-3 border-r border-b border-primary"
			aria-hidden="true"
		></span>
		<div class="flex items-start gap-4">
			<HelpCircle class="h-6 w-6 shrink-0 text-primary" />
			<div>
				<h2 class="mb-2 text-xl font-bold tracking-tight">
					お探しの情報が見つかりませんか?
				</h2>
				<p class="text-zinc-700">
					このページで解決しない疑問や質問がありましたら、GitHub や X (Twitter)
					からお気軽にお問い合わせください。
				</p>
			</div>
		</div>
	</div>

	<!-- FAQ Items -->
	<div class="space-y-2">
		{#each faqs as faq, i (i)}
			<div
				class="collapse-plus collapse rounded-2xl border border-zinc-200 bg-white transition-colors hover:border-primary/30"
			>
				<input type="radio" name="faq-accordion" />
				<div class="collapse-title text-base font-semibold sm:text-lg">
					<span class="mr-3 font-mono text-xs tracking-widest text-primary">
						Q{String(i + 1).padStart(2, "0")}.
					</span>
					{faq.question}
				</div>
				<div class="collapse-content">
					<div class="flex gap-3 pt-2">
						<span class="font-mono text-xs tracking-widest text-zinc-400">A.</span>
						<p class="leading-relaxed text-zinc-700">{faq.answer}</p>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- CTA -->
	<div
		class="relative mt-12 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-8 text-center"
	>
		<div
			class="mx-auto mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10"
		>
			<MessageCircle class="h-6 w-6 text-primary" />
		</div>
		<h2 class="mb-3 text-xl font-bold tracking-tight">他にご質問はありますか?</h2>
		<p class="mb-6 text-zinc-500">
			お気軽にお問い合わせください。メンバー一同、お待ちしています。
		</p>
		<div class="flex flex-wrap justify-center gap-3">
			<a
				href="/join"
				class="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-zinc-950 transition-all hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
			>
				入部案内を見る
			</a>
			<a
				href="/"
				class="inline-flex min-h-11 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-6 py-3 font-semibold text-zinc-700 transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
			>
				トップページへ
			</a>
		</div>
	</div>
</div>
