import { test, expect } from '@playwright/test';

test.describe('FacebookErrorBoundary', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/error-boundary');
    await page.waitForSelector('[data-testid="error-boundary-page"]', { state: 'visible' });
  });

  test('normal rendering – Like renders inside error boundary without fallback', async ({ page }) => {
    const section = page.locator('[data-testid="scenario-normal"]');
    await expect(section).toBeVisible();

    // The Like component should render its fb-like div, not the fallback
    const like = section.locator('.fb-like');
    await expect(like).toHaveCount(1);

    const fallback = section.locator('[data-testid="fallback-1"]');
    await expect(fallback).not.toBeVisible();
  });

  test('static fallback – when child throws, static fallback div appears', async ({ page }) => {
    const section = page.locator('[data-testid="scenario-static-fallback"]');
    await expect(section).toBeVisible();

    const fallback = section.locator('[data-testid="static-fallback"]');
    await expect(fallback).toBeVisible();
    await expect(fallback).toHaveText('Static fallback UI');

    // The child content should not be rendered
    const child = section.locator('[data-testid="child-content"]');
    await expect(child).not.toBeVisible();
  });

  test('function fallback – when child throws, function fallback renders with error message', async ({ page }) => {
    const section = page.locator('[data-testid="scenario-function-fallback"]');
    await expect(section).toBeVisible();

    // Initially the child renders successfully
    const child = section.locator('[data-testid="child-content"]');
    await expect(child).toBeVisible();
    await expect(child).toHaveText('Content rendered successfully');

    // Trigger an error
    await page.locator('[data-testid="trigger-error"]').click();

    // Function fallback should appear with the error message
    const fallback = section.locator('[data-testid="function-fallback"]');
    await expect(fallback).toBeVisible();

    const errorText = section.locator('[data-testid="error-text"]');
    await expect(errorText).toHaveText('Error: Component error');
  });

  test('onError callback – error message is captured', async ({ page }) => {
    const section = page.locator('[data-testid="scenario-function-fallback"]');

    // Initially no error message
    const errorMsg = page.locator('[data-testid="on-error-message"]');
    await expect(errorMsg).toHaveText('');

    // Trigger the error
    await page.locator('[data-testid="trigger-error"]').click();

    // onError callback should have captured the error message
    await expect(errorMsg).toHaveText('Component error');
  });

  test('reset – clicking reset button recovers from error and renders child again', async ({ page }) => {
    const section = page.locator('[data-testid="scenario-function-fallback"]');

    // Trigger the error first
    await page.locator('[data-testid="trigger-error"]').click();

    // Fallback should be visible
    const fallback = section.locator('[data-testid="function-fallback"]');
    await expect(fallback).toBeVisible();

    // Click reset
    await page.locator('[data-testid="reset-button"]').click();

    // Child should render again
    const child = section.locator('[data-testid="child-content"]');
    await expect(child).toBeVisible();
    await expect(child).toHaveText('Content rendered successfully');

    // Fallback should be gone
    await expect(fallback).not.toBeVisible();

    // Reset count should be incremented
    const resetCount = page.locator('[data-testid="reset-count"]');
    await expect(resetCount).toHaveText('1');
  });
});
