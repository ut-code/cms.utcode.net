<script lang="ts">
	import ImageSection from "$lib/components/ImageSection.svelte";
	import { ArrowRight, BookOpen, Box, MessageSquare } from "lucide-svelte";
</script>

<svelte:head>
	<title>活動内容 | ut.code();</title>
	<meta property="og:title" content="活動内容 | ut.code();" />
</svelte:head>

<!-- Cover Image Header -->
<img
	src="/images/activity/learn/cover.jpg"
	alt=""
	class="h-72 w-full object-cover md:h-96"
/>

<!-- Title Section -->
<section class="py-16">
	<div class="container mx-auto px-6 lg:max-w-screen-lg">
		<div
			class="mb-3 font-[JetBrains_Mono,monospace] text-xs font-medium uppercase tracking-widest text-primary"
		>
			Activities
		</div>
		<h1 class="text-3xl font-bold md:text-4xl">活動内容</h1>
		<p class="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600">
			ut.code();
			は、全ての人にソフトウェア開発の魅力を伝えるべく、教材の作成から教育活動までを一貫して行っており、さらに高みを目指すための自学自習の機会も提供しています。充実した教材、気軽に質問できる環境、切磋琢磨する仲間、この3つの柱により、初心者から上級者まですべての人に新しい学びを提供します。
		</p>
	</div>
</section>

<!-- Learn Section -->
<section class="bg-zinc-50" id="learn">
	<div class="py-16">
		<div class="container mx-auto px-6 lg:max-w-screen-lg">
			<div class="flex items-center gap-4">
				<div class="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-zinc-900">
					<BookOpen class="h-7 w-7" />
				</div>
				<div>
					<h2 class="text-2xl font-bold">学習・教育</h2>
					<p class="text-zinc-500">Learn & Educate</p>
				</div>
			</div>
		</div>
	</div>

	<ImageSection
		title="ut.code(); Learn"
		image="/images/activity/learn/utcode-learn.jpg"
		imageAlt="ut.code(); Learn"
		alignImage="right"
	>
		<p>
			ut.code(); Learn は、ut.code(); の内部向けの教材です。はじめの一歩から実際の Web
			システム開発までに必要な知識と、多くの演習問題から構成されています。
		</p>
		<p>
			一般的な教材と異なり、網羅的な説明を避け、詳細は演習問題中に自力で調べられるようヒントを設ける形式になっています。これにより、カリキュラム終了後に自走できる基礎を確立することができます。
		</p>
		<a
			href="/projects/utcode-learn"
			class="mt-4 inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary hover:text-zinc-900"
		>
			詳しく見る
			<ArrowRight class="h-4 w-4" />
		</a>
	</ImageSection>

	<ImageSection
		title="ドキュメントを読む会"
		image="/images/activity/learn/read-document.avif"
		alignImage="left"
	>
		<p>
			ドキュメントを読む会は、ut.code();
			の提供するドキュメントにとどまらず、自ら調べて理解を深める"自走力"を養うことを目的としています。
		</p>
		<p>
			参加者はそれぞれのペースでドキュメントを読み進め、疑問があれば調べたり、周囲と共有したりしながら、ゼロから内容を理解することを目指します。
		</p>
	</ImageSection>

	<ImageSection
		title="全ゼミ / 自主ゼミ「モダン Web システム開発入門」"
		image="/images/activity/learn/specialized-seminar.jpg"
		alignImage="right"
	>
		<p>
			ut.code(); Learn を教材に、駒場キャンパスで講義形式で Web
			システム開発を学ぶことのできるゼミです。自学自習のペース配分が苦手でも、毎週の参加と課題により学習を進めることができます。
		</p>
	</ImageSection>
</section>

<!-- Develop Section -->
<section class="py-16" id="develop">
	<div class="container mx-auto px-6 lg:max-w-screen-lg">
		<div class="flex items-center gap-4">
			<div class="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-zinc-900">
				<Box class="h-7 w-7" />
			</div>
			<div>
				<h2 class="text-2xl font-bold">開発</h2>
				<p class="text-zinc-500">Develop</p>
			</div>
		</div>
		<p class="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600">
			ut.code();
			では、社会をより良い方向へ導くことを目指し、様々なプロダクトを開発しています。ut.code();
			は開発するプロダクトを「プロジェクト」と呼び、通常の活動はプロジェクトが基本単位となっています。
		</p>
	</div>

	<ImageSection
		title="プロジェクト"
		image="/images/activity/develop/project.jpg"
		imageAlt="共同作業の様子"
		alignImage="right"
	>
		<p>
			プロジェクトは、ut.code();
			内のチームにより開発されるソフトウェアの単位で、多くはそれぞれ独立した Slack
			チャンネル、Notion ページ、Google Drive
			フォルダを持っています。成果物はすべてオープンソースであり、GitHub 上で公開されています。
		</p>
		<a
			href="/projects"
			class="mt-4 inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary hover:text-zinc-900"
		>
			すべてのプロジェクト
			<ArrowRight class="h-4 w-4" />
		</a>
	</ImageSection>

	<ImageSection
		title="ハッカソン"
		image="/images/activity/develop/hackathon.jpg"
		alignImage="left"
	>
		<p>
			ハッカソンは、限られた時間の中でアイデアを形にし、実際に動くプロダクトを開発するイベントです。参加者はチームを組み、短期間で設計・実装・発表までを行うため、創造力や技術力、チームワークが試されます。アイデアを素早く具体化し、試行錯誤しながらブラッシュアップする過程を通じて、実践的なスキルを磨くことができます。
		</p>
	</ImageSection>

	<ImageSection
		title="個人開発"
		image="/images/activity/develop/solo-dev.jpg"
		alignImage="right"
	>
		<p>
			個人開発は、アイデアを自由に形にし、自分のペースで開発を進めるスタイルです。発想から実装までを一貫して行うことで、技術力や問題解決能力を高めることができます。
		</p>
		<p>
			ut.code();
			は、そんな個人開発を支えるため、発表の場や開発に必要なリソース提供を通じて、開発者の挑戦をサポートしています。
		</p>
	</ImageSection>
</section>

<!-- Share Section -->
<section class="bg-zinc-50 py-16" id="share">
	<div class="container mx-auto px-6 lg:max-w-screen-lg">
		<div class="flex items-center gap-4">
			<div class="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-zinc-900">
				<MessageSquare class="h-7 w-7" />
			</div>
			<div>
				<h2 class="text-2xl font-bold">交流</h2>
				<p class="text-zinc-500">Share & Connect</p>
			</div>
		</div>
		<p class="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600">
			ソフトウェア開発のために必要な技術は増加の一途をたどっており、ひとつのソフトウェアのために投資されるエネルギーも拡大し続けています。現代の開発者にとって、多くの関係者と密にコミュニケーションをとり、互いの足りない部分を補い合うことは、大切な技術のひとつです。
		</p>
	</div>

	<ImageSection
		title="作業会"
		image="/images/activity/share/weekly-meetup.jpg"
		alignImage="right"
	>
		<p>
			大学の長期休暇は 2
			か月にも及ぶため、ソフトウェア開発プロジェクトを実施するには絶好の機会です。しかし、長い休暇を有意義に使うために自らを律することは容易ではありません。
		</p>
		<p>
			ut.code();
			では、長期休暇の期間中、週末を利用して作業会を開催しています。所属するプロジェクトの打ち合わせに使ったり、普段は交流のない他のプロジェクトの人と繋がりを持ったりできるでしょう。
		</p>
	</ImageSection>

	<ImageSection
		title="五月祭・駒場祭"
		image="/images/activity/share/festival.jpg"
		alignImage="left"
	>
		<p>
			東京大学の主要な学園祭である五月祭・駒場祭に、ut.code();
			も出展しています。参加者にソフトウェア開発の魅力を知ってもらうことを目標に掲げる企画で、例年たくさんの方からご好評をいただいています。
		</p>
		<p>
			ut.code();
			のメンバーにとっては、通常より短い期間で実施するプロジェクトでもあり、身に着けた技術での腕試しや、開発チームのリーダーとしての経験を得るための場になっています。
		</p>
	</ImageSection>

	<ImageSection
		title="合宿"
		image="/images/activity/share/camp.jpg"
		alignImage="right"
	>
		<p>
			ソフトウェア開発には長い時間がかかります。大学生活には時間的余裕があるとはいえ、集中して開発に取り組むのはなかなか難しいのが現実です。
		</p>
		<p>
			ut.code();
			の合宿は、慌ただしい日常生活をしばらくの間抜け出し、全力で開発を行う合宿です。帰ってきた後には一回り成長した自分を実感できることでしょう。
		</p>
	</ImageSection>
</section>

<!-- Join CTA -->
<section class="bg-zinc-900 py-20 text-white">
	<div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-12 px-6 xl:flex-row">
		<img
			src="/images/lab-cafe.jpg"
			alt=""
			class="w-full max-w-xl rounded-3xl object-cover xl:max-h-96 xl:w-auto"
		/>
		<div class="text-center xl:text-left">
			<h2 class="text-3xl font-bold md:text-4xl lg:text-5xl">
				<span class="bg-white px-2 text-zinc-900">未来のソフトウェア</span>を<br />
				<span class="mt-2 inline-block">デザインしよう</span>
			</h2>
			<p class="mt-6 text-lg text-zinc-300">
				ut.code(); で一緒にワクワクするソフトウェアを作りませんか？
				初心者から実務経験者、学年を問わずどなたでも大歓迎です。
			</p>
			<a
				href="/join"
				class="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 font-semibold text-zinc-900 transition-all hover:bg-primary/90"
			>
				JOIN US
				<ArrowRight class="h-5 w-5" />
			</a>
		</div>
	</div>
</section>
