/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Allows you to manage a set of observables based on various types of keys.
 * Keys can be simple identifiers or complex objects. If a default value is provided,
 * it will be used when a key is observed before being explicitly set. You can also
 * provide a function to create a custom default based on the key.
 *
 * `ObservableMap` contains an observable whose state is a map of other observables.
 * Typically, observers will observe a single key in the map and will only be notified
 * of changes to that specific key. To observe any changes to the entire map, use the
 * "entries" selector described below.
 *
 * **Usage:**
 * solarSystems: ObservableMap<SystemID, SolarSystems> = new ObservableMap({
 *   default: new SolarSystems(),
 * });
 *
 * planets: AsyncObservableMap<SolarSystem, Array<Planets>> =
 *   new AsyncObservableMap({
 *     default: async system => {
 *       const planetInfos = await fetchPlanetInfo(system);
 *       return planetInfos.map(info => new Planet(info));
 *     },
 *   });
 *
 * A selector named "entries" is also provided, which is accessible from the `ObservableMap`.
 * This allows you to derive information based on all items in the map. However, note that
 * you will be observing all changes to the map or individual keys.
 *
 * **Usage:**
 * const systemNames = observe(solarSystems.entries)
 *   .map(([systemID, system]) => system.name ?? systemID);
 */

import { AbstractObserver } from '@/AbstractObserver';
import { Maybe } from '@/Maybe';
import { nullthrows } from '@/nullthrows';
import { StateRef } from '@/StateRef';
import {
  Options as ObservableOptions,
  TAbstractObservable,
} from '@/AbstractObservable';
import { Observable } from '@/Observable';
import { AnyObserver } from '@/AnyObserver';

enum SetMode {
  NORMAL,
  SILENT,
}

/**
 * Callback that creates a default value for a given key
 */
export type getDefaultCB<TKey, TProvide> = (key: TKey) => TProvide;

/**
 * Options are the same as for an Observable, but onRelease needs to include a key
 */
export type Options<TKey, TProvide> = Omit<
  ObservableOptions<TProvide>,
  'onRelease'
> &
  Partial<{
    onRelease: (key: TKey, provide: TProvide) => void;
  }>;

export abstract class AbstractObservableMap<
  TKey,
  TResolve,
  TProvide,
  TObservable extends TAbstractObservable<
    TResolve,
    TProvide
  > = TAbstractObservable<TResolve, TProvide>,
> {
  private debugIdPrefix: Maybe<string> = null;
  private map: Observable<Map<TKey, TObservable>>;
  private getDefault: Maybe<getDefaultCB<TKey, TProvide>>;
  private options: Maybe<Options<TKey, TProvide>>;
  private makeObservable: (options: ObservableOptions<TProvide>) => TObservable;

  constructor(
    getDefault: Maybe<getDefaultCB<TKey, TProvide>>,
    valueOptions: Maybe<Options<TKey, TProvide>>,
    makeObservable: (options: ObservableOptions<TProvide>) => TObservable
  ) {
    this.map = new Observable({ default: new Map() });
    this.getDefault = getDefault;
    this.makeObservable = makeObservable;
    this.options = valueOptions;
  }

  setDebugPrefix = (prefix: string) => {
    this.debugIdPrefix = prefix;
    this.map.setDebugPrefix(prefix + '::map');
    this.map.peek()?.forEach((observable) => observable.setDebugPrefix(prefix));
  };

  /**
   * Retrieves the state associated with the given key if it exists and, in the case
   * of an async map, if the Promise has resolved. This method will not create a default
   * entry, even if a default has been set. Note that if the map contains nullable types,
   * using `peek` alone is insufficient to determine whether the state is `null` or if
   * the state does not exist.
   */
  peek = (key: TKey): Maybe<TResolve> => {
    return this.map.peek()?.get(key)?.peek();
  };

  peekEntries = (): Maybe<Array<[TKey, Maybe<TResolve>]>> => {
    const map = this.map.peek();
    if (map == null) {
      return null;
    }
    return Array.from(map.entries()).map(([key, observable]) => [
      key,
      observable.peek(),
    ]);
  };

  /**
   * Updates the value associated with the given key and notifies observers
   * of the change.
   */
  set = (key: TKey, value: TProvide) => {
    // Internal setter for creating or updating items in the map
    this.setImpl(key, value, SetMode.NORMAL);
  };

  has(key: TKey): boolean {
    return this.map.peek()?.has(key) === true;
  }

  /**
   * Removes all items from the map.
   */
  clear() {
    // Ensure all observables are properly cleaned up before removal
    this.map.peek()?.forEach((observable) => observable.destroy());
    // Replace the current map with a new one to ensure all comparisons fail
    this.map.set(new Map());
  }

  /**
   * Used by Observers and Observables to access the StateRef for a given key.
   * Should only be accessed internally
   */
  __observeRef = (
    observer: AbstractObserver,
    key: TKey
  ): Maybe<StateRef<TResolve, TProvide>> => {
    const map = (observer as AnyObserver).observe(this.map);
    let observable = map.get(key);
    // If the key does not exist but a default is specified, create it.
    if (observable == null && this.getDefault != null) {
      observable = this.setImpl(key, this.getDefault(key), SetMode.SILENT);
    }
    return observable?.__observeRef(observer);
  };

  /**
   * Internal setter that creates the observable for a given key if missing.
   */
  private setImpl(
    key: TKey,
    value: TProvide,
    updateMode: SetMode
  ): TObservable {
    // Use the existing map in silent mode to avoid unnecessary updates and potential
    // memory leaks when observers are reading keys. Otherwise, cloning the map
    // ensures that changes are detected, triggering necessary updates.
    const rawMap = nullthrows(this.map.peek(), 'Map not initialized');
    const map = updateMode === SetMode.SILENT ? rawMap : new Map(rawMap);
    let observable = map.get(key);
    if (observable == null) {
      const options: ObservableOptions<TProvide> = {
        ...this.options,
        default: value,
        // Wrap the onRelease function so we can clean up the map
        onRelease: (value) => {
          this.map.peek()?.delete(key);
          this.options?.onRelease?.(key, value);
        },
      };
      observable = this.makeObservable(options);
      if (this.debugIdPrefix != null) {
        observable.setDebugPrefix(this.debugIdPrefix);
      }
    } else {
      observable.set(value);
    }
    map.set(key, observable);
    if (updateMode !== SetMode.SILENT) {
      this.map.set(map);
    }
    return observable;
  }
}
