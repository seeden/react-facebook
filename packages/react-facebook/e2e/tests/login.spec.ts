import { test, expect } from '@playwright/test';
import { waitForFacebookSDK } from '../helpers/facebook-helpers';

test.describe('Login Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/login');
    await page.waitForSelector('[data-testid="login-page"]');
    await waitForFacebookSDK(page);
  });

  test('should render default login button with text', async ({ page }) => {
    const button = page.locator('[data-testid="login-button"]');
    await expect(button).toBeVisible();
    await expect(button).toContainText('Login with Facebook');
    // Default element type is button
    const tagName = await button.evaluate((el) => el.tagName);
    expect(tagName).toBe('BUTTON');
  });

  test('should render custom children text', async ({ page }) => {
    const button = page.locator('[data-testid="custom-text-login"]');
    await expect(button).toBeVisible();
    await expect(button).toContainText('Custom Login Text');
  });

  test('should render with render props pattern', async ({ page }) => {
    const customRender = page.locator('[data-testid="custom-render"]');
    await expect(customRender).toBeVisible();
    await expect(customRender).toContainText('Click me to login');
  });

  test('should render as custom element type (DIV)', async ({ page }) => {
    const divLogin = page.locator('[data-testid="div-login"]');
    await expect(divLogin).toBeVisible();
    await expect(divLogin).toContainText('Custom Login Element');
    const tagName = await divLogin.evaluate((el) => el.tagName);
    expect(tagName).toBe('DIV');
  });

  test('should render disabled login button', async ({ page }) => {
    const disabledButton = page.locator('[data-testid="disabled-login"]');
    await expect(disabledButton).toBeVisible();
    await expect(disabledButton).toBeDisabled();
    await expect(disabledButton).toContainText('Loading...');
  });

  test('should apply custom styles', async ({ page }) => {
    const styledButton = page.locator('[data-testid="styled-login"]');
    await expect(styledButton).toBeVisible();

    const backgroundColor = await styledButton.evaluate(
      (el) => getComputedStyle(el).backgroundColor,
    );
    expect(backgroundColor).toBe('rgb(255, 0, 0)');

    const borderRadius = await styledButton.evaluate(
      (el) => getComputedStyle(el).borderRadius,
    );
    expect(borderRadius).toBe('10px');
  });

  test('should render multiple login buttons with correct text', async ({ page }) => {
    const emailLogin = page.locator('[data-testid="email-login"]');
    const extendedLogin = page.locator('[data-testid="extended-login"]');
    const rerequestLogin = page.locator('[data-testid="rerequest-login"]');

    await expect(emailLogin).toBeVisible();
    await expect(extendedLogin).toBeVisible();
    await expect(rerequestLogin).toBeVisible();

    await expect(emailLogin).toContainText('Login for Email');
    await expect(extendedLogin).toContainText('Extended Permissions');
    await expect(rerequestLogin).toContainText('Re-request Permissions');
  });

  test('should be clickable (triggers login flow)', async ({ page }) => {
    const button = page.locator('[data-testid="login-button"]');
    await expect(button).toBeVisible();
    await expect(button).not.toBeDisabled();

    // Clicking the login button opens a Facebook popup.
    // We just verify the button is interactive; we do not follow through
    // with the popup since we cannot authenticate in E2E tests.
    const popupPromise = page.waitForEvent('popup', { timeout: 3000 }).catch(() => null);
    await button.click();
    const popup = await popupPromise;

    // The popup may or may not open depending on browser popup-blocker settings.
    // Either way, the click should not throw and the button should remain visible.
    if (popup) {
      await popup.close();
    }
    await expect(button).toBeVisible();
  });
});
