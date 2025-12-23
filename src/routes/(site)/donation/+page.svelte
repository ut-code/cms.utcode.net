<script lang="ts">
	import { Banknote, Building2, Github, Heart, Laptop, Twitter } from "lucide-svelte";
</script>

<svelte:head>
	<title>ご寄付・ご協賛のお願い | ut.code();</title>
	<meta property="og:title" content="ご寄付・ご協賛のお願い | ut.code();" />
	<meta
		name="description"
		content="ut.code();への寄付・協賛をお願いしております。皆様のご支援により、より多くの方にソフトウェア開発の魅力を届けることができます。"
	/>
</svelte:head>

<!-- Header -->
<section class="border-b border-zinc-200 bg-zinc-50/50 py-16">
	<div class="mx-auto max-w-6xl px-6">
		<div
			class="mb-3 font-[JetBrains_Mono,monospace] text-xs font-medium tracking-widest text-[#00D372] uppercase"
		>
			Support us
		</div>
		<h1 class="mb-2 text-3xl font-bold">ご寄付・ご協賛のお願い</h1>
		<p class="text-zinc-500">皆様のご支援により、活動を続けることができます。</p>
	</div>
</section>

<div class="mx-auto max-w-4xl px-6 py-12">
	<!-- Introduction -->
	<div class="mb-12 rounded-2xl border border-[#00D372]/20 bg-[#00D372]/5 p-8">
		<h2 class="mb-4 flex items-center gap-2 text-2xl font-bold">
			<Heart class="h-6 w-6 text-[#00D372]" />
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
		<h2 class="mb-6 flex items-center gap-2 text-xl font-bold">
			<Building2 class="h-5 w-5 text-[#00D372]" />
			協賛による支援
		</h2>
		<div class="rounded-2xl border border-zinc-200 bg-white p-8">
			<p class="mb-4 leading-relaxed text-zinc-700">
				ut.code();は、ご協賛いただいた企業様のロゴをウェブサイトに掲載しております。
			</p>
			<div class="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
				<h3 class="mb-3 font-semibold text-zinc-900">協賛のメリット</h3>
				<ul class="space-y-2">
					<li class="flex items-start gap-3">
						<span class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#00D372]"></span>
						<span class="text-sm text-zinc-700">公式ウェブサイトへの企業ロゴ掲載</span>
					</li>
					<li class="flex items-start gap-3">
						<span class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#00D372]"></span>
						<span class="text-sm text-zinc-700">学生エンジニアコミュニティへの認知度向上</span>
					</li>
					<li class="flex items-start gap-3">
						<span class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#00D372]"></span>
						<span class="text-sm text-zinc-700">東京大学を中心とした教育支援への貢献</span>
					</li>
				</ul>
			</div>
		</div>
	</section>

	<!-- Donation Support -->
	<section class="mb-12">
		<h2 class="mb-6 flex items-center gap-2 text-xl font-bold">
			<Banknote class="h-5 w-5 text-[#00D372]" />
			ご寄付による支援
		</h2>
		<div class="rounded-2xl border border-zinc-200 bg-white p-8">
			<p class="mb-6 leading-relaxed text-zinc-700">
				ご寄付いただける方は、以下の口座にお振込みください。
			</p>
			<div class="mb-6 rounded-xl border border-zinc-200 bg-zinc-50 p-6">
				<h3 class="mb-4 font-semibold text-zinc-900">振込先情報</h3>
				<div class="space-y-3">
					<div class="flex gap-3">
						<span class="w-24 shrink-0 text-sm font-medium text-zinc-500">金融機関</span>
						<span class="text-sm text-zinc-900">三菱 UFJ 銀行 (0005)</span>
					</div>
					<div class="flex gap-3">
						<span class="w-24 shrink-0 text-sm font-medium text-zinc-500">支店</span>
						<span class="text-sm text-zinc-900">本郷 (351)</span>
					</div>
					<div class="flex gap-3">
						<span class="w-24 shrink-0 text-sm font-medium text-zinc-500">口座番号</span>
						<span class="text-sm text-zinc-900">0339615</span>
					</div>
				</div>
			</div>
			<p class="text-sm text-zinc-600">
				誤操作の防止と、感謝の気持ちをお伝えするため、事前にご一報いただけますと幸いです。
			</p>
		</div>
	</section>

	<!-- Laptop Donation -->
	<section class="mb-12">
		<h2 class="mb-6 flex items-center gap-2 text-xl font-bold">
			<Laptop class="h-5 w-5 text-[#00D372]" />
			使用しなくなったノートパソコンの譲渡
		</h2>
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
			<div class="rounded-xl border border-amber-200 bg-amber-50 p-6">
				<h3 class="mb-3 font-semibold text-amber-900">重要なお願い</h3>
				<p class="text-sm leading-relaxed text-amber-800">
					保存されているデータは幣団体で削除する処理を行いますが、情報漏洩については責任を負うことができませんので、送付前にデータの削除をお願いいたします。
				</p>
			</div>
		</div>
	</section>

	<!-- Supporters -->
	<section class="mb-12">
		<h2 class="mb-6 text-xl font-bold">ご支援いただいた皆様</h2>
		<div class="rounded-2xl border border-zinc-200 bg-white p-6">
			<ul class="space-y-2">
				<li class="flex items-center gap-2 text-sm text-zinc-700">
					<span class="font-medium text-zinc-500">2024/3/11</span>
					<span>コウノマサノリ様</span>
				</li>
			</ul>
		</div>
	</section>

	<!-- Contact -->
	<section class="mb-12">
		<h2 class="mb-6 text-xl font-bold">お問い合わせ</h2>
		<div class="rounded-2xl border border-zinc-200 bg-white p-6">
			<p class="mb-4 text-zinc-700">
				ご寄付・ご協賛に関するお問い合わせは、以下の SNS からお気軽にどうぞ。
			</p>
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
	<div class="rounded-2xl bg-zinc-900 p-8 text-center text-white">
		<h2 class="mb-4 text-2xl font-bold">あなたのご支援をお待ちしています</h2>
		<p class="mb-6 text-zinc-400">
			皆様のご支援により、より多くの方にソフトウェア開発の魅力を届けることができます。
		</p>
	</div>
</div>
