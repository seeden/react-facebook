import { test, expect, type Page } from '@playwright/test';

async function waitForFacebookSDK(page: Page, timeout = 15_000) {
  await page.waitForFunction(
    () =>
      typeof window.FB !== 'undefined' &&
      typeof window.FB.init === 'function' &&
      typeof window.FB.XFBML !== 'undefined',
    { timeout },
  );
}

async function getSDKScriptSrc(page: Page): Promise<string | null> {
  return page.evaluate(() => {
    const script = document.getElementById('facebook-jssdk') as HTMLScriptElement | null;
    return script?.src ?? null;
  });
}

const LOCALE_CHANGE_TIMEOUT = 25_000;

test.describe('Playground Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/playground');
    await page.waitForSelector('[data-testid="playground-page"]', { state: 'visible' });
  });

  test('renders all 8 demo sections', async ({ page }) => {
    const sections = [
      'demo-like',
      'demo-share',
      'demo-comments',
      'demo-page',
      'demo-embedded-post',
      'demo-embedded-video',
      'demo-share-button',
      'demo-login',
    ];

    for (const id of sections) {
      await expect(page.locator(`[data-testid="${id}"]`)).toBeVisible();
    }
  });

  test('renders locale selector with default English', async ({ page }) => {
    const select = page.locator('[data-testid="locale-select"]');
    await expect(select).toBeVisible();
    await expect(select).toHaveValue('en_US');
  });

  test('renders login warning banner', async ({ page }) => {
    const banner = page.locator('[data-testid="login-banner"]');
    await expect(banner).toBeVisible();
    await expect(banner).toContainText('domain whitelisted');
  });

  test('renders back to docs link', async ({ page }) => {
    const link = page.locator('a[href="/docs"]');
    await expect(link).toBeVisible();
    await expect(link).toContainText('Back to docs');
  });
});

test.describe('Playground Controls', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/playground');
    await page.waitForSelector('[data-testid="playground-page"]', { state: 'visible' });
    await waitForFacebookSDK(page);
  });

  test('Like: layout control updates data-layout attribute', async ({ page }) => {
    const like = page.locator('[data-testid="demo-like"] .fb-like');
    await expect(like).toHaveAttribute('data-layout', 'standard');

    await page.locator('[data-testid="like-layout"]').selectOption('box_count');
    await expect(like).toHaveAttribute('data-layout', 'box_count');

    await page.locator('[data-testid="like-layout"]').selectOption('button');
    await expect(like).toHaveAttribute('data-layout', 'button');
  });

  test('Like: action control updates data-action attribute', async ({ page }) => {
    const like = page.locator('[data-testid="demo-like"] .fb-like');
    await expect(like).toHaveAttribute('data-action', 'like');

    await page.locator('[data-testid="like-action"]').selectOption('recommend');
    await expect(like).toHaveAttribute('data-action', 'recommend');
  });

  test('Like: share toggle updates data-share attribute', async ({ page }) => {
    const like = page.locator('[data-testid="demo-like"] .fb-like');
    await expect(like).toHaveAttribute('data-share', 'true');

    await page.locator('[data-testid="like-share"]').uncheck();
    await expect(like).toHaveAttribute('data-share', 'false');
  });

  test('Share: layout control updates data-layout attribute', async ({ page }) => {
    const share = page.locator('[data-testid="demo-share"] .fb-share-button');
    await expect(share).toHaveAttribute('data-layout', 'button_count');

    await page.locator('[data-testid="share-layout"]').selectOption('box_count');
    await expect(share).toHaveAttribute('data-layout', 'box_count');
  });

  test('Comments: colorScheme control updates data-colorscheme', async ({ page }) => {
    const comments = page.locator('[data-testid="demo-comments"] .fb-comments');
    await expect(comments).toHaveAttribute('data-colorscheme', 'light');

    await page.locator('[data-testid="comments-color-scheme"]').selectOption('dark');
    await expect(comments).toHaveAttribute('data-colorscheme', 'dark');
  });

  test('Comments: numPosts control updates data-numposts', async ({ page }) => {
    const comments = page.locator('[data-testid="demo-comments"] .fb-comments');
    await expect(comments).toHaveAttribute('data-numposts', '5');

    await page.locator('[data-testid="comments-num-posts"]').fill('3');
    await expect(comments).toHaveAttribute('data-numposts', '3');
  });

  test('Page: hideCover toggle updates data-hide-cover', async ({ page }) => {
    const pagePlugin = page.locator('[data-testid="demo-page"] .fb-page');
    await expect(pagePlugin).toHaveAttribute('data-hide-cover', 'false');

    await page.locator('[data-testid="page-hide-cover"]').check();
    await expect(pagePlugin).toHaveAttribute('data-hide-cover', 'true');
  });

  test('Page: smallHeader toggle updates data-small-header', async ({ page }) => {
    const pagePlugin = page.locator('[data-testid="demo-page"] .fb-page');
    await expect(pagePlugin).toHaveAttribute('data-small-header', 'false');

    await page.locator('[data-testid="page-small-header"]').check();
    await expect(pagePlugin).toHaveAttribute('data-small-header', 'true');
  });

  test('EmbeddedPost: showText toggle updates data-show-text', async ({ page }) => {
    const post = page.locator('[data-testid="demo-embedded-post"] .fb-post');
    await expect(post).toHaveAttribute('data-show-text', 'true');

    await page.locator('[data-testid="post-show-text"]').uncheck();
    await expect(post).toHaveAttribute('data-show-text', 'false');
  });

  test('EmbeddedVideo: autoPlay toggle updates data-autoplay', async ({ page }) => {
    const video = page.locator('[data-testid="demo-embedded-video"] .fb-video');
    await expect(video).toHaveAttribute('data-autoplay', 'false');

    await page.locator('[data-testid="video-auto-play"]').check();
    await expect(video).toHaveAttribute('data-autoplay', 'true');
  });

  test('Login: disabled toggle disables the button', async ({ page }) => {
    const loginButton = page.locator('[data-testid="demo-login"] button').first();
    await expect(loginButton).not.toBeDisabled();

    await page.locator('[data-testid="login-disabled"]').check();
    await expect(loginButton).toBeDisabled();
  });
});

test.describe('Playground Locale', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/playground');
    await page.waitForSelector('[data-testid="playground-page"]', { state: 'visible' });
    await waitForFacebookSDK(page);
  });

  test('SDK loads with en_US locale URL on init', async ({ page }) => {
    const src = await getSDKScriptSrc(page);
    expect(src).toContain('/en_US/');
  });

  test('changing locale reloads SDK with new locale URL', async ({ page }) => {
    test.setTimeout(60_000);

    const srcBefore = await getSDKScriptSrc(page);
    expect(srcBefore).toContain('/en_US/');

    await page.locator('[data-testid="locale-select"]').selectOption('es_ES');

    // Wait for SDK to reload with new locale and reinitialize
    await expect(async () => {
      const src = await getSDKScriptSrc(page);
      expect(src).toContain('/es_ES/');
      const fbDefined = await page.evaluate(() => typeof window.FB !== 'undefined');
      expect(fbDefined).toBe(true);
    }).toPass({ timeout: LOCALE_CHANGE_TIMEOUT });
  });
});
