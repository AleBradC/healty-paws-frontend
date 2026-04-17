import { describe, it, expect } from 'vitest';
import { cx } from './cx';

describe('cx', () => {
  it('joins truthy class names with a space', () => {
    expect(cx('foo', 'bar')).toBe('foo bar');
  });

  it('filters out falsy values: false', () => {
    expect(cx('foo', false, 'bar')).toBe('foo bar');
  });

  it('filters out falsy values: null', () => {
    expect(cx('foo', null, 'bar')).toBe('foo bar');
  });

  it('filters out falsy values: undefined', () => {
    expect(cx('foo', undefined, 'bar')).toBe('foo bar');
  });

  it('returns an empty string when all args are falsy', () => {
    expect(cx(false, null, undefined)).toBe('');
  });

  it('returns an empty string when called with no args', () => {
    expect(cx()).toBe('');
  });

  it('handles a single class', () => {
    expect(cx('only')).toBe('only');
  });

  it('handles mixed truthy and falsy in order', () => {
    expect(cx('a', false, 'b', null, 'c')).toBe('a b c');
  });
});
