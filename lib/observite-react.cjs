/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var react = require('react');
var observite = require('observite');

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
var __read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
/**
 * Used in React components to create an observer for subscribing to
 * observables. The observer is automatically cleaned up when the component
 * unmounts.
 *
 * @param debugIdPrefix - A prefix to help identify the observer in debug logs
 * @returns A ComponentObserver instance for observing observables
 */
function useObserver(debugIdPrefix) {
    // Create a ref for holding onto the observer across re-renders
    var ref = react.useRef(null);
    if (ref.current == null) {
        ref.current = new observite.ComponentObserver(debugIdPrefix);
    }
    else {
        ref.current.onRender();
    }
    var observer = ref.current;
    var _a = __read(react.useReducer(function (x) { return x + 1; }, 0), 2), forceUpdate = _a[1];
    observer.setOnChange(forceUpdate);
    // Unlock the observe while inside this component's render function and then
    // the useEffect runs at the end of the render to lock the observer again.
    // This is to protect against an observer being used inside call backs.
    observer.unlock();
    react.useEffect(function () { return observer.lock(); }, undefined);
    // Make sure we clean up listener on unmount
    react.useEffect(function () { return function () { return observer.destroy(); }; }, []);
    return observer;
}

exports.useObserver = useObserver;

module.exports = exports;
