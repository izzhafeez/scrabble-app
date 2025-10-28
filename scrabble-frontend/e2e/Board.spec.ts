import { test, expect } from '@playwright/test';

// test row functionality
test('moves to next square', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // square-0
  const square0 = page.locator('#square-0');
  await expect(square0).toBeVisible();

  const input0 = square0.locator('input');
  await input0.click();
  await input0.type('h');
  
  // square-1
  const square1 = page.locator('#square-1');
  const input1 = square1.locator('input');
  await expect(input1).toBeFocused();
});

test('moves to previous square on backspace', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // square-0
  const square0 = page.locator('#square-0');
  const input0 = square0.locator('input');
  await input0.click();
  await input0.type('h');

  // square-1
  const square1 = page.locator('#square-1');
  const input1 = square1.locator('input');
  await input1.type('e');

  // backspace on square-1
  await input1.press('Backspace');

  // should focus back to square-0
  await expect(input0).toBeFocused();
});

test('resets row on reset button click', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // square-0
  const square0 = page.locator('#square-0');
  const input0 = square0.locator('input');
  await input0.click();
  await input0.type('h');

  // square-1
  const square1 = page.locator('#square-1');
  const input1 = square1.locator('input');
  await input1.type('e');

  // click reset button
  const resetButton = page.locator('button', { hasText: 'Reset' });
  await resetButton.click();

  // squares should be empty
  await expect(input0).toHaveValue('');
  await expect(input1).toHaveValue('');

  // focus should be on square-0
  await expect(input0).toBeFocused();
});

test('invalid word with non-alphabetic characters', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // square-0
  const square0 = page.locator('#square-0');
  const input0 = square0.locator('input');
  await input0.click();
  await input0.type('h');

  // square-1
  const square1 = page.locator('#square-1');
  const input1 = square1.locator('input');
  await input1.type('3');

  // should show total score as Invalid
  const totalScore = page.locator('p', { hasText: 'Total Score:' });
  await expect(totalScore).toHaveText('Total Score: Invalid');
});