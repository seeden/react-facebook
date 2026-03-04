import { describe, it, expect } from 'vitest';
import getCurrentHref from '../utils/getCurrentHref';

describe('getCurrentHref', () => {
  it('returns window.location.href in a browser environment', () => {
    // In jsdom, canUseDOM is true at module load time,
    // so getCurrentHref returns window.location.href.
    const result = getCurrentHref();

    expect(result).toBe(window.location.href);
  });

  it('returns a string value', () => {
    const result = getCurrentHref();

    expect(typeof result).toBe('string');
  });
});
