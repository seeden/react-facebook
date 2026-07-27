import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import createFacebook, { ConfigAuthResponse, ScopeAuthResponse } from '../utils/Facebook';

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
      expect((window.FB as { init: unknown }).init).toHaveBeenCalledWith(expect.objectContaining({ appId: 'test123' }));
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

      expect(window.FB.init).toHaveBeenCalledWith(expect.objectContaining({ appId: 'test123' }));
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

  describe('login', () => {
    type MockFB = {
      init: ReturnType<typeof vi.fn>;
      XFBML: { parse: ReturnType<typeof vi.fn> };
      login: ReturnType<typeof vi.fn>;
      logout: ReturnType<typeof vi.fn>;
      getLoginStatus: ReturnType<typeof vi.fn>;
      Event: { subscribe: ReturnType<typeof vi.fn>; unsubscribe: ReturnType<typeof vi.fn> };
      api: ReturnType<typeof vi.fn>;
      ui: ReturnType<typeof vi.fn>;
    };

    function makeMockFB(loginMock = vi.fn()): MockFB {
      return {
        init: vi.fn(),
        XFBML: { parse: vi.fn() },
        login: loginMock,
        logout: vi.fn(),
        getLoginStatus: vi.fn(),
        Event: { subscribe: vi.fn(), unsubscribe: vi.fn() },
        api: vi.fn(),
        ui: vi.fn(),
      };
    }

    async function initWithMockedSDK(loginMock = vi.fn()) {
      const fb = createFacebook({ appId: 'test123', lazy: true });
      (window as { FB?: unknown }).FB = makeMockFB(loginMock);
      const p = fb.init();
      window.fbAsyncInit();
      await p;
      return fb;
    }

    /** Returns the options object passed as the second argument to FB.login(callback, options). */
    function captureLoginOptions(loginMock: ReturnType<typeof vi.fn>): Record<string, unknown> {
      return loginMock.mock.calls[0][1] as Record<string, unknown>;
    }

    function resolveLoginWith(loginMock: ReturnType<typeof vi.fn>, response: unknown) {
      loginMock.mockImplementation((callback: (r: unknown) => void) => callback(response));
    }

    const getConnectedScopeResponse = (overrides?: Partial<ScopeAuthResponse>) => ({
      status: 'connected',
      authResponse: { userID: 'user_1', accessToken: 'tok_abc', expiresIn: 3600, ...overrides },
    });

    const getConnectedConfigResponse = (overrides?: Partial<ConfigAuthResponse>) => ({
      status: 'connected',
      authResponse: { userID: null, code: 'auth_code_xyz', expiresIn: NaN, ...overrides },
    });

    const notAuthorizedResponse = { status: 'not_authorized' };

    // ── 1. Scope flow ──────────────────────────────────────────────────────

    describe('scope flow', () => {
      it('passes scope string to FB.login options', async () => {
        const loginMock = vi.fn();
        const fb = await initWithMockedSDK(loginMock);
        resolveLoginWith(loginMock, getConnectedScopeResponse());

        await fb.login({ scope: 'email,public_profile' });

        const opts = captureLoginOptions(loginMock);
        expect(opts.scope).toBe('email,public_profile');
      });

      it('does not set config_id, response_type, or override_default_response_type when only scope provided', async () => {
        const loginMock = vi.fn();
        const fb = await initWithMockedSDK(loginMock);
        resolveLoginWith(loginMock, getConnectedScopeResponse());

        await fb.login({ scope: 'email' });

        const opts = captureLoginOptions(loginMock);
        expect(opts.config_id).toBeUndefined();
        expect(opts.response_type).toBeUndefined();
        expect(opts.override_default_response_type).toBeUndefined();
      });

      it('returns connected response with accessToken', async () => {
        const loginMock = vi.fn();
        const fb = await initWithMockedSDK(loginMock);
        resolveLoginWith(
          loginMock,
          getConnectedScopeResponse({ accessToken: 'tok_123', userID: 'user_connected_123', expiresIn: 1500 }),
        );

        const response = await fb.login({ scope: 'email' });

        expect(response.status).toBe('connected');
        if (response.status === 'connected') {
          expect(response.authResponse.accessToken).toBe('tok_123');
          expect(response.authResponse.userID).toBe('user_connected_123');
        }
      });
    });

    // ── 2. Without scope ───────────────────────────────────────────────────

    describe('without scope', () => {
      it('calls FB.login with empty options when no scope is provided', async () => {
        const loginMock = vi.fn();
        const fb = await initWithMockedSDK(loginMock);
        resolveLoginWith(loginMock, getConnectedScopeResponse());

        await fb.login({});

        const opts = captureLoginOptions(loginMock);
        expect(opts.scope).toBeUndefined();
        expect(opts.config_id).toBeUndefined();
      });

      it('treats scope: undefined the same as omitting scope', async () => {
        const loginMock = vi.fn();
        const fb = await initWithMockedSDK(loginMock);
        resolveLoginWith(loginMock, getConnectedScopeResponse());

        await fb.login({ scope: undefined });

        const opts = captureLoginOptions(loginMock);
        expect(opts.scope).toBeUndefined();
      });
    });

    // ── 3. Config ID flow ──────────────────────────────────────────────────

    describe('configId flow', () => {
      it('sets config_id on FB.login options', async () => {
        const loginMock = vi.fn();
        const fb = await initWithMockedSDK(loginMock);
        resolveLoginWith(loginMock, getConnectedConfigResponse());

        await fb.login({ configId: 'cfg_abc123' });

        const opts = captureLoginOptions(loginMock);
        expect(opts.config_id).toBe('cfg_abc123');
      });

      it('sets response_type to "code"', async () => {
        const loginMock = vi.fn();
        const fb = await initWithMockedSDK(loginMock);
        resolveLoginWith(loginMock, getConnectedConfigResponse());

        await fb.login({ configId: 'cfg_abc123' });

        const opts = captureLoginOptions(loginMock);
        expect(opts.response_type).toBe('code');
      });

      it('sets override_default_response_type to true', async () => {
        const loginMock = vi.fn();
        const fb = await initWithMockedSDK(loginMock);
        resolveLoginWith(loginMock, getConnectedConfigResponse());

        await fb.login({ configId: 'cfg_abc123' });

        const opts = captureLoginOptions(loginMock);
        expect(opts.override_default_response_type).toBe(true);
      });

      it('does not set scope', async () => {
        const loginMock = vi.fn();
        const fb = await initWithMockedSDK(loginMock);
        resolveLoginWith(loginMock, getConnectedConfigResponse());

        await fb.login({ configId: 'cfg_abc123' });

        const opts = captureLoginOptions(loginMock);
        expect(opts.scope).toBeUndefined();
      });

      it('returns connected response with code and no accessToken', async () => {
        const loginMock = vi.fn();
        const fb = await initWithMockedSDK(loginMock);
        resolveLoginWith(loginMock, getConnectedConfigResponse({ code: 'config_auth_code_123' }));

        const response = await fb.login({ configId: 'cfg_abc123' });

        expect(response.status).toBe('connected');
        if (response.status === 'connected') {
          expect(response.authResponse.code).toBe('config_auth_code_123');
          expect(response.authResponse.accessToken).toBeUndefined();
          expect(response.authResponse.userID).toBeNull();
        }
      });
    });

    // ── 4. Additional option flags ─────────────────────────────────────────

    describe('additional option flags', () => {
      it('returnScopes: true adds return_scopes to FB.login options', async () => {
        const loginMock = vi.fn();
        const fb = await initWithMockedSDK(loginMock);
        resolveLoginWith(loginMock, getConnectedScopeResponse());

        await fb.login({ scope: 'email', returnScopes: true });

        const opts = captureLoginOptions(loginMock);
        expect(opts.return_scopes).toBe(true);
      });

      it('rerequest: true adds auth_type "rerequest"', async () => {
        const loginMock = vi.fn();
        const fb = await initWithMockedSDK(loginMock);
        resolveLoginWith(loginMock, getConnectedScopeResponse());

        await fb.login({ scope: 'email', rerequest: true });

        const opts = captureLoginOptions(loginMock);
        expect(opts.auth_type).toBe('rerequest');
      });

      it('reauthorize: true adds auth_type "reauthenticate"', async () => {
        const loginMock = vi.fn();
        const fb = await initWithMockedSDK(loginMock);
        resolveLoginWith(loginMock, getConnectedScopeResponse());

        await fb.login({ scope: 'email', reauthorize: true });

        const opts = captureLoginOptions(loginMock);
        expect(opts.auth_type).toBe('reauthenticate');
      });

      it('rerequest and reauthorize together produce auth_type "rerequest,reauthenticate"', async () => {
        const loginMock = vi.fn();
        const fb = await initWithMockedSDK(loginMock);
        resolveLoginWith(loginMock, getConnectedScopeResponse());

        await fb.login({ scope: 'email', rerequest: true, reauthorize: true });

        const opts = captureLoginOptions(loginMock);
        expect(opts.auth_type).toBe('rerequest,reauthenticate');
      });

      it('authType array is included in auth_type', async () => {
        const loginMock = vi.fn();
        const fb = await initWithMockedSDK(loginMock);
        resolveLoginWith(loginMock, getConnectedScopeResponse());

        await fb.login({ scope: 'email', authType: ['custom_type'] });

        const opts = captureLoginOptions(loginMock);
        expect(opts.auth_type).toBe('custom_type');
      });

      it('authType array is merged with rerequest boolean option', async () => {
        const loginMock = vi.fn();
        const fb = await initWithMockedSDK(loginMock);
        resolveLoginWith(loginMock, getConnectedScopeResponse());

        await fb.login({ scope: 'email', authType: ['custom_type'], rerequest: true, reauthorize: true });

        const opts = captureLoginOptions(loginMock);
        expect(opts.auth_type).toBe('custom_type,rerequest,reauthenticate');
      });

      it('no auth_type key when no rerequest/reauthorize/authType provided', async () => {
        const loginMock = vi.fn();
        const fb = await initWithMockedSDK(loginMock);
        resolveLoginWith(loginMock, getConnectedScopeResponse());

        await fb.login({ scope: 'email' });

        const opts = captureLoginOptions(loginMock);
        expect(opts.auth_type).toBeUndefined();
      });
    });

    // ── 5. Error cases ─────────────────────────────────────────────────────

    describe('error cases', () => {
      it('throws FBError when FB.login returns an error response', async () => {
        const loginMock = vi.fn();
        const fb = await initWithMockedSDK(loginMock);
        loginMock.mockImplementation((cb: (r: unknown) => void) =>
          cb({ error: { code: 190, type: 'OAuthException', message: 'Invalid token' } }),
        );

        await expect(fb.login({ scope: 'email' })).rejects.toMatchObject({
          code: 190,
          type: 'OAuthException',
          message: '[react-facebook] Invalid token (code: 190, type: OAuthException)',
        });
      });

      it('throws when FB.login callback receives undefined', async () => {
        const loginMock = vi.fn();
        const fb = await initWithMockedSDK(loginMock);
        loginMock.mockImplementation((cb: (r: unknown) => void) => cb(undefined));

        await expect(fb.login({ scope: 'email' })).rejects.toThrow('Response is undefined');
      });

      it('resolves with non-connected status without throwing', async () => {
        const loginMock = vi.fn();
        const fb = await initWithMockedSDK(loginMock);
        resolveLoginWith(loginMock, notAuthorizedResponse);

        const response = await fb.login({ scope: 'email' });

        expect(response.status).toBe('not_authorized');
      });
    });
  });
});
