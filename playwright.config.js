import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: process.env.CI
    ? [
        ['github'],
        ['list', { printSteps: true }],
        ['html', { open: 'never' }],
      ]
    : [
        ['list', { printSteps: true }],
        ['html', { open: 'never' }],
      ],

  use: {
    baseURL: 'https://opensource-demo.orangehrmlive.com',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.spec\.js/,
      use: {
        storageState: undefined,
      },
    },
    {
      name: 'tests',
      testIgnore: /auth\.setup\.spec\.js/,
      dependencies: ['setup'],
    },
  ],
});