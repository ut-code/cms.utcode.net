<script lang="ts">
	import { BookOpen, Box, MessageSquare } from "lucide-svelte";
</script>

<svelte:head>
	<title>活動内容 | ut.code();</title>
	<meta property="og:title" content="活動内容 | ut.code();" />
</svelte:head>

<!-- Header -->
<section class="border-b border-zinc-200 bg-zinc-50/50 py-16">
	<div class="mx-auto max-w-6xl px-6">
		<div
			class="mb-3 font-[JetBrains_Mono,monospace] text-xs font-medium tracking-widest text-[#00D372] uppercase"
		>
			Activities
		</div>
		<h1 class="mb-2 text-3xl font-bold">活動内容</h1>
		<p class="text-zinc-500">
			ut.code();
			は学習・開発・交流の3つの軸で活動しています。プログラミング未経験者から経験者まで、誰もが成長できる環境を提供します。
		</p>
	</div>
</section>

<!-- Learn Section -->
<section class="border-b border-zinc-200 py-24" id="learn">
	<div class="mx-auto max-w-6xl px-6">
		<div class="mb-12 flex items-center gap-4">
			<div class="flex h-14 w-14 items-center justify-center rounded-xl bg-[#00D372] text-zinc-900">
				<BookOpen class="h-7 w-7" />
			</div>
			<div>
				<h2 class="text-2xl font-bold">学習・教育</h2>
				<p class="text-zinc-500">Learn & Educate</p>
			</div>
		</div>

		<div class="mb-12 rounded-2xl border border-zinc-200 bg-white p-8">
			<p class="leading-relaxed text-zinc-600">
				ut.code();
				は、全ての人にソフトウェア開発の魅力を伝えるべく、教材の作成から教育活動までを一貫して行っており、さらに高みを目指すための自学自習の機会も提供しています。充実した教材、気軽に質問できる環境、切磋琢磨する仲間、この3つの柱により、初心者から上級者まですべての人に新しい学びを提供します。
			</p>
		</div>

		<div class="space-y-8">
			<!-- ut.code(); Learn -->
			<div
				class="group rounded-2xl border border-zinc-200 bg-white p-8 transition-all hover:border-[#00D372]/50 hover:shadow-lg hover:shadow-[#00D372]/5"
			>
				<h3 class="mb-4 text-xl font-semibold">ut.code(); Learn</h3>
				<div class="space-y-4 text-zinc-600">
					<p>
						ut.code(); Learn は、ut.code(); の内部向けの教材です。はじめの一歩から実際の Web
						システム開発までに必要な知識と、多くの演習問題から構成されています。
					</p>
					<p>
						一般的な教材と異なり、網羅的な説明を避け、詳細は演習問題中に自力で調べられるようヒントを設ける形式になっています。これにより、カリキュラム終了後に自走できる基礎を確立することができます。
					</p>
				</div>
			</div>

			<!-- Document Reading -->
			<div
				class="group rounded-2xl border border-zinc-200 bg-white p-8 transition-all hover:border-[#00D372]/50 hover:shadow-lg hover:shadow-[#00D372]/5"
			>
				<h3 class="mb-4 text-xl font-semibold">ドキュメントを読む会</h3>
				<div class="space-y-4 text-zinc-600">
					<p>
						ドキュメントを読む会は、ut.code();
						の提供するドキュメントにとどまらず、自ら調べて理解を深める"自走力"を養うことを目的としています。
					</p>
					<p>
						参加者はそれぞれのペースでドキュメントを読み進め、疑問があれば調べたり、周囲と共有したりしながら、ゼロから内容を理解することを目指します。
					</p>
				</div>
			</div>

			<!-- Seminar -->
			<div
				class="group rounded-2xl border border-zinc-200 bg-white p-8 transition-all hover:border-[#00D372]/50 hover:shadow-lg hover:shadow-[#00D372]/5"
			>
				<h3 class="mb-4 text-xl font-semibold">全ゼミ / 自主ゼミ「モダン Web システム開発入門」</h3>
				<div class="space-y-4 text-zinc-600">
					<p>
						ut.code(); Learn を教材に、駒場キャンパスで講義形式で Web
						システム開発を学ぶことのできるゼミです。自学自習のペース配分が苦手でも、毎週の参加と課題により学習を進めることができます。
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Develop Section -->
<section class="border-b border-zinc-200 bg-zinc-50/50 py-24" id="develop">
	<div class="mx-auto max-w-6xl px-6">
		<div class="mb-12 flex items-center gap-4">
			<div class="flex h-14 w-14 items-center justify-center rounded-xl bg-[#00D372] text-zinc-900">
				<Box class="h-7 w-7" />
			</div>
			<div>
				<h2 class="text-2xl font-bold">開発</h2>
				<p class="text-zinc-500">Develop</p>
			</div>
		</div>

		<div class="mb-12 rounded-2xl border border-zinc-200 bg-white p-8">
			<p class="leading-relaxed text-zinc-600">
				ut.code();
				では、社会をより良い方向へ導くことを目指し、様々なプロダクトを開発しています。ut.code();
				は開発するプロダクトを「プロジェクト」と呼び、通常の活動はプロジェクトが基本単位となっています。プロジェクトのアイデア出しから実際の開発、チームメンバーとのコミュニケーション方法など、様々なノウハウが蓄積されています。
			</p>
		</div>

		<div class="space-y-8">
			<!-- Projects -->
			<div
				class="group rounded-2xl border border-zinc-200 bg-white p-8 transition-all hover:border-[#00D372]/50 hover:shadow-lg hover:shadow-[#00D372]/5"
			>
				<h3 class="mb-4 text-xl font-semibold">プロジェクト</h3>
				<div class="space-y-4 text-zinc-600">
					<p>
						プロジェクトは、ut.code();
						内のチームにより開発されるソフトウェアの単位で、多くはそれぞれ独立した Slack
						チャンネル、Notion ページ、Google Drive
						フォルダを持っています。成果物はすべてオープンソースであり、GitHub
						上で公開されています。
					</p>
					<div class="pt-4">
						<a
							href="/projects"
							class="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#00D372] hover:text-zinc-900"
						>
							すべてのプロジェクト
						</a>
					</div>
				</div>
			</div>

			<!-- Hackathon -->
			<div
				class="group rounded-2xl border border-zinc-200 bg-white p-8 transition-all hover:border-[#00D372]/50 hover:shadow-lg hover:shadow-[#00D372]/5"
			>
				<h3 class="mb-4 text-xl font-semibold">ハッカソン</h3>
				<div class="space-y-4 text-zinc-600">
					<p>
						ハッカソンは、限られた時間の中でアイデアを形にし、実際に動くプロダクトを開発するイベントです。参加者はチームを組み、短期間で設計・実装・発表までを行うため、創造力や技術力、チームワークが試されます。アイデアを素早く具体化し、試行錯誤しながらブラッシュアップする過程を通じて、実践的なスキルを磨くことができます。
					</p>
				</div>
			</div>

			<!-- Solo Development -->
			<div
				class="group rounded-2xl border border-zinc-200 bg-white p-8 transition-all hover:border-[#00D372]/50 hover:shadow-lg hover:shadow-[#00D372]/5"
			>
				<h3 class="mb-4 text-xl font-semibold">個人開発</h3>
				<div class="space-y-4 text-zinc-600">
					<p>
						個人開発は、アイデアを自由に形にし、自分のペースで開発を進めるスタイルです。発想から実装までを一貫して行うことで、技術力や問題解決能力を高めることができます。思いついたものをすぐに試し、試行錯誤を重ねながらプロダクトを作り上げていく過程そのものが、大きな学びや発見につながります。ut.code();
						は、そんな個人開発を支えるため、発表の場や開発に必要なリソース提供を通じて、開発者の挑戦をサポートしています。
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Share Section -->
<section class="py-24" id="share">
	<div class="mx-auto max-w-6xl px-6">
		<div class="mb-12 flex items-center gap-4">
			<div class="flex h-14 w-14 items-center justify-center rounded-xl bg-[#00D372] text-zinc-900">
				<MessageSquare class="h-7 w-7" />
			</div>
			<div>
				<h2 class="text-2xl font-bold">交流</h2>
				<p class="text-zinc-500">Share & Connect</p>
			</div>
		</div>

		<div class="mb-12 rounded-2xl border border-zinc-200 bg-white p-8">
			<p class="leading-relaxed text-zinc-600">
				ソフトウェア開発のために必要な技術は増加の一途をたどっており、ひとつのソフトウェアのために投資されるエネルギーも拡大し続けています。現代の開発者にとって、多くの関係者と密にコミュニケーションをとり、互いの足りない部分を補い合うことは、大切な技術のひとつです。
			</p>
		</div>

		<div class="space-y-8">
			<!-- Work Session -->
			<div
				class="group rounded-2xl border border-zinc-200 bg-white p-8 transition-all hover:border-[#00D372]/50 hover:shadow-lg hover:shadow-[#00D372]/5"
			>
				<h3 class="mb-4 text-xl font-semibold">作業会</h3>
				<div class="space-y-4 text-zinc-600">
					<p>
						大学の長期休暇は 2
						か月にも及ぶため、ソフトウェア開発プロジェクトを実施するには絶好の機会です。しかし、長い休暇を有意義に使うために自らを律することは容易ではありません。
					</p>
					<p>
						ut.code();
						では、長期休暇の期間中、週末を利用して作業会を開催しています。所属するプロジェクトの打ち合わせに使ったり、普段は交流のない他のプロジェクトの人と繋がりを持ったりできるでしょう。
					</p>
				</div>
			</div>

			<!-- Festival -->
			<div
				class="group rounded-2xl border border-zinc-200 bg-white p-8 transition-all hover:border-[#00D372]/50 hover:shadow-lg hover:shadow-[#00D372]/5"
			>
				<h3 class="mb-4 text-xl font-semibold">五月祭・駒場祭</h3>
				<div class="space-y-4 text-zinc-600">
					<p>
						東京大学の主要な学園祭である五月祭・駒場祭に、ut.code();
						も出展しています。参加者にソフトウェア開発の魅力を知ってもらうことを目標に掲げる企画で、例年たくさんの方からご好評をいただいています。
					</p>
					<p>
						ut.code();
						のメンバーにとっては、通常より短い期間で実施するプロジェクトでもあり、身に着けた技術での腕試しや、開発チームのリーダーとしての経験を得るための場になっています。
					</p>
				</div>
			</div>

			<!-- Camp -->
			<div
				class="group rounded-2xl border border-zinc-200 bg-white p-8 transition-all hover:border-[#00D372]/50 hover:shadow-lg hover:shadow-[#00D372]/5"
			>
				<h3 class="mb-4 text-xl font-semibold">合宿</h3>
				<div class="space-y-4 text-zinc-600">
					<p>
						ソフトウェア開発には長い時間がかかります。大学生活には時間的余裕があるとはいえ、集中して開発に取り組むのはなかなか難しいのが現実です。
					</p>
					<p>
						ut.code();
						の合宿は、慌ただしい日常生活をしばらくの間抜け出し、全力で開発を行う合宿です。帰ってきた後には一回り成長した自分を実感できることでしょう。
					</p>
				</div>
			</div>
		</div>
	</div>
</section>
