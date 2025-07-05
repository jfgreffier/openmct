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
      testMatch: '**/*.e2e.spec.js', // only run e2e tests
      grepInvert: /@couchdb|@generatedata/,
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
