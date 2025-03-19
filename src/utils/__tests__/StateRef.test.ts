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
    const promise = new Promise(() => {
      throw new Error('promise rejection');
    });
    const stateRef = stateRefFromProvided(promise);

    expect(stateRef.getStatus()).toBe(Status.Pending);
    try {
      await stateRef.promise;
    } catch (e) {}
    expect(stateRef.getStatus()).toBe(Status.Rejected);
  });

  test('should create a StateRef in a rejected status with an error', () => {
    const error = new Error('stateRefFromError');
    const stateRef = stateRefFromError(error);

    expect(stateRef.getStatus()).toBe(Status.Rejected);
    expect(() => stateRef.getOrThrowAsync()).toThrow(error);
  });

  describe('getOrThrowProvided', () => {
    it('Async getOrThrowProvided', async () => {
      const promise = new Promise((resolve) => resolve(1));
      const stateRef = stateRefFromProvided(promise);
      expect(stateRef.getOrThrowProvided()).toBe(promise);
      await stateRef.promise;
      expect(stateRef.getOrThrowProvided()).toBe(promise);
    });
    it('Sync getOrThrowProvided', () => {
      const stateRef = stateRefFromProvided(1);
      expect(stateRef.getOrThrowProvided()).toBe(1);
    });
    it('Failed getOrThrowProvided', () => {
      const stateRef = stateRefFromError(new Error('failed'));
      expect(() => stateRef.getOrThrowProvided()).toThrow('failed');
    });
  });

  describe('getOrThrowAsync', () => {
    it('Async getOrThrowAsync', async () => {
      const promise = new Promise((resolve) => resolve(1));
      const stateRef = stateRefFromProvided(promise);
      expect(stateRef.getOrThrowAsync()).toBe(promise);
      await stateRef.promise;
      expect(stateRef.getOrThrowAsync()).toBe(1);
    });
    it('Sync getOrThrowAsync', () => {
      const stateRef = stateRefFromProvided(1);
      expect(stateRef.getOrThrowAsync()).toBe(1);
    });
    it('Failed getOrThrowAsync', () => {
      const stateRef = stateRefFromError(new Error('failed'));
      expect(() => stateRef.getOrThrowAsync()).toThrow('failed');
    });
  });

  describe('getOrThrowSync', () => {
    it('Async getOrThrowSync', async () => {
      const promise = new Promise((resolve) => resolve(1));
      const stateRef = stateRefFromProvided(promise);
      expect(() => stateRef.getOrThrowSync(ThrowMode.ErrorOnPending)).toThrow(
        'Attempted to access a pending state from synchronous code.'
      );
      let caught = null;
      try {
        stateRef.getOrThrowSync(ThrowMode.ThrowPromise);
      } catch (e) {
        caught = e;
      }
      expect(caught).toBe(promise);
      await caught;
      expect(stateRef.getOrThrowSync(ThrowMode.ErrorOnPending)).toBe(1);
      expect(stateRef.getOrThrowSync(ThrowMode.ThrowPromise)).toBe(1);
    });
    it('Sync getOrThrowSync', () => {
      const stateRef = stateRefFromProvided(1);
      expect(stateRef.getOrThrowSync(ThrowMode.ErrorOnPending)).toBe(1);
      expect(stateRef.getOrThrowSync(ThrowMode.ThrowPromise)).toBe(1);
    });
    it('Failed getOrThrowSync', () => {
      const stateRef = stateRefFromError(new Error('failed'));
      expect(() => stateRef.getOrThrowSync(ThrowMode.ErrorOnPending)).toThrow(
        'failed'
      );
      expect(() => stateRef.getOrThrowSync(ThrowMode.ThrowPromise)).toThrow(
        'failed'
      );
    });
  });
});
