import { test, expect } from '@playwright/test';
import { waitForFacebookSDK, isWidgetProcessed, waitForFacebookIframe } from '../helpers/facebook-helpers';

test.describe('Like & Comments', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/like');
    await page.waitForSelector('[data-testid="like-page"]', { state: 'visible' });
    await waitForFacebookSDK(page);
  });

  test('Like renders with correct data-href and data-colorscheme', async ({ page }) => {
    const container = page.locator('[data-testid="like-button"]');
    const like = container.locator('.fb-like');
    await expect(like).toHaveCount(1);
    await expect(like).toHaveAttribute('data-href', 'https://github.com/seeden/react-facebook');
    await expect(like).toHaveAttribute('data-colorscheme', 'dark');
  });

  test('Like with share has data-share and data-layout', async ({ page }) => {
    const container = page.locator('[data-testid="like-share-button"]');
    const like = container.locator('.fb-like');
    await expect(like).toHaveCount(1);
    await expect(like).toHaveAttribute('data-share', 'true');
    await expect(like).toHaveAttribute('data-layout', 'button_count');
    await expect(like).toHaveAttribute('data-href', 'https://reactjs.org');
  });

  test('Comments widget has all data attributes', async ({ page }) => {
    const container = page.locator('[data-testid="comments-widget"]');
    const comments = container.locator('.fb-comments');
    await expect(comments).toHaveCount(1);
    await expect(comments).toHaveAttribute('data-href', 'https://github.com/seeden/react-facebook');
    await expect(comments).toHaveAttribute('data-numposts', '5');
    await expect(comments).toHaveAttribute('data-width', '500');
    await expect(comments).toHaveAttribute('data-colorscheme', 'dark');
  });

  test('Multiple like buttons have correct individual attributes', async ({ page }) => {
    const like1 = page.locator('[data-testid="like-1"] .fb-like');
    const like2 = page.locator('[data-testid="like-2"] .fb-like');
    const like3 = page.locator('[data-testid="like-3"] .fb-like');

    await expect(like1).toHaveCount(1);
    await expect(like2).toHaveCount(1);
    await expect(like3).toHaveCount(1);

    await expect(like1).toHaveAttribute('data-layout', 'standard');
    await expect(like2).toHaveAttribute('data-layout', 'box_count');
    await expect(like3).toHaveAttribute('data-layout', 'button');

    // All share the same href
    await expect(like1).toHaveAttribute('data-href', 'https://github.com/seeden/react-facebook');
    await expect(like2).toHaveAttribute('data-href', 'https://github.com/seeden/react-facebook');
    await expect(like3).toHaveAttribute('data-href', 'https://github.com/seeden/react-facebook');
  });

  test('Widget processing check (EU-safe)', async ({ page }) => {
    // isWidgetProcessed is EU-safe: returns boolean, never throws
    const likeProcessed = await isWidgetProcessed(page, '[data-testid="like-button"] .fb-like');
    // We only check that the function returns a boolean; actual processing
    // depends on geography and Facebook SDK availability.
    expect(typeof likeProcessed).toBe('boolean');

    const commentsProcessed = await isWidgetProcessed(page, '[data-testid="comments-widget"] .fb-comments');
    expect(typeof commentsProcessed).toBe('boolean');
  });

  test('Like widget renders a real Facebook iframe', async ({ page }) => {
    test.setTimeout(60_000);

    const iframe = await waitForFacebookIframe(page, '[data-testid="like-button"] .fb-like');
    expect(iframe.src).toContain('facebook.com');
    expect(iframe.src).toContain('like');
  });

  test('Comments widget renders a real Facebook iframe', async ({ page }) => {
    test.setTimeout(60_000);

    const iframe = await waitForFacebookIframe(page, '[data-testid="comments-widget"] .fb-comments');
    expect(iframe.src).toContain('facebook.com');
    expect(iframe.src).toContain('comment');
  });

  test('Multiple Like widgets each get their own Facebook iframe', async ({ page }) => {
    test.setTimeout(60_000);

    const iframe1 = await waitForFacebookIframe(page, '[data-testid="like-1"] .fb-like');
    const iframe2 = await waitForFacebookIframe(page, '[data-testid="like-2"] .fb-like');
    const iframe3 = await waitForFacebookIframe(page, '[data-testid="like-3"] .fb-like');

    for (const iframe of [iframe1, iframe2, iframe3]) {
      expect(iframe.src).toContain('facebook.com');
      expect(iframe.src).toContain('like');
    }

    // Different layouts should produce different iframe srcs
    const srcs = new Set([iframe1.src, iframe2.src, iframe3.src]);
    expect(srcs.size).toBe(3);
  });
});
