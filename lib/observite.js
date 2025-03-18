/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var __values = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read$6 = (undefined && undefined.__read) || function (o, n) {
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
var ComparisonMethod;
(function (ComparisonMethod) {
    // Uses strict equality to determine changes. If you create a new object
    // or array with each "set" operation, such as by spreading values into a new
    // object (e.g., `{ ...oldObject }`), onChange events will always be triggered
    // because the reference will differ.
    ComparisonMethod[ComparisonMethod["Exact"] = 0] = "Exact";
    // Compares each value in an object or array. This allows you to spread values
    // into a new object or array without triggering updates to all observers, as
    // long as the top-level values remain unchanged.
    ComparisonMethod[ComparisonMethod["ShallowEqual"] = 1] = "ShallowEqual";
    // Recursively compares all nested properties to determine changes, walking
    // through all children for a deep comparison. This is useful for complex
    // data structures where deep equality is necessary.
    ComparisonMethod[ComparisonMethod["DeepEquals"] = 2] = "DeepEquals";
})(ComparisonMethod || (ComparisonMethod = {}));
/**
 * Returns true if the two values are equal, false otherwise. The comparison
 * method determines how equality is determined.
 */
function areEqual(a, b, method) {
    var e_1, _a, e_2, _b, e_3, _c;
    // Check for exact equality between 'a' and 'b'
    if (Object.is(a, b)) {
        return true;
    }
    var nextMethod = method;
    switch (method) {
        case ComparisonMethod.DeepEquals:
            // Recurse to the next level if deep equality is used
            nextMethod = ComparisonMethod.DeepEquals;
            break;
        case ComparisonMethod.ShallowEqual:
            // Recurse only once if shallow equality is used
            nextMethod = ComparisonMethod.Exact;
            break;
        case ComparisonMethod.Exact:
            // If comparison method is exact, values are not equal, so return false
            return false;
    }
    // Since we've already checked for exact equality, if either value is null or
    // undefined, it means they don't match, so return false
    if (a == null || b == null) {
        return false;
    }
    // Compare Maps
    if (a instanceof Map !== b instanceof Map) {
        return false;
    }
    if (a instanceof Map && b instanceof Map) {
        if (a.size !== b.size) {
            return false;
        }
        try {
            for (var a_1 = __values(a), a_1_1 = a_1.next(); !a_1_1.done; a_1_1 = a_1.next()) {
                var _d = __read$6(a_1_1.value, 2), key = _d[0], value = _d[1];
                if (!b.has(key)) {
                    return false;
                }
                if (!areEqual(value, b.get(key), nextMethod)) {
                    return false;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (a_1_1 && !a_1_1.done && (_a = a_1.return)) _a.call(a_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return true;
    }
    // Compare Sets
    if (a instanceof Set !== b instanceof Set) {
        return false;
    }
    if (a instanceof Set && b instanceof Set) {
        if (a.size !== b.size) {
            return false;
        }
        try {
            for (var a_2 = __values(a), a_2_1 = a_2.next(); !a_2_1.done; a_2_1 = a_2.next()) {
                var value = a_2_1.value;
                if (!b.has(value)) {
                    return false;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (a_2_1 && !a_2_1.done && (_b = a_2.return)) _b.call(a_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return true;
    }
    // Compare Arrays
    if (Array.isArray(a) !== Array.isArray(b)) {
        return false;
    }
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {
            return false;
        }
        for (var i = 0; i < a.length; i++) {
            if (!areEqual(a[i], b[i], nextMethod)) {
                return false;
            }
        }
        return true;
    }
    // Compare Objects
    if (typeof a === 'object' && typeof b === 'object') {
        var aKeys = Object.keys(a);
        var bKeys = Object.keys(b);
        if (aKeys.length !== bKeys.length) {
            return false;
        }
        try {
            for (var aKeys_1 = __values(aKeys), aKeys_1_1 = aKeys_1.next(); !aKeys_1_1.done; aKeys_1_1 = aKeys_1.next()) {
                var key = aKeys_1_1.value;
                if (!b.hasOwnProperty(key) ||
                    !areEqual(a[key], b[key], nextMethod)) {
                    return false;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (aKeys_1_1 && !aKeys_1_1.done && (_c = aKeys_1.return)) _c.call(aKeys_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return true;
    }
    return false;
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function nullthrows(value, message) {
    if (value != null) {
        return value;
    }
    throw new Error(message !== null && message !== void 0 ? message : 'Got unexpected null or undefined');
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function isPromise(value) {
    return value instanceof Promise;
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var __extends$c = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.Status = void 0;
(function (Status) {
    Status["Pending"] = "Pending";
    Status["Resolved"] = "Resolved";
    Status["Rejected"] = "Rejected";
})(exports.Status || (exports.Status = {}));
var ThrowMode;
(function (ThrowMode) {
    ThrowMode["ErrorOnPending"] = "ErrorOnPending";
    ThrowMode["ThrowPromise"] = "ThrowPromise";
})(ThrowMode || (ThrowMode = {}));
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
var AbstractStateRef = /** @class */ (function () {
    function AbstractStateRef(holder, state, onStatusChanged) {
        this.holder = null;
        this.onStatusChanged = null;
        this.holder = holder;
        this.state = state;
        this.onStatusChanged = onStatusChanged;
    }
    AbstractStateRef.prototype.getStatus = function () {
        return this.state.status;
    };
    AbstractStateRef.prototype.getState = function () {
        return this.state;
    };
    AbstractStateRef.prototype.setState = function (state) {
        var _a;
        var prevStatus = this.state.status;
        this.state = state;
        if (prevStatus !== state.status) {
            (_a = this.onStatusChanged) === null || _a === void 0 ? void 0 : _a.call(this, state.status, prevStatus);
        }
    };
    AbstractStateRef.prototype.getHolderForProvided = function () {
        return this.holder;
    };
    /**
     * Allows Observables to inspect the data without subscribing or modifying it.
     * The peek method does not provide context about the Promise or error status;
     * it simply returns the value if available.
     */
    AbstractStateRef.prototype.peek = function () {
        return this.state.status === exports.Status.Resolved ? this.state.result : null;
    };
    /**
     * Returns the provided value if the status is Status.Pending or Status.Resolved.
     * Throws an error if the status is Status.Rejected.
     */
    AbstractStateRef.prototype.getOrThrowProvided = function () {
        switch (this.state.status) {
            case exports.Status.Pending:
            case exports.Status.Resolved:
                return nullthrows(this.holder, 'Initialized without a value and not in a rejected state.').provided;
            case exports.Status.Rejected:
                throw this.state.error;
            default:
                this.state;
        }
        throw Error('This code path should be unreachable.');
    };
    /**
     * Returns the result if available, otherwise the provided value.
     * Throws an error only if the status is Status.Rejected.
     */
    AbstractStateRef.prototype.getOrThrowAsync = function () {
        switch (this.state.status) {
            case exports.Status.Pending:
                return nullthrows(this.holder, 'Initialized without a value and not in a rejected state.').provided;
            case exports.Status.Resolved:
                return this.state.result;
            case exports.Status.Rejected:
                throw this.state.error;
            default:
                this.state;
        }
        throw Error('This code path should be unreachable.');
    };
    /**
     * Throws if the status is not 'Resolved'. Handles promises based on the mode:
     * - ThrowMode.ErrorOnPending: Throws an error if pending
     * - ThrowMode.ThrowPromise: Throws the promise itself if pending
     */
    AbstractStateRef.prototype.getOrThrowSync = function (mode) {
        switch (this.state.status) {
            case exports.Status.Pending:
                if (mode === ThrowMode.ThrowPromise) {
                    throw this.state.promise;
                }
                else {
                    throw new Error('Attempted to access a pending state from synchronous code.');
                }
            case exports.Status.Resolved:
                return this.state.result;
            case exports.Status.Rejected:
                throw this.state.error;
            default:
                this.state;
        }
        throw Error('This code path should be unreachable.');
    };
    return AbstractStateRef;
}());
var AsyncStateRef = /** @class */ (function (_super) {
    __extends$c(AsyncStateRef, _super);
    function AsyncStateRef(promise, onStatusChanged) {
        var _this = _super.call(this, { provided: promise }, { status: exports.Status.Pending, promise: promise }, onStatusChanged) || this;
        _this.promise = promise.then(function (result) {
            _this.setState({ status: exports.Status.Resolved, result: result });
            return result;
        }, function (thrown) {
            var error = isPromise(thrown)
                ? new Error('Promise thrown inside of promise')
                : thrown;
            _this.setState({ status: exports.Status.Rejected, error: error });
            throw error;
        });
        return _this;
    }
    return AsyncStateRef;
}(AbstractStateRef));
var SyncStateRef = /** @class */ (function (_super) {
    __extends$c(SyncStateRef, _super);
    function SyncStateRef(result, onStatusChanged) {
        return _super.call(this, { provided: result }, { status: exports.Status.Resolved, result: result }, onStatusChanged) || this;
    }
    return SyncStateRef;
}(AbstractStateRef));
var FailedStateRef = /** @class */ (function (_super) {
    __extends$c(FailedStateRef, _super);
    function FailedStateRef(error) {
        return _super.call(this, null, { status: exports.Status.Rejected, error: error }) || this;
    }
    return FailedStateRef;
}(AbstractStateRef));
/**
 * Creates a StateRef from a value or a promise of a value.
 * - If a Promise is provided, an AsyncStateRef is created.
 * - Otherwise, a SyncStateRef is created.
 */
function stateRefFromProvided(provided, onStatusChanged) {
    if (isPromise(provided)) {
        return new AsyncStateRef(provided, onStatusChanged);
    }
    else {
        return new SyncStateRef(provided, onStatusChanged);
    }
}
/**
 * Creates a StateRef with a rejected status without needing a
 * source value for the error.
 */
function stateRefFromError(error) {
    return new FailedStateRef(error);
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * Since ReleaseDelay is a union type that includes a number for exact release
 * delays, we need to use a string literal to ensure type safety.
 */
exports.ReleaseDelay = void 0;
(function (ReleaseDelay) {
    ReleaseDelay["Default"] = "Default";
    ReleaseDelay["Never"] = "Never";
})(exports.ReleaseDelay || (exports.ReleaseDelay = {}));

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Be sure to call setConfigOptions() before initializing any other modules.
 */
var __assign$5 = (undefined && undefined.__assign) || function () {
    __assign$5 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$5.apply(this, arguments);
};
/**
 * Default configuration values.
 */
var config = {
    // Use shallow equality as the default comparison method to avoid unnecessary
    // re-renders when using spread operators for updates.
    defaultComparisonMethod: ComparisonMethod.ShallowEqual,
    // Wait a frame before releasing (1ms).
    defaultReleaseDelayMS: 1,
    // Base Observables are not worth releasing by default.
    defaultObservableReleaseDelay: exports.ReleaseDelay.Never,
    // Selectors are usually worth releasing by default.
    defaultSelectorReleaseDelay: exports.ReleaseDelay.Default,
    // Use global timers by default.
    setTimeout: window.setTimeout.bind(window),
    clearTimeout: window.clearTimeout.bind(window),
    setInterval: window.setInterval.bind(window),
    clearInterval: window.clearInterval.bind(window),
    setImmediate: function (cb) {
        if (typeof setImmediate !== 'undefined') {
            return window.setImmediate(cb);
        }
        return window.setTimeout(cb, 0);
    },
};
function setConfigOptions(options) {
    config = __assign$5(__assign$5({}, config), options);
}
function getConfig() {
    return config;
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * ObservableManager is responsible for queuing Observers to be notified in a
 * breadth-first manner, rather than depth-first. This approach minimizes
 * unnecessary updates and ensures consistency across dependent Observables.
 *
 * Consider an Observable called Galaxy that stores information about the
 * galaxy. There are two Selectors: SolarSystems, which extracts solar systems
 * from the Galaxy, and Planets, which extracts planets. An Observer called
 * Person combines information from SolarSystems and Planets to derive insights
 * about the Universe. What happens when a new solar system is added to the
 * Galaxy?
 *
 *          SolarSystems
 *        /              \
 * Galaxy                  Person
 *        \              /
 *            Planets
 *
 * Without ObservableManager, updates would proceed as follows:
 * - Galaxy updates and informs SolarSystems to update.
 * - SolarSystems updates and informs Person to update.
 * - Galaxy informs Planets to update.
 * - Planets updates and informs Person to update again.
 *
 * As the tree grows, more unnecessary updates occur. Additionally, Person
 * might fail to compute its state correctly if it receives SolarSystems with
 * planets that aren't yet updated in Planets.
 *
 * During updates, Observers may start and stop observing frequently.
 * ObservableManager helps prevent thrashing of reference count checks and
 * avoids premature state release by deferring these checks until the update
 * completes.
 */
var ObservableManager = /** @class */ (function () {
    function ObservableManager() {
        var _this = this;
        this.isUpdating = false;
        this.pendingChanges = new Set();
        this.observablesToCheck = new Set();
        this.pendingComponentUpdates = new Set();
        this.addChangedObserverImpl = function (observer) {
            _this.pendingChanges.add(observer);
        };
    }
    /**
     * Queues all observers of a given observable for notification updates.
     */
    ObservableManager.prototype.addChangedObservers = function (observable, observers) {
        observers.forEach(this.addChangedObserverImpl);
        this.deferredCheckForNoObservers(observable);
    };
    /**
     * Queues a change for the specified observer.
     */
    ObservableManager.prototype.addChangedObserver = function (observer) {
        this.addChangedObserverImpl(observer);
        this.update();
    };
    /**
     * Schedules a check for an observable that has no more observers.
     */
    ObservableManager.prototype.deferredCheckForNoObservers = function (observable) {
        this.observablesToCheck.add(observable);
        this.update();
    };
    /**
     * Initiates the process of processing the queue if it hasn't started yet.
     */
    ObservableManager.prototype.update = function () {
        var _this = this;
        if (this.isUpdating === false) {
            this.isUpdating = true;
            getConfig().setImmediate(function () { return _this.flushQueue(); });
        }
    };
    /**
     * Marks a change as handled for the specified observer, removing any pending
     * component updates if present.
     */
    ObservableManager.prototype.changeHandled = function (observer) {
        // Remove any pending update, as the component may have already rendered.
        this.pendingComponentUpdates.delete(observer);
    };
    /**
     * Processes the queue of pending changes, ensuring that updates are handled
     * in the correct order. This method assumes the process hasn't started yet.
     */
    ObservableManager.prototype.flushQueue = function () {
        var _this = this;
        // Continuously process the queue to handle dynamic changes that may occur
        // during processing, ensuring no updates are missed.
        while (this.pendingChanges.size > 0) {
            // Sorting by creation order helps maintain a predictable update sequence,
            // which is crucial for handling dependencies correctly. Although solving
            // the dependency tree would be ideal, this approach is currently fast enough.
            var changedQueue = Array.from(this.pendingChanges).sort(function (a, b) { return a.__getCreationOrder() - b.__getCreationOrder(); });
            var observer = changedQueue[0];
            this.pendingChanges.delete(observer);
            if (observer.getIsComponent()) {
                // Component updates are deferred to ensure they are processed separately,
                // allowing for batch updates and reducing unnecessary re-renders.
                this.pendingComponentUpdates.add(observer);
            }
            else {
                observer.__observableChanged();
            }
        }
        // Sort the list of components we need to update by their creation order.
        // This ensures that parent components render before their children, maintaining
        // the correct rendering hierarchy and preventing potential rendering issues.
        var componentObservers = Array.from(this.pendingComponentUpdates);
        componentObservers.sort(function (a, b) { return a.__getCreationOrder() - b.__getCreationOrder(); });
        componentObservers.forEach(function (observer) {
            // The set of pending component updates can change during rendering due to
            // new updates being triggered. Therefore, we only proceed with updates for
            // components that are still in the original set to avoid redundant operations.
            if (_this.pendingComponentUpdates.has(observer)) {
                observer.__observableChanged();
            }
        });
        // Perform reference counter checks on any Observables that have been updated.
        // This helps identify and clean up Observables that no longer have any observers,
        // preventing memory leaks and ensuring efficient resource management.
        this.observablesToCheck.forEach(function (observable) {
            return observable.__checkForNoObservers();
        });
        // Clear the state for the next update cycle to ensure that the system is ready
        // for new changes and does not carry over any stale data from the previous cycle.
        this.observablesToCheck.clear();
        this.pendingComponentUpdates.clear();
        this.isUpdating = false;
    };
    return ObservableManager;
}());
var manager = new ObservableManager();

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
var __extends$b = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign$4 = (undefined && undefined.__assign) || function () {
    __assign$4 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$4.apply(this, arguments);
};
/**
 * Used to generate unique IDs for each observable instance.
 */
var nextDebugID$2 = 1;
/**
 * AbstractObservable serves as a base class for managing references to
 * Observables without requiring knowledge of their specific types. It defines
 * the fundamental methods necessary for interacting with the observable,
 * facilitating communication with other components.
 */
var AbstractObservable = /** @class */ (function () {
    function AbstractObservable() {
        var _this = this;
        this.debugID = nextDebugID$2++;
        this.setDebugPrefix = function (prefix) {
            _this.debugID = "".concat(prefix, "::").concat(_this.debugID);
        };
    }
    return AbstractObservable;
}());
/**
 * TAbstractObservable servers as a base class for managing references to
 * Observables when the types are important. For Sync Observables, the Provided type
 * and the Resolved type are the same. For Async Observables, the Provided type
 * is a Promise and the Resolved type is the result of the Promise.
 */
var TAbstractObservable = /** @class */ (function (_super) {
    __extends$b(TAbstractObservable, _super);
    function TAbstractObservable(options) {
        var _this = _super.call(this) || this;
        _this.stateRef = null;
        _this.observers = new Set();
        _this.isDestroyed = false;
        _this.releaseTimeoutID = null;
        /**
         * Retrieves the cached state if it exists. Throws an error if the state has
         * not been initialized. Returns null if there was an error or if a Promise is
         * still pending. Note that if the Observable's type is nullable, using this
         * method alone may not distinguish between a null value and a missing value.
         */
        _this.peek = function () {
            var ref = nullthrows(_this.stateRef, "Observable not initialized: ".concat(_this.debugID));
            return ref.peek();
        };
        /**
         * Updates the value and notifies observers if the new value differs from the
         * current value. This is defined as an arrow function to ensure it can be
         * used directly as a callback in React components, preserving the correct
         * `this` context.
         */
        _this.set = function (value) {
            _this.setImpl(value);
        };
        /**
         * Allows Observers and Observables to access the StateRef for a given key.
         * Should only be called by internal systems.
         */
        _this.__observeRef = function (observer) {
            _this.addObserver(observer);
            return nullthrows(_this.stateRef, 'Observable not initialized');
        };
        _this.options = __assign$4({}, options);
        if ((options === null || options === void 0 ? void 0 : options.debugID) != null) {
            _this.debugID = options === null || options === void 0 ? void 0 : options.debugID;
        }
        if (options != null) {
            var defaultValue = options.default;
            if (defaultValue !== undefined) {
                _this.stateRef = stateRefFromProvided(defaultValue);
            }
        }
        return _this;
    }
    /**
     * Checks if the state has been initialized. Accessing the state before
     * initialization can lead to exceptions.
     */
    TAbstractObservable.prototype.isInitialized = function () {
        return this.stateRef != null;
    };
    /**
     * Cleans up the state and marks the observable as destroyed before removing
     * references to it.
     */
    TAbstractObservable.prototype.destroy = function () {
        this.isDestroyed = true;
        this.clearState();
    };
    /**
     * Overridable method for setting the value. This method is provided to
     * address issues with `this` binding that can occur when overriding the
     * function expression used in the `set` method.
     */
    TAbstractObservable.prototype.setImpl = function (value) {
        var _a, _b, _c, _d, _e;
        var currentValue = (_a = this.stateRef) === null || _a === void 0 ? void 0 : _a.peek();
        if (areEqual(value, currentValue, (_c = (_b = this.options) === null || _b === void 0 ? void 0 : _b.comparisonMethod) !== null && _c !== void 0 ? _c : getConfig().defaultComparisonMethod)) {
            return;
        }
        var isInitialSet = this.stateRef == null;
        this.stateRef = stateRefFromProvided(value);
        if (!isInitialSet) {
            this.changed(value);
        }
        else {
            // Observers only need to be notified of changes after the initial set,
            // as they receive the current value upon observation and only need to be
            // informed when that value changes.
            // However, if an onChange callback is used to trigger side-effects,
            // transitioning from "not set" to "set" should be considered a change.
            (_e = (_d = this.options) === null || _d === void 0 ? void 0 : _d.onChanged) === null || _e === void 0 ? void 0 : _e.call(_d, value);
        }
    };
    /**
     * Sets the state to a failed state with the provided error. Once set, this
     * error will be thrown each time the state is observed, instead of returning
     * a value.
     */
    TAbstractObservable.prototype.setError = function (error) {
        this.stateRef = stateRefFromError(error);
    };
    /**
     * Clears the reference count for the specified observer.
     * Should only be called by internal systems.
     */
    TAbstractObservable.prototype.__removeObserver = function (observer) {
        var _a;
        if (!this.observers.has(observer)) {
            return;
        }
        this.observers.delete(observer);
        if (this.observers.size === 0 &&
            // Even if there are no more observers, wait for promises to resolve
            // before freeing the state. This prevents canceling async requests
            // that might be re-observed before completion, which would be wasteful.
            // The observer count will be checked again after the promise resolves.
            ((_a = this.stateRef) === null || _a === void 0 ? void 0 : _a.getStatus()) !== exports.Status.Pending) {
            // Observers may be cleared during an update and quickly re-observed,
            // so delay checking for missing observers to prevent thrashing.
            manager.deferredCheckForNoObservers(this);
        }
    };
    /**
     * Checks if the state is ready to be released and initiates a timeout to
     * release it after the specified delay. This is used by the ObservableManager
     * to manage state lifecycle based on observer presence.
     */
    TAbstractObservable.prototype.__checkForNoObservers = function () {
        var _this = this;
        var _a, _b;
        var ref = this.stateRef;
        var releaseDelay = (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.releaseDelay) !== null && _b !== void 0 ? _b : getConfig().defaultObservableReleaseDelay;
        if (
        // Ensure the state has not already been cleaned up
        ref != null &&
            // Confirm there are no current observers
            this.observers.size === 0 &&
            // Ensure a release is not already scheduled
            this.releaseTimeoutID == null &&
            // Verify that a release is desired
            releaseDelay != null &&
            releaseDelay !== exports.ReleaseDelay.Never) {
            // Schedule the release with a delay to avoid unnecessary state disposal
            // if something quickly re-subscribes.
            this.releaseTimeoutID = getConfig().setTimeout(function () { return _this.release(ref); }, releaseDelay === exports.ReleaseDelay.Default
                ? getConfig().defaultReleaseDelayMS
                : releaseDelay);
        }
    };
    /**
     * Clears internal state and observers.
     */
    TAbstractObservable.prototype.clearState = function () {
        this.stateRef = null;
        this.observers.clear();
    };
    /**
     * Queues observers for notification of changes, then clears all references.
     * Observers will re-evaluate their observables after each change.
     */
    TAbstractObservable.prototype.changed = function (value) {
        var _a, _b;
        manager.addChangedObservers(this, this.observers);
        this.observers.clear();
        (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.onChanged) === null || _b === void 0 ? void 0 : _b.call(_a, value);
    };
    /**
     * Adds an observer and cancels any pending release.
     */
    TAbstractObservable.prototype.addObserver = function (observer) {
        this.resetReleaseTimeout();
        this.observers.add(observer);
        observer.__addObservable(this);
    };
    /**
     * Cancels any pending release timeout if it exists.
     */
    TAbstractObservable.prototype.resetReleaseTimeout = function () {
        this.releaseTimeoutID != null &&
            getConfig().clearTimeout(this.releaseTimeoutID);
        this.releaseTimeoutID = null;
    };
    /**
     * Frees the state reference after the specified release delay in options.
     */
    TAbstractObservable.prototype.release = function (ref) {
        var _a, _b;
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
        var holder = ref.getHolderForProvided();
        if (holder != null) {
            (_b = (_a = this.options).onRelease) === null || _b === void 0 ? void 0 : _b.call(_a, holder.provided);
        }
        this.clearState();
    };
    return TAbstractObservable;
}(AbstractObservable));

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var __extends$a = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var AsyncObservable = /** @class */ (function (_super) {
    __extends$a(AsyncObservable, _super);
    function AsyncObservable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AsyncObservable.factory = function (options) { return new AsyncObservable(options); };
    return AsyncObservable;
}(TAbstractObservable));

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var __extends$9 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Observable = /** @class */ (function (_super) {
    __extends$9(Observable, _super);
    function Observable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Observable.factory = function (options) { return new Observable(options); };
    return Observable;
}(TAbstractObservable));

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
var __assign$3 = (undefined && undefined.__assign) || function () {
    __assign$3 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$3.apply(this, arguments);
};
var __read$5 = (undefined && undefined.__read) || function (o, n) {
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
var SetMode;
(function (SetMode) {
    SetMode[SetMode["NORMAL"] = 0] = "NORMAL";
    SetMode[SetMode["SILENT"] = 1] = "SILENT";
})(SetMode || (SetMode = {}));
var AbstractObservableMap = /** @class */ (function () {
    function AbstractObservableMap(getDefault, valueOptions, makeObservable) {
        var _this = this;
        this.debugIdPrefix = null;
        this.setDebugPrefix = function (prefix) {
            var _a;
            _this.debugIdPrefix = prefix;
            _this.map.setDebugPrefix(prefix + '::map');
            (_a = _this.map.peek()) === null || _a === void 0 ? void 0 : _a.forEach(function (observable) { return observable.setDebugPrefix(prefix); });
        };
        /**
         * Retrieves the state associated with the given key if it exists and, in the case
         * of an async map, if the Promise has resolved. This method will not create a default
         * entry, even if a default has been set. Note that if the map contains nullable types,
         * using `peek` alone is insufficient to determine whether the state is `null` or if
         * the state does not exist.
         */
        this.peek = function (key) {
            var _a, _b;
            return (_b = (_a = _this.map.peek()) === null || _a === void 0 ? void 0 : _a.get(key)) === null || _b === void 0 ? void 0 : _b.peek();
        };
        this.peekEntries = function () {
            var map = _this.map.peek();
            if (map == null) {
                return null;
            }
            return Array.from(map.entries()).map(function (_a) {
                var _b = __read$5(_a, 2), key = _b[0], observable = _b[1];
                return [
                    key,
                    observable.peek(),
                ];
            });
        };
        /**
         * Updates the value associated with the given key and notifies observers
         * of the change.
         */
        this.set = function (key, value) {
            // Internal setter for creating or updating items in the map
            _this.setImpl(key, value, SetMode.NORMAL);
        };
        /**
         * Used by Observers and Observables to access the StateRef for a given key.
         * Should only be accessed internally
         */
        this.__observeRef = function (observer, key) {
            var map = observer.observe(_this.map);
            var observable = map.get(key);
            // If the key does not exist but a default is specified, create it.
            if (observable == null && _this.getDefault != null) {
                observable = _this.setImpl(key, _this.getDefault(key), SetMode.SILENT);
            }
            return observable === null || observable === void 0 ? void 0 : observable.__observeRef(observer);
        };
        this.map = new Observable({ default: new Map() });
        this.getDefault = getDefault;
        this.makeObservable = makeObservable;
        this.options = valueOptions;
    }
    AbstractObservableMap.prototype.has = function (key) {
        var _a;
        return ((_a = this.map.peek()) === null || _a === void 0 ? void 0 : _a.has(key)) === true;
    };
    /**
     * Removes all items from the map.
     */
    AbstractObservableMap.prototype.clear = function () {
        var _a;
        // Ensure all observables are properly cleaned up before removal
        (_a = this.map.peek()) === null || _a === void 0 ? void 0 : _a.forEach(function (observable) { return observable.destroy(); });
        // Replace the current map with a new one to ensure all comparisons fail
        this.map.set(new Map());
    };
    /**
     * Internal setter that creates the observable for a given key if missing.
     */
    AbstractObservableMap.prototype.setImpl = function (key, value, updateMode) {
        var _this = this;
        // Use the existing map in silent mode to avoid unnecessary updates and potential
        // memory leaks when observers are reading keys. Otherwise, cloning the map
        // ensures that changes are detected, triggering necessary updates.
        var rawMap = nullthrows(this.map.peek(), 'Map not initialized');
        var map = updateMode === SetMode.SILENT ? rawMap : new Map(rawMap);
        var observable = map.get(key);
        if (observable == null) {
            var options = __assign$3(__assign$3({}, this.options), { default: value, 
                // Wrap the onRelease function so we can clean up the map
                onRelease: function (value) {
                    var _a, _b, _c;
                    (_a = _this.map.peek()) === null || _a === void 0 ? void 0 : _a.delete(key);
                    (_c = (_b = _this.options) === null || _b === void 0 ? void 0 : _b.onRelease) === null || _c === void 0 ? void 0 : _c.call(_b, key, value);
                } });
            observable = this.makeObservable(options);
            if (this.debugIdPrefix != null) {
                observable.setDebugPrefix(this.debugIdPrefix);
            }
        }
        else {
            observable.set(value);
        }
        map.set(key, observable);
        if (updateMode !== SetMode.SILENT) {
            this.map.set(map);
        }
        return observable;
    };
    return AbstractObservableMap;
}());

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
var __assign$2 = (undefined && undefined.__assign) || function () {
    __assign$2 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$2.apply(this, arguments);
};
/**
 * Static used for creating unique ids for each observable.
 */
var nextDebugID$1 = 1;
var AbstractSelector = /** @class */ (function () {
    function AbstractSelector(getState, options, createObserver, createObservable) {
        var _this = this;
        this.debugID = nextDebugID$1++;
        this.setDebugPrefix = function (prefix) {
            _this.debugID = prefix + '::' + _this.debugID;
            _this.stateObserver.setDebugPrefix(prefix + '::observer');
            _this.stateObservable.setDebugPrefix(prefix + '::observable');
        };
        /**
         * Retrieves the cached state if it exists from an observer's request.
         * This method will not generate the state if it is missing. Note that if
         * the selector is for a nullable type, using peek alone is insufficient to
         * determine whether the state is null or does not exist.
         */
        this.peek = function () {
            return _this.stateObservable.peek();
        };
        this.peekSafe = function () {
            return _this.stateObservable.isInitialized()
                ? _this.stateObservable.peek()
                : null;
        };
        /**
         * Although selectors are downstream from observables, it can sometimes be
         * convenient to have a setter that accepts the same value provided by getState.
         * This setter would internally determine what needs to be updated so that
         * getState will subsequently provide that value.
         */
        this.set = function (_) {
            throw new Error('Set on selectors not yet supported');
        };
        /**
         * Used by Observers and Observables to access the StateRef.
         */
        this.__observeRef = function (observer) {
            // Ensure the state is initialized if this is the first request for it.
            if (!_this.stateObservable.isInitialized()) {
                _this.updateState();
            }
            return _this.stateObservable.__observeRef(observer);
        };
        /**
         * Calls the getState callback and caches the result.
         */
        this.updateState = function () {
            try {
                var prevState = _this.stateObservable.isInitialized()
                    ? _this.stateObservable.peek()
                    : null;
                var state = _this.getState(_this.stateObserver, prevState);
                _this.stateObservable.set(state);
            }
            catch (thrown) {
                _this.stateObservable.setError(
                // Throwing promises only works inside React components. You can't
                // access async state from synchronous code. You either need to make
                // more of your code async or wrap promises in a handler such as a
                // LoadObject.
                (isPromise(thrown)
                    ? new Error('Promise thrown inside Promise')
                    : thrown));
            }
        };
        this.getState = getState;
        this.stateObserver = createObserver();
        this.stateObserver.setOnChange(this.updateState);
        this.stateObservable = createObservable(__assign$2(__assign$2({ releaseDelay: getConfig().defaultSelectorReleaseDelay }, options), { 
            // Wrap the onRelease function to ensure that anything this
            // selector is observing stops being observed.
            onRelease: function (value) {
                var _a, _b;
                (_a = _this.stateObserver) === null || _a === void 0 ? void 0 : _a.reset();
                (_b = options === null || options === void 0 ? void 0 : options.onRelease) === null || _b === void 0 ? void 0 : _b.call(options, value);
            } }));
    }
    /**
     * Cleans up the state when removing all references to this selector.
     */
    AbstractSelector.prototype.destroy = function () {
        var _a;
        (_a = this.stateObserver) === null || _a === void 0 ? void 0 : _a.destroy();
        this.stateObservable.destroy();
    };
    return AbstractSelector;
}());

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * Static used for creating unique ids for each observable.
 */
var nextDebugID = 1;
/**
 * Observers monitor Observables, which contain state. An Observer can
 * subscribe to as many Observables as needed, allowing it to detect changes
 * to their combined state. When any of these Observables change, the Observer
 * stops monitoring all of them and restarts observation in the onChange
 * callback. This allows the Observer to adapt to changing conditions by
 * re-evaluating which Observables are relevant, based on the current state
 * of other Observables.
 */
var AbstractObserver = /** @class */ (function () {
    function AbstractObserver(debugPrefix) {
        var _this = this;
        this.observables = new Set();
        this.onChange = null;
        this.creationOrder = nextDebugID++;
        this.debugID = this.creationOrder;
        this.isComponent = false;
        this.observeState = function (observable) {
            var state = observable.__observeRef(_this).getState();
            if (state.status === exports.Status.Pending) {
                // When the promise finishes, consider it a change event.
                state.promise.then(function () { return manager.addChangedObserver(_this); }, function () { return manager.addChangedObserver(_this); });
            }
            return state;
        };
        this.observeKeyState = function (observable, key) {
            var _a;
            var state = (_a = observable.__observeRef(_this, key)) === null || _a === void 0 ? void 0 : _a.getState();
            if (state == null) {
                return null;
            }
            if (state.status === exports.Status.Pending) {
                // When the promise finishes, consider it a change event.
                state.promise.then(function () { return manager.addChangedObserver(_this); }, function () { return manager.addChangedObserver(_this); });
            }
            return state;
        };
        if (debugPrefix != null) {
            this.setDebugPrefix(debugPrefix);
        }
    }
    /**
     * Should only be called by internal systems.
     */
    AbstractObserver.prototype.__getCreationOrder = function () {
        return this.creationOrder;
    };
    AbstractObserver.prototype.setDebugPrefix = function (prefix) {
        this.debugID = "".concat(prefix, "::").concat(this.debugID);
    };
    AbstractObserver.prototype.setOnChange = function (onChange) {
        this.onChange = onChange;
    };
    AbstractObserver.prototype.getIsComponent = function () {
        return this.isComponent;
    };
    /**
     * Called when the Observer is no longer needed. Cleans up any resources.
     */
    AbstractObserver.prototype.destroy = function () {
        this.onChange = null;
        this.reset();
    };
    /**
     * Called to clear subscriptions to all Observables.
     */
    AbstractObserver.prototype.reset = function () {
        var _this = this;
        this.observables.forEach(function (observable) { return observable.__removeObserver(_this); });
        this.observables.clear();
    };
    /**
     * Should only be called by internal systems.
     */
    AbstractObserver.prototype.__addObservable = function (observable) {
        if (this.onChange != null) {
            this.observables.add(observable);
        }
    };
    /**
     * Should only be called by internal systems.
     */
    AbstractObserver.prototype.__observableChanged = function () {
        var _a;
        this.reset();
        (_a = this.onChange) === null || _a === void 0 ? void 0 : _a.call(this);
    };
    return AbstractObserver;
}());

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Use when you need to observe both synchronous and
 * asynchronous observables.
 */
var __extends$8 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read$4 = (undefined && undefined.__read) || function (o, n) {
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
var __spreadArray$2 = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var AsyncObserver = /** @class */ (function (_super) {
    __extends$8(AsyncObserver, _super);
    function AsyncObserver() {
        var _this = _super.apply(this, __spreadArray$2([], __read$4(arguments), false)) || this;
        _this.observe = function (observable) {
            var ref = observable.__observeRef(_this);
            return ref.getOrThrowProvided();
        };
        _this.observeKey = function (observable, key) {
            var _a;
            return (_a = observable.__observeRef(_this, key)) === null || _a === void 0 ? void 0 : _a.getOrThrowProvided();
        };
        return _this;
    }
    AsyncObserver.factory = function () { return new AsyncObserver(); };
    return AsyncObserver;
}(AbstractObserver));

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var __extends$7 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var AsyncSelector = /** @class */ (function (_super) {
    __extends$7(AsyncSelector, _super);
    function AsyncSelector(getState, options) {
        return _super.call(this, getState, options, AsyncObserver.factory, AsyncObservable.factory) || this;
    }
    AsyncSelector.factory = function (getState, options) { return new AsyncSelector(getState, options); };
    return AsyncSelector;
}(AbstractSelector));

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var __extends$6 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read$3 = (undefined && undefined.__read) || function (o, n) {
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
var AsyncObservableMap = /** @class */ (function (_super) {
    __extends$6(AsyncObservableMap, _super);
    function AsyncObservableMap(getDefault, valueOptions) {
        var _this = _super.call(this, getDefault, valueOptions, AsyncObservable.factory) || this;
        /**
         * Convenience selector that can be used to access all items in the map
         */
        _this.entries = new AsyncSelector(function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
            var map;
            var _this = this;
            var observe = _b.observe;
            return __generator(this, function (_c) {
                map = observe(this.map);
                return [2 /*return*/, Promise.all(Array.from(map.entries()).map(function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
                        var _c;
                        var _d = __read$3(_b, 2), key = _d[0], observable = _d[1];
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    _c = [key];
                                    return [4 /*yield*/, observe(observable)];
                                case 1: return [2 /*return*/, _c.concat([
                                        _e.sent()
                                    ])];
                            }
                        });
                    }); }))];
            });
        }); });
        return _this;
    }
    return AsyncObservableMap;
}(AbstractObservableMap));

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
var __assign$1 = (undefined && undefined.__assign) || function () {
    __assign$1 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$1.apply(this, arguments);
};
var AbstractSelectorMap = /** @class */ (function () {
    function AbstractSelectorMap(getState, options, createSelector) {
        var _this = this;
        this.debugIdPrefix = null;
        this.selectors = new Map();
        this.setDebugPrefix = function (prefix) {
            _this.debugIdPrefix = prefix;
            _this.selectors.forEach(function (selector) { return selector.setDebugPrefix(prefix); });
        };
        /**
         * Retrieves the cached state for a given key if it exists from an observer's request.
         * This method will not generate the state if it is missing. Note that if the selector
         * is for a nullable type, using peek alone is insufficient to determine whether the
         * state is null or does not exist.
         */
        this.peek = function (key) {
            if (!_this.selectors.has(key)) {
                return null;
            }
            return _this.getSelector(key).peek();
        };
        /**
         * Although selectors are downstream from observables, it can sometimes be
         * convenient to have a setter that accepts the same value provided by getState.
         * This setter would internally determine what needs to be updated so that
         * getState will subsequently provide that new value.
         */
        this.set = function (_key, _provide) {
            throw new Error('Set on selectors not yet supported');
        };
        /**
         * Used by Observers and Observables to access the StateRef for a given key.
         */
        this.__observeRef = function (observer, key) {
            var selector = _this.getSelector(key);
            return selector.__observeRef(observer);
        };
        this.getState = getState;
        this.options = options;
        this.createSelector = createSelector;
    }
    /**
     * Retrieves the selector associated with a given key, or creates one if it
     * does not exist yet.
     */
    AbstractSelectorMap.prototype.getSelector = function (key) {
        var _this = this;
        var selector = this.selectors.get(key);
        if (selector == null) {
            selector = this.createSelector(
            // Create a GetStateCallback with the key bound to the function
            function (observer) { return _this.getState(observer, key); }, __assign$1(__assign$1({ 
                // By default, we want selectors to release their state when not observed,
                // as this data is derived and doesn't need to persist.
                releaseDelay: exports.ReleaseDelay.Default }, this.options), { onRelease: function (value) {
                    var _a, _b, _c;
                    (_a = _this.selectors.get(key)) === null || _a === void 0 ? void 0 : _a.destroy();
                    _this.selectors.delete(key);
                    (_c = (_b = _this.options) === null || _b === void 0 ? void 0 : _b.onRelease) === null || _c === void 0 ? void 0 : _c.call(_b, key, value);
                } }));
            if (this.debugIdPrefix != null) {
                selector.setDebugPrefix(this.debugIdPrefix);
            }
            this.selectors.set(key, selector);
        }
        return selector;
    };
    return AbstractSelectorMap;
}());

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var __extends$5 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var AsyncSelectorMap = /** @class */ (function (_super) {
    __extends$5(AsyncSelectorMap, _super);
    function AsyncSelectorMap(getState, options) {
        return _super.call(this, getState, options, AsyncSelector.factory) || this;
    }
    return AsyncSelectorMap;
}(AbstractSelectorMap));

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Use when you need to observe both synchronous and asynchronous observables.
 * Instead of returning a promise when in a pending state, throw the promise.
 * This approach is useful in environments like React, which support a
 * <Suspense> wrapper that catches promises and renders a loading state.
 */
var __extends$4 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read$2 = (undefined && undefined.__read) || function (o, n) {
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
var __spreadArray$1 = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var ComponentObserver = /** @class */ (function (_super) {
    __extends$4(ComponentObserver, _super);
    function ComponentObserver() {
        var _this = _super.apply(this, __spreadArray$1([], __read$2(arguments), false)) || this;
        _this.isLocked = false;
        _this.isComponent = true;
        _this.observe = function (observable) {
            return observable.__observeRef(_this).getOrThrowSync(ThrowMode.ThrowPromise);
        };
        _this.observeKey = function (observable, key) {
            var ref = observable.__observeRef(_this, key);
            return ref === null || ref === void 0 ? void 0 : ref.getOrThrowSync(ThrowMode.ThrowPromise);
        };
        return _this;
    }
    ComponentObserver.prototype.lock = function () {
        this.isLocked = true;
    };
    ComponentObserver.prototype.unlock = function () {
        this.isLocked = false;
    };
    ComponentObserver.prototype.onRender = function () {
        manager.changeHandled(this);
    };
    ComponentObserver.prototype.__addObservable = function (observable) {
        if (this.isLocked === true) {
            throw new Error('Using ComponentObserver outside of render function');
        }
        _super.prototype.__addObservable.call(this, observable);
    };
    ComponentObserver.factory = function () { return new ComponentObserver(); };
    return ComponentObserver;
}(AbstractObserver));

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
function lerp(v1, v2, t) {
    return v1 + (v2 - v1) * t;
}
var ObservableAnimation = /** @class */ (function () {
    function ObservableAnimation(targetOptions, currentOptions, options) {
        var _this = this;
        var _a;
        this.animationState = null;
        this.onRelease = function () { };
        this.startInterval = function () {
            var animationState = nullthrows(_this.animationState);
            getConfig().clearInterval(animationState.id);
            animationState.id = getConfig().setInterval(_this.onFrame, animationState.delayMs);
        };
        this.onFrame = function () {
            var _a;
            var animationState = nullthrows(_this.animationState);
            var start = animationState.start, end = animationState.end, t = animationState.t, tStep = animationState.tStep;
            var newT = t + tStep;
            var interpolateCB = (_a = _this.options.interpolateCB) !== null && _a !== void 0 ? _a : lerp;
            _this.current.set(interpolateCB(start, end, Math.min(1.0, newT)));
            if (newT >= 1.0) {
                _this.clearAnimation();
            }
            else {
                animationState.t = newT;
            }
        };
        this.target = new Observable(__assign(__assign({}, (targetOptions !== null && targetOptions !== void 0 ? targetOptions : {})), { onRelease: this.onRelease }));
        this.current = new Observable(__assign(__assign({}, ((_a = currentOptions !== null && currentOptions !== void 0 ? currentOptions : targetOptions) !== null && _a !== void 0 ? _a : {})), { onRelease: this.onRelease }));
        this.options = __assign({ transitionDurationMs: 150, framesPerSecond: 30, waitMs: 0 }, options);
    }
    ObservableAnimation.prototype.setTarget = function (value) {
        this.clearAnimation();
        this.target.set(value);
        this.onChanged();
    };
    ObservableAnimation.prototype.setCurrent = function (value) {
        this.clearAnimation();
        this.current.set(value);
        this.onChanged();
    };
    ObservableAnimation.prototype.setBoth = function (value) {
        this.clearAnimation();
        this.target.set(value);
        this.current.set(value);
        this.onChanged();
    };
    ObservableAnimation.prototype.destroy = function () {
        this.target.destroy();
        this.current.destroy();
    };
    ObservableAnimation.prototype.onChanged = function () {
        var start = nullthrows(this.current.peek());
        var end = nullthrows(this.target.peek());
        if (!this.animationState &&
            !areEqual(start, end, ComparisonMethod.ShallowEqual)) {
            var _a = this.options, transitionDurationMs = _a.transitionDurationMs, framesPerSecond = _a.framesPerSecond, waitMs = _a.waitMs;
            var delayMs = Math.ceil(1000 / framesPerSecond);
            var tStep = delayMs / transitionDurationMs;
            var id = void 0;
            if (waitMs > 0) {
                id = getConfig().setInterval(this.startInterval, waitMs);
            }
            else {
                id = getConfig().setInterval(this.onFrame, delayMs);
            }
            this.animationState = { start: start, end: end, t: 0, tStep: tStep, id: id, delayMs: delayMs };
        }
    };
    ObservableAnimation.prototype.clearAnimation = function () {
        if (this.animationState) {
            var id = this.animationState.id;
            id && getConfig().clearInterval(id);
            this.animationState = null;
        }
    };
    return ObservableAnimation;
}());

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Use when you only need to observe synchronous observables.
 */
var __extends$3 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read$1 = (undefined && undefined.__read) || function (o, n) {
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
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var SyncObserver = /** @class */ (function (_super) {
    __extends$3(SyncObserver, _super);
    function SyncObserver() {
        var _this = _super.apply(this, __spreadArray([], __read$1(arguments), false)) || this;
        _this.observe = function (observable) {
            var ref = observable.__observeRef(_this);
            return ref.getOrThrowSync(ThrowMode.ErrorOnPending);
        };
        _this.observeKey = function (observable, key) {
            var ref = observable.__observeRef(_this, key);
            return ref === null || ref === void 0 ? void 0 : ref.getOrThrowSync(ThrowMode.ErrorOnPending);
        };
        return _this;
    }
    SyncObserver.factory = function () { return new SyncObserver(); };
    return SyncObserver;
}(AbstractObserver));

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var __extends$2 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Selector = /** @class */ (function (_super) {
    __extends$2(Selector, _super);
    function Selector(getState, options) {
        return _super.call(this, getState, options, SyncObserver.factory, Observable.factory) || this;
    }
    Selector.factory = function (getState, options) { return new Selector(getState, options); };
    return Selector;
}(AbstractSelector));

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var __extends$1 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var ObservableMap = /** @class */ (function (_super) {
    __extends$1(ObservableMap, _super);
    function ObservableMap(getDefault, valueOptions) {
        var _this = _super.call(this, getDefault, valueOptions, Observable.factory) || this;
        /**
         * Convenience selector that can be used to access all items in the map
         */
        _this.entries = new Selector(function (_a) {
            var observe = _a.observe;
            var map = observe(_this.map);
            return Array.from(map.entries()).map(function (_a) {
                var _b = __read(_a, 2), key = _b[0], observable = _b[1];
                return [
                    key,
                    observe(observable),
                ];
            });
        });
        return _this;
    }
    return ObservableMap;
}(AbstractObservableMap));

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * Optional base class for classes containing observables.
 * Injects debug IDs into the observables for logging.
 */
var ObservableStore = /** @class */ (function () {
    function ObservableStore() {
        var _this = this;
        getConfig().setImmediate(function () {
            var className = _this.constructor.name;
            for (var propName in _this) {
                var prop = _this[propName];
                if (prop != null &&
                    prop instanceof Object &&
                    'setDebugPrefix' in prop &&
                    prop.hasOwnProperty('setDebugPrefix') &&
                    typeof prop.setDebugPrefix === 'function') {
                    prop.setDebugPrefix("".concat(className, "::").concat(propName));
                }
            }
        });
    }
    return ObservableStore;
}());

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var SelectorMap = /** @class */ (function (_super) {
    __extends(SelectorMap, _super);
    function SelectorMap(getState, options) {
        return _super.call(this, getState, options, Selector.factory) || this;
    }
    return SelectorMap;
}(AbstractSelectorMap));

exports.AsyncObservable = AsyncObservable;
exports.AsyncObservableMap = AsyncObservableMap;
exports.AsyncObserver = AsyncObserver;
exports.AsyncSelector = AsyncSelector;
exports.AsyncSelectorMap = AsyncSelectorMap;
exports.ComponentObserver = ComponentObserver;
exports.Observable = Observable;
exports.ObservableAnimation = ObservableAnimation;
exports.ObservableMap = ObservableMap;
exports.ObservableStore = ObservableStore;
exports.Selector = Selector;
exports.SelectorMap = SelectorMap;
exports.SyncObserver = SyncObserver;
exports.setConfigOptions = setConfigOptions;

module.exports = exports;
