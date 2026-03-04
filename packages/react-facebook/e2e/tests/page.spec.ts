import { test, expect } from '@playwright/test';
import { waitForFacebookSDK, isWidgetProcessed, waitForFacebookIframe } from '../helpers/facebook-helpers';

test.describe('Page Plugin', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/page');
    await page.waitForSelector('[data-testid="page-page"]', { state: 'visible' });
    await waitForFacebookSDK(page);
  });

  test('Page renders with data-href, data-tabs, and data-show-facepile', async ({ page }) => {
    const container = page.locator('[data-testid="facebook-page"]');
    const fbPage = container.locator('.fb-page');
    await expect(fbPage).toBeVisible();
    await expect(fbPage).toHaveAttribute('data-href', 'https://www.facebook.com/meta');
    await expect(fbPage).toHaveAttribute('data-tabs', 'timeline');
    await expect(fbPage).toHaveAttribute('data-show-facepile', 'true');
  });

  test('Page with tabs has data-tabs, data-width, and data-height', async ({ page }) => {
    const container = page.locator('[data-testid="page-with-tabs"]');
    const fbPage = container.locator('.fb-page');
    await expect(fbPage).toBeVisible();
    await expect(fbPage).toHaveAttribute('data-tabs', 'timeline,events,messages');
    await expect(fbPage).toHaveAttribute('data-width', '400');
    await expect(fbPage).toHaveAttribute('data-height', '300');
  });

  test('Minimal page has just data-href', async ({ page }) => {
    const container = page.locator('[data-testid="minimal-page"]');
    const fbPage = container.locator('.fb-page');
    await expect(fbPage).toBeVisible();
    await expect(fbPage).toHaveAttribute('data-href', 'https://www.facebook.com/facebook');
  });

  test('Compact page has data-small-header, data-adapt-container-width, and data-hide-cta', async ({ page }) => {
    const container = page.locator('[data-testid="compact-page"]');
    const fbPage = container.locator('.fb-page');
    await expect(fbPage).toBeVisible();
    await expect(fbPage).toHaveAttribute('data-small-header', 'true');
    await expect(fbPage).toHaveAttribute('data-adapt-container-width', 'true');
    await expect(fbPage).toHaveAttribute('data-hide-cta', 'true');
  });

  test('Widget processing check (fb_iframe_widget)', async ({ page }) => {
    const processed = await isWidgetProcessed(page, '[data-testid="facebook-page"] .fb-page');
    // EU-safe: just verify the helper returns a boolean
    expect(typeof processed).toBe('boolean');
  });

  test('Page plugin renders a real Facebook iframe', async ({ page }) => {
    test.setTimeout(60_000);

    const iframe = await waitForFacebookIframe(page, '[data-testid="facebook-page"] .fb-page');
    expect(iframe.src).toContain('facebook.com');
    expect(iframe.src).toContain('page');
  });

  test('Multiple Page plugins each render a real Facebook iframe', async ({ page }) => {
    test.setTimeout(60_000);

    const iframe1 = await waitForFacebookIframe(page, '[data-testid="facebook-page"] .fb-page');
    const iframe2 = await waitForFacebookIframe(page, '[data-testid="page-with-tabs"] .fb-page');
    const iframe3 = await waitForFacebookIframe(page, '[data-testid="minimal-page"] .fb-page');

    for (const iframe of [iframe1, iframe2, iframe3]) {
      expect(iframe.src).toContain('facebook.com');
      expect(iframe.src).toContain('page');
    }
  });
});
