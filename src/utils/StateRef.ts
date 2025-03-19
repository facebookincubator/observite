/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { isPromise } from '../utils/isPromise';
import { nullthrows } from '../utils/nullthrows';
import { Maybe } from './Maybe';

export enum Status {
  Pending = 'pending',
  Resolved = 'resolved',
  Rejected = 'rejected',
}

export enum ThrowMode {
  ErrorOnPending = 'errorOnPending',
  ThrowPromise = 'throwPromise',
}

/**
 * Whether using async or sync state, we treat the state as if it is async.
 * Sync state simply never enters the Status.Pending status.
 */
type AsyncState<TResolve> =
  | { status: Status.Pending; promise: Promise<TResolve> }
  | { status: Status.Resolved; result: TResolve }
  | { status: Status.Rejected; error: Error };
type StatusChangeCB = (next: Status, prev: Status) => unknown;

/**
 * Because we want to support nullable types, we can't simply hold a value and
 * perform null checks against it. Instead, we need a wrapper that indicates
 * whether the value was provided at all or if the value was provided but is
 * null itself.
 */
type HolderForProvided<TProvide> = { provided: TProvide };

/**
 * StateRef is an internal structure for Observables that encapsulates the
 * complexities of handling Promises and Errors.
 *
 * For Promises, consumers of data want to think of it as simply requesting X
 * and receiving X, but we might not have X yet. StateRef caches the promise
 * provided by the observable and listens for its completion. Once the promise
 * is resolved, StateRef caches the result. If anyone requests the state before
 * the Promise has completed, we return the Promise. After the promise is
 * complete, we can provide the result synchronously. This is crucial because
 * Promises don't natively indicate their pending status. To transition from
 * the async world to the sync world, we need to know when the Promise is done.
 *
 * For Errors, if an error is thrown while fetching a value, we cache that error
 * similarly to how we cache the result. This is because other Selectors may
 * request the same data, and we want to avoid re-fetching data unless something
 * has changed that might alter the outcome.
 */
export type StateRef<TProvide, TResolve> = AbstractStateRef<TProvide, TResolve>;
class AbstractStateRef<TProvide, TResolve> {
  #holder: Maybe<HolderForProvided<TProvide>> = null;
  #state: AsyncState<TResolve>;
  #onStatusChanged: Maybe<StatusChangeCB> = null;
  constructor(
    holder: Maybe<HolderForProvided<TProvide>>,
    state: AsyncState<TResolve>,
    onStatusChanged?: Maybe<StatusChangeCB>
  ) {
    this.#holder = holder;
    this.#state = state;
    this.#onStatusChanged = onStatusChanged;
  }

  getStatus(): Status {
    return this.#state.status;
  }

  // This method should only be invoked by subclasses.
  __setState(state: AsyncState<TResolve>) {
    const prevStatus = this.#state.status;
    this.#state = state;
    if (prevStatus !== state.status) {
      this.#onStatusChanged?.(state.status, prevStatus);
    }
  }

  getHolderForProvided(): Maybe<HolderForProvided<TProvide>> {
    return this.#holder;
  }

  /**
   * Allows Observables to inspect the data without subscribing or modifying it.
   * The peek method does not provide context about the Promise or error status;
   * it simply returns the value if available.
   */
  peek(): Maybe<TResolve> {
    return this.#state.status === Status.Resolved ? this.#state.result : null;
  }

  /**
   * Returns the provided value if the status is Status.Pending or Status.Resolved.
   * Throws an error if the status is Status.Rejected.
   */
  getOrThrowProvided(): TProvide {
    switch (this.#state.status) {
      case Status.Pending:
      case Status.Resolved:
        return nullthrows(
          this.#holder,
          'Initialized without a value and not in a rejected state.'
        ).provided;
      case Status.Rejected:
        throw this.#state.error;
      default:
        const _: never = this.#state;
    }
    throw Error('This code path should be unreachable.');
  }

  /**
   * Returns the result or provided value if available.
   * Throws an error only if the status is Status.Rejected.
   */
  getOrThrowAsync(): TProvide | TResolve {
    switch (this.#state.status) {
      case Status.Pending:
        return nullthrows(
          this.#holder,
          'Initialized without a value and not in a rejected state.'
        ).provided;
      case Status.Resolved:
        return this.#state.result;
      case Status.Rejected:
        throw this.#state.error;
      default:
        const _: never = this.#state;
    }
    throw Error('This code path should be unreachable.');
  }

  /**
   * Throws if the status is not 'Resolved'. Handles promises based on the mode:
   * - ThrowMode.ErrorOnPending: Throws an error if pending
   * - ThrowMode.ThrowPromise: Throws the promise itself if pending
   */
  getOrThrowSync(mode: ThrowMode): TResolve {
    switch (this.#state.status) {
      case Status.Pending:
        if (mode === ThrowMode.ThrowPromise) {
          throw this.#state.promise;
        } else {
          throw new Error(
            'Attempted to access a pending state from synchronous code.'
          );
        }
      case Status.Resolved:
        return this.#state.result;
      case Status.Rejected:
        throw this.#state.error;
      default:
        const _: never = this.#state;
    }
    throw Error('This code path should be unreachable.');
  }
}

class AsyncStateRef<TResolve> extends AbstractStateRef<
  Promise<TResolve>,
  TResolve
> {
  promise: Promise<TResolve>;
  constructor(
    promise: Promise<TResolve>,
    onStatusChanged?: Maybe<StatusChangeCB>
  ) {
    super(
      { provided: promise },
      { status: Status.Pending, promise },
      onStatusChanged
    );
    this.promise = promise.then(
      (result: TResolve) => {
        this.__setState({ status: Status.Resolved, result });
        return result;
      },
      (thrown: Error) => {
        const error: Error = isPromise(thrown)
          ? new Error('Promise thrown inside of promise')
          : thrown;
        this.__setState({ status: Status.Rejected, error });
        throw error;
      }
    );
  }
}

class SyncStateRef<TResolve> extends AbstractStateRef<TResolve, TResolve> {
  constructor(result: TResolve, onStatusChanged?: Maybe<StatusChangeCB>) {
    super(
      { provided: result },
      { status: Status.Resolved, result },
      onStatusChanged
    );
  }
}

/**
 * Creates a StateRef from a value or a promise of a value.
 * - If a Promise is provided, an AsyncStateRef is created.
 * - Otherwise, a SyncStateRef is created.
 */
export function stateRefFromProvided<TProvide>(
  provided: TProvide,
  onStatusChanged?: Maybe<StatusChangeCB>
): TProvide extends Promise<infer TResolve>
  ? AsyncStateRef<TResolve>
  : SyncStateRef<TProvide> {
  if (isPromise(provided)) {
    return new AsyncStateRef(
      provided,
      onStatusChanged
    ) as TProvide extends Promise<infer TResolve>
      ? AsyncStateRef<TResolve>
      : never;
  } else {
    return new SyncStateRef(
      provided,
      onStatusChanged
    ) as TProvide extends Promise<infer _TResolve>
      ? never
      : SyncStateRef<TProvide>;
  }
}

/**
 * Creates a StateRef with a rejected status without needing a
 * source value for the error.
 */
export function stateRefFromError<TProvide, TResolve>(
  error: Error
): StateRef<TProvide, TResolve> {
  return new AbstractStateRef(null, { status: Status.Rejected, error });
}
