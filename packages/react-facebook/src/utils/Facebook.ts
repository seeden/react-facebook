import LoginStatus from '../constants/LoginStatus';
import FBError from '../errors/FBError';

export type AuthResponse = {
  userID: string;
  accessToken: string;
};

export type LoginResponse =
  | {
      status: LoginStatus.CONNECTED;
      authResponse: AuthResponse;
    }
  | {
      status: Exclude<LoginStatus, LoginStatus.CONNECTED>;
    };

export type LoginOptions = {
  scope?: string;
  returnScopes?: boolean;
  authType?: string[];
  rerequest?: boolean;
  reauthorize?: boolean;
};

type FBErrorResponse = {
  error: {
    code: number;
    type: string;
    message: string;
  };
};

type FBSDK = {
  init: (options: {
    appId: string;
    version?: string;
    cookie?: boolean;
    status?: boolean;
    xfbml?: boolean;
    frictionlessRequests?: boolean;
  }) => void;
  api: (path: string, method: string, params: Record<string, unknown>, callback: (response: unknown) => void) => void;
  ui: (options: Record<string, unknown>, callback: (response: unknown) => void) => void;
  login: (callback: (response: unknown) => void, options: Record<string, unknown>) => void;
  logout: (callback: (response: unknown) => void) => void;
  getLoginStatus: (callback: (response: unknown) => void) => void;
  Event: {
    subscribe: (event: string, callback: (...args: unknown[]) => void) => void;
    unsubscribe: (event: string, callback: (...args: unknown[]) => void) => void;
  };
  XFBML: {
    parse: (element?: HTMLElement) => void;
  };
};

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: FBSDK;
  }
}

export enum Method {
  GET = 'get',
  POST = 'post',
  DELETE = 'delete',
}

export type FacebookOptions = {
  domain?: string;
  version?: string;
  cookie?: boolean;
  status?: boolean;
  xfbml?: boolean;
  language?: string;
  frictionlessRequests?: boolean;
  debug?: boolean;
  chatSupport?: boolean;
  appId: string;
  autoLogAppEvents?: boolean;
  lazy?: boolean;
};

const defaultOptions: Omit<FacebookOptions, 'appId'> = {
  domain: 'connect.facebook.net',
  version: 'v23.0',
  cookie: false,
  status: false,
  xfbml: false,
  language: 'en_US',
  frictionlessRequests: false,
  debug: false,
  chatSupport: false,
  autoLogAppEvents: true,
  lazy: false,
};

function isFBError(response: unknown): response is FBErrorResponse {
  return typeof response === 'object' && response !== null && 'error' in response;
}

export type FacebookInstance = {
  getAppId: () => string;
  getFB: () => FBSDK | undefined;
  init: () => Promise<FacebookInstance>;
  ui: (options: Record<string, unknown>) => Promise<unknown>;
  api: <T>(path: string, method?: Method, params?: Record<string, unknown>) => Promise<T>;
  login: (options: LoginOptions) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  getLoginStatus: () => Promise<LoginResponse>;
  getTokenDetail: (loginResponse?: LoginResponse) => Promise<AuthResponse>;
  getProfile: (params: { fields: string }) => Promise<unknown>;
  getPermissions: () => Promise<{ permission: string; status: 'granted' }[]>;
  hasPermissions: (permissions: string[]) => Promise<boolean>;
  subscribe: <T>(eventName: string, callback: (value: T) => void) => Promise<() => Promise<void>>;
  unsubscribe: <T>(eventName: string, callback: (value: T) => void) => Promise<void>;
  parse: (parentNode?: HTMLElement) => Promise<void>;
  getLocale: () => string;
  changeLocale: (newLocale: string) => Promise<void>;
  options: FacebookOptions;
  loadingPromise: Promise<FacebookInstance> | undefined;
};

export default function createFacebook(options: FacebookOptions): FacebookInstance {
  if (!options.appId) {
    throw new Error('[react-facebook] You need to set appId');
  }

  const opts: FacebookOptions = {
    ...defaultOptions,
    ...options,
  };

  let loadingPromise: Promise<FacebookInstance> | undefined;

  function getAppId() {
    return opts.appId;
  }

  function getFB(): FBSDK | undefined {
    if (typeof window === 'undefined') return undefined;
    return window.FB;
  }

  async function init(): Promise<FacebookInstance> {
    if (typeof window === 'undefined') {
      return instance;
    }

    if (loadingPromise) {
      return loadingPromise;
    }

    loadingPromise = new Promise<FacebookInstance>((resolve, reject) => {
      const { domain, language, debug, chatSupport, ...restOptions } = opts;

      const initParams = {
        appId: restOptions.appId,
        version: restOptions.version,
        cookie: restOptions.cookie,
        status: restOptions.status,
        xfbml: restOptions.xfbml,
        frictionlessRequests: restOptions.frictionlessRequests,
      };

      let poll: ReturnType<typeof setInterval> | undefined;

      const timeout = setTimeout(() => {
        if (poll) clearInterval(poll);
        loadingPromise = undefined;
        instance.loadingPromise = undefined;
        reject(
          new Error(
            '[react-facebook] Facebook SDK loading timed out after 10 seconds. ' +
              'This may be caused by an ad blocker or network issue.',
          ),
        );
      }, 10000);

      function onSDKReady() {
        if (poll) clearInterval(poll);
        clearTimeout(timeout);
        window.FB.init(initParams);
        resolve(instance);
      }

      window.fbAsyncInit = onSDKReady;

      if (window.document.getElementById('facebook-jssdk')) {
        if (window.FB) {
          clearTimeout(timeout);
          return resolve(instance);
        }
        // Script exists but FB not yet loaded. Keep timeout active and
        // poll as a fallback in case fbAsyncInit already fired before
        // we set our handler (SSR hydration, multiple providers, static script tag).
        poll = setInterval(() => {
          if (window.FB) onSDKReady();
        }, 50);
        return;
      }

      const js = window.document.createElement('script');
      js.id = 'facebook-jssdk';
      js.async = true;
      js.defer = true;
      js.crossOrigin = 'anonymous';
      js.src = `https://${domain}/${language}/sdk${chatSupport ? '/xfbml.customerchat' : ''}${debug ? '/debug' : ''}.js`;

      js.onerror = () => {
        clearTimeout(timeout);
        loadingPromise = undefined;
        instance.loadingPromise = undefined;
        reject(
          new Error(
            `[react-facebook] Failed to load Facebook SDK from ${js.src}. ` +
              'This may be caused by an ad blocker or network issue.',
          ),
        );
      };

      window.document.body.appendChild(js);
    });

    instance.loadingPromise = loadingPromise;
    return loadingPromise;
  }

  async function call<T>(invoke: (fb: FBSDK, callback: (response: unknown) => void) => void): Promise<T> {
    await init();

    const fb = getFB();
    if (!fb) throw new Error('[react-facebook] Facebook SDK not available');

    return new Promise((resolve, reject) => {
      const callback = (response: unknown) => {
        if (!response) {
          reject(new Error('Response is undefined'));
        } else if (isFBError(response)) {
          const { code, type, message } = response.error;
          reject(new FBError(message, code, type));
        } else {
          resolve(response as T);
        }
      };

      invoke(fb, callback);
    });
  }

  async function ui(options: Record<string, unknown>) {
    await init();

    const fb = getFB();
    if (!fb) throw new Error('[react-facebook] Facebook SDK not available');

    return new Promise((resolve, reject) => {
      fb.ui(options, (response: unknown) => {
        if (!response) {
          resolve(undefined);
          return;
        }
        if (isFBError(response)) {
          const { code, type, message } = response.error;
          reject(new FBError(message, code, type));
          return;
        }
        resolve(response);
      });
    });
  }

  async function api<T>(path: string, method = Method.GET, params: Record<string, unknown> = {}) {
    return call<T>((fb, cb) => fb.api(path, method, params, cb));
  }

  async function login(loginOpts: LoginOptions) {
    const { scope, returnScopes, rerequest, reauthorize } = loginOpts;
    const types = [...(loginOpts.authType ?? [])];
    const fbLoginOptions: Record<string, unknown> = { scope };

    if (returnScopes) {
      fbLoginOptions.return_scopes = true;
    }

    if (rerequest) {
      types.push('rerequest');
    }

    if (reauthorize) {
      types.push('reauthenticate');
    }

    if (types.length) {
      fbLoginOptions.auth_type = types.join(',');
    }

    return call<LoginResponse>((fb, cb) => fb.login(cb, fbLoginOptions));
  }

  async function logout() {
    return call<void>((fb, cb) => fb.logout(cb));
  }

  async function getLoginStatus(): Promise<LoginResponse> {
    return call<LoginResponse>((fb, cb) => fb.getLoginStatus(cb));
  }

  async function getTokenDetail(loginResponse?: LoginResponse): Promise<AuthResponse> {
    if (loginResponse?.status === LoginStatus.CONNECTED) {
      return loginResponse.authResponse;
    }

    const response = await getLoginStatus();

    if (response.status === LoginStatus.CONNECTED) {
      return response.authResponse;
    }

    throw new Error('Token is undefined');
  }

  async function getProfile(params: { fields: string }) {
    return api('/me', Method.GET, params as Record<string, unknown>);
  }

  async function getPermissions() {
    const response = await api<{ data: { permission: string; status: 'granted' }[] }>('/me/permissions');
    return response.data;
  }

  async function hasPermissions(permissions: string[]) {
    const usersPermissions = await getPermissions();

    const matchedPermissions = permissions.filter((p) => {
      return usersPermissions.some((row) => row.status === 'granted' && row.permission === p);
    });

    return matchedPermissions.length === permissions.length;
  }

  async function subscribe<T>(eventName: string, callback: (value: T) => void) {
    await init();
    const fb = getFB();
    if (!fb) throw new Error('[react-facebook] Facebook SDK not available');
    fb.Event.subscribe(eventName, callback as (...args: unknown[]) => void);

    return () => unsubscribe(eventName, callback);
  }

  async function unsubscribe<T>(eventName: string, callback: (value: T) => void) {
    await init();
    const fb = getFB();
    if (!fb) throw new Error('[react-facebook] Facebook SDK not available');
    fb.Event.unsubscribe(eventName, callback as (...args: unknown[]) => void);
  }

  async function parse(parentNode?: HTMLElement) {
    await init();

    const fb = getFB();
    if (!fb) throw new Error('[react-facebook] Facebook SDK not available');

    if (parentNode) {
      fb.XFBML.parse(parentNode);
    } else {
      fb.XFBML.parse();
    }
  }

  function getLocale(): string {
    return opts.language || 'en_US';
  }

  async function changeLocale(newLocale: string): Promise<void> {
    if (typeof window === 'undefined') return;

    opts.language = newLocale;

    const existingScript = window.document.getElementById('facebook-jssdk');
    if (existingScript) {
      existingScript.remove();
    }

    if (window.FB) {
      delete (window as { FB?: FBSDK }).FB;
    }

    loadingPromise = undefined;
    instance.loadingPromise = undefined;

    await init();

    const fb = getFB();
    if (fb?.XFBML?.parse) {
      fb.XFBML.parse();
    }
  }

  const instance: FacebookInstance = {
    getAppId,
    getFB,
    init,
    ui,
    api,
    login,
    logout,
    getLoginStatus,
    getTokenDetail,
    getProfile,
    getPermissions,
    hasPermissions,
    subscribe,
    unsubscribe,
    parse,
    getLocale,
    changeLocale,
    options: opts,
    loadingPromise: undefined,
  };

  if (!opts.lazy && typeof window !== 'undefined') {
    init();
  }

  return instance;
}
