import { test, expect } from '@playwright/test';

test('leaderboard displays empty', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // click the button to show leaderboard
  await page.click('text=View Top Scores');

  // check for leaderboard entries
  await expect(page.locator('text=No Entries Found.')).toBeVisible();
});
