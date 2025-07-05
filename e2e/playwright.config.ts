import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'html',
  use: {
    baseURL: 'https://jfgreffier.github.io/openmct/',
    trace: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      grepInvert: /@couchdb|@generatedata/,
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
