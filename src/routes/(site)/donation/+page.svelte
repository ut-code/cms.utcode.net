<script lang="ts">
	import { ArrowRight, Banknote, Building2, Github, Heart, Laptop, Twitter } from "lucide-svelte";

	type Benefit = string;
	const benefits: Benefit[] = [
		"公式ウェブサイトへの企業ロゴ掲載",
		"学生エンジニアコミュニティへの認知度向上",
		"東京大学を中心とした教育支援への貢献",
	];

	type BankRow = { label: string; value: string };
	const bankInfo: BankRow[] = [
		{ label: "金融機関", value: "三菱 UFJ 銀行 (0005)" },
		{ label: "支店", value: "本郷 (351)" },
		{ label: "口座番号", value: "0339615" },
	];
</script>

<svelte:head>
	<title>ご寄付・ご協賛のお願い | ut.code();</title>
	<meta property="og:title" content="ご寄付・ご協賛のお願い | ut.code();" />
	<meta
		name="description"
		content="ut.code();への寄付・協賛をお願いしております。皆様のご支援により、より多くの方にソフトウェア開発の魅力を届けることができます。"
	/>
	<meta
		property="og:description"
		content="ut.code();への寄付・協賛をお願いしております。皆様のご支援により、より多くの方にソフトウェア開発の魅力を届けることができます。"
	/>
</svelte:head>

<!--
	donation page — support-options layout.
	Header w/ dot-grid + heart icon. Each support type sits in a
	white card with mono category label and primary accent details.
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
			<span>// support us</span>
		</div>
		<h1 class="text-4xl leading-tight font-bold tracking-tight text-zinc-900 sm:text-5xl">
			ご寄付・ご協賛のお願い
		</h1>
		<p class="mt-4 max-w-2xl text-lg text-zinc-600">
			皆様のご支援により、活動を続けることができます。
		</p>
	</div>
</section>

<div class="mx-auto max-w-4xl px-6 py-12">
	<!-- Introduction -->
	<div
		class="relative mb-12 overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/[0.04] to-transparent p-8"
	>
		<span
			class="pointer-events-none absolute top-0 left-0 h-3 w-3 border-t border-l border-primary"
			aria-hidden="true"
		></span>
		<span
			class="pointer-events-none absolute right-0 bottom-0 h-3 w-3 border-r border-b border-primary"
			aria-hidden="true"
		></span>
		<h2 class="mb-4 flex items-center gap-3 text-2xl font-bold tracking-tight">
			<Heart class="h-6 w-6 text-primary" />
			ut.code(); について
		</h2>
		<div class="space-y-3 leading-relaxed text-zinc-700">
			<p>ut.code(); は、学生の手で自主的に運営されている団体です。</p>
			<p>多くの方にソフトウェア開発の魅力を知っていただくため、活動はすべて無償で行っています。</p>
			<p>
				現在のところ活動資金は寄付によって賄われていますが、十分とはいえない状況です。
				皆様のご支援をいただけますと幸いです。
			</p>
		</div>
	</div>

	<!-- Sponsorship Support -->
	<section class="mb-12">
		<div class="mb-6 flex items-center gap-3">
			<Building2 class="h-5 w-5 text-primary" />
			<h2 class="text-xl font-bold tracking-tight">協賛による支援</h2>
			<div
				class="flex-1 border-t border-dashed border-zinc-200"
				aria-hidden="true"
			></div>
			<span class="font-mono text-[11px] tracking-widest text-zinc-400">01</span>
		</div>
		<div class="rounded-2xl border border-zinc-200 bg-white p-8">
			<p class="mb-6 leading-relaxed text-zinc-700">
				ut.code(); は、ご協賛いただいた企業様のロゴをウェブサイトに掲載しております。
			</p>
			<div class="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
				<div
					class="mb-4 font-mono text-[11px] tracking-widest text-zinc-500 uppercase"
				>
					// benefits
				</div>
				<ul class="space-y-3">
					{#each benefits as benefit (benefit)}
						<li class="flex items-start gap-3">
							<span
								class="mt-2 inline-block h-px w-3 shrink-0 bg-primary"
								aria-hidden="true"
							></span>
							<span class="text-sm text-zinc-700">{benefit}</span>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</section>

	<!-- Donation Support -->
	<section class="mb-12">
		<div class="mb-6 flex items-center gap-3">
			<Banknote class="h-5 w-5 text-primary" />
			<h2 class="text-xl font-bold tracking-tight">ご寄付による支援</h2>
			<div
				class="flex-1 border-t border-dashed border-zinc-200"
				aria-hidden="true"
			></div>
			<span class="font-mono text-[11px] tracking-widest text-zinc-400">02</span>
		</div>
		<div class="rounded-2xl border border-zinc-200 bg-white p-8">
			<p class="mb-6 leading-relaxed text-zinc-700">
				ご寄付いただける方は、以下の口座にお振込みください。
			</p>
			<div class="mb-6 overflow-hidden rounded-xl border border-zinc-200">
				<div
					class="border-b border-zinc-200 bg-zinc-50 px-6 py-3 font-mono text-[11px] tracking-widest text-zinc-500 uppercase"
				>
					// bank info
				</div>
				<dl class="divide-y divide-zinc-100">
					{#each bankInfo as row (row.label)}
						<div
							class="grid grid-cols-[7rem_1fr] items-baseline gap-4 px-6 py-3"
						>
							<dt
								class="font-mono text-[11px] tracking-widest text-zinc-500 uppercase"
							>
								{row.label}
							</dt>
							<dd class="text-sm text-zinc-900 tabular-nums">{row.value}</dd>
						</div>
					{/each}
				</dl>
			</div>
			<p class="text-sm text-zinc-600">
				誤操作の防止と、感謝の気持ちをお伝えするため、事前にご一報いただけますと幸いです。
			</p>
		</div>
	</section>

	<!-- Laptop Donation -->
	<section class="mb-12">
		<div class="mb-6 flex items-center gap-3">
			<Laptop class="h-5 w-5 text-primary" />
			<h2 class="text-xl font-bold tracking-tight">使用しなくなったノートパソコンの譲渡</h2>
			<div
				class="flex-1 border-t border-dashed border-zinc-200"
				aria-hidden="true"
			></div>
			<span class="font-mono text-[11px] tracking-widest text-zinc-400">03</span>
		</div>
		<div class="rounded-2xl border border-zinc-200 bg-white p-8">
			<div class="mb-6 space-y-3 leading-relaxed text-zinc-700">
				<p>
					ut.code();
					では例年、五月祭・駒場祭で外部のお客様向けにプログラミングを学ぶことのできる企画を行っています。
				</p>
				<p>
					この企画では、皆様に気軽にお越しいただけるよう、会場内でノートパソコンを貸し出しています。
					各々が持ち寄ったノートパソコンを使用してはいますが、それだけでは台数が足りないため、外部の事業者にレンタルを依頼せざるを得ず、その費用負担が問題となっています。
				</p>
				<p>
					そこで、ut.code();
					では、使用しなくなったノートパソコンを譲渡していただける方を募集しています。
				</p>
			</div>
			<div
				class="relative overflow-hidden rounded-xl border border-amber-300 bg-amber-50 p-6"
			>
				<div
					class="mb-2 font-mono text-[11px] tracking-widest text-amber-700 uppercase"
				>
					// important
				</div>
				<h3 class="mb-3 font-semibold text-amber-900">重要なお願い</h3>
				<p class="text-sm leading-relaxed text-amber-800">
					保存されているデータは幣団体で削除する処理を行いますが、情報漏洩については責任を負うことができませんので、送付前にデータの削除をお願いいたします。
				</p>
			</div>
		</div>
	</section>

	<!-- Supporters -->
	<section class="mb-12">
		<div class="mb-6 flex items-center gap-3">
			<h2 class="text-xl font-bold tracking-tight">ご支援いただいた皆様</h2>
			<div
				class="flex-1 border-t border-dashed border-zinc-200"
				aria-hidden="true"
			></div>
			<span class="font-mono text-[11px] tracking-widest text-zinc-400">04</span>
		</div>
		<div class="rounded-2xl border border-zinc-200 bg-white p-6">
			<ul class="space-y-2">
				<li class="flex items-center gap-4 text-sm">
					<span class="font-mono text-xs tracking-wider text-zinc-400">
						2024.03.11
					</span>
					<span
						class="inline-block h-px w-3 bg-zinc-300"
						aria-hidden="true"
					></span>
					<span class="text-zinc-700">コウノマサノリ様</span>
				</li>
			</ul>
		</div>
	</section>

	<!-- Contact -->
	<section class="mb-12">
		<div class="mb-6 flex items-center gap-3">
			<h2 class="text-xl font-bold tracking-tight">お問い合わせ</h2>
			<div
				class="flex-1 border-t border-dashed border-zinc-200"
				aria-hidden="true"
			></div>
			<span class="font-mono text-[11px] tracking-widest text-zinc-400">05</span>
		</div>
		<div class="rounded-2xl border border-zinc-200 bg-white p-6">
			<p class="mb-4 text-zinc-700">
				ご寄付・ご協賛に関するお問い合わせは、以下の SNS からお気軽にどうぞ。
			</p>
			<div class="flex flex-wrap gap-3">
				<a
					href="https://github.com/ut-code"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex min-h-11 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
				>
					<Github class="h-4 w-4" />
					<span class="font-mono">GitHub</span>
				</a>
				<a
					href="https://x.com/utokyo_code"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex min-h-11 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
				>
					<Twitter class="h-4 w-4" />
					<span class="font-mono">X (Twitter)</span>
				</a>
			</div>
		</div>
	</section>

	<!-- CTA -->
	<div
		class="relative overflow-hidden rounded-2xl bg-zinc-950 p-10 text-center text-white"
	>
		<div
			class="pointer-events-none absolute inset-0 opacity-[0.15]"
			style="background-image: radial-gradient(circle, rgb(255 255 255 / 0.6) 1px, transparent 1px); background-size: 24px 24px;"
			aria-hidden="true"
		></div>
		<div
			class="pointer-events-none absolute -right-32 -bottom-32 h-72 w-72 rounded-full"
			style="background: radial-gradient(circle, oklch(76% 0.2 153 / 0.3) 0%, transparent 60%);"
			aria-hidden="true"
		></div>
		<div class="relative">
			<div
				class="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-[11px] tracking-widest text-primary backdrop-blur uppercase"
			>
				<Heart class="h-3 w-3" />
				thank you
			</div>
			<h2 class="mb-4 text-2xl leading-tight font-bold tracking-tight sm:text-3xl">
				あなたのご支援を<br class="sm:hidden" />お待ちしています
			</h2>
			<p class="mx-auto max-w-xl text-zinc-400">
				皆様のご支援により、より多くの方にソフトウェア開発の魅力を届けることができます。
			</p>
			<a
				href="#top"
				class="mt-6 inline-flex min-h-11 items-center gap-2 font-mono text-xs tracking-widest text-primary transition-colors hover:text-white focus:outline-none"
			>
				<ArrowRight class="h-3.5 w-3.5 rotate-[-90deg]" />
				support options に戻る
			</a>
		</div>
	</div>
</div>
