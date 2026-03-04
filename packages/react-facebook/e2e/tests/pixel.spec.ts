import { test, expect } from '@playwright/test';
import { stubFbq, getFbqCalls } from '../helpers/facebook-helpers';

test.describe('Facebook Pixel', () => {
  test('should initialize pixel with fbq init call', async ({ page }) => {
    await stubFbq(page);
    await page.goto('/#/pixel');
    await page.waitForSelector('[data-testid="pixel-page"]');

    // Wait for initialization to complete
    await page.waitForTimeout(500);

    const calls = await getFbqCalls(page);
    const initCall = calls.find(
      (call) => call[0] === 'init' && call[1] === 'test-pixel-id',
    );
    expect(initCall).toBeTruthy();
    expect(initCall![0]).toBe('init');
    expect(initCall![1]).toBe('test-pixel-id');
    expect(initCall![2]).toEqual({});
  });

  test('should track purchase event', async ({ page }) => {
    await stubFbq(page);
    await page.goto('/#/pixel');
    await page.waitForSelector('[data-testid="pixel-page"]');

    // Wait for initialization
    await page.waitForTimeout(500);

    await page.locator('[data-testid="track-purchase"]').click();

    const calls = await getFbqCalls(page);
    const purchaseCall = calls.find(
      (call) => call[0] === 'track' && call[1] === 'Purchase',
    );
    expect(purchaseCall).toBeTruthy();
    expect(purchaseCall![0]).toBe('track');
    expect(purchaseCall![1]).toBe('Purchase');
    expect(purchaseCall![2]).toEqual({ value: 29.99 });
  });

  test('should track custom event', async ({ page }) => {
    await stubFbq(page);
    await page.goto('/#/pixel');
    await page.waitForSelector('[data-testid="pixel-page"]');

    // Wait for initialization
    await page.waitForTimeout(500);

    await page.locator('[data-testid="track-custom"]').click();

    const calls = await getFbqCalls(page);
    const customCall = calls.find(
      (call) => call[0] === 'trackCustom' && call[1] === 'CustomEvent',
    );
    expect(customCall).toBeTruthy();
    expect(customCall![0]).toBe('trackCustom');
    expect(customCall![1]).toBe('CustomEvent');
    expect(customCall![2]).toEqual({ data: 'test' });
  });

  test('should track page view', async ({ page }) => {
    await stubFbq(page);
    await page.goto('/#/pixel');
    await page.waitForSelector('[data-testid="pixel-page"]');

    // Wait for initialization
    await page.waitForTimeout(500);

    await page.locator('[data-testid="page-view"]').click();

    const calls = await getFbqCalls(page);
    const pageViewCall = calls.find(
      (call) => call[0] === 'track' && call[1] === 'PageView',
    );
    expect(pageViewCall).toBeTruthy();
    expect(pageViewCall![0]).toBe('track');
    expect(pageViewCall![1]).toBe('PageView');
  });
});
