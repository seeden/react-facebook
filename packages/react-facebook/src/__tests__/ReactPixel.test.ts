import { describe, it, expect, beforeEach, vi } from 'vitest';

// Shared state that the mock factory closes over
const mockMethods = {
  init: vi.fn().mockResolvedValue(undefined),
  pageView: vi.fn().mockResolvedValue(undefined),
  track: vi.fn().mockResolvedValue(undefined),
  trackSingle: vi.fn().mockResolvedValue(undefined),
  trackCustom: vi.fn().mockResolvedValue(undefined),
  trackSingleCustom: vi.fn().mockResolvedValue(undefined),
  grantConsent: vi.fn().mockResolvedValue(undefined),
  revokeConsent: vi.fn().mockResolvedValue(undefined),
  fbq: vi.fn().mockResolvedValue(undefined),
  isInitialized: vi.fn().mockReturnValue(false),
  getOptions: vi.fn().mockReturnValue({}),
};

const mockCreateFacebookPixel = vi.fn(() => mockMethods);

vi.mock('../utils/FacebookPixel', () => {
  return { default: mockCreateFacebookPixel };
});

describe('ReactPixel', () => {
  beforeEach(() => {
    vi.resetModules();
    mockCreateFacebookPixel.mockClear();

    // Reset each mock method
    for (const key of Object.keys(mockMethods) as Array<keyof typeof mockMethods>) {
      mockMethods[key].mockClear();
      if (key === 'init') {
        mockMethods[key].mockResolvedValue(mockMethods);
      } else if (key === 'isInitialized') {
        mockMethods[key].mockReturnValue(false);
      } else if (key === 'getOptions') {
        mockMethods[key].mockReturnValue({});
      } else {
        mockMethods[key].mockResolvedValue(undefined);
      }
    }
  });

  it('throws when calling pageView before init', async () => {
    const { default: ReactPixel } = await import('../utils/ReactPixel');

    expect(() => ReactPixel.pageView()).toThrow('init() must be called before');
  });

  it('throws when calling track before init', async () => {
    const { default: ReactPixel } = await import('../utils/ReactPixel');

    expect(() => ReactPixel.track('Purchase')).toThrow('init() must be called before');
  });

  it('throws when calling trackCustom before init', async () => {
    const { default: ReactPixel } = await import('../utils/ReactPixel');

    expect(() => ReactPixel.trackCustom('MyEvent')).toThrow('init() must be called before');
  });

  it('throws when calling trackSingle before init', async () => {
    const { default: ReactPixel } = await import('../utils/ReactPixel');

    expect(() => ReactPixel.trackSingle('pixel-id', 'Purchase')).toThrow('init() must be called before');
  });

  it('throws when calling trackSingleCustom before init', async () => {
    const { default: ReactPixel } = await import('../utils/ReactPixel');

    expect(() => ReactPixel.trackSingleCustom('pixel-id', 'MyEvent')).toThrow('init() must be called before');
  });

  it('throws when calling grantConsent before init', async () => {
    const { default: ReactPixel } = await import('../utils/ReactPixel');

    expect(() => ReactPixel.grantConsent()).toThrow('init() must be called before');
  });

  it('throws when calling revokeConsent before init', async () => {
    const { default: ReactPixel } = await import('../utils/ReactPixel');

    expect(() => ReactPixel.revokeConsent()).toThrow('init() must be called before');
  });

  it('throws when calling fbq before init', async () => {
    const { default: ReactPixel } = await import('../utils/ReactPixel');

    expect(() => ReactPixel.fbq('track', 'PageView')).toThrow('init() must be called before');
  });

  it('init creates a FacebookPixel instance and calls init', async () => {
    const { default: ReactPixel } = await import('../utils/ReactPixel');

    await ReactPixel.init('my-pixel-id');

    expect(mockCreateFacebookPixel).toHaveBeenCalledWith(expect.objectContaining({ pixelId: 'my-pixel-id' }));
    expect(mockMethods.init).toHaveBeenCalled();
  });

  it('init passes advancedMatching and options', async () => {
    const { default: ReactPixel } = await import('../utils/ReactPixel');

    await ReactPixel.init('my-pixel-id', { em: 'user@example.com' }, { autoConfig: false, debug: true });

    expect(mockCreateFacebookPixel).toHaveBeenCalledWith(
      expect.objectContaining({
        pixelId: 'my-pixel-id',
        advancedMatching: { em: 'user@example.com' },
        autoConfig: false,
        debug: true,
      }),
    );
  });

  it('delegates pageView to the instance after init', async () => {
    const { default: ReactPixel } = await import('../utils/ReactPixel');

    await ReactPixel.init('my-pixel-id');
    await ReactPixel.pageView();

    expect(mockMethods.pageView).toHaveBeenCalled();
  });

  it('delegates track to the instance after init', async () => {
    const { default: ReactPixel } = await import('../utils/ReactPixel');

    await ReactPixel.init('my-pixel-id');
    await ReactPixel.track('Purchase', { value: 9.99 });

    expect(mockMethods.track).toHaveBeenCalledWith('Purchase', { value: 9.99 });
  });

  it('delegates trackCustom to the instance after init', async () => {
    const { default: ReactPixel } = await import('../utils/ReactPixel');

    await ReactPixel.init('my-pixel-id');
    await ReactPixel.trackCustom('MyEvent', { key: 'val' });

    expect(mockMethods.trackCustom).toHaveBeenCalledWith('MyEvent', { key: 'val' });
  });

  it('delegates grantConsent to the instance after init', async () => {
    const { default: ReactPixel } = await import('../utils/ReactPixel');

    await ReactPixel.init('my-pixel-id');
    await ReactPixel.grantConsent();

    expect(mockMethods.grantConsent).toHaveBeenCalled();
  });

  it('delegates revokeConsent to the instance after init', async () => {
    const { default: ReactPixel } = await import('../utils/ReactPixel');

    await ReactPixel.init('my-pixel-id');
    await ReactPixel.revokeConsent();

    expect(mockMethods.revokeConsent).toHaveBeenCalled();
  });

  it('delegates fbq to the instance after init', async () => {
    const { default: ReactPixel } = await import('../utils/ReactPixel');

    await ReactPixel.init('my-pixel-id');
    await ReactPixel.fbq('track', 'Lead');

    expect(mockMethods.fbq).toHaveBeenCalledWith('track', 'Lead');
  });
});
