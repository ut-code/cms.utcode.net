<script lang="ts">
  import { ArrowRight } from "lucide-svelte";
</script>

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
      ut.code(); で一緒にワクワクするソフトウェアを作りませんか?
      初心者から実務経験者、学年を問わずどなたでも大歓迎です。
    </p>
    <a
      href="/join"
      class="group inline-flex items-center gap-2 rounded-lg bg-[#00D372] px-8 py-4 text-lg font-semibold text-zinc-900 shadow-lg shadow-[#00D372]/25 transition-all hover:bg-[#00C066] hover:shadow-xl"
    >
      JOIN US
      <ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
    </a>
  </div>
</section>
