/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  stateRefFromProvided,
  stateRefFromError,
  Status,
  StateRef,
  ThrowMode,
} from '../StateRef';

describe('StateRef Tests', () => {
  test('should create a SyncStateRef for a non-promise value', () => {
    const value = 42;
    const stateRef = stateRefFromProvided(value);

    expect(stateRef.getStatus()).toBe(Status.Resolved);
    expect(stateRef.peek()).toBe(value);
  });

  test('should create an AsyncStateRef for a promise', async () => {
    const value = 42;
    const promise = Promise.resolve(value);
    const stateRef = stateRefFromProvided(promise);

    expect(stateRef.getStatus()).toBe(Status.Pending);

    await promise;
    expect(stateRef.getStatus()).toBe(Status.Resolved);
    expect(stateRef.peek()).toBe(value);
  });

  test('should handle promise rejection in AsyncStateRef', async () => {
    const error = new Error('Test error 1');
    const promise = Promise.reject(error);
    const stateRef = stateRefFromProvided(promise);

    expect(stateRef.getStatus()).toBe(Status.Pending);

    await promise.catch(() => {});
    expect(stateRef.getStatus()).toBe(Status.Rejected);
  });

  test('should create a StateRef in a rejected status with an error', () => {
    const error = new Error('Test error 2');
    const stateRef = stateRefFromError(error);

    expect(stateRef.getStatus()).toBe(Status.Rejected);
    expect(() => stateRef.getOrThrowAsync()).toThrow(error);
  });

  describe('getOrThrowProvided', () => {
    it('returns the provided value when the status is Resolved', () => {
      const stateRef = stateRefFromProvided('resolved');
      expect(stateRef.getOrThrowProvided()).toBe('resolved');
    });
    it('throws an error when the status is Rejected', () => {
      const stateRef = stateRefFromError(new Error('rejected'));
      expect(() => stateRef.getOrThrowProvided()).toThrow('rejected');
    });
    it('throws an error when the status is Pending', () => {
      const promise = new Promise<string>(() => {});
      const stateRef = stateRefFromProvided(promise);
      expect(() => stateRef.getOrThrowProvided()).toThrow(
        'Initialized without a value and not in a rejected state.'
      );
    });
  });

  describe('getOrThrowAsync', () => {
    it('returns the provided value when the status is Resolved', () => {
      const stateRef = stateRefFromProvided('resolved');
      expect(stateRef.getOrThrowAsync()).toBe('resolved');
    });
    it('returns the provided value when the status is Pending', () => {
      const promise = new Promise<string>(() => {});
      const stateRef = stateRefFromProvided(promise);
      expect(stateRef.getOrThrowAsync()).toBeInstanceOf(Promise);
    });
    it('throws an error when the status is Rejected', () => {
      const stateRef = stateRefFromError(new Error('rejected'));
      expect(() => stateRef.getOrThrowAsync()).toThrow('rejected');
    });
  });

  describe('getOrThrowSync', () => {
    it('returns the provided value when the status is Resolved', () => {
      const stateRef = stateRefFromProvided('resolved');
      expect(stateRef.getOrThrowSync(ThrowMode.ErrorOnPending)).toBe(
        'resolved'
      );
    });
    it('throws an error when the status is Rejected', () => {
      const stateRef = stateRefFromError(new Error('rejected'));
      expect(() => stateRef.getOrThrowSync(ThrowMode.ErrorOnPending)).toThrow(
        'rejected'
      );
    });
    it('throws an error when the status is Pending and mode is ErrorOnPending', () => {
      const promise = new Promise<string>(() => {});
      const stateRef = stateRefFromProvided(promise);
      expect(() => stateRef.getOrThrowSync(ThrowMode.ErrorOnPending)).toThrow(
        'Attempted to access a pending state from synchronous code.'
      );
    });
    it('throws the promise when the status is Pending and mode is ThrowPromise', () => {
      const promise = new Promise<string>(() => {});
      const stateRef = stateRefFromProvided(promise);
      expect(() => stateRef.getOrThrowSync(ThrowMode.ThrowPromise)).toThrow();
    });
  });
});
