/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Observables can be monitored for changes by Observers. In other words,
 * Observers maintain state that can be subscribed to via an Observer.
 *
 * React Usage Example:
 *
 * // Create an Observable or AsyncObservable, ideally within a class
 * selectedPlanetID: Observable<?PlanetID> = new Observable({default: null});
 * allPlanets: AsyncObservable<Array<Planets>> = new AsyncObservable({
 *   default: async () => {
 *     const allPlanets = await fetchAllPlanets();
 *     this.selectedPlanetID.set(allPlanets[0]);
 *     return allPlanets;
 *   },
 * });
 *
 * // Within a React component, use an Observer to monitor any dependencies your
 * // component has.
 * const {observe} = useObserver();
 * // Async observers will throw a Promise to a <Suspense /> if still pending
 * const allPlanets = observe(PlanetStore.allPlanets);
 * const selectedPlanetID = observe(PlanetStore.selectedPlanetID);
 * const selectedPlanet = allPlanets.find(
 *   planet => planet.id === selectedPlanetID
 * );
 *
 * // You can use the "set" method from the Observable to pass directly to
 * // React components.
 * <PlanetSelector
 *   selected={selectedPlanetID}
 *   onChange={PlanetStore.selectedPlanetID.set}
 * />
 */

import { areEqual, ComparisonMethod } from '../utils/areEqual';
import { Maybe } from '../utils/Maybe';
import { AbstractObserver } from '../observers/AbstractObserver';
import { nullthrows } from '../utils/nullthrows';
import {
  StateRef,
  stateRefFromError,
  stateRefFromProvided,
  Status,
} from '../utils/StateRef';
import ObservableManager from '../manager/ObservableManager';

type TimeoutID = ReturnType<typeof setTimeout>;

enum ReleaseDelay {
  Default,
  Never,
}

/**
 * Options you can provide to an Observable
 */
export type Options<TProvide> = Partial<{
  // Specifies a starting value for the Observable. Without a default,
  // attempting to access the Observable before calling the "set" function
  // will throw an exception.
  default: TProvide;
  // Allows you to provide a custom debug ID for the Observable. This
  // can make it easier to track what observables were changed. If not provided,
  // a unique number will be assigned as the debug ID.
  debugID: string;
  // Allows for executing side effects when the Observable changes. This is
  // particularly useful in situations where you cannot use a selector and need
  // to trigger actions, such as updating another Observable, whenever this one
  // changes.
  onChanged: (newValue: TProvide) => unknown;
  // By default, Observables do not automatically release their resources.
  // However, you can specify a timeout delay to clean up resources once no
  // Observers are attached. After this delay, the Observable will release its
  // data references. If a onRelease callback is provided without a specified
  // delay, the delay defaults to 1 millisecond (i.e., the next frame).
  releaseDelay: number | ReleaseDelay;
  // If releasing the reference is insufficient for cleaning up the data, you
  // can specify a callback to perform additional cleanup.
  onRelease: (provided: TProvide) => unknown;
  // Determines the method for checking changes. By default, shallow equality
  // is used.
  comparisonMethod: ComparisonMethod;
}>;

/**
 * Used to generate unique IDs for each observable instance.
 */
let nextDebugID = 1;

/**
 * The default duration (in milliseconds) to wait before releasing observables
 * that are no longer being observed by any subscribers.
 */
const DEFAULT_RELEASE_DELAY_MS = 1;

/**
 * AbstractObservable serves as a base class for managing references to
 * Observables without requiring knowledge of their specific types. It defines
 * the fundamental methods necessary for interacting with the observable,
 * facilitating communication with other components.
 */
export abstract class AbstractObservable {
  protected debugID: number | string = nextDebugID++;
  abstract __checkForNoObservers(): void;
  abstract __removeObserver(observer: AbstractObserver): void;

  setDebugPrefix = (prefix: number | string) => {
    this.debugID = `${prefix}::${this.debugID}`;
  };
}

/**
 * TAbstractObservable servers as a base class for managing references to
 * Observables when the types are important. For Sync Observables, the Provided type
 * and the Resolved type are the same. For Async Observables, the Provided type
 * is a Promise and the Resolved type is the result of the Promise.
 */
export abstract class TAbstractObservable<
  TResolve,
  TProvide,
> extends AbstractObservable {
  private stateRef: Maybe<StateRef<TResolve, TProvide>> = null;
  private observers: Set<AbstractObserver> = new Set();
  private options: Options<TProvide>;
  private isDestroyed: boolean = false;
  private releaseTimeoutID: Maybe<TimeoutID> = null;

  constructor(options?: Maybe<Options<TProvide>>) {
    super();
    this.options = { ...options } as Options<TProvide>;
    if (options?.debugID != null) {
      this.debugID = options?.debugID;
    }
    if (options?.default != null) {
      this.stateRef = stateRefFromProvided<TResolve, TProvide>(options.default);
    }
  }

  /**
   * Checks if the state has been initialized. Accessing the state before
   * initialization can lead to exceptions.
   */
  isInitialized(): boolean {
    return this.stateRef != null;
  }

  /**
   * Cleans up the state and marks the observable as destroyed before removing
   * references to it.
   */
  destroy() {
    this.isDestroyed = true;
    this.clearState();
  }

  /**
   * Retrieves the cached state if it exists. Throws an error if the state has
   * not been initialized. Returns null if there was an error or if a Promise is
   * still pending. Note that if the Observable's type is nullable, using this
   * method alone may not distinguish between a null value and a missing value.
   */
  peek = (): Maybe<TResolve> => {
    const ref = nullthrows(
      this.stateRef,
      `Observable not initialized: ${this.debugID}`
    );
    return ref.peek();
  };

  /**
   * Updates the value and notifies observers if the new value differs from the
   * current value. This is defined as an arrow function to ensure it can be
   * used directly as a callback in React components, preserving the correct
   * `this` context.
   */
  set = (value: TProvide): void => {
    this.setImpl(value);
  };

  /**
   * Overridable method for setting the value. This method is provided to
   * address issues with `this` binding that can occur when overriding the
   * function expression used in the `set` method.
   */
  protected setImpl(value: TProvide) {
    const currentValue: Maybe<TResolve> = this.stateRef?.peek();
    if (
      areEqual(
        value,
        currentValue,
        this.options?.comparisonMethod ?? ComparisonMethod.ShallowEqual
      )
    ) {
      return;
    }
    const isInitialSet = this.stateRef == null;
    this.stateRef = stateRefFromProvided(value);
    if (!isInitialSet) {
      this.changed(value);
    } else {
      // Observers only need to be notified of changes after the initial set,
      // as they receive the current value upon observation and only need to be
      // informed when that value changes.
      // However, if an onChange callback is used to trigger side-effects,
      // transitioning from "not set" to "set" should be considered a change.
      this.options?.onChanged?.(value);
    }
  }

  /**
   * Sets the state to a failed state with the provided error. Once set, this
   * error will be thrown each time the state is observed, instead of returning
   * a value.
   */
  setError(error: Error) {
    this.stateRef = stateRefFromError<TResolve, TProvide>(error);
  }

  /**
   * Allows Observers and Observables to access the StateRef for a given key.
   * Should only be called by internal systems.
   */
  __observeRef = (observer: AbstractObserver): StateRef<TResolve, TProvide> => {
    this.addObserver(observer);
    return nullthrows(this.stateRef, 'Observable not initialized');
  };

  /**
   * Clears the reference count for the specified observer.
   * Should only be called by internal systems.
   */
  __removeObserver(observer: AbstractObserver) {
    if (!this.observers.has(observer)) {
      return;
    }
    this.observers.delete(observer);
    if (
      this.observers.size === 0 &&
      // Even if there are no more observers, wait for promises to resolve
      // before freeing the state. This prevents canceling async requests
      // that might be re-observed before completion, which would be wasteful.
      // The observer count will be checked again after the promise resolves.
      this.stateRef?.getStatus() !== Status.Pending
    ) {
      // Observers may be cleared during an update and quickly re-observed,
      // so delay checking for missing observers to prevent thrashing.
      ObservableManager.deferredCheckForNoObservers(this);
    }
  }

  /**
   * Checks if the state is ready to be released and initiates a timeout to
   * release it after the specified delay. This is used by the ObservableManager
   * to manage state lifecycle based on observer presence.
   */
  __checkForNoObservers() {
    const ref = this.stateRef;
    const releaseDelay = this.options?.releaseDelay;
    if (
      // Ensure the state has not already been cleaned up
      ref != null &&
      // Confirm there are no current observers
      this.observers.size === 0 &&
      // Ensure a release is not already scheduled
      this.releaseTimeoutID == null &&
      // Verify that a release is desired
      releaseDelay != null &&
      releaseDelay !== ReleaseDelay.Never
    ) {
      // Schedule the release with a delay to avoid unnecessary state disposal
      // if something quickly re-subscribes.
      this.releaseTimeoutID = setTimeout(
        () => this.release(ref),
        releaseDelay === ReleaseDelay.Default
          ? DEFAULT_RELEASE_DELAY_MS
          : releaseDelay
      );
    }
  }

  /**
   * Clears internal state and observers.
   */
  private clearState() {
    this.stateRef = null;
    this.observers.clear();
  }

  /**
   * Queues observers for notification of changes, then clears all references.
   * Observers will re-evaluate their observables after each change.
   */
  private changed(value: TProvide) {
    ObservableManager.addChangedObservers(this, this.observers);
    this.observers.clear();
    this.options?.onChanged?.(value);
  }

  /**
   * Adds an observer and cancels any pending release.
   */
  private addObserver(observer: AbstractObserver) {
    this.resetReleaseTimeout();
    this.observers.add(observer);
    observer.__addObservable(this);
  }

  /**
   * Cancels any pending release timeout if it exists.
   */
  private resetReleaseTimeout() {
    this.releaseTimeoutID != null && clearTimeout(this.releaseTimeoutID);
    this.releaseTimeoutID = null;
  }

  /**
   * Frees the state reference after the specified release delay in options.
   */
  private release(ref: StateRef<TResolve, TProvide>): void {
    this.resetReleaseTimeout();
    // This should not occur, as the timeout is canceled whenever observers are added.
    if (this.observers.size !== 0) {
      throw new Error('releasing with observers');
    }
    // If the state was set directly as an error (not a rejected Promise),
    // we should not call the release callback. Simply checking the status is
    // insufficient because a Promise might still call onRelease with a rejected
    // promise. Checking for a null state result is also inadequate, as the
    // Observable type might be nullable. Instead, use a container that wraps
    // the provided value; the container will be null if there's truly no value
    // to release.
    const holder = ref.getHolderForProvided();
    if (holder != null) {
      this.options.onRelease?.(holder.provided);
    }
    this.clearState();
  }
}
