<script lang="ts">
	import { Calendar, Clock, ExternalLink, MapPin, MessageCircle, Users } from "lucide-svelte";
</script>

<svelte:head>
	<title>2025年春新歓イベント一覧 | ut.code();</title>
	<meta property="og:title" content="2025年春新歓イベント一覧 | ut.code();" />
	<meta
		name="description"
		content="ut.code(); 2025年春新歓イベントの日程と詳細をご案内します。プログラミング初心者から経験者まで、どなたでも参加できます。"
	/>
</svelte:head>

<!-- Header -->
<section class="border-b border-zinc-200 bg-zinc-50/50 py-16">
	<div class="mx-auto max-w-6xl px-6">
		<div
			class="mb-3 font-[JetBrains_Mono,monospace] text-xs font-medium tracking-widest text-primary uppercase"
		>
			Welcome Events 2025
		</div>
		<h1 class="mb-2 text-3xl font-bold">2025年春新歓イベント一覧</h1>
		<p class="text-zinc-500">新歓イベントの日程と詳細をご案内します</p>
	</div>
</section>

<div class="mx-auto max-w-4xl px-6 py-12">
	<!-- Discord Invite -->
	<div class="mb-12 rounded-2xl border border-[#5865F2]/20 bg-[#5865F2]/5 p-8">
		<div class="flex items-start gap-4">
			<MessageCircle class="h-8 w-8 shrink-0 text-[#5865F2]" />
			<div>
				<h2 class="mb-2 text-2xl font-bold">Discord サーバーに参加しよう</h2>
				<p class="mb-4 leading-relaxed text-zinc-700">
					ut.code(); の活動は主に Discord で行われています。
					新歓イベントの最新情報や部員登録フォームも Discord で配布されますので、まずは Discord
					サーバーにご参加ください。
				</p>
				<a
					href="https://discord.gg/q3w3gfZfjy"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-2 rounded-lg bg-[#5865F2] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#4752C4]"
				>
					Discord に参加する
					<ExternalLink class="h-4 w-4" />
				</a>
			</div>
		</div>
	</div>

	<!-- Materials -->
	<section class="mb-12">
		<h2 class="mb-6 flex items-center gap-2 text-xl font-bold">
			<ExternalLink class="h-5 w-5 text-primary" />
			新歓配布資料
		</h2>
		<div class="rounded-2xl border border-zinc-200/50 bg-white/80 backdrop-blur-md p-6">
			<ul class="space-y-3">
				<li>
					<a
						href="https://docs.google.com/presentation/d/1c8eWT2ihAr1Y1ppYphcG_sRRV2cSsc9N1v7nWg_FPtQ/edit?usp=sharing"
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center gap-2 text-primary transition-colors hover:text-primary-focus"
					>
						ut.code(); 紹介スライド
						<ExternalLink class="h-3 w-3" />
					</a>
				</li>
			</ul>
		</div>
	</section>

	<!-- Events Timeline -->
	<section class="mb-12">
		<h2 class="mb-6 flex items-center gap-2 text-xl font-bold">
			<Calendar class="h-5 w-5 text-primary" />
			新歓イベント日程
		</h2>
		<p class="mb-6 text-zinc-600">
			2025年の新歓イベントの日程は以下のとおりです。興味がある方は、ぜひ気軽に参加してみてください！
		</p>

		<!-- Active Events -->
		<div class="space-y-6">
			<!-- Self-Study Sessions -->
			<div
				class="rounded-2xl border border-zinc-200/50 bg-white/80 backdrop-blur-md p-6 transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/5"
			>
				<div class="mb-3 flex items-start justify-between">
					<h3 class="text-lg font-bold text-zinc-900">自主勉強会</h3>
					<span class="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
						学習系
					</span>
				</div>
				<div class="space-y-2 text-sm">
					<div class="flex items-start gap-2 text-zinc-600">
						<Clock class="mt-0.5 h-4 w-4 shrink-0" />
						<div>
							<div>4/7 (月), 16 (水), 18 (金), 23 (水), 25 (金), 30 (水)</div>
							<div>すべて 19:00 ~ 21:30</div>
						</div>
					</div>
					<div class="flex items-start gap-2 text-zinc-600">
						<MapPin class="mt-0.5 h-4 w-4 shrink-0" />
						<span>駒場学生会館 313 B (部室)</span>
					</div>
					<div class="mt-3 text-zinc-700">
						<p>途中参加・途中退出可。</p>
						<p class="mt-1">
							自分のペースでプログラミングを学び、プロジェクトに参加できるスキルをつけよう！
							経験者も新しい知識を学ぶチャンス！
						</p>
					</div>
				</div>
			</div>

			<!-- Personal Hackathon -->
			<div
				class="rounded-2xl border border-zinc-200/50 bg-white/80 backdrop-blur-md p-6 transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/5"
			>
				<div class="mb-3 flex items-start justify-between">
					<h3 class="text-lg font-bold text-zinc-900">新歓個人ハッカソン</h3>
					<span class="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
						交流・開発系
					</span>
				</div>
				<div class="space-y-2 text-sm">
					<div class="flex items-start gap-2 text-zinc-600">
						<Clock class="mt-0.5 h-4 w-4 shrink-0" />
						<span>5/10 (土), 5/11 (日)</span>
					</div>
					<div class="mt-3 text-zinc-700">
						<p>
							ut.code(); Learn
							の復習を兼ねて、自分なりのフルスタックアプリケーションを作りましょう！
						</p>
						<p class="mt-2">事前に進めておいたり、終わったあとに続けて開発しても OK！</p>
						<p class="mt-2">
							合宿や勉強会に参加するなどして、 ut.code(); Learn
							の第3章「Webサーバーが動作する仕組みを知ろう」まで終わらせているとスムーズに開発ができます。
						</p>
						<p class="mt-2">希望者は制作物を五月祭や Website などに展示することができます。</p>
					</div>
				</div>
			</div>

			<!-- Project Kickoff -->
			<div
				class="rounded-2xl border border-zinc-200/50 bg-white/80 backdrop-blur-md p-6 transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/5"
			>
				<div class="mb-3 flex items-start justify-between">
					<h3 class="text-lg font-bold text-zinc-900">プロジェクト発足会</h3>
					<span class="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
						交流・開発系
					</span>
				</div>
				<div class="space-y-2 text-sm">
					<div class="flex items-start gap-2 text-zinc-600">
						<Clock class="mt-0.5 h-4 w-4 shrink-0" />
						<span>6月頃予定</span>
					</div>
					<div class="flex items-start gap-2 text-zinc-600">
						<MapPin class="mt-0.5 h-4 w-4 shrink-0" />
						<span>駒場・渋谷付近予定</span>
					</div>
					<div class="mt-3 text-zinc-700">
						<p>
							みんなで食事をしながら、新プロジェクトの発足に向けた話をしていくそんなイベントです。
						</p>
						<p class="mt-2">プロジェクトの多くはここで発足しています！</p>
					</div>
				</div>
			</div>

			<!-- Member Registration Deadline -->
			<div class="rounded-2xl border border-red-200 bg-red-50 p-6">
				<div class="mb-3 flex items-start justify-between">
					<h3 class="text-lg font-bold text-red-900">部員フォーム締め切り</h3>
					<span class="rounded-full bg-red-200 px-3 py-1 text-xs font-semibold text-red-800">
						重要
					</span>
				</div>
				<div class="space-y-2 text-sm">
					<div class="flex items-start gap-2 text-red-700">
						<Clock class="mt-0.5 h-4 w-4 shrink-0" />
						<span>5/17 (土)</span>
					</div>
					<div class="mt-3 text-red-900">
						ut.code(); の 2025 年春新歓での新入生の受付は、ここまでとさせていただきます。
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Past Events (Collapsible) -->
	<section class="mb-12">
		<details class="collapse-arrow collapse rounded-2xl border border-zinc-300 bg-zinc-50">
			<summary class="collapse-title text-lg font-semibold text-zinc-600">
				締め切り済み・終了済みイベント
			</summary>
			<div class="collapse-content">
				<div class="space-y-6 pt-4">
					<!-- Explanatory Events -->
					<div>
						<h4 class="mb-4 text-center text-sm font-semibold text-zinc-500">説明会系イベント</h4>
						<div class="space-y-4">
							<div class="rounded-lg border border-zinc-200/50 bg-white/80 backdrop-blur-md p-4">
								<h5 class="mb-2 font-semibold text-zinc-700">オンライン新歓説明会</h5>
								<div class="space-y-1 text-sm text-zinc-600">
									<div>日時: 3/30 (日) 20:00~</div>
									<div>場所: Zoom</div>
								</div>
							</div>

							<div class="rounded-lg border border-zinc-200/50 bg-white/80 backdrop-blur-md p-4">
								<h5 class="mb-2 font-semibold text-zinc-700">サーオリ</h5>
								<div class="space-y-1 text-sm text-zinc-600">
									<div>日時: 4/3(木), 4/4(金) 全日</div>
									<div>場所: 1232教室</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Learning Events -->
					<div>
						<h4 class="mb-4 text-center text-sm font-semibold text-zinc-500">学習系イベント</h4>
						<div class="space-y-4">
							<div class="rounded-lg border border-zinc-200/50 bg-white/80 backdrop-blur-md p-4">
								<h5 class="mb-2 font-semibold text-zinc-700">新歓講習会</h5>
								<div class="space-y-1 text-sm text-zinc-600">
									<div>日時: 4/6 (日) 14:00 ~ 17:30、4/12 (土) 14:00 ~ 17:30</div>
									<div>
										場所:
										<ul class="ml-4 list-disc">
											<li>4/6 (日): 駒場キャンパス 1 号館 102 教室</li>
											<li>4/12 (土): 駒場キャンパス 11 号館 1105 教室</li>
										</ul>
									</div>
									<div class="mt-2">
										<a
											href="https://forms.gle/Bo5gHDgz12XtA4NW8"
											target="_blank"
											rel="noopener noreferrer"
											class="text-primary hover:text-primary-focus"
										>
											参加フォーム
										</a>
									</div>
									<div class="mt-2">
										授業形式で HTML・CSS・JavaScript の基礎を学び、簡単な Web
										アプリを公開できるようになります。
									</div>
								</div>
							</div>

							<div class="rounded-lg border border-zinc-200/50 bg-white/80 backdrop-blur-md p-4">
								<h5 class="mb-2 font-semibold text-zinc-700">エンジニア系サークル合同新歓</h5>
								<div class="space-y-1 text-sm text-zinc-600">
									<div>日時: 4/9 (水) 19:00 ~ 21:00、4/15 (火) 19:00 ~ 21:00</div>
									<div>場所: 両日とも駒場キャンパス 1102 教室</div>
									<div class="mt-2">
										<a
											href="https://forms.gle/sAU7A9uMVerQPpUb6"
											target="_blank"
											rel="noopener noreferrer"
											class="text-primary hover:text-primary-focus"
										>
											参加フォーム
										</a>
									</div>
									<div class="mt-2">TSG、UTFF、RoboTech、灯と合同で新歓説明会を開催！</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Social/Development Events -->
					<div>
						<h4 class="mb-4 text-center text-sm font-semibold text-zinc-500">
							交流・開発系イベント
						</h4>
						<div class="space-y-4">
							<div class="rounded-lg border border-zinc-200/50 bg-white/80 backdrop-blur-md p-4">
								<h5 class="mb-2 font-semibold text-zinc-700">新歓合宿</h5>
								<div class="space-y-1 text-sm text-zinc-600">
									<div>日程: 5/3(土) ~ 5/5(月)</div>
									<div>場所: 東京大学山中寮内藤セミナーハウス</div>
									<div>フォーム: Discord にあります</div>
									<div>フォーム提出期限: 4/13 (日) 18:00</div>
									<div class="mt-2">
										合宿を通してプログラミングの基礎を身につけ、自分なりのサイトやアプリを作りましょう！
									</div>
									<div class="mt-2">
										ut.code(); の新歓イベントとしては一番大きなものになります！ ut.code();
										の普段の活動を知ることができますし、部員や他の新入生とも交流できるいい機会になります！
										ぜひご参加ください！
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</details>
	</section>

	<!-- Participation Info -->
	<section class="mb-12">
		<h2 class="mb-6 flex items-center gap-2 text-xl font-bold">
			<Users class="h-5 w-5 text-primary" />
			参加について
		</h2>
		<div class="rounded-2xl border border-zinc-200/50 bg-white/80 backdrop-blur-md p-6">
			<ul class="space-y-3">
				<li class="flex items-start gap-3">
					<span class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary"></span>
					<span class="text-zinc-700">各イベントは基本的に事前登録制です</span>
				</li>
				<li class="flex items-start gap-3">
					<span class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary"></span>
					<span class="text-zinc-700">プログラミング未経験者も歓迎します</span>
				</li>
				<li class="flex items-start gap-3">
					<span class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary"></span>
					<span class="text-zinc-700">詳細や最新情報は Discord サーバーでお知らせします</span>
				</li>
				<li class="flex items-start gap-3">
					<span class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary"></span>
					<span class="text-zinc-700">ご質問は Discord または SNS でお気軽にどうぞ</span>
				</li>
			</ul>
		</div>
	</section>

	<!-- CTA -->
	<div class="rounded-2xl bg-zinc-900 p-8 text-center text-white">
		<h2 class="mb-4 text-2xl font-bold">一緒にプログラミングを学ぼう</h2>
		<p class="mb-6 text-zinc-500">
			ut.code(); であなたのスキルを磨き、仲間と一緒に成長しませんか？
		</p>
		<div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
			<a
				href="https://discord.gg/q3w3gfZfjy"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 rounded-lg bg-[#5865F2] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#4752C4]"
			>
				Discord に参加
				<ExternalLink class="h-4 w-4" />
			</a>
			<a
				href="/join"
				class="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-zinc-900 transition-colors hover:bg-primary-focus"
			>
				入部案内を見る
			</a>
		</div>
	</div>
</div>
