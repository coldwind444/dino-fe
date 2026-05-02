import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    // {
    //   name: 'setup',
    //   testMatch: /.*\.setup\.ts/,
    //   use: { ...devices['Desktop Chrome'] },
    // },
    {
      name: 'auth',
      testMatch: /.*(login|register|reset-password|onboarding)\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
      //  dependencies: ['setup'],
      testIgnore: /.*(login|register|reset-password|onboarding)\.spec\.ts/,
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
      //  dependencies: ['setup'],
      testIgnore: /.*(login|register|reset-password|onboarding)\.spec\.ts/,
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
      //  dependencies: ['setup'],
      testIgnore: /.*(login|register|reset-password|onboarding)\.spec\.ts/,
    },
    {
      name: 'edge',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge',
      },
      //  dependencies: ['setup'],
      testIgnore: /.*(login|register|reset-password|onboarding)\.spec\.ts/,
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});