export type PixelOptions = {
  pixelId: string;
  autoConfig?: boolean;
  debug?: boolean;
  advancedMatching?: Record<string, any>;
};

export type PixelEventData = Record<string, any>;

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

const defaultPixelOptions: Omit<PixelOptions, 'pixelId'> = {
  autoConfig: true,
  debug: false,
  advancedMatching: {},
};

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

export default class FacebookPixel {
  private options: PixelOptions;
  private loadingPromise: Promise<FacebookPixel> | undefined;

  constructor(options: PixelOptions) {
    if (!options.pixelId) {
      throw new Error('You need to set pixelId');
    }

    this.options = {
      ...defaultPixelOptions,
      ...options,
    };

    if (!this.options.debug) {
      this.options.debug = false;
    }
  }

  private warn(...args: any[]): void {
    if (!this.options.debug) return;
    console.warn('[react-facebook-pixel]', ...args);
  }

  private log(...args: any[]): void {
    if (!this.options.debug) return;
    console.info('[react-facebook-pixel]', ...args);
  }

  private loadPixelScript(): Promise<void> {
    return new Promise((resolve) => {
      // Check if already loaded
      if (window.fbq) {
        resolve();
        return;
      }

      // Load Facebook Pixel script
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      
      script.onload = () => {
        // Initialize fbq function
        if (!window.fbq) {
          (window as any).fbq = function() {
            (window as any).fbq.callMethod
              ? (window as any).fbq.callMethod.apply((window as any).fbq, arguments)
              : (window as any).fbq.queue.push(arguments);
          };
        }
        
        if (!window._fbq) {
          window._fbq = window.fbq;
        }
        
        window.fbq.push = window.fbq;
        window.fbq.loaded = true;
        window.fbq.version = '2.0';
        window.fbq.queue = [];
        
        resolve();
      };

      script.onerror = () => {
        this.warn('Failed to load Facebook Pixel script');
        resolve();
      };

      document.head.appendChild(script);
    });
  }

  async init(): Promise<FacebookPixel> {
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = this.loadPixelScript().then(() => {
      const { pixelId, autoConfig, advancedMatching } = this.options;

      if (autoConfig === false) {
        window.fbq('set', 'autoConfig', false, pixelId);
      }

      window.fbq('init', pixelId, advancedMatching);
      
      this.log('Pixel initialized successfully');
      return this;
    });

    return this.loadingPromise;
  }

  async pageView(): Promise<void> {
    await this.init();

    window.fbq('track', 'PageView');
    this.log("Called fbq('track', 'PageView')");
  }

  async track(eventName: PixelEventName, data?: PixelEventData): Promise<void> {
    await this.init();

    window.fbq('track', eventName, data);
    this.log(`Called fbq('track', '${eventName}')`);
    
    if (data) {
      this.log('with data:', data);
    }
  }

  async trackSingle(pixelId: string, eventName: PixelEventName, data?: PixelEventData): Promise<void> {
    await this.init();

    window.fbq('trackSingle', pixelId, eventName, data);
    this.log(`Called fbq('trackSingle', '${pixelId}', '${eventName}')`);
    
    if (data) {
      this.log('with data:', data);
    }
  }

  async trackCustom(eventName: string, data?: PixelEventData): Promise<void> {
    await this.init();

    window.fbq('trackCustom', eventName, data);
    this.log(`Called fbq('trackCustom', '${eventName}')`);
    
    if (data) {
      this.log('with data:', data);
    }
  }

  async trackSingleCustom(pixelId: string, eventName: string, data?: PixelEventData): Promise<void> {
    await this.init();

    window.fbq('trackSingleCustom', pixelId, eventName, data);
    this.log(`Called fbq('trackSingleCustom', '${pixelId}', '${eventName}')`);
    
    if (data) {
      this.log('with data:', data);
    }
  }

  async grantConsent(): Promise<void> {
    await this.init();

    window.fbq('consent', 'grant');
    this.log("Called fbq('consent', 'grant')");
  }

  async revokeConsent(): Promise<void> {
    await this.init();

    window.fbq('consent', 'revoke');
    this.log("Called fbq('consent', 'revoke')");
  }

  // Direct access to fbq for advanced use cases
  async fbq(...args: any[]): Promise<void> {
    await this.init();

    window.fbq(...args);
    this.log(`Called fbq('${args.slice(0, 2).join("', '")}')`);
    
    if (args[2]) {
      this.log('with data:', args[2]);
    }
  }

  isInitialized(): boolean {
    return !!this.loadingPromise;
  }

  getOptions(): PixelOptions {
    return { ...this.options };
  }
}
