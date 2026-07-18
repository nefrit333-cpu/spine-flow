import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://127.0.0.1:5173', browserName: 'chromium', ...devices['iPhone 13'] },
  webServer: { command: 'npm.cmd run dev -- --host 127.0.0.1 --port 5173', port: 5173, reuseExistingServer: true },
})
