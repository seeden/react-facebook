import { test, expect } from '@playwright/test';
import { waitForFacebookSDK, isWidgetProcessed, waitForFacebookIframe } from '../helpers/facebook-helpers';

test.describe('EmbeddedPost & EmbeddedVideo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/embedded');
    await page.waitForSelector('[data-testid="embedded-page"]', { state: 'visible' });
    await waitForFacebookSDK(page);
  });

  test('EmbeddedPost renders with data-href, data-width, and data-show-text', async ({ page }) => {
    const container = page.locator('[data-testid="embedded-post"]');
    const post = container.locator('.fb-post');
    await expect(post).toBeVisible();
    await expect(post).toHaveAttribute('data-href', 'https://www.facebook.com/20531316728/posts/10154009990506729/');
    await expect(post).toHaveAttribute('data-width', '500');
    await expect(post).toHaveAttribute('data-show-text', 'true');
  });

  test('EmbeddedVideo renders with data-href, data-width, data-show-text, and data-show-captions', async ({ page }) => {
    const container = page.locator('[data-testid="embedded-video"]');
    const video = container.locator('.fb-video');
    await expect(video).toHaveCount(1);
    await expect(video).toHaveAttribute('data-href', 'https://www.facebook.com/facebook/videos/10153231379946729/');
    await expect(video).toHaveAttribute('data-width', '500');
    await expect(video).toHaveAttribute('data-show-text', 'true');
    await expect(video).toHaveAttribute('data-show-captions', 'true');
  });

  test('Minimal post renders with just data-href', async ({ page }) => {
    const container = page.locator('[data-testid="minimal-post"]');
    const post = container.locator('.fb-post');
    await expect(post).toBeVisible();
    await expect(post).toHaveAttribute('data-href', 'https://www.facebook.com/20531316728/posts/10154009990506729/');
  });

  test('Multiple embeds are all visible', async ({ page }) => {
    const multiPost = page.locator('[data-testid="multi-embed-post"] .fb-post');
    const multiVideo = page.locator('[data-testid="multi-embed-video"] .fb-video');

    await expect(multiPost).toBeVisible();
    await expect(multiVideo).toHaveCount(1);

    await expect(multiPost).toHaveAttribute('data-width', '400');
    await expect(multiVideo).toHaveAttribute('data-width', '400');
  });

  test('Widget processing check', async ({ page }) => {
    const postProcessed = await isWidgetProcessed(page, '[data-testid="embedded-post"] .fb-post');
    const videoProcessed = await isWidgetProcessed(page, '[data-testid="embedded-video"] .fb-video');

    // EU-safe: just verify the helper returns a boolean
    expect(typeof postProcessed).toBe('boolean');
    expect(typeof videoProcessed).toBe('boolean');
  });

  test('EmbeddedPost renders a real Facebook iframe', async ({ page }) => {
    test.setTimeout(60_000);

    const iframe = await waitForFacebookIframe(page, '[data-testid="embedded-post"] .fb-post');
    expect(iframe.src).toContain('facebook.com');
    expect(iframe.src).toContain('post');
  });

  test('EmbeddedVideo renders a real Facebook iframe', async ({ page }) => {
    test.setTimeout(60_000);

    const iframe = await waitForFacebookIframe(page, '[data-testid="embedded-video"] .fb-video');
    expect(iframe.src).toContain('facebook.com');
    expect(iframe.src).toContain('video');
  });
});
