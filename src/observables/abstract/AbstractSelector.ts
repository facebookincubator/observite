/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Allows you to derive state from other observables and keep that new state cached.
 * If any input used to derive a selector's state changes, it will regenerate its state
 * and update only if the new state is different.
 *
 * A selector is essentially both an Observable and an Observer. The Observable holds
 * the state, and the Observer observes it via a getState callback.
 *
 * Usage:
 * planets: Selector<Array<Planet>> = new Selector(({ observe }) =>
 *   observe(celestialBodies).filter(({ type }) => type === 'planet')
 * );
 *
 * planetInfos: AsyncSelector<Array<PlanetInfo>> =
 *   new AsyncSelector(async ({ observe }) => {
 *     const infos = await observe(celestialBodyInfos);
 *     return observe(infos).filter(({ type }) => type === 'planet');
 *   });
 */

import { Maybe } from '@/Maybe';
import {
  Options,
  ReleaseDelay,
  TAbstractObservable,
} from './AbstractObservable';
import { StateRef } from '@/StateRef';
import { isPromise } from '@/isPromise';
import { AbstractObserver } from '@/AbstractObserver';

export type getStateCB<TResolve, TProvide> = (
  observer: AbstractObserver,
  previous: Maybe<TResolve>
) => TProvide;

/**
 * Static used for creating unique ids for each observable.
 */
let nextDebugID = 1;

export abstract class AbstractSelector<
  TResolve,
  TProvide,
  TObservable extends TAbstractObservable<TResolve, TProvide>,
> {
  private debugID: number | string = nextDebugID++;
  private getState: getStateCB<TResolve, TProvide>;
  private stateObserver: AbstractObserver;
  private stateObservable: TObservable;

  constructor(
    getState: getStateCB<TResolve, TProvide>,
    options: Maybe<Options<TProvide>>,
    createObserver: () => AbstractObserver,
    createObservable: (options: Options<TProvide>) => TObservable
  ) {
    this.getState = getState;
    this.stateObserver = createObserver();
    this.stateObserver.setOnChange(this.updateState);
    this.stateObservable = createObservable({
      // By default, we want selectors to release their state when not
      // observed, as this data is derived and doesn't need to persist.
      releaseDelay: ReleaseDelay.Default,
      ...options,
      // Wrap the onRelease function to ensure that anything this
      // selector is observing stops being observed.
      onRelease: (value: TProvide) => {
        this.stateObserver?.reset();
        options?.onRelease?.(value);
      },
    });
  }

  setDebugPrefix = (prefix: string) => {
    this.debugID = prefix + '::' + this.debugID;
    this.stateObserver.setDebugPrefix(prefix + '::observer');
    this.stateObservable.setDebugPrefix(prefix + '::observable');
  };

  /**
   * Cleans up the state when removing all references to this selector.
   */
  destroy() {
    this.stateObserver?.destroy();
    this.stateObservable.destroy();
  }

  /**
   * Retrieves the cached state if it exists from an observer's request.
   * This method will not generate the state if it is missing. Note that if
   * the selector is for a nullable type, using peek alone is insufficient to
   * determine whether the state is null or does not exist.
   */
  peek = (): Maybe<TResolve> => {
    return this.stateObservable.peek();
  };

  peekSafe = (): Maybe<TResolve> => {
    return this.stateObservable.isInitialized()
      ? this.stateObservable.peek()
      : null;
  };

  /**
   * Although selectors are downstream from observables, it can sometimes be
   * convenient to have a setter that accepts the same value provided by getState.
   * This setter would internally determine what needs to be updated so that
   * getState will subsequently provide that value.
   */
  set = (_: TProvide) => {
    throw new Error('Set on selectors not yet supported');
  };

  /**
   * Used by Observers and Observables to access the StateRef.
   */
  __observeRef = (observer: AbstractObserver): StateRef<TResolve, TProvide> => {
    // Ensure the state is initialized if this is the first request for it.
    if (!this.stateObservable.isInitialized()) {
      this.updateState();
    }
    return this.stateObservable.__observeRef(observer);
  };

  /**
   * Calls the getState callback and caches the result.
   */
  private updateState = () => {
    try {
      const prevState = this.stateObservable.isInitialized()
        ? this.stateObservable.peek()
        : null;
      const state = this.getState(this.stateObserver, prevState);
      this.stateObservable.set(state);
    } catch (thrown) {
      let error = thrown;
      this.stateObservable.setError(
        // Throwing promises only works inside React components. You can't
        // access async state from synchronous code. You either need to make
        // more of your code async or wrap promises in a handler such as a
        // LoadObject.
        (isPromise(thrown)
          ? new Error('Promise thrown inside Promise')
          : thrown) as Error
      );
    }
  };
}

// export class AsyncSelector<T> extends AbstractSelector<Promise<T>, T> {
//   static factory: (
//     getStateCB<Promise<T>, T>,
//     ?Options<Promise<T>>,
//   ) => AsyncSelector<T> = (getState, options) =>
//     new AsyncSelector(getState, options);

//   constructor(
//     getState: getStateCB<Promise<T>, T>,
//     options?: ?Options<Promise<T>>,
//   ) {
//     // $FlowFixMe[incompatible-call]
//     super(getState, options, AsyncObserver.factory, AsyncObservable.factory);
//   }
// }

// export class Selector<T> extends AbstractSelector<T, T> {
//   static factory: (getStateCB<T, T>, ?Options<T>) => Selector<T> = (
//     getState,
//     options,
//   ) => new Selector(getState, options);

//   constructor(getState: getStateCB<T, T>, options?: ?Options<T>) {
//     // $FlowFixMe[incompatible-call]
//     super(getState, options, SyncObserver.factory, Observable.factory);
//   }
// }
