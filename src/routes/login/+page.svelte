<script lang="ts">
  import { authClient } from "$lib/client/auth";
  import { Github } from "lucide-svelte";

  function loginWithGitHub() {
    authClient.signIn.social({ provider: "github", callbackURL: "/admin" }).catch(console.error);
  }
</script>

<div class="flex min-h-screen items-center justify-center bg-zinc-50">
  <div class="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
    <div class="mb-6 text-center">
      <h1 class="font-[JetBrains_Mono,monospace] text-xl font-semibold">
        ut.code<span class="text-[#00D372]">();</span>
      </h1>
      <p class="mt-2 text-sm text-zinc-500">Sign in to access the admin panel</p>
    </div>

    <button onclick={loginWithGitHub} class="btn w-full gap-2 btn-neutral">
      <Github class="h-5 w-5" />
      Continue with GitHub
    </button>
  </div>
</div>
