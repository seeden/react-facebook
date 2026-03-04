import { Page, expect } from '@playwright/test';

/** Wait for the Facebook SDK to be loaded and initialized */
export async function waitForFacebookSDK(page: Page, timeout = 15_000) {
  await page.waitForFunction(
    () =>
      (window as any).FB &&
      typeof (window as any).FB.init === 'function' &&
      typeof (window as any).FB.XFBML === 'object',
    { timeout },
  );
}

/** Wait for a Facebook widget to be processed by the SDK (gets fb_iframe_widget class) */
export async function waitForFacebookWidget(page: Page, selector: string, timeout = 15_000) {
  await page.waitForSelector(selector, { state: 'visible', timeout });
  await page.waitForFunction(
    (sel: string) => {
      const el = document.querySelector(sel);
      return el && el.classList.contains('fb_iframe_widget');
    },
    selector,
    { timeout },
  );
}

/** Check if a widget was processed by the SDK (EU-safe: returns boolean, never throws) */
export async function isWidgetProcessed(page: Page, selector: string): Promise<boolean> {
  return page.evaluate((sel: string) => {
    const el = document.querySelector(sel);
    return el ? el.classList.contains('fb_iframe_widget') : false;
  }, selector);
}

type FacebookIframeInfo = {
  src: string;
  title: string;
  attrWidth: string;
  attrHeight: string;
};

/**
 * Wait for Facebook to inject a real iframe inside a widget container.
 * Proves the SDK loaded, processed the XFBML element, and created an iframe
 * pointing to Facebook's plugin endpoint. This goes beyond checking our own
 * React state or data attributes.
 *
 * Dimension rendering depends on Facebook's domain verification for the app ID,
 * so we check the iframe's attribute dimensions (set by the SDK) rather than
 * the rendered bounding rect (which may be 0 on localhost).
 */
export async function waitForFacebookIframe(
  page: Page,
  containerSelector: string,
  timeout = 20_000,
): Promise<FacebookIframeInfo> {
  const handle = await page.waitForFunction(
    (sel: string) => {
      const iframe = document.querySelector(`${sel} iframe`) as HTMLIFrameElement | null;
      if (!iframe?.src?.includes('facebook.com')) return null;
      return {
        src: iframe.src,
        title: iframe.title || '',
        attrWidth: iframe.getAttribute('width') || iframe.style.width || '',
        attrHeight: iframe.getAttribute('height') || iframe.style.height || '',
      };
    },
    containerSelector,
    { timeout },
  );

  return handle.jsonValue() as Promise<FacebookIframeInfo>;
}

/** Inject a recording fbq stub before any page scripts run. Call BEFORE page.goto(). */
export async function stubFbq(page: Page) {
  await page.addInitScript(() => {
    const calls: any[][] = [];
    (window as any).__fbq_calls = calls;
    (window as any).fbq = function (...args: any[]) {
      calls.push(args);
    };
    (window as any)._fbq = (window as any).fbq;
  });
}

/** Read back recorded fbq calls */
export async function getFbqCalls(page: Page): Promise<any[][]> {
  return page.evaluate(() => (window as any).__fbq_calls || []);
}
