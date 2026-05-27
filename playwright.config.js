import { defineConfig } from '@playwright/test';

//config all project
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

  // config browser/page runtime
      use: {
    baseURL: 'https://opensource-demo.orangehrmlive.com',
    storageState: 'auth/user.json',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    //screenshot: 'on',
    //video: 'on',
    trace: 'on-first-retry',
  },
});