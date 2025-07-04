// playwright.config.js
// @ts-check

// eslint-disable-next-line no-unused-vars
import { devices } from '@playwright/test';
import { fileURLToPath } from 'url';
const MAX_FAILURES = 5;

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  retries: 2, //Retries 2 times for a total of 3 runs. When running sharded and with max-failures=5, this should ensure that flake is managed without failing the full suite
  testDir: 'tests',
  grepInvert: /@mobile/, //Ignore mobile tests
  testIgnore: '**/*.perf.spec.js', //Ignore performance tests and define in playwright-performance.config.js
  timeout: 60 * 1000,
  maxFailures: MAX_FAILURES, //Limits failures to 5 to reduce CI Waste
  use: {
    baseURL: 'https://jfgreffier.github.io/openmct/',
    headless: true,
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'off',
    // @ts-ignore - custom configuration option for nyc codecoverage output path
    coveragePath: fileURLToPath(new URL('../.nyc_output', import.meta.url))
  },
  projects: [
    {
      name: 'chrome',
      testMatch: '**/*.e2e.spec.js', // only run e2e tests
      grepInvert: /@couchdb|@generatedata/,
      use: {
        browserName: 'chromium'
      }
    }
  ],
  reporter: 'html'
};

export default config;
