<svelte:head>
	<title>2026 年春新歓 イベント一覧 | ut.code();</title>
	<meta property="og:title" content="2026 年春新歓 イベント一覧 | ut.code();" />
	<meta name="description" content="ut.code(); 2026年春新歓イベントの日程と詳細" />
</svelte:head>

<!--
	welcome events page — schedule layout.
	Each category becomes a labeled chapter; event details laid out as
	a quasi-table with mono date stamps.
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
			<span>// welcome events · 2026</span>
		</div>
		<h1 class="text-4xl leading-tight font-bold tracking-tight text-zinc-900 sm:text-5xl">
			2026 年春新歓<br />イベント一覧
		</h1>
	</div>
</section>

<div class="mx-auto max-w-2xl px-6">
	<section class="py-16">
		<p class="text-lg leading-relaxed text-zinc-600">
			2026 年の新歓イベントの日程は以下のとおりです。
			興味がある方は、ぜひ気軽に参加してみてください!
		</p>
		<a
			href="/images/welcome/calendar.jpg"
			target="_blank"
			class="group mt-8 block overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:border-primary/30 hover:shadow-md focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
		>
			<img
				src="/images/welcome/calendar.jpg"
				alt="新歓日程カレンダー"
				class="w-full transition-transform duration-500 group-hover:scale-[1.02]"
			/>
		</a>
		<p
			class="mt-3 text-center font-mono text-[11px] tracking-widest text-zinc-400 uppercase"
		>
			// click image to view fullscreen
		</p>
	</section>

	<!-- 説明会系イベント -->
	<section class="border-t border-zinc-100 py-16">
		<div
			class="mb-6 font-mono text-[11px] tracking-widest text-primary uppercase"
		>
			// info sessions · 01
		</div>
		<h2 class="mb-8 text-2xl font-bold tracking-tight">説明会系イベント</h2>
		<div class="space-y-6">
			<div class="rounded-2xl border border-zinc-200 bg-white p-6">
				<h3 class="mb-3 font-semibold">サーオリ</h3>
				<div class="font-mono text-sm text-zinc-600">
					<span class="text-zinc-400">date</span>
					<span class="mx-2 text-zinc-300">·</span>
					4/3 (金), 4/5 (日)
				</div>
			</div>
			<div class="rounded-2xl border border-zinc-200 bg-white p-6">
				<h3 class="mb-3 font-semibold">東大エンジニア系サークル合同新歓</h3>
				<div class="font-mono text-sm text-zinc-600">
					<span class="text-zinc-400">date</span>
					<span class="mx-2 text-zinc-300">·</span>
					4/9 (木), 4/15 (水)
				</div>
			</div>
		</div>
	</section>

	<!-- 学習系イベント -->
	<section class="border-t border-zinc-100 py-16">
		<div
			class="mb-6 font-mono text-[11px] tracking-widest text-primary uppercase"
		>
			// learn · 02
		</div>
		<h2 class="mb-8 text-2xl font-bold tracking-tight">学習系イベント</h2>
		<div class="space-y-6">
			<div class="rounded-2xl border border-zinc-200 bg-white p-6">
				<h3 class="mb-3 font-semibold">初学者講習会</h3>
				<div
					class="grid grid-cols-[3.5rem_1fr] gap-y-1 font-mono text-sm text-zinc-600"
				>
					<span class="text-zinc-400">date</span>
					<span>4/12 (日), 4/18 (土) 13:30〜17:30</span>
					<span class="text-zinc-400">place</span>
					<span>4/12 → 1311教室, 4/18 → 1331教室</span>
				</div>
				<p class="mt-3 text-zinc-600">
					授業形式で HTML・CSS・JavaScript の基礎を学び、簡単な Web
					アプリを公開できるようになります。
				</p>
				<a
					href="https://forms.gle/HPi8Y73h4xFjQTAs5"
					target="_blank"
					rel="noopener noreferrer"
					class="mt-4 inline-flex min-h-11 items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-zinc-950 transition-all hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
				>
					参加登録はこちら →
				</a>
			</div>
			<div class="rounded-2xl border border-zinc-200 bg-white p-6">
				<h3 class="mb-3 font-semibold">自主勉強会</h3>
				<div
					class="grid grid-cols-[3.5rem_1fr] gap-y-1 font-mono text-sm text-zinc-600"
				>
					<span class="text-zinc-400">date</span>
					<span>
						4/7 (火), 4/10 (金), 4/14 (火), 4/17 (金), 4/21 (火), 4/24 (金), 4/28 (火),
						5/8 (金)
					</span>
					<span class="text-zinc-400">place</span>
					<span>学生会館 313B</span>
				</div>
				<p class="mt-3 text-zinc-600">途中参加・途中退出可。</p>
				<p class="mt-2 text-zinc-600">
					自分のペースでプログラミングを学び、プロジェクトに参加できるスキルをつけよう!
					経験者も新しい知識を学ぶチャンス!
				</p>
			</div>
		</div>
	</section>

	<!-- 交流・開発系イベント -->
	<section class="border-t border-zinc-100 py-16">
		<div
			class="mb-6 font-mono text-[11px] tracking-widest text-primary uppercase"
		>
			// share &amp; develop · 03
		</div>
		<h2 class="mb-8 text-2xl font-bold tracking-tight">交流・開発系イベント</h2>
		<div class="space-y-6">
			<div class="rounded-2xl border border-zinc-200 bg-white p-6">
				<h3 class="mb-3 font-semibold">新歓合宿</h3>
				<div class="font-mono text-sm text-zinc-600">
					<span class="text-zinc-400">date</span>
					<span class="mx-2 text-zinc-300">·</span>
					5/4 (月) ~ 5/6 (水)
				</div>
				<p class="mt-3 text-zinc-600">
					合宿を通してプログラミングの基礎を身につけ、自分なりのサイトやアプリを作りましょう!
				</p>
				<p class="mt-2 text-zinc-600">
					ut.code();
					の新歓イベントとしては一番大きなものになります!部員や他の新入生とも交流できるいい機会になります!ぜひご参加ください!
				</p>
				<p
					class="mt-4 inline-block rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1 font-mono text-[11px] tracking-wide text-zinc-500"
				>
					※ 参加登録は締め切りました
				</p>
			</div>
			<div class="rounded-2xl border border-zinc-200 bg-white p-6">
				<h3 class="mb-3 font-semibold">新歓ハッカソン</h3>
				<div
					class="grid grid-cols-[5rem_1fr] gap-y-1 font-mono text-sm text-zinc-600"
				>
					<span class="text-zinc-400">kickoff</span>
					<span>4/26 (日)</span>
					<span class="text-zinc-400">workshop</span>
					<span>5/9 (土)</span>
					<span class="text-zinc-400">demo</span>
					<span>5/10 (日)</span>
				</div>
				<a
					href="https://forms.gle/KCQsJc5RAURUkFW8A"
					target="_blank"
					rel="noopener noreferrer"
					class="mt-4 inline-flex min-h-11 items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-zinc-950 transition-all hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
				>
					参加登録はこちら →
				</a>
			</div>
		</div>
	</section>

	<!-- その他 -->
	<section class="border-t border-zinc-100 py-16">
		<div
			class="mb-6 font-mono text-[11px] tracking-widest text-primary uppercase"
		>
			// others · 04
		</div>
		<h2 class="mb-8 text-2xl font-bold tracking-tight">その他</h2>
		<div class="rounded-2xl border border-zinc-200 bg-white p-6">
			<h3 class="mb-3 font-semibold">ut.code(); 総会</h3>
			<div
				class="grid grid-cols-[5rem_1fr] gap-y-1 font-mono text-sm text-zinc-600"
			>
				<span class="text-zinc-400">apr</span>
				<span>4/25 (土)</span>
				<span class="text-zinc-400">may</span>
				<span>5/16 (土)</span>
			</div>
		</div>
	</section>
</div>
