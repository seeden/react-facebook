import LoginStatus from '../constants/LoginStatus';
import FBError from '../errors/FBError';

export type AuthResponse = {
  userID: string; 
  accessToken: string;
};

export type LoginResponse = {
  status: LoginStatus.CONNECTED,
  authResponse: AuthResponse,
} | {
  status: Exclude<LoginStatus, LoginStatus.CONNECTED>,
};

export type LoginOptions = {
  scope?: string;
  returnScopes?: boolean;
  authType?: string[];
  rerequest?: boolean;
  reauthorize?: boolean;
};
declare global {
  interface Window { 
    fbAsyncInit: () => void;
    FB: any;
  }
}

export enum Method {
  GET = 'get',
  POST = 'post',
  DELETE = 'delete',
};

export enum Namespace {
  UI = 'ui',
  API = 'api',
  LOGIN = 'login',
  LOGOUT = 'logout',
  GET_LOGIN_STATUS = 'getLoginStatus',
  GET_AUTH_RESPONSE = 'getAuthResponse',
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

export default class Facebook {
  options: FacebookOptions;
  loadingPromise: Promise<any> | undefined;

  constructor(options: FacebookOptions) {
    if (!options.appId) {
      throw new Error('You need to set appId');
    }

    this.options = {
      ...defaultOptions,
      ...options,
    };

    if (!this.options.lazy) {
      this.init();
    }
  }

  getAppId() {
    return this.options.appId;
  }

  getFB() {
    return window.FB;
  }

  async init(): Promise<Facebook> {
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = new Promise((resolve) => {
      const {
        domain,
        language,
        debug,
        chatSupport,
        ...restOptions
      } = this.options;

      window.fbAsyncInit = () => {
        window.FB.init({
          appId: restOptions.appId,
          version: restOptions.version,
          cookie: restOptions.cookie,
          status: restOptions.status,
          xfbml: restOptions.xfbml,
          frictionlessRequests: restOptions.frictionlessRequests,
        });

        resolve(this);
      };

      if (window.document.getElementById('facebook-jssdk')) {
        return resolve(this);
      }
      
      const js = window.document.createElement('script');
      js.id = 'facebook-jssdk';
      js.async = true;
      js.defer = true;
      js.crossOrigin = 'anonymous';
      js.src = `https://${domain}/${language}/sdk${chatSupport ? '/xfbml.customerchat' : ''}${debug ? '/debug' : ''}.js`;

      window.document.body.appendChild(js);
    });

    return this.loadingPromise;
  }

  async process<Response>(namespace: Namespace, before: any[] = [], after: any[] = []): Promise<Response> {
    await this.init();

    const fb = this.getFB();

    return new Promise((resolve, reject) => {
      const callback = (response: Response | { error: { code: number, type: string, message: string} }) => {
        if (!response) {
          if (namespace === Namespace.UI) return;
          reject(new Error('Response is undefined'));
        } else if (!!response && typeof response === 'object' && 'error' in response) {
          const { code, type, message } = response.error;

          reject(new FBError(message, code, type));
        } else {
          resolve(response);
        }
      };

      (fb as any)[namespace](...before, callback, ...after);
    });
  }

  async ui(options: any) {
    return this.process(Namespace.UI, [options]);
  }

  async api<T>(path: string, method = Method.GET, params = {}) {
    return this.process<T>(Namespace.API, [path, method, params]);
  }

  async login(options: LoginOptions) {
    const { scope, authType = [], returnScopes, rerequest, reauthorize } = options;
    const loginOptions: {
      return_scopes?: boolean;
      auth_type?: string;
      scope?: string;
    } = {
      scope,
    };

    if (returnScopes) {
      loginOptions.return_scopes = true;
    }

    if (rerequest) {
      authType.push('rerequest');
    }

    if (reauthorize) {
      authType.push('reauthenticate');
    }

    if (authType.length) {
      loginOptions.auth_type = authType.join(',');
    }

    return this.process<LoginResponse>(Namespace.LOGIN, [], [loginOptions]);
  }

  async logout() {
    return this.process(Namespace.LOGOUT);
  }


  async getLoginStatus(): Promise<LoginResponse> {
    return this.process<LoginResponse>(Namespace.GET_LOGIN_STATUS);
  }

  async getAuthResponse() {
    return this.process(Namespace.GET_AUTH_RESPONSE);
  }

  async getTokenDetail(loginResponse?: LoginResponse): Promise<AuthResponse> {
    if (loginResponse?.status === LoginStatus.CONNECTED) {
      return loginResponse.authResponse;
    }

    const response = await this.getLoginStatus();

    if (response.status === LoginStatus.CONNECTED) {
      return response.authResponse;
    }

    throw new Error('Token is undefined');
  }

  async getProfile(params: any) {
    return this.api('/me', Method.GET, params);
  }

  async getTokenDetailWithProfile(params: any, response: any) {
    const tokenDetail = await this.getTokenDetail(response);
    const profile = await this.getProfile(params);

    return {
      profile,
      tokenDetail,
    };
  }

  async getToken(): Promise<string> {
    const authResponse = await this.getTokenDetail();
    return authResponse.accessToken;
  }

  async getUserId(): Promise<string> {
    const authResponse = await this.getTokenDetail();
    return authResponse.userID;
  }

  async sendInvite(to: string, options: any) {
    return this.ui({
      to,
      method: 'apprequests',
      ...options,
    });
  }

  async postAction(ogNamespace: string, ogAction: string, ogObject: string, ogObjectUrl: string, noFeedStory: boolean = false) {
    let url = `/me/${ogNamespace}:${ogAction}?${ogObject}=${encodeURIComponent(ogObjectUrl)}`;

    if (noFeedStory === true) {
      url += '&no_feed_story=true';
    }

    return this.api(url, Method.POST);
  }

  async getPermissions() {
    const response = await this.api<{ data: any }>('/me/permissions');
    return response.data as {
      permission: string;
      status: 'granted';
    }[];
  }

  async hasPermissions(permissions: string[]) {
    const usersPermissions = await this.getPermissions();

    const findedPermissions = permissions.filter((p) => {
      const currentPermission = usersPermissions.find((row) => {
        const { permission, status } = row;
        return status === 'granted' && permission === p;
      });

      return !!currentPermission;
    });

    return findedPermissions.length === permissions.length;
  }

  async subscribe<T>(eventName: string, callback: (value: T) => void) {
    await this.init();
    this.getFB().Event.subscribe(eventName, callback);

    return () => this.unsubscribe(eventName, callback);
  }

  async unsubscribe<T>(eventName: string, callback: (value: T) => void) {
    await this.init();
    this.getFB().Event.unsubscribe(eventName, callback);
  }

  async parse(parentNode: HTMLElement) {
    await this.init();

    if (typeof parentNode === 'undefined') {
      this.getFB().XFBML.parse();
    } else {
      this.getFB().XFBML.parse(parentNode);
    }
  }

  async getRequests() {
    return this.api('/me/apprequests');
  }

  async removeRequest(requestId: string) {
    return this.api(requestId, Method.DELETE);
  }

  async setAutoGrow() {
    await this.init();
    this.getFB().Canvas.setAutoGrow();
  }

  async paySimple(product: string, quantity = 1) {
    return this.ui({
      method: 'pay',
      action: 'purchaseitem',
      product,
      quantity,
    });
  }

  async pay(product: string, options: any) {
    return this.ui({
      method: 'pay',
      action: 'purchaseitem',
      product,
      ...options,
    });
  }

  getLocale(): string {
    return this.options.language || 'en_US';
  }

  async changeLocale(newLocale: string): Promise<void> {
    // Update the options
    this.options.language = newLocale;
    
    // Remove existing Facebook SDK script
    const existingScript = window.document.getElementById('facebook-jssdk');
    if (existingScript) {
      existingScript.remove();
    }

    // Clear existing FB object
    if (window.FB) {
      delete (window as any).FB;
    }

    // Reset loading promise to force re-initialization
    this.loadingPromise = undefined;

    // Re-initialize with new locale
    await this.init();

    // Re-parse all existing Facebook widgets on the page
    await this.parseAll();
  }

  async parseAll(): Promise<void> {
    await this.init();
    
    const fb = this.getFB();
    if (fb && fb.XFBML && fb.XFBML.parse) {
      // Parse all Facebook widgets on the page
      fb.XFBML.parse();
    }
  }
}

