<svelte:head>
  <title>ut.code(); - 東京大学ソフトウェアエンジニアリングサークル</title>
  <meta property="og:title" content="ut.code(); - 東京大学ソフトウェアエンジニアリングサークル" />
</svelte:head>

<!-- Hero -->
<section class="flex min-h-screen items-center">
  <div class="mx-auto grid max-w-6xl items-center gap-16 px-6 lg:grid-cols-2">
    <div>
      <div
        class="mb-6 inline-block rounded-full bg-[#00D372]/10 px-3 py-1 font-[JetBrains_Mono,monospace] text-xs font-medium text-zinc-700"
      >
        Est. 2019 — UTokyo
      </div>
      <h1 class="mb-6 text-5xl leading-tight font-bold tracking-tight lg:text-6xl">
        ソフトウェアで、<br />
        <span class="text-[#00D372]">未来を書く。</span>
      </h1>
      <p class="mb-8 max-w-md text-lg leading-relaxed text-zinc-500">
        東京大学のソフトウェアエンジニアリングサークル。学生が実際にプロダクトを作り、世に届ける。
      </p>
      <div class="flex items-center gap-4">
        <a
          href="#join"
          class="rounded-lg bg-[#00D372] px-6 py-3 font-semibold text-zinc-900 transition-colors hover:bg-[#00C066]"
        >
          参加する
        </a>
        <a href="/projects" class="text-zinc-500 transition-colors hover:text-zinc-900">
          プロジェクトを見る →
        </a>
      </div>
    </div>
    <div class="flex justify-center lg:justify-end">
      <div class="w-full max-w-sm rounded-xl bg-zinc-900 p-6 shadow-2xl">
        <div class="mb-4 flex gap-2">
          <div class="h-3 w-3 rounded-full bg-red-500"></div>
          <div class="h-3 w-3 rounded-full bg-yellow-500"></div>
          <div class="h-3 w-3 rounded-full bg-green-500"></div>
        </div>
        <pre class="font-[JetBrains_Mono,monospace] text-sm leading-relaxed"><code
            class="text-zinc-400"
            ><span class="text-purple-400">const</span> <span class="text-[#00D372]">utcode</span
            > = {"{"}
  <span class="text-blue-400">members</span>: <span class="text-orange-400">50</span>,
  <span class="text-blue-400">projects</span>: <span class="text-orange-400">20</span>,
  <span class="text-blue-400">motto</span>: <span class="text-green-400">"Ship it"</span>
}</code
          ></pre>
      </div>
    </div>
  </div>
</section>

<!-- Stats -->
<section class="border-y border-zinc-200 py-16">
  <div class="mx-auto flex max-w-6xl justify-center gap-16 px-6 lg:gap-24">
    <div class="text-center">
      <div class="font-[JetBrains_Mono,monospace] text-4xl font-bold">50+</div>
      <div class="mt-1 text-sm tracking-wide text-zinc-500 uppercase">Members</div>
    </div>
    <div class="text-center">
      <div class="font-[JetBrains_Mono,monospace] text-4xl font-bold">20+</div>
      <div class="mt-1 text-sm tracking-wide text-zinc-500 uppercase">Projects</div>
    </div>
    <div class="text-center">
      <div class="font-[JetBrains_Mono,monospace] text-4xl font-bold">5</div>
      <div class="mt-1 text-sm tracking-wide text-zinc-500 uppercase">Years</div>
    </div>
  </div>
</section>

<!-- About -->
<section id="about" class="py-24">
  <div class="mx-auto grid max-w-6xl gap-16 px-6 lg:grid-cols-2">
    <div>
      <div
        class="mb-3 font-[JetBrains_Mono,monospace] text-xs font-medium tracking-widest text-[#00D372] uppercase"
      >
        What we do
      </div>
      <h2 class="mb-4 text-3xl font-bold">実践から学ぶ</h2>
      <p class="leading-relaxed text-zinc-500">
        ut.code();
        は「作って学ぶ」をモットーに、実際のプロダクト開発を通じてエンジニアリングを学ぶサークルです。週次の勉強会、ハッカソン、長期プロジェクトを通じて、実践的なスキルを身につけます。
      </p>
    </div>
    <div class="grid gap-4">
      <div
        class="rounded-xl border border-zinc-200 bg-zinc-50 p-6 transition-colors hover:border-[#00D372]"
      >
        <div class="mb-4 flex h-10 w-10 items-center justify-center text-[#00D372]">
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <polyline points="16,18 22,12 16,6" /><polyline points="8,6 2,12 8,18" />
          </svg>
        </div>
        <h3 class="mb-1 font-semibold">開発</h3>
        <p class="text-sm text-zinc-500">Webアプリ、モバイル、インフラまで幅広く</p>
      </div>
      <div
        class="rounded-xl border border-zinc-200 bg-zinc-50 p-6 transition-colors hover:border-[#00D372]"
      >
        <div class="mb-4 flex h-10 w-10 items-center justify-center text-[#00D372]">
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path
              d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
            />
          </svg>
        </div>
        <h3 class="mb-1 font-semibold">学習</h3>
        <p class="text-sm text-zinc-500">初心者歓迎。基礎から丁寧にサポート</p>
      </div>
      <div
        class="rounded-xl border border-zinc-200 bg-zinc-50 p-6 transition-colors hover:border-[#00D372]"
      >
        <div class="mb-4 flex h-10 w-10 items-center justify-center text-[#00D372]">
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle
              cx="9"
              cy="7"
              r="4"
            /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <h3 class="mb-1 font-semibold">交流</h3>
        <p class="text-sm text-zinc-500">企業連携、OB/OGとの繋がり</p>
      </div>
    </div>
  </div>
</section>

<!-- Projects -->
<section id="projects" class="bg-zinc-50 py-24">
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
      <a href="/projects" class="text-sm text-zinc-500 transition-colors hover:text-zinc-900">
        すべて見る →
      </a>
    </div>
    <div class="grid gap-6 lg:grid-cols-3">
      <div class="flex flex-col rounded-xl bg-zinc-900 p-8 text-white lg:row-span-2">
        <span
          class="inline-block self-start rounded bg-[#00D372] px-2 py-1 font-[JetBrains_Mono,monospace] text-xs font-medium text-zinc-900"
          >Featured</span
        >
        <div class="mt-auto pt-8">
          <h3 class="mb-2 text-xl font-semibold">CourseMate</h3>
          <p class="mb-4 text-sm text-zinc-400">
            東大生のための履修管理・時間割アプリ。シラバス検索から時間割作成まで。
          </p>
          <div class="flex flex-wrap gap-2">
            <span
              class="rounded bg-zinc-800 px-2 py-1 font-[JetBrains_Mono,monospace] text-xs text-zinc-400"
              >React</span
            >
            <span
              class="rounded bg-zinc-800 px-2 py-1 font-[JetBrains_Mono,monospace] text-xs text-zinc-400"
              >TypeScript</span
            >
            <span
              class="rounded bg-zinc-800 px-2 py-1 font-[JetBrains_Mono,monospace] text-xs text-zinc-400"
              >Supabase</span
            >
          </div>
        </div>
      </div>
      <div class="rounded-xl border border-zinc-200 bg-white p-6">
        <h3 class="mb-2 font-semibold">ut.code(); Learn</h3>
        <p class="mb-4 text-sm text-zinc-500">プログラミング学習教材</p>
        <div class="flex flex-wrap gap-2">
          <span
            class="rounded bg-zinc-100 px-2 py-1 font-[JetBrains_Mono,monospace] text-xs text-zinc-600"
            >Svelte</span
          >
          <span
            class="rounded bg-zinc-100 px-2 py-1 font-[JetBrains_Mono,monospace] text-xs text-zinc-600"
            >MDX</span
          >
        </div>
      </div>
      <div class="rounded-xl border border-zinc-200 bg-white p-6">
        <h3 class="mb-2 font-semibold">Meibo</h3>
        <p class="mb-4 text-sm text-zinc-500">サークル名簿管理</p>
        <div class="flex flex-wrap gap-2">
          <span
            class="rounded bg-zinc-100 px-2 py-1 font-[JetBrains_Mono,monospace] text-xs text-zinc-600"
            >Next.js</span
          >
          <span
            class="rounded bg-zinc-100 px-2 py-1 font-[JetBrains_Mono,monospace] text-xs text-zinc-600"
            >Prisma</span
          >
        </div>
      </div>
    </div>
  </div>
</section>

<!-- CTA -->
<section id="join" class="bg-[#00D372]/10 py-24">
  <div class="mx-auto max-w-6xl px-6 text-center">
    <h2 class="mb-4 text-4xl font-bold">一緒につくろう</h2>
    <p class="mb-8 text-zinc-500">経験不問。興味があれば誰でも。</p>
    <a
      href="https://utcode.net"
      class="inline-block rounded-lg bg-[#00D372] px-8 py-4 text-lg font-semibold text-zinc-900 transition-colors hover:bg-[#00C066]"
    >
      ut.code(); に参加
    </a>
  </div>
</section>
