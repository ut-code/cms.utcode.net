<script lang="ts">
  import { getStats } from "$lib/data/public/stats.remote";
  import { getPublicArticles, getPublicProjects } from "$lib/data/public/index.remote";
  import { Code, BookOpen, MessageSquare, ArrowRight, Github, Twitter } from "lucide-svelte";
  import { PROJECT_CATEGORIES } from "$lib/shared/models/schema";

  const stats = $derived(await getStats());
  const allArticles = $derived(await getPublicArticles());
  const allProjects = $derived(await getPublicProjects());

  const articles = $derived(allArticles.slice(0, 3));
  const featuredProject = $derived(allProjects.find((p) => p.category === "active"));
  const projects = $derived(allProjects.filter((p) => p.id !== featuredProject?.id).slice(0, 4));

  const currentYear = new Date().getFullYear();
  const years = currentYear - 2019;
</script>

<svelte:head>
  <title>ut.code(); - 東京大学ソフトウェアエンジニアリングサークル</title>
  <meta property="og:title" content="ut.code(); - 東京大学ソフトウェアエンジニアリングサークル" />
</svelte:head>

<!-- Hero -->
<section class="relative flex min-h-screen items-center overflow-hidden">
  <!-- Gradient background -->
  <div
    class="pointer-events-none absolute inset-0 bg-gradient-to-br from-zinc-50 via-white to-emerald-50/30"
  ></div>
  <!-- Grid pattern -->
  <div
    class="pointer-events-none absolute inset-0 opacity-[0.015]"
    style="background-image: url(&quot;data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&quot;);"
  ></div>

  <div class="relative z-10 mx-auto grid max-w-6xl items-center gap-16 px-6 lg:grid-cols-2">
    <div class="animate-fade-slide-in">
      <div
        class="mb-6 inline-block rounded-full border border-zinc-200 bg-white px-4 py-1.5 font-[JetBrains_Mono,monospace] text-xs font-medium text-zinc-600 shadow-sm"
      >
        <span class="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-[#00D372]"></span>
        Est. 2019 — The University of Tokyo
      </div>
      <h1 class="mb-6 text-4xl leading-tight font-bold tracking-tight sm:text-5xl lg:text-6xl">
        ソフトウェアで、<br />
        <span class="relative">
          <span
            class="bg-gradient-to-r from-[#00D372] to-emerald-400 bg-clip-text text-transparent"
          >
            未来を書く。
          </span>
        </span>
      </h1>
      <p class="mb-8 max-w-md text-lg leading-relaxed text-zinc-500">
        東京大学のソフトウェアエンジニアリングサークル。学生が実際にプロダクトを作り、世に届ける。
      </p>
      <div class="flex flex-wrap items-center gap-4">
        <a
          href="#join"
          class="group inline-flex items-center gap-2 rounded-lg bg-[#00D372] px-6 py-3 font-semibold text-zinc-900 shadow-lg shadow-[#00D372]/25 transition-all hover:bg-[#00C066] hover:shadow-xl hover:shadow-[#00D372]/30"
        >
          参加する
          <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </a>
        <a
          href="/projects"
          class="inline-flex items-center gap-1 text-zinc-500 transition-colors hover:text-zinc-900"
        >
          プロジェクトを見る
          <ArrowRight class="h-4 w-4" />
        </a>
      </div>
    </div>
    <div class="animate-fade-slide-in stagger-2 flex justify-center lg:justify-end">
      <div
        class="w-full max-w-sm rounded-2xl border border-zinc-200 bg-zinc-900 p-6 shadow-2xl shadow-zinc-900/20"
      >
        <div class="mb-4 flex items-center gap-2">
          <div class="h-3 w-3 rounded-full bg-red-500"></div>
          <div class="h-3 w-3 rounded-full bg-yellow-500"></div>
          <div class="h-3 w-3 rounded-full bg-green-500"></div>
          <span class="ml-2 font-[JetBrains_Mono,monospace] text-xs text-zinc-500">utcode.ts</span>
        </div>
        <pre class="font-[JetBrains_Mono,monospace] text-sm leading-relaxed"><code
            class="text-zinc-400"
            ><span class="text-purple-400">const</span> <span class="text-[#00D372]">utcode</span
            > = {"{"}<br />  <span class="text-blue-400">members</span>: <span
              class="text-orange-400">{stats.members}</span
            >,<br />  <span class="text-blue-400">projects</span>: <span class="text-orange-400"
              >{stats.projects}</span
            >,<br />  <span class="text-blue-400">years</span>: <span class="text-orange-400"
              >{years}</span
            >,<br />  <span class="text-blue-400">motto</span>: <span class="text-green-400"
              >"Ship it"</span
            ><br />}</code
          ></pre>
      </div>
    </div>
  </div>
</section>

<!-- Stats -->
<section class="border-y border-zinc-200 bg-zinc-50/50 py-16">
  <div
    class="mx-auto flex max-w-6xl flex-wrap justify-center gap-8 px-6 sm:gap-16 lg:justify-between lg:gap-24"
  >
    <div class="text-center">
      <div class="font-[JetBrains_Mono,monospace] text-4xl font-bold text-zinc-900">
        {stats.members}<span class="text-[#00D372]">+</span>
      </div>
      <div class="mt-1 text-sm tracking-wide text-zinc-500 uppercase">Members</div>
    </div>
    <div class="text-center">
      <div class="font-[JetBrains_Mono,monospace] text-4xl font-bold text-zinc-900">
        {stats.projects}<span class="text-[#00D372]">+</span>
      </div>
      <div class="mt-1 text-sm tracking-wide text-zinc-500 uppercase">Projects</div>
    </div>
    <div class="text-center">
      <div class="font-[JetBrains_Mono,monospace] text-4xl font-bold text-zinc-900">
        {stats.articles}
      </div>
      <div class="mt-1 text-sm tracking-wide text-zinc-500 uppercase">Articles</div>
    </div>
    <div class="text-center">
      <div class="font-[JetBrains_Mono,monospace] text-4xl font-bold text-zinc-900">
        {years}<span class="text-[#00D372]">+</span>
      </div>
      <div class="mt-1 text-sm tracking-wide text-zinc-500 uppercase">Years</div>
    </div>
  </div>
</section>

<!-- Activities -->
<section class="py-24">
  <div class="mx-auto max-w-6xl px-6">
    <div class="mb-12 text-center">
      <div
        class="mb-3 font-[JetBrains_Mono,monospace] text-xs font-medium tracking-widest text-[#00D372] uppercase"
      >
        What we do
      </div>
      <h2 class="text-3xl font-bold">活動内容</h2>
    </div>
    <div class="grid gap-6 md:grid-cols-3">
      <div
        class="group rounded-2xl border border-zinc-200 bg-white p-8 transition-all hover:border-[#00D372]/50 hover:shadow-lg hover:shadow-[#00D372]/5"
      >
        <div
          class="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-white transition-colors group-hover:bg-[#00D372] group-hover:text-zinc-900"
        >
          <BookOpen class="h-6 w-6" />
        </div>
        <h3 class="mb-2 text-xl font-semibold">学習・教育</h3>
        <p class="leading-relaxed text-zinc-500">
          プログラミング未経験者から経験者まで、共に学び教え合う学習会を開催。独自の学習コンテンツをオープンソースで公開しています。
        </p>
      </div>
      <div
        class="group rounded-2xl border border-zinc-200 bg-white p-8 transition-all hover:border-[#00D372]/50 hover:shadow-lg hover:shadow-[#00D372]/5"
      >
        <div
          class="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-white transition-colors group-hover:bg-[#00D372] group-hover:text-zinc-900"
        >
          <MessageSquare class="h-6 w-6" />
        </div>
        <h3 class="mb-2 text-xl font-semibold">交流</h3>
        <p class="leading-relaxed text-zinc-500">
          定期的なイベントでメンバー同士の交流を深めます。集中開発合宿やブレインストーミング大会など様々な活動を実施。
        </p>
      </div>
      <div
        class="group rounded-2xl border border-zinc-200 bg-white p-8 transition-all hover:border-[#00D372]/50 hover:shadow-lg hover:shadow-[#00D372]/5"
      >
        <div
          class="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-white transition-colors group-hover:bg-[#00D372] group-hover:text-zinc-900"
        >
          <Code class="h-6 w-6" />
        </div>
        <h3 class="mb-2 text-xl font-semibold">開発</h3>
        <p class="leading-relaxed text-zinc-500">
          大学や社会をより良くするソフトウェアを一緒に開発。Webアプリからモバイル、インフラまで幅広く挑戦しています。
        </p>
      </div>
    </div>
  </div>
</section>

<!-- Projects -->
<section class="bg-zinc-50 py-24">
  <div class="mx-auto max-w-6xl px-6">
    <div class="mb-8 flex items-end justify-between">
      <div>
        <div
          class="mb-3 font-[JetBrains_Mono,monospace] text-xs font-medium tracking-widest text-[#00D372] uppercase"
        >
          Projects
        </div>
        <h2 class="text-3xl font-bold">つくったもの</h2>
      </div>
      <a
        href="/projects"
        class="group hidden items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-900 sm:flex"
      >
        すべて見る
        <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </a>
    </div>
    <div class="grid gap-6 lg:grid-cols-3">
      {#if featuredProject}
        <a
          href="/projects/{featuredProject.slug}"
          class="group flex flex-col rounded-2xl bg-zinc-900 p-8 text-white transition-all hover:shadow-2xl lg:row-span-2"
        >
          <span
            class="inline-block self-start rounded-lg bg-[#00D372] px-3 py-1 font-[JetBrains_Mono,monospace] text-xs font-medium text-zinc-900"
          >
            Featured
          </span>
          {#if featuredProject.coverUrl}
            <img
              src={featuredProject.coverUrl}
              alt={featuredProject.name}
              class="mt-6 aspect-video w-full rounded-xl object-cover"
            />
          {/if}
          <div class="mt-auto pt-8">
            <h3 class="mb-2 text-xl font-semibold transition-colors group-hover:text-[#00D372]">
              {featuredProject.name}
            </h3>
            {#if featuredProject.description}
              <p class="mb-4 text-sm text-zinc-400">{featuredProject.description}</p>
            {/if}
            <div class="flex flex-wrap gap-2">
              <span
                class="rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1 font-[JetBrains_Mono,monospace] text-xs text-zinc-400"
              >
                {PROJECT_CATEGORIES[featuredProject.category]}
              </span>
            </div>
          </div>
        </a>
      {/if}
      {#each projects as project (project.id)}
        <a
          href="/projects/{project.slug}"
          class="group rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-[#00D372] hover:shadow-md"
        >
          {#if project.coverUrl}
            <img
              src={project.coverUrl}
              alt={project.name}
              class="mb-4 aspect-video w-full rounded-xl object-cover"
            />
          {/if}
          <h3 class="mb-2 font-semibold transition-colors group-hover:text-[#00D372]">
            {project.name}
          </h3>
          {#if project.description}
            <p class="mb-4 line-clamp-2 text-sm text-zinc-500">{project.description}</p>
          {/if}
          <div class="flex flex-wrap gap-2">
            <span
              class="rounded-lg bg-zinc-100 px-2 py-1 font-[JetBrains_Mono,monospace] text-xs text-zinc-600"
            >
              {PROJECT_CATEGORIES[project.category]}
            </span>
          </div>
        </a>
      {/each}
    </div>
    <a
      href="/projects"
      class="mt-8 flex items-center justify-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-900 sm:hidden"
    >
      すべて見る
      <ArrowRight class="h-4 w-4" />
    </a>
  </div>
</section>

<!-- Articles -->
<section class="py-24">
  <div class="mx-auto max-w-6xl px-6">
    <div class="mb-8 flex items-end justify-between">
      <div>
        <div
          class="mb-3 font-[JetBrains_Mono,monospace] text-xs font-medium tracking-widest text-[#00D372] uppercase"
        >
          News
        </div>
        <h2 class="text-3xl font-bold">最新情報</h2>
      </div>
      <a
        href="/articles"
        class="group hidden items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-900 sm:flex"
      >
        すべて見る
        <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </a>
    </div>
    {#if articles.length > 0}
      <div class="grid gap-6 md:grid-cols-3">
        {#each articles as article (article.id)}
          <a
            href="/articles/{article.slug}"
            class="group rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-[#00D372] hover:shadow-md"
          >
            {#if article.coverUrl}
              <img
                src={article.coverUrl}
                alt={article.title}
                class="mb-4 aspect-video w-full rounded-xl object-cover"
              />
            {/if}
            <h3 class="mb-2 font-semibold transition-colors group-hover:text-[#00D372]">
              {article.title}
            </h3>
            {#if article.excerpt}
              <p class="mb-4 line-clamp-2 text-sm text-zinc-500">{article.excerpt}</p>
            {/if}
            <div class="flex items-center gap-2 text-xs text-zinc-400">
              {#if article.author}
                <span>{article.author.name}</span>
                <span>·</span>
              {/if}
              {#if article.publishedAt}
                <time datetime={article.publishedAt.toISOString()}>
                  {article.publishedAt.toLocaleDateString("ja-JP")}
                </time>
              {/if}
            </div>
          </a>
        {/each}
      </div>
    {:else}
      <p class="text-zinc-500">まだ記事がありません。</p>
    {/if}
    <a
      href="/articles"
      class="mt-8 flex items-center justify-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-900 sm:hidden"
    >
      すべて見る
      <ArrowRight class="h-4 w-4" />
    </a>
  </div>
</section>

<!-- Join CTA -->
<section id="join" class="relative overflow-hidden bg-zinc-900 py-32 text-white">
  <!-- Background decoration -->
  <div
    class="pointer-events-none absolute inset-0 opacity-10"
    style="background-image: radial-gradient(circle at 20% 50%, #00D372 0%, transparent 50%), radial-gradient(circle at 80% 50%, #00D372 0%, transparent 50%);"
  ></div>

  <div class="relative z-10 mx-auto max-w-6xl px-6 text-center">
    <h2 class="mb-6 text-4xl font-bold md:text-5xl">
      <span class="inline-block border-b-4 border-[#00D372] pb-2">未来のソフトウェア</span>を<br
      />デザインしよう
    </h2>
    <p class="mx-auto mb-10 max-w-xl text-lg text-zinc-400">
      ut.code(); で一緒にワクワクするソフトウェアを作りませんか？
      初心者から実務経験者、学年を問わずどなたでも大歓迎です。
    </p>
    <a
      href="https://utcode.net/join/"
      target="_blank"
      rel="noopener noreferrer"
      class="group inline-flex items-center gap-2 rounded-lg bg-[#00D372] px-8 py-4 text-lg font-semibold text-zinc-900 shadow-lg shadow-[#00D372]/25 transition-all hover:bg-[#00C066] hover:shadow-xl"
    >
      JOIN US
      <ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
    </a>
  </div>
</section>

<!-- About -->
<section class="bg-zinc-50 py-24">
  <div class="mx-auto max-w-6xl px-6">
    <div class="mb-12 text-center">
      <div
        class="mb-3 font-[JetBrains_Mono,monospace] text-xs font-medium tracking-widest text-[#00D372] uppercase"
      >
        About us
      </div>
      <h2 class="text-3xl font-bold">団体概要</h2>
    </div>
    <div class="mx-auto max-w-3xl">
      <ul class="divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white">
        {#each [{ label: "団体名", value: "ut.code();" }, { label: "部員", value: `${stats.members}名程度` }, { label: "所属", value: `東京大学工学部丁友会 (${currentYear}年度)` }, { label: "部室", value: "駒場キャンパス学生会館 313B 教室" }, { label: "活動場所", value: "オンライン, 部室, 本郷図書館プロジェクトボックス等" }] as item (item.label)}
          <li class="flex px-6 py-4">
            <span class="w-28 shrink-0 font-medium text-zinc-700">{item.label}</span>
            <span class="text-zinc-600">{item.value}</span>
          </li>
        {/each}
        <li class="flex items-center px-6 py-4">
          <span class="w-28 shrink-0 font-medium text-zinc-700">SNS</span>
          <div class="flex gap-4">
            <a
              href="https://github.com/ut-code"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 text-zinc-600 transition-colors hover:text-zinc-900"
            >
              <Github class="h-5 w-5" />
              <span>ut-code</span>
            </a>
            <a
              href="https://twitter.com/utokyo_code"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 text-zinc-600 transition-colors hover:text-zinc-900"
            >
              <Twitter class="h-5 w-5" />
              <span>@utokyo_code</span>
            </a>
          </div>
        </li>
      </ul>
    </div>
  </div>
</section>
