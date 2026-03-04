import { describe, it, expect } from 'vitest';
import FBError from '../errors/FBError';

describe('FBError', () => {
  it('formats the message correctly', () => {
    const error = new FBError('Something went wrong', 190, 'OAuthException');

    expect(error.message).toBe(
      '[react-facebook] Something went wrong (code: 190, type: OAuthException)',
    );
  });

  it('stores the error code', () => {
    const error = new FBError('Token expired', 190, 'OAuthException');

    expect(error.code).toBe(190);
  });

  it('stores the error type', () => {
    const error = new FBError('Token expired', 190, 'OAuthException');

    expect(error.type).toBe('OAuthException');
  });

  it('has name set to FBError', () => {
    const error = new FBError('Test error', 100, 'GraphMethodException');

    expect(error.name).toBe('FBError');
  });

  it('is an instance of Error', () => {
    const error = new FBError('Test error', 100, 'GraphMethodException');

    expect(error).toBeInstanceOf(Error);
  });

  it('has a stack trace', () => {
    const error = new FBError('Test error', 100, 'GraphMethodException');

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('FBError');
  });
});
