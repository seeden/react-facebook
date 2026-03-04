import { test, expect } from '@playwright/test';
import { waitForFacebookSDK } from '../helpers/facebook-helpers';

const MOCK_USER = { id: '123', name: 'Test User' };

/**
 * Install a mock for window.FB.api using addInitScript.
 *
 * FB.api uses JSONP / iframe transport internally, so page.route() cannot
 * intercept it.  Instead we monkey-patch FB.api right after the real SDK
 * creates the FB object (via fbAsyncInit) so every subsequent call to
 * FB.api(path, method, params, cb) invokes the callback with the data
 * stored in window.__FB_API_MOCK.
 *
 * Call this BEFORE page.goto() so the init script runs before the app code.
 */
async function installFBApiMock(page: import('@playwright/test').Page, mockResponse: unknown) {
  await page.addInitScript((response) => {
    // Store the mock response so we can change it later via page.evaluate
    (window as any).__FB_API_MOCK = response;

    // Patch fbAsyncInit: wrap whatever the app sets so we can intercept FB.api
    // right after FB.init() is called.
    let _appInit: (() => void) | undefined;

    Object.defineProperty(window, 'fbAsyncInit', {
      configurable: true,
      get() {
        return _appInit;
      },
      set(fn: () => void) {
        _appInit = () => {
          // Let the real init run first so FB object is fully set up
          fn();

          // Now override FB.api
          if ((window as any).FB) {
            (window as any).FB.api = (
              _path: string,
              _method: string,
              _params: Record<string, any>,
              callback: (resp: any) => void,
            ) => {
              // FB.api callback signature: callback(response)
              const resp = (window as any).__FB_API_MOCK;
              // Use setTimeout to mimic async behavior
              setTimeout(() => callback(resp), 0);
            };
          }
        };
      },
    });
  }, mockResponse);
}

test.describe('useGraphAPI hook', () => {
  test.describe('manual fetch', () => {
    test.beforeEach(async ({ page }) => {
      await installFBApiMock(page, MOCK_USER);
      await page.goto('/#/graph-api');
      await page.waitForSelector('[data-testid="graph-api-page"]', { state: 'visible' });
      await waitForFacebookSDK(page);
    });

    test('clicking fetch button loads data from Graph API', async ({ page }) => {
      const demo = page.locator('[data-testid="graph-api-demo"]');

      // Manual demo should start idle with no data
      await expect(demo.locator('[data-testid="loading-state"]')).toHaveText('idle');
      await expect(demo.locator('[data-testid="data-state"]')).toHaveText('no-data');

      // Click the fetch button
      await demo.locator('[data-testid="fetch-button"]').click();

      // Wait for data to appear
      await expect(demo.locator('[data-testid="data-state"]')).not.toHaveText('no-data', {
        timeout: 10_000,
      });

      // Verify the mocked data is displayed
      const dataText = await demo.locator('[data-testid="data-state"]').textContent();
      const parsed = JSON.parse(dataText!);
      expect(parsed.id).toBe('123');
      expect(parsed.name).toBe('Test User');

      // Loading should be idle after fetch completes
      await expect(demo.locator('[data-testid="loading-state"]')).toHaveText('idle');

      // No error
      await expect(demo.locator('[data-testid="error-state"]')).toHaveText('no-error');
    });
  });

  test.describe('auto fetch', () => {
    test.beforeEach(async ({ page }) => {
      await installFBApiMock(page, MOCK_USER);
      await page.goto('/#/graph-api');
      await page.waitForSelector('[data-testid="graph-api-page"]', { state: 'visible' });
      await waitForFacebookSDK(page);
    });

    test('auto-fetch demo loads data on mount', async ({ page }) => {
      const demo = page.locator('[data-testid="auto-fetch-demo"]');

      // Wait for data to appear (auto-fetched on mount)
      await expect(demo.locator('[data-testid="auto-data"]')).not.toHaveText('no-data', {
        timeout: 10_000,
      });

      // Verify the mocked data
      const dataText = await demo.locator('[data-testid="auto-data"]').textContent();
      const parsed = JSON.parse(dataText!);
      expect(parsed.id).toBe('123');
      expect(parsed.name).toBe('Test User');

      // Loading should be idle
      await expect(demo.locator('[data-testid="auto-loading"]')).toHaveText('idle');

      // No error
      await expect(demo.locator('[data-testid="auto-error"]')).toHaveText('no-error');
    });
  });

  test.describe('error handling', () => {
    test.beforeEach(async ({ page }) => {
      // Mock an error response — FB.api returns {error: {...}} in the callback
      await installFBApiMock(page, {
        error: {
          message: 'Invalid OAuth access token.',
          type: 'OAuthException',
          code: 190,
        },
      });

      await page.goto('/#/graph-api');
      await page.waitForSelector('[data-testid="graph-api-page"]', { state: 'visible' });
      await waitForFacebookSDK(page);
    });

    test('error state is set when Graph API returns an error', async ({ page }) => {
      const demo = page.locator('[data-testid="graph-api-demo"]');

      // Trigger a fetch
      await demo.locator('[data-testid="fetch-button"]').click();

      // Wait for error to appear
      await expect(demo.locator('[data-testid="error-state"]')).not.toHaveText('no-error', {
        timeout: 10_000,
      });

      // Verify error message is displayed
      const errorText = await demo.locator('[data-testid="error-state"]').textContent();
      expect(errorText).toContain('Invalid OAuth access token.');

      // Loading should be idle after error
      await expect(demo.locator('[data-testid="loading-state"]')).toHaveText('idle');

      // Data should still be empty
      await expect(demo.locator('[data-testid="data-state"]')).toHaveText('no-data');
    });
  });

  test.describe('reset', () => {
    test.beforeEach(async ({ page }) => {
      await installFBApiMock(page, MOCK_USER);
      await page.goto('/#/graph-api');
      await page.waitForSelector('[data-testid="graph-api-page"]', { state: 'visible' });
      await waitForFacebookSDK(page);
    });

    test('clicking reset clears data after a successful fetch', async ({ page }) => {
      const demo = page.locator('[data-testid="graph-api-demo"]');

      // Fetch data first
      await demo.locator('[data-testid="fetch-button"]').click();

      // Wait for data to load
      await expect(demo.locator('[data-testid="data-state"]')).not.toHaveText('no-data', {
        timeout: 10_000,
      });

      // Now click reset
      await demo.locator('[data-testid="reset-button"]').click();

      // Data should be cleared
      await expect(demo.locator('[data-testid="data-state"]')).toHaveText('no-data');

      // Error should be cleared
      await expect(demo.locator('[data-testid="error-state"]')).toHaveText('no-error');

      // Loading should be idle
      await expect(demo.locator('[data-testid="loading-state"]')).toHaveText('idle');
    });
  });
});
