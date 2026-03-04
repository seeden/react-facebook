import { test, expect, type Page } from '@playwright/test';
import { waitForFacebookSDK } from '../helpers/facebook-helpers';

/**
 * Locale change involves removing the FB SDK script, deleting window.FB,
 * and re-loading the SDK from the CDN with a new locale URL.  The Facebook
 * class's init() has a 10 s internal timeout, and the CDN round-trip can be
 * slow, so we use generous timeouts for assertions that depend on a locale
 * change completing.
 */
const LOCALE_CHANGE_TIMEOUT = 25_000;

async function getSDKScriptSrc(page: Page): Promise<string | null> {
  return page.evaluate(() => {
    const script = document.getElementById('facebook-jssdk') as HTMLScriptElement | null;
    return script?.src ?? null;
  });
}

async function getSDKScriptCount(page: Page): Promise<number> {
  return page.evaluate(() => document.querySelectorAll('#facebook-jssdk').length);
}

async function isFBDefined(page: Page): Promise<boolean> {
  return page.evaluate(() => typeof window.FB !== 'undefined');
}

test.describe('Locale Support', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/locale');
    await page.waitForSelector('[data-testid="locale-page"]');
    await waitForFacebookSDK(page);
  });

  test('should initialize with default locale en_US', async ({ page }) => {
    const currentLocale = page.locator('[data-testid="current-locale"]');
    await expect(currentLocale).toHaveText('en_US');

    const isChanging = page.locator('[data-testid="is-changing"]');
    await expect(isChanging).toHaveText('false');
  });

  test('should load SDK script with en_US locale URL on init', async ({ page }) => {
    const src = await getSDKScriptSrc(page);
    expect(src).toContain('/en_US/');
    expect(await getSDKScriptCount(page)).toBe(1);
  });

  test('should change locale to Spanish and reload SDK with es_ES URL', async ({ page }) => {
    test.setTimeout(60_000);

    const srcBefore = await getSDKScriptSrc(page);
    expect(srcBefore).toContain('/en_US/');

    await page.locator('[data-testid="change-to-spanish"]').click();

    const currentLocale = page.locator('[data-testid="current-locale"]');
    await expect(currentLocale).toHaveText('es_ES', { timeout: LOCALE_CHANGE_TIMEOUT });

    const isChanging = page.locator('[data-testid="is-changing"]');
    await expect(isChanging).toHaveText('false', { timeout: LOCALE_CHANGE_TIMEOUT });

    // Verify the actual SDK script was swapped to the new locale
    const srcAfter = await getSDKScriptSrc(page);
    expect(srcAfter).toContain('/es_ES/');
    expect(srcAfter).not.toContain('/en_US/');

    // Only one SDK script should exist
    expect(await getSDKScriptCount(page)).toBe(1);

    // FB should be re-initialized
    expect(await isFBDefined(page)).toBe(true);
  });

  test('should handle multiple sequential locale changes with correct SDK URLs', async ({ page }) => {
    test.setTimeout(120_000);

    const currentLocale = page.locator('[data-testid="current-locale"]');
    const isChanging = page.locator('[data-testid="is-changing"]');

    // en_US -> es_ES
    await page.locator('[data-testid="change-to-spanish"]').click();
    await expect(currentLocale).toHaveText('es_ES', { timeout: LOCALE_CHANGE_TIMEOUT });
    await expect(isChanging).toHaveText('false', { timeout: LOCALE_CHANGE_TIMEOUT });
    expect(await getSDKScriptSrc(page)).toContain('/es_ES/');

    // es_ES -> fr_FR
    await page.locator('[data-testid="change-to-french"]').click();
    await expect(currentLocale).toHaveText('fr_FR', { timeout: LOCALE_CHANGE_TIMEOUT });
    await expect(isChanging).toHaveText('false', { timeout: LOCALE_CHANGE_TIMEOUT });
    expect(await getSDKScriptSrc(page)).toContain('/fr_FR/');

    // fr_FR -> en_US
    await page.locator('[data-testid="change-to-english"]').click();
    await expect(currentLocale).toHaveText('en_US', { timeout: LOCALE_CHANGE_TIMEOUT });
    await expect(isChanging).toHaveText('false', { timeout: LOCALE_CHANGE_TIMEOUT });
    expect(await getSDKScriptSrc(page)).toContain('/en_US/');

    // After all changes, still exactly one script tag
    expect(await getSDKScriptCount(page)).toBe(1);
    expect(await isFBDefined(page)).toBe(true);
  });

  test('should disable buttons during locale change', async ({ page }) => {
    test.setTimeout(60_000);

    const spanishButton = page.locator('[data-testid="change-to-spanish"]');
    const frenchButton = page.locator('[data-testid="change-to-french"]');

    await expect(spanishButton).not.toBeDisabled();
    await expect(frenchButton).not.toBeDisabled();

    await spanishButton.click();

    const currentLocale = page.locator('[data-testid="current-locale"]');
    await expect(currentLocale).toHaveText('es_ES', { timeout: LOCALE_CHANGE_TIMEOUT });

    const isChanging = page.locator('[data-testid="is-changing"]');
    await expect(isChanging).toHaveText('false', { timeout: LOCALE_CHANGE_TIMEOUT });

    await expect(spanishButton).not.toBeDisabled();
    await expect(frenchButton).not.toBeDisabled();
  });

  test('should be a no-op when setting same locale', async ({ page }) => {
    const currentLocale = page.locator('[data-testid="current-locale"]');
    await expect(currentLocale).toHaveText('en_US');

    const srcBefore = await getSDKScriptSrc(page);

    await page.locator('[data-testid="change-to-english"]').click();

    const isChanging = page.locator('[data-testid="is-changing"]');
    await expect(isChanging).toHaveText('false');
    await expect(currentLocale).toHaveText('en_US');

    // Script should not have been touched
    const srcAfter = await getSDKScriptSrc(page);
    expect(srcAfter).toBe(srcBefore);
  });

  test('should provide locale through direct Facebook context', async ({ page }) => {
    test.setTimeout(60_000);

    const contextLocale = page.locator('[data-testid="context-locale"]');
    await expect(contextLocale).toHaveText('en_US');

    await page.locator('[data-testid="direct-change-locale"]').click();

    await expect(contextLocale).toHaveText('de_DE', { timeout: LOCALE_CHANGE_TIMEOUT });

    const currentLocale = page.locator('[data-testid="current-locale"]');
    await expect(currentLocale).toHaveText('de_DE', { timeout: LOCALE_CHANGE_TIMEOUT });

    // SDK script should reflect the new locale
    expect(await getSDKScriptSrc(page)).toContain('/de_DE/');
    expect(await getSDKScriptCount(page)).toBe(1);
  });
});
