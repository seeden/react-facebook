import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import createFacebook from '../utils/Facebook';

describe('Facebook', () => {
  beforeEach(() => {
    // Clean up any existing FB state
    delete (window as { FB?: unknown }).FB;
    delete (window as { fbAsyncInit?: unknown }).fbAsyncInit;
    const existingScript = document.getElementById('facebook-jssdk');
    if (existingScript) existingScript.remove();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('createFacebook', () => {
    it('throws when appId is missing', () => {
      expect(() => createFacebook({ appId: '' })).toThrow('[react-facebook] You need to set appId');
    });

    it('creates instance with valid appId', () => {
      const fb = createFacebook({ appId: 'test123', lazy: true });
      expect(fb.getAppId()).toBe('test123');
    });

    it('merges default options', () => {
      const fb = createFacebook({ appId: 'test123', lazy: true });
      expect(fb.options.version).toBe('v23.0');
      expect(fb.options.language).toBe('en_US');
      expect(fb.options.domain).toBe('connect.facebook.net');
    });
  });

  describe('SSR safety', () => {
    it('getFB returns undefined when window.FB is not set', () => {
      const fb = createFacebook({ appId: 'test123', lazy: true });
      expect(fb.getFB()).toBeUndefined();
    });

    it('getLocale returns default locale', () => {
      const fb = createFacebook({ appId: 'test123', lazy: true });
      expect(fb.getLocale()).toBe('en_US');
    });
  });

  describe('init', () => {
    it('creates script element on init', async () => {
      const fb = createFacebook({ appId: 'test123', lazy: true });

      // Start init but don't await (it will timeout)
      const initPromise = fb.init();

      // Verify script was created
      const script = document.getElementById('facebook-jssdk') as HTMLScriptElement;
      expect(script).not.toBeNull();
      expect(script.async).toBe(true);
      expect(script.defer).toBe(true);
      expect(script.src).toContain('connect.facebook.net/en_US/sdk.js');

      // Simulate FB loading
      (window as { FB?: unknown }).FB = {
        init: vi.fn(),
        XFBML: { parse: vi.fn() },
      };
      window.fbAsyncInit();

      await initPromise;
      expect((window.FB as { init: unknown }).init).toHaveBeenCalledWith(
        expect.objectContaining({ appId: 'test123' })
      );
    });

    it('returns cached promise on second init call', async () => {
      const fb = createFacebook({ appId: 'test123', lazy: true });

      // Simulate immediate FB availability
      (window as { FB?: unknown }).FB = {
        init: vi.fn(),
        XFBML: { parse: vi.fn() },
      };

      const promise1 = fb.init();

      // Trigger fbAsyncInit
      window.fbAsyncInit();

      await promise1;

      // Second call should use the same cached promise
      const promise2 = fb.init();
      const result = await promise2;
      expect(result).toBe(fb);
    });

    it('rejects on script load error', async () => {
      const fb = createFacebook({ appId: 'test123', lazy: true });

      const initPromise = fb.init();

      // Simulate script error
      const script = document.getElementById('facebook-jssdk') as HTMLScriptElement;
      script.onerror?.(new Event('error'));

      await expect(initPromise).rejects.toThrow('[react-facebook] Failed to load Facebook SDK');
    });

    it('allows retry after script load failure', async () => {
      const fb = createFacebook({ appId: 'test123', lazy: true });

      const initPromise = fb.init();
      const script = document.getElementById('facebook-jssdk') as HTMLScriptElement;
      script.onerror?.(new Event('error'));

      await expect(initPromise).rejects.toThrow();

      // loadingPromise should be reset, allowing retry
      expect(fb.loadingPromise).toBeUndefined();
    });
  });

  describe('changeLocale', () => {
    async function initFB() {
      const fb = createFacebook({ appId: 'test123', lazy: true });

      (window as { FB?: unknown }).FB = {
        init: vi.fn(),
        XFBML: { parse: vi.fn() },
      };

      const initPromise = fb.init();
      window.fbAsyncInit();
      await initPromise;

      return fb;
    }

    function simulateSDKLoad() {
      (window as { FB?: unknown }).FB = {
        init: vi.fn(),
        XFBML: { parse: vi.fn() },
      };
      window.fbAsyncInit();
    }

    it('removes old script from DOM before re-init', async () => {
      const fb = await initFB();

      const oldScript = document.getElementById('facebook-jssdk');
      expect(oldScript).not.toBeNull();

      const changePromise = fb.changeLocale('es_ES');

      // Old script should be gone before the new one is inserted
      const scriptsAfterRemove = document.querySelectorAll('#facebook-jssdk');
      // init() inserts a new one immediately, so there should be exactly 1 (the new one)
      expect(scriptsAfterRemove.length).toBe(1);
      expect(scriptsAfterRemove[0]).not.toBe(oldScript);

      simulateSDKLoad();
      await changePromise;
    });

    it('deletes window.FB before re-init', async () => {
      const fb = await initFB();
      expect(window.FB).toBeDefined();

      let fbDuringInit: unknown = 'not-checked';
      const originalAppendChild = document.body.appendChild.bind(document.body);
      vi.spyOn(document.body, 'appendChild').mockImplementation((node) => {
        // Capture FB state at the moment the new script is appended
        fbDuringInit = (window as { FB?: unknown }).FB;
        return originalAppendChild(node);
      });

      const changePromise = fb.changeLocale('fr_FR');
      simulateSDKLoad();
      await changePromise;

      expect(fbDuringInit).toBeUndefined();
    });

    it('resets loadingPromise so init creates a fresh SDK load', async () => {
      const fb = await initFB();
      expect(fb.loadingPromise).toBeDefined();

      const changePromise = fb.changeLocale('ja_JP');

      // After changeLocale starts, the old promise should be cleared
      // (the new init() sets a new one, but it's a different promise)
      simulateSDKLoad();
      await changePromise;

      expect(fb.loadingPromise).toBeDefined();
    });

    it('loads new script with correct locale in URL', async () => {
      const fb = await initFB();

      const oldScript = document.getElementById('facebook-jssdk') as HTMLScriptElement;
      expect(oldScript.src).toContain('/en_US/');

      const changePromise = fb.changeLocale('es_ES');

      const newScript = document.getElementById('facebook-jssdk') as HTMLScriptElement;
      expect(newScript.src).toContain('/es_ES/');
      expect(newScript.src).not.toContain('/en_US/');

      simulateSDKLoad();
      await changePromise;
    });

    it('updates language option', async () => {
      const fb = await initFB();

      const changePromise = fb.changeLocale('es_ES');
      simulateSDKLoad();
      await changePromise;

      expect(fb.options.language).toBe('es_ES');
      expect(fb.getLocale()).toBe('es_ES');
    });

    it('re-initializes FB.init with same appId after locale change', async () => {
      const fb = await initFB();

      const changePromise = fb.changeLocale('pt_BR');
      simulateSDKLoad();
      await changePromise;

      expect(window.FB.init).toHaveBeenCalledWith(
        expect.objectContaining({ appId: 'test123' }),
      );
    });

    it('calls XFBML.parse after locale change to re-render widgets', async () => {
      const fb = await initFB();

      const changePromise = fb.changeLocale('de_DE');
      simulateSDKLoad();
      await changePromise;

      expect(window.FB.XFBML.parse).toHaveBeenCalled();
    });

    it('handles sequential locale changes correctly', async () => {
      const fb = await initFB();

      // First change
      const change1 = fb.changeLocale('es_ES');
      simulateSDKLoad();
      await change1;

      expect(fb.getLocale()).toBe('es_ES');
      let script = document.getElementById('facebook-jssdk') as HTMLScriptElement;
      expect(script.src).toContain('/es_ES/');

      // Second change
      const change2 = fb.changeLocale('fr_FR');
      simulateSDKLoad();
      await change2;

      expect(fb.getLocale()).toBe('fr_FR');
      script = document.getElementById('facebook-jssdk') as HTMLScriptElement;
      expect(script.src).toContain('/fr_FR/');
    });
  });
});
