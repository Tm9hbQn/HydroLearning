/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensures relative paths for assets, compatible with GitHub Pages subdirectories
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    // Exclude Playwright e2e specs — those run via `npx playwright test` only
    exclude: ['node_modules', 'e2e/**'],
  },
})
