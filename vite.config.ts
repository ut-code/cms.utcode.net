import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  server: {
    fs: { allow: ["design"] },
    watch: {
      // Reduce file watch overhead
      ignored: ["!**/node_modules/**", "**/.git/**", "**/.devenv/**", "**/.ck/**"],
    },
  },
  optimizeDeps: {
    // Exclude large dependencies from pre-bundling
    exclude: ["sharp"],
  },
  ssr: {
    // Optimize SSR performance
    noExternal: [],
  },
});
