import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import createFacebookPixel from '../utils/FacebookPixel';

describe('FacebookPixel', () => {
  beforeEach(() => {
    // Clean up any existing pixel state
    delete (window as { fbq?: unknown }).fbq;
    delete (window as { _fbq?: unknown })._fbq;

    // Remove any pixel script tags
    document.querySelectorAll('script[src*="fbevents.js"]').forEach((el) => el.remove());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('createFacebookPixel', () => {
    it('throws when pixelId is missing', () => {
      expect(() => createFacebookPixel({ pixelId: '' })).toThrow('You need to set pixelId');
    });

    it('creates instance with valid pixelId', () => {
      const pixel = createFacebookPixel({ pixelId: 'test-pixel' });

      expect(pixel).toBeDefined();
      expect(pixel.getOptions).toBeDefined();
    });

    it('reports not initialized before init is called', () => {
      const pixel = createFacebookPixel({ pixelId: 'test-pixel' });

      expect(pixel.isInitialized()).toBe(false);
    });

    it('merges default options', () => {
      const pixel = createFacebookPixel({ pixelId: 'test-pixel' });
      const options = pixel.getOptions();

      expect(options.pixelId).toBe('test-pixel');
      expect(options.autoConfig).toBe(true);
      expect(options.debug).toBe(false);
    });
  });

  describe('init', () => {
    it('creates a script element pointing to fbevents.js', () => {
      const pixel = createFacebookPixel({ pixelId: 'test-pixel' });

      pixel.init();

      const script = document.querySelector('script[src*="fbevents.js"]') as HTMLScriptElement;
      expect(script).not.toBeNull();
      expect(script.async).toBe(true);
      expect(script.src).toContain('https://connect.facebook.net/en_US/fbevents.js');
    });

    it('resolves after script loads and initializes fbq', async () => {
      const pixel = createFacebookPixel({ pixelId: 'test-pixel' });

      const initPromise = pixel.init();

      // Simulate script load: set up window.fbq before triggering onload
      const script = document.querySelector('script[src*="fbevents.js"]') as HTMLScriptElement;

      // Trigger onload which sets up fbq internally
      script.onload?.(new Event('load'));

      const result = await initPromise;
      expect(result).toBe(pixel);
      expect(pixel.isInitialized()).toBe(true);
    });

    it('calls fbq init with pixelId after script loads', async () => {
      const pixel = createFacebookPixel({ pixelId: 'test-pixel' });

      const initPromise = pixel.init();

      const script = document.querySelector('script[src*="fbevents.js"]') as HTMLScriptElement;

      // The onload handler creates fbq if it does not exist yet.
      // We pre-set window.fbq as a spy so we can track calls made after onload.
      const fbqSpy = vi.fn();
      (window as { fbq?: unknown }).fbq = fbqSpy;

      script.onload?.(new Event('load'));
      await initPromise;

      expect(fbqSpy).toHaveBeenCalledWith('init', 'test-pixel', expect.anything());
    });

    it('caches the init result so second call resolves to the same instance', async () => {
      // Pre-set fbq so loadPixelScript resolves immediately (fbq already loaded)
      (window as { fbq?: unknown }).fbq = vi.fn();

      const pixel = createFacebookPixel({ pixelId: 'test-pixel' });

      const result1 = await pixel.init();
      const result2 = await pixel.init();

      expect(result1).toBe(result2);
      expect(result1).toBe(pixel);
    });

    it('rejects on script load error', async () => {
      const pixel = createFacebookPixel({ pixelId: 'test-pixel' });

      const initPromise = pixel.init();

      const script = document.querySelector('script[src*="fbevents.js"]') as HTMLScriptElement;
      script.onerror?.(new Event('error'));

      await expect(initPromise).rejects.toThrow('Failed to load Facebook Pixel script');
    });

    it('allows retry after init failure by clearing loadingPromise', async () => {
      const pixel = createFacebookPixel({ pixelId: 'test-pixel' });

      const initPromise = pixel.init();

      const script = document.querySelector('script[src*="fbevents.js"]') as HTMLScriptElement;
      script.onerror?.(new Event('error'));

      await expect(initPromise).rejects.toThrow();

      // After failure, isInitialized should return false so a retry is possible
      expect(pixel.isInitialized()).toBe(false);
    });

    it('resolves immediately if fbq is already on window', async () => {
      (window as { fbq?: unknown }).fbq = vi.fn();

      const pixel = createFacebookPixel({ pixelId: 'test-pixel' });

      const result = await pixel.init();
      expect(result).toBe(pixel);
    });

    it('disables autoConfig when option is false', async () => {
      (window as { fbq?: unknown }).fbq = vi.fn();

      const pixel = createFacebookPixel({ pixelId: 'test-pixel', autoConfig: false });

      await pixel.init();

      expect(window.fbq).toHaveBeenCalledWith('set', 'autoConfig', false, 'test-pixel');
    });
  });

  describe('tracking methods', () => {
    let pixel: ReturnType<typeof createFacebookPixel>;
    let fbqSpy: ReturnType<typeof vi.fn>;

    beforeEach(async () => {
      // Pre-set fbq so init resolves immediately
      fbqSpy = vi.fn();
      (window as { fbq?: unknown }).fbq = fbqSpy;

      pixel = createFacebookPixel({ pixelId: 'test-pixel' });
      await pixel.init();

      // Clear init-related calls so we can assert only on tracking calls
      fbqSpy.mockClear();
    });

    it('pageView calls fbq with track PageView', async () => {
      await pixel.pageView();

      expect(fbqSpy).toHaveBeenCalledWith('track', 'PageView');
    });

    it('track calls fbq with event name and data', async () => {
      await pixel.track('Purchase', { value: 29.99, currency: 'USD' });

      expect(fbqSpy).toHaveBeenCalledWith('track', 'Purchase', { value: 29.99, currency: 'USD' });
    });

    it('track calls fbq with event name and no data', async () => {
      await pixel.track('ViewContent');

      expect(fbqSpy).toHaveBeenCalledWith('track', 'ViewContent', undefined);
    });

    it('trackCustom calls fbq with trackCustom action', async () => {
      await pixel.trackCustom('MyCustomEvent', { key: 'value' });

      expect(fbqSpy).toHaveBeenCalledWith('trackCustom', 'MyCustomEvent', { key: 'value' });
    });

    it('trackSingle calls fbq with trackSingle action', async () => {
      await pixel.trackSingle('other-pixel', 'Purchase', { value: 10 });

      expect(fbqSpy).toHaveBeenCalledWith('trackSingle', 'other-pixel', 'Purchase', { value: 10 });
    });

    it('trackSingleCustom calls fbq with trackSingleCustom action', async () => {
      await pixel.trackSingleCustom('other-pixel', 'MyEvent', { foo: 'bar' });

      expect(fbqSpy).toHaveBeenCalledWith('trackSingleCustom', 'other-pixel', 'MyEvent', { foo: 'bar' });
    });

    it('grantConsent calls fbq with consent grant', async () => {
      await pixel.grantConsent();

      expect(fbqSpy).toHaveBeenCalledWith('consent', 'grant');
    });

    it('revokeConsent calls fbq with consent revoke', async () => {
      await pixel.revokeConsent();

      expect(fbqSpy).toHaveBeenCalledWith('consent', 'revoke');
    });

    it('fbq passes arbitrary arguments to window.fbq', async () => {
      await pixel.fbq('track', 'Lead', { content_name: 'signup' });

      expect(fbqSpy).toHaveBeenCalledWith('track', 'Lead', { content_name: 'signup' });
    });
  });
});
