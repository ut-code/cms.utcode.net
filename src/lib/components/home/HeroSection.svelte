<script lang="ts">
  import { ArrowRight } from "lucide-svelte";

  type Props = {
    members: number;
    projects: number;
    years: number;
  };

  const { members, projects, years }: Props = $props();
</script>

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
              class="text-orange-400">{members}</span
            >,<br />  <span class="text-blue-400">projects</span>: <span class="text-orange-400"
              >{projects}</span
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
