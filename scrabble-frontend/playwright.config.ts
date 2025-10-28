import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Directory where your tests are located
  testDir: './e2e',  // change this to wherever your spec files are

  // Pattern to match test files
  testMatch: '/*.spec.ts', // or '*.test.ts', etc.

  // Optional: run tests in parallel
  fullyParallel: true,

  // Base URL for your app
  use: {
    baseURL: 'http://localhost:3000',
    headless: true, // or false if you want to see the browser
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  // Timeout for each test
  timeout: 30_000,
});
