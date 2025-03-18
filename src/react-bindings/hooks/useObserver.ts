/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * React hook for creating an observer for subscribing to observables.
 *
 * Usage:
 * const {observe, observeKey} = useObserver('MyComponent');
 * const planetID = observe(SolarSystemStore.selectedPlanetID);
 * const planetProps = observeKey(SolarSystemStore.planetProps, planetID);
 */

import { useEffect, useReducer, useRef } from 'react';
import { ComponentObserver } from '../../observite';

/**
 * Used in React components to create an observer for subscribing to
 * observables. The observer is automatically cleaned up when the component
 * unmounts.
 *
 * @param debugIdPrefix - A prefix to help identify the observer in debug logs
 * @returns A ComponentObserver instance for observing observables
 */
export function useObserver(debugIdPrefix?: string): ComponentObserver {
  // Create a ref for holding onto the observer across re-renders
  const ref = useRef<ComponentObserver | null>(null);

  if (ref.current == null) {
    ref.current = new ComponentObserver(debugIdPrefix);
  } else {
    ref.current.onRender();
  }

  const observer = ref.current;

  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);
  observer.setOnChange(forceUpdate);

  // Unlock the observe while inside this component's render function and then
  // the useEffect runs at the end of the render to lock the observer again.
  // This is to protect against an observer being used inside call backs.
  observer.unlock();
  useEffect(() => observer.lock(), undefined);

  // Make sure we clean up listener on unmount
  useEffect(() => () => observer.destroy(), []);

  return observer;
}
