export type PixelOptions = {
  pixelId: string;
  autoConfig?: boolean;
  debug?: boolean;
  advancedMatching?: Record<string, unknown>;
};

export type PixelEventData = Record<string, unknown>;

export type PixelEventName =
  | 'PageView'
  | 'ViewContent'
  | 'Search'
  | 'AddToCart'
  | 'AddToWishlist'
  | 'InitiateCheckout'
  | 'AddPaymentInfo'
  | 'Purchase'
  | 'Lead'
  | 'CompleteRegistration'
  | 'Contact'
  | 'CustomizeProduct'
  | 'Donate'
  | 'FindLocation'
  | 'Schedule'
  | 'StartTrial'
  | 'SubmitApplication'
  | 'Subscribe'
  | 'Custom';

type FBQ = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  push: FBQ;
  loaded: boolean;
  version: string;
};

const defaultPixelOptions: Omit<PixelOptions, 'pixelId'> = {
  autoConfig: true,
  debug: false,
  advancedMatching: {},
};

declare global {
  interface Window {
    fbq: FBQ | undefined;
    _fbq: FBQ | undefined;
  }
}

export type FacebookPixelInstance = {
  init: () => Promise<FacebookPixelInstance>;
  pageView: () => Promise<void>;
  track: (eventName: PixelEventName, data?: PixelEventData) => Promise<void>;
  trackSingle: (pixelId: string, eventName: PixelEventName, data?: PixelEventData) => Promise<void>;
  trackCustom: (eventName: string, data?: PixelEventData) => Promise<void>;
  trackSingleCustom: (pixelId: string, eventName: string, data?: PixelEventData) => Promise<void>;
  grantConsent: () => Promise<void>;
  revokeConsent: () => Promise<void>;
  fbq: (...args: unknown[]) => Promise<void>;
  isInitialized: () => boolean;
  getOptions: () => PixelOptions;
};

export default function createFacebookPixel(options: PixelOptions): FacebookPixelInstance {
  if (!options.pixelId) {
    throw new Error('You need to set pixelId');
  }

  const opts: PixelOptions = {
    ...defaultPixelOptions,
    ...options,
    debug: options.debug ?? false,
  };

  let loadingPromise: Promise<FacebookPixelInstance> | undefined;

  function warn(...args: unknown[]): void {
    if (!opts.debug) return;
    console.warn('[react-facebook-pixel]', ...args);
  }

  function log(...args: unknown[]): void {
    if (!opts.debug) return;
    console.info('[react-facebook-pixel]', ...args);
  }

  function loadPixelScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        resolve();
        return;
      }

      if (window.fbq) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';

      script.onload = () => {
        if (!window.fbq) {
          // Real fbevents.js failed to set up fbq; create a stub
          const fbq = function (...args: unknown[]) {
            if (fbq.callMethod) {
              fbq.callMethod(...args);
            } else {
              fbq.queue.push(args);
            }
          } as FBQ;
          fbq.queue = [];
          fbq.loaded = true;
          fbq.version = '2.0';
          fbq.push = fbq;
          window.fbq = fbq;
        }

        if (!window._fbq) {
          window._fbq = window.fbq!;
        }

        resolve();
      };

      script.onerror = () => {
        warn('Failed to load Facebook Pixel script');
        reject(
          new Error(
            '[react-facebook] Failed to load Facebook Pixel script. ' +
              'This may be caused by an ad blocker or network issue.',
          ),
        );
      };

      document.head.appendChild(script);
    });
  }

  async function init(): Promise<FacebookPixelInstance> {
    if (loadingPromise) {
      return loadingPromise;
    }

    loadingPromise = loadPixelScript()
      .then(() => {
        if (typeof window === 'undefined' || !window.fbq) return instance;

        const { pixelId, autoConfig, advancedMatching } = opts;

        if (autoConfig === false) {
          window.fbq('set', 'autoConfig', false, pixelId);
        }

        window.fbq('init', pixelId, advancedMatching);

        log('Pixel initialized successfully');
        return instance;
      })
      .catch((error) => {
        loadingPromise = undefined;
        throw error;
      });

    return loadingPromise;
  }

  function getFbq(): FBQ {
    const fbq = window.fbq;
    if (!fbq) throw new Error('[react-facebook] Facebook Pixel not initialized');
    return fbq;
  }

  async function pageView(): Promise<void> {
    await init();
    getFbq()('track', 'PageView');
    log("Called fbq('track', 'PageView')");
  }

  async function track(eventName: PixelEventName, data?: PixelEventData): Promise<void> {
    await init();
    getFbq()('track', eventName, data);
    log(`Called fbq('track', '${eventName}')`);
    if (data) log('with data:', data);
  }

  async function trackSingle(pixelId: string, eventName: PixelEventName, data?: PixelEventData): Promise<void> {
    await init();
    getFbq()('trackSingle', pixelId, eventName, data);
    log(`Called fbq('trackSingle', '${pixelId}', '${eventName}')`);
    if (data) log('with data:', data);
  }

  async function trackCustom(eventName: string, data?: PixelEventData): Promise<void> {
    await init();
    getFbq()('trackCustom', eventName, data);
    log(`Called fbq('trackCustom', '${eventName}')`);
    if (data) log('with data:', data);
  }

  async function trackSingleCustom(pixelId: string, eventName: string, data?: PixelEventData): Promise<void> {
    await init();
    getFbq()('trackSingleCustom', pixelId, eventName, data);
    log(`Called fbq('trackSingleCustom', '${pixelId}', '${eventName}')`);
    if (data) log('with data:', data);
  }

  async function grantConsent(): Promise<void> {
    await init();
    getFbq()('consent', 'grant');
    log("Called fbq('consent', 'grant')");
  }

  async function revokeConsent(): Promise<void> {
    await init();
    getFbq()('consent', 'revoke');
    log("Called fbq('consent', 'revoke')");
  }

  async function fbqDirect(...args: unknown[]): Promise<void> {
    await init();
    getFbq()(...args);
    log(`Called fbq('${(args.slice(0, 2) as string[]).join("', '")}')`);
    if (args[2]) log('with data:', args[2]);
  }

  function isInitialized(): boolean {
    return !!loadingPromise;
  }

  function getOptions(): PixelOptions {
    return { ...opts };
  }

  const instance: FacebookPixelInstance = {
    init,
    pageView,
    track,
    trackSingle,
    trackCustom,
    trackSingleCustom,
    grantConsent,
    revokeConsent,
    fbq: fbqDirect,
    isInitialized,
    getOptions,
  };

  return instance;
}
