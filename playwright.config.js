// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright configuration.
 * - Single browser: Chromium only (per testing guidelines).
 * - E2E tests live in tests/e2e/.
 * - Uses Page Object Model pattern across all spec files.
 */
module.exports = defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.spec.js',

  /* Run tests in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: Boolean(process.env.CI),

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Reporter to use. */
  reporter: 'html',

  use: {
    /* Base URL of the running frontend */
    baseURL: process.env.FRONTEND_URL || 'http://localhost:3000',

    /* Collect trace when retrying the failed test. */
    trace: 'on-first-retry',
  },

  /* Use Chromium only — as per testing guidelines */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Start both servers before running E2E tests */
  webServer: [
    {
      command: 'cd packages/backend && npm start',
      url: `http://localhost:${process.env.PORT || 3030}`,
      reuseExistingServer: !process.env.CI,
      timeout: 30000,
    },
    {
      command: 'cd packages/frontend && npm start',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 60000,
    },
  ],
});
