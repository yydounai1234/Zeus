import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { vitePlugin as zeus } from 'zeus-plugin'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), zeus({
    cacheVersion: 100
  })]
})
