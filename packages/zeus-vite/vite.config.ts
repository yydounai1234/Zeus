import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePlugin from 'zeus-plugin'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vitePlugin({
    cacheVersion: 100
  })]
})
