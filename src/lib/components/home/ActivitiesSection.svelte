<script lang="ts">
  import { Code, BookOpen, MessageSquare } from "lucide-svelte";
</script>

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
