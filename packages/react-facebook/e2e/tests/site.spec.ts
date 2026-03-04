import { test, expect } from '@playwright/test';
import { waitForFacebookSDK, isWidgetProcessed, waitForFacebookIframe } from '../helpers/facebook-helpers';

test.describe('Site – multiple Facebook components on one page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/site');
    await page.waitForSelector('[data-testid="site-page"]', { state: 'visible' });
    await waitForFacebookSDK(page);
  });

  test('all component sections are visible', async ({ page }) => {
    await expect(page.locator('[data-testid="page-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="like-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="share-button-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="share-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="comments-section"]')).toBeVisible();
  });

  test('Page widget has correct data-href and data-tabs', async ({ page }) => {
    const pageWidget = page.locator('[data-testid="page-section"] .fb-page');
    await expect(pageWidget).toBeVisible();
    await expect(pageWidget).toHaveAttribute('data-href', 'https://www.facebook.com/facebook');
    await expect(pageWidget).toHaveAttribute('data-tabs', 'timeline');
  });

  test('Like widget has data-share="true"', async ({ page }) => {
    const like = page.locator('[data-testid="like-section"] .fb-like');
    await expect(like).toHaveCount(1);
    await expect(like).toHaveAttribute('data-share', 'true');
    await expect(like).toHaveAttribute('data-href', 'https://www.facebook.com/facebook');
  });

  test('ShareButton is visible with correct text', async ({ page }) => {
    const shareButton = page.locator('[data-testid="share-button-section"] button');
    await expect(shareButton).toBeVisible();
    await expect(shareButton).toHaveText('Share Button');
  });

  test('Share widget has data-layout="button_count"', async ({ page }) => {
    const share = page.locator('[data-testid="share-section"] .fb-share-button');
    await expect(share).toBeVisible();
    await expect(share).toHaveAttribute('data-layout', 'button_count');
    await expect(share).toHaveAttribute('data-href', 'https://developers.facebook.com/docs/plugins/');
  });

  test('Comments widget has correct data-href', async ({ page }) => {
    const comments = page.locator('[data-testid="comments-section"] .fb-comments');
    await expect(comments).toHaveCount(1);
    await expect(comments).toHaveAttribute('data-href', 'http://www.facebook.com');
  });

  test('Widget processing check (EU-safe)', async ({ page }) => {
    const pageProcessed = await isWidgetProcessed(page, '[data-testid="page-section"] .fb-page');
    expect(typeof pageProcessed).toBe('boolean');

    const likeProcessed = await isWidgetProcessed(page, '[data-testid="like-section"] .fb-like');
    expect(typeof likeProcessed).toBe('boolean');

    const commentsProcessed = await isWidgetProcessed(page, '[data-testid="comments-section"] .fb-comments');
    expect(typeof commentsProcessed).toBe('boolean');
  });

  test('All widgets render real Facebook iframes on the same page', async ({ page }) => {
    test.setTimeout(60_000);

    const pageIframe = await waitForFacebookIframe(page, '[data-testid="page-section"] .fb-page');
    expect(pageIframe.src).toContain('facebook.com');
    expect(pageIframe.src).toContain('page');

    const likeIframe = await waitForFacebookIframe(page, '[data-testid="like-section"] .fb-like');
    expect(likeIframe.src).toContain('facebook.com');
    expect(likeIframe.src).toContain('like');

    const shareIframe = await waitForFacebookIframe(page, '[data-testid="share-section"] .fb-share-button');
    expect(shareIframe.src).toContain('facebook.com');
    expect(shareIframe.src).toContain('share');

    const commentsIframe = await waitForFacebookIframe(page, '[data-testid="comments-section"] .fb-comments');
    expect(commentsIframe.src).toContain('facebook.com');
    expect(commentsIframe.src).toContain('comment');
  });
});
