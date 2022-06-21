// vite.config.js
import * as path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/sw.ts'),
      name: "ZeusSw",
      formats: ['iife']
    },
    outDir: path.resolve(__dirname, 'src/sw'),
    rollupOptions: {
      
    }
  }
})