import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePlugin from 'zeus-plugin'
export default defineConfig({
  plugins: [
    vue(),
    vitePlugin({
      prefix: '',
      scope: '',
      swName: 'sw',
      cacheVersion: 12,
      swVersion: 17,
      appShellFiles: ["/source.webp"],
      patten: /image|png/
    }),
  ],
})
