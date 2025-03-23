/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Allows you to create a set of selectors based on some kind of input.
 * Keys can be simple, like IDs, or complex objects.
 *
 * Usage:
 * systemPlanets: SelectorMap<SolarSystem, Array<Planet>> =
 *   new SelectorMap(({observe}, system) => {
 *     return observe(allPlanets).filter(planet => planet.system === system);
 *   });
 * planetMoons: AsyncSelectorMap<Planet, Array<Moon>> =
 *   new AsyncSelectorMap(async ({observeKey}, planet) => {
 *     const info = await observeKey(planetInfos, planet);
 *     return into.satellites.filter(({type}) => type === 'moon');
 *   });
 */

import { AbstractObserver } from '@/AbstractObserver';
import {
  Options as ObservableOptions,
  ReleaseDelay,
} from '@/AbstractObservable';
import {
  AbstractSelector,
  getStateCB as getSelectorStateCB,
} from '@/AbstractSelector';
import { Maybe } from '@/Maybe';
import { StateRef } from '@/StateRef';
import { AnyObserver } from '@/AnyObserver';

/**
 * Callback that selects state for a given key
 */
export type getStateCB<TKey, TProvide> = (
  Observer: AnyObserver,
  TKey: TKey
) => TProvide;

/**
 * Same options as observable however the release function needs a key
 */
export type Options<TKey, TProvide> = Omit<
  ObservableOptions<TProvide>,
  'onRelease'
> &
  Partial<{
    onRelease: (key: TKey, provide: TProvide) => void;
  }>;

export abstract class AbstractSelectorMap<
  TKey,
  TResolve,
  TProvide,
  TObserver extends AnyObserver,
  TSelector extends AbstractSelector<
    TResolve,
    TProvide,
    TObserver
  > = AbstractSelector<TResolve, TProvide, TObserver>,
> {
  private debugIdPrefix: Maybe<string> = null;
  private selectors: Map<TKey, TSelector> = new Map();
  private getState: getStateCB<TKey, TProvide>;
  private options: Maybe<Options<TKey, TProvide>>;

  private createSelector: (
    getState: getSelectorStateCB<TResolve, TProvide, TObserver>,
    options: ObservableOptions<TProvide>
  ) => TSelector;

  constructor(
    getState: getStateCB<TKey, TProvide>,
    options: Maybe<Options<TKey, TProvide>>,
    createSelector: (
      getState: getSelectorStateCB<TResolve, TProvide, TObserver>,
      options: ObservableOptions<TProvide>
    ) => TSelector
  ) {
    this.getState = getState;
    this.options = options;
    this.createSelector = createSelector;
  }

  setDebugPrefix = (prefix: string) => {
    this.debugIdPrefix = prefix;
    this.selectors.forEach((selector) => selector.setDebugPrefix(prefix));
  };

  /**
   * Retrieves the cached state for a given key if it exists from an observer's request.
   * This method will not generate the state if it is missing. Note that if the selector
   * is for a nullable type, using peek alone is insufficient to determine whether the
   * state is null or does not exist.
   */
  peek = (key: TKey): Maybe<TResolve> => {
    if (!this.selectors.has(key)) {
      return null;
    }
    return this.getSelector(key).peek();
  };

  /**
   * Although selectors are downstream from observables, it can sometimes be
   * convenient to have a setter that accepts the same value provided by getState.
   * This setter would internally determine what needs to be updated so that
   * getState will subsequently provide that new value.
   */
  set = (_key: TKey, _provide: TProvide) => {
    throw new Error('Set on selectors not yet supported');
  };

  /**
   * Used by Observers and Observables to access the StateRef for a given key.
   */
  __observeRef = (
    observer: AbstractObserver,
    key: TKey
  ): StateRef<TResolve, TProvide> => {
    const selector = this.getSelector(key);
    return selector.__observeRef(observer);
  };

  /**
   * Retrieves the selector associated with a given key, or creates one if it
   * does not exist yet.
   */
  private getSelector(key: TKey): TSelector {
    let selector = this.selectors.get(key);
    if (selector == null) {
      selector = this.createSelector(
        // Create a GetStateCallback with the key bound to the function
        (observer) => this.getState(observer, key),
        // Wrap the onRelease callback to clean up data
        {
          // By default, we want selectors to release their state when not observed,
          // as this data is derived and doesn't need to persist.
          releaseDelay: ReleaseDelay.Default,
          ...this.options,
          onRelease: (value) => {
            this.selectors.get(key)?.destroy();
            this.selectors.delete(key);
            this.options?.onRelease?.(key, value);
          },
        }
      );
      if (this.debugIdPrefix != null) {
        selector.setDebugPrefix(this.debugIdPrefix);
      }
      this.selectors.set(key, selector);
    }
    return selector;
  }
}
