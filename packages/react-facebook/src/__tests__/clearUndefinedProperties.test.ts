import { describe, it, expect } from 'vitest';
import clearUndefinedProperties from '../utils/clearUndefinedProperties';

describe('clearUndefinedProperties', () => {
  it('removes properties with undefined values', () => {
    const result = clearUndefinedProperties({
      a: 1,
      b: undefined,
      c: 'hello',
    });

    expect(result).toEqual({ a: 1, c: 'hello' });
  });

  it('preserves null values', () => {
    const result = clearUndefinedProperties({
      a: null,
      b: undefined,
      c: 'test',
    });

    expect(result).toEqual({ a: null, c: 'test' });
  });

  it('preserves falsy values like 0, false, and empty string', () => {
    const result = clearUndefinedProperties({
      zero: 0,
      empty: '',
      no: false,
      undef: undefined,
    });

    expect(result).toEqual({ zero: 0, empty: '', no: false });
  });

  it('returns an empty object when all values are undefined', () => {
    const result = clearUndefinedProperties({
      a: undefined,
      b: undefined,
    });

    expect(result).toEqual({});
  });

  it('returns an equivalent object when no values are undefined', () => {
    const input = { a: 1, b: 'two', c: true };
    const result = clearUndefinedProperties(input);

    expect(result).toEqual({ a: 1, b: 'two', c: true });
  });
});
