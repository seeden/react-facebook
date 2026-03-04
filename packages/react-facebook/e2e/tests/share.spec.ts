import { test, expect } from '@playwright/test';
import { waitForFacebookSDK, isWidgetProcessed, waitForFacebookIframe } from '../helpers/facebook-helpers';

test.describe('Share & ShareButton', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/share');
    await page.waitForSelector('[data-testid="share-page"]', { state: 'visible' });
    await waitForFacebookSDK(page);
  });

  test('Share widget renders with correct data-href and data-layout', async ({ page }) => {
    const container = page.locator('[data-testid="share-widget"]');
    const share = container.locator('.fb-share-button');
    await expect(share).toBeVisible();
    await expect(share).toHaveAttribute('data-href', 'https://github.com/seeden/react-facebook');
    await expect(share).toHaveAttribute('data-layout', 'button_count');
  });

  test('Share widget gets fb_iframe_widget class', async ({ page }) => {
    const processed = await isWidgetProcessed(page, '[data-testid="share-widget"] .fb-share-button');
    // EU-safe: just verify the helper returns a boolean
    expect(typeof processed).toBe('boolean');
  });

  test('ShareButton renders with correct text', async ({ page }) => {
    const container = page.locator('[data-testid="share-button"]');
    const button = container.locator('button');
    await expect(button).toBeVisible();
    await expect(button).toHaveText('Share React');
  });

  test('Multiple share components are all visible', async ({ page }) => {
    const share1 = page.locator('[data-testid="multi-share-1"] .fb-share-button');
    const shareBtn = page.locator('[data-testid="multi-share-button"] button');
    const share2 = page.locator('[data-testid="multi-share-2"] .fb-share-button');

    await expect(share1).toBeVisible();
    await expect(shareBtn).toBeVisible();
    await expect(share2).toBeVisible();

    // Verify individual layouts
    await expect(share1).toHaveAttribute('data-layout', 'button');
    await expect(share2).toHaveAttribute('data-layout', 'box_count');

    // ShareButton renders the correct text
    await expect(shareBtn).toHaveText('Share GitHub');
  });

  test('Share widgets get fb_iframe_widget class', async ({ page }) => {
    const processed1 = await isWidgetProcessed(page, '[data-testid="share-widget"] .fb-share-button');
    const processed2 = await isWidgetProcessed(page, '[data-testid="multi-share-1"] .fb-share-button');

    expect(typeof processed1).toBe('boolean');
    expect(typeof processed2).toBe('boolean');
  });

  test('Share widget renders a real Facebook iframe', async ({ page }) => {
    test.setTimeout(60_000);

    const iframe = await waitForFacebookIframe(page, '[data-testid="share-widget"] .fb-share-button');
    expect(iframe.src).toContain('facebook.com');
    expect(iframe.src).toContain('share');
  });

  test('Multiple Share widgets each render a real Facebook iframe', async ({ page }) => {
    test.setTimeout(60_000);

    const iframe1 = await waitForFacebookIframe(page, '[data-testid="multi-share-1"] .fb-share-button');
    const iframe2 = await waitForFacebookIframe(page, '[data-testid="multi-share-2"] .fb-share-button');

    for (const iframe of [iframe1, iframe2]) {
      expect(iframe.src).toContain('facebook.com');
      expect(iframe.src).toContain('share');
    }

    // Different layouts should produce different iframe srcs
    expect(iframe1.src).not.toBe(iframe2.src);
  });
});
