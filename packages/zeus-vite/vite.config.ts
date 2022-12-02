import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePlugin from 'zeus-plugin'
export default defineConfig({
  plugins: [
    vue(),
    vitePlugin({
      cacheVersion: 1,
      swVersion: 1,
      appShellFiles: ["/source.webp"],
      patten: /image|png/
    }),
  ],
})
