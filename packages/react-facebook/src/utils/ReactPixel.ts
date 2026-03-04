import createFacebookPixel from './FacebookPixel';
import type { FacebookPixelInstance, PixelEventName, PixelEventData } from './FacebookPixel';

/**
 * Standalone Facebook Pixel API — no provider required.
 *
 * Drop-in replacement for `react-facebook-pixel`:
 *
 * @example
 * ```ts
 * import { ReactPixel } from 'react-facebook';
 *
 * ReactPixel.init('YOUR_PIXEL_ID');
 * ReactPixel.pageView();
 * ReactPixel.track('Purchase', { value: 29.99, currency: 'USD' });
 * ```
 */

let instance: FacebookPixelInstance | undefined;

function getInstance(): FacebookPixelInstance {
  if (!instance) {
    throw new Error('[react-facebook] ReactPixel.init() must be called before using any tracking methods.');
  }
  return instance;
}

const ReactPixel = {
  /**
   * Initialize Facebook Pixel.
   *
   * @param pixelId - Your Facebook Pixel ID
   * @param advancedMatching - Optional advanced matching parameters (e.g. `{ em: 'user@example.com' }`)
   * @param options - Optional configuration (`autoConfig`, `debug`)
   */
  init(
    pixelId: string,
    advancedMatching?: Record<string, unknown>,
    options?: { autoConfig?: boolean; debug?: boolean },
  ): Promise<void> {
    instance = createFacebookPixel({
      pixelId,
      advancedMatching,
      ...options,
    });
    return instance.init().then(() => undefined);
  },

  /** Track a page view event. */
  pageView(): Promise<void> {
    return getInstance().pageView();
  },

  /** Track a standard Facebook event. */
  track(eventName: PixelEventName | string, data?: PixelEventData): Promise<void> {
    return getInstance().track(eventName as PixelEventName, data);
  },

  /** Track a standard event for a specific pixel. */
  trackSingle(pixelId: string, eventName: PixelEventName | string, data?: PixelEventData): Promise<void> {
    return getInstance().trackSingle(pixelId, eventName as PixelEventName, data);
  },

  /** Track a custom event. */
  trackCustom(eventName: string, data?: PixelEventData): Promise<void> {
    return getInstance().trackCustom(eventName, data);
  },

  /** Track a custom event for a specific pixel. */
  trackSingleCustom(pixelId: string, eventName: string, data?: PixelEventData): Promise<void> {
    return getInstance().trackSingleCustom(pixelId, eventName, data);
  },

  /** Grant GDPR tracking consent. */
  grantConsent(): Promise<void> {
    return getInstance().grantConsent();
  },

  /** Revoke GDPR tracking consent. */
  revokeConsent(): Promise<void> {
    return getInstance().revokeConsent();
  },

  /** Direct access to fbq for advanced use cases. */
  fbq(...args: unknown[]): Promise<void> {
    return getInstance().fbq(...args);
  },
};

export default ReactPixel;
