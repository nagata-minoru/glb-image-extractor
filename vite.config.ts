/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  plugins: [react()],
  base: '/glb-image-extractor/',
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  test: {
    projects: [{
      // GLB 処理をモックして、部品ごとの動きを jsdom で確かめる
      extends: true,
      test: {
        name: 'unit',
        environment: 'jsdom',
        include: ['src/**/*.test.{ts,tsx}'],
        exclude: ['src/**/*.browser.test.{ts,tsx}'],
      },
    }, {
      // 外部の GLTF ライブラリと canvas を本物の Chromium で動かす
      extends: true,
      test: {
        name: 'browser',
        include: ['src/**/*.browser.test.{ts,tsx}'],
        testTimeout: 30000,
        browser: {
          enabled: true,
          provider: playwright(),
          headless: true,
          instances: [{ browser: 'chromium' }],
        },
      },
    }],
  },
})
