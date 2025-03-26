/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var observite$1 = {};

var AsyncObservable = {};

var AbstractObservable = {};

var areEqual = {};

var hasRequiredAreEqual;

function requireAreEqual () {
	if (hasRequiredAreEqual) return areEqual;
	hasRequiredAreEqual = 1;
	/**
	 * Copyright (c) Meta Platforms, Inc. and affiliates.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	Object.defineProperty(areEqual, "__esModule", { value: true });
	areEqual.ComparisonMethod = void 0;
	areEqual.areEqual = areEqual$1;
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
	})(ComparisonMethod || (areEqual.ComparisonMethod = ComparisonMethod = {}));
	/**
	 * Returns true if the two values are equal, false otherwise. The comparison
	 * method determines how equality is determined.
	 */
	function areEqual$1(a, b, method) {
	    // Check for exact equality between 'a' and 'b'
	    if (Object.is(a, b)) {
	        return true;
	    }
	    // If comparison method is exact, values are not equal, so return false
	    if (method === ComparisonMethod.Exact) {
	        return false;
	    }
	    // Since we've already checked for exact equality, if either value is null or undefined,
	    // it means they don't match, so return false
	    if (a == null || b == null) {
	        return false;
	    }
	    // Recurse only once if shallow equality is used
	    const nextMethod = method === ComparisonMethod.DeepEquals
	        ? ComparisonMethod.DeepEquals
	        : ComparisonMethod.ShallowEqual;
	    // Compare Maps
	    if (a instanceof Map && b instanceof Map) {
	        if (a.size !== b.size) {
	            return false;
	        }
	        for (const [key, value] of a) {
	            if (!b.has(key)) {
	                return false;
	            }
	            if (!areEqual$1(value, b.get(key), nextMethod)) {
	                return false;
	            }
	        }
	        return true;
	    }
	    // Compare Sets
	    if (a instanceof Set && b instanceof Set) {
	        if (a.size !== b.size) {
	            return false;
	        }
	        for (const value of a) {
	            if (!b.has(value)) {
	                return false;
	            }
	        }
	        return true;
	    }
	    // Compare Arrays
	    if (Array.isArray(a) && Array.isArray(b)) {
	        if (a.length !== b.length) {
	            return false;
	        }
	        for (let i = 0; i < a.length; i++) {
	            if (!areEqual$1(a[i], b[i], nextMethod)) {
	                return false;
	            }
	        }
	        return true;
	    }
	    // Compare Objects
	    if (typeof a === 'object' && typeof b === 'object') {
	        const aKeys = Object.keys(a);
	        const bKeys = Object.keys(b);
	        if (aKeys.length !== bKeys.length) {
	            return false;
	        }
	        for (const key of aKeys) {
	            if (!b.hasOwnProperty(key) ||
	                !areEqual$1(a[key], b[key], nextMethod)) {
	                return false;
	            }
	        }
	        return true;
	    }
	    return false;
	}
	return areEqual;
}

var nullthrows = {};

var hasRequiredNullthrows;

function requireNullthrows () {
	if (hasRequiredNullthrows) return nullthrows;
	hasRequiredNullthrows = 1;
	/**
	 * Copyright (c) Meta Platforms, Inc. and affiliates.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	Object.defineProperty(nullthrows, "__esModule", { value: true });
	nullthrows.nullthrows = nullthrows$1;
	function nullthrows$1(value, message) {
	    if (value != null) {
	        return value;
	    }
	    throw new Error(message !== null && message !== void 0 ? message : 'Got unexpected null or undefined');
	}
	return nullthrows;
}

var StateRef = {};

var isPromise = {};

var hasRequiredIsPromise;

function requireIsPromise () {
	if (hasRequiredIsPromise) return isPromise;
	hasRequiredIsPromise = 1;
	/**
	 * Copyright (c) Meta Platforms, Inc. and affiliates.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	Object.defineProperty(isPromise, "__esModule", { value: true });
	isPromise.isPromise = isPromise$1;
	function isPromise$1(value) {
	    return value instanceof Promise;
	}
	return isPromise;
}

var hasRequiredStateRef;

function requireStateRef () {
	if (hasRequiredStateRef) return StateRef;
	hasRequiredStateRef = 1;
	/**
	 * Copyright (c) Meta Platforms, Inc. and affiliates.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	Object.defineProperty(StateRef, "__esModule", { value: true });
	StateRef.ThrowMode = StateRef.Status = void 0;
	StateRef.stateRefFromProvided = stateRefFromProvided;
	StateRef.stateRefFromError = stateRefFromError;
	const isPromise_1 = requireIsPromise();
	const nullthrows_1 = requireNullthrows();
	var Status;
	(function (Status) {
	    Status[Status["Pending"] = 0] = "Pending";
	    Status[Status["Resolved"] = 1] = "Resolved";
	    Status[Status["Rejected"] = 2] = "Rejected";
	})(Status || (StateRef.Status = Status = {}));
	var ThrowMode;
	(function (ThrowMode) {
	    ThrowMode[ThrowMode["ErrorOnPending"] = 0] = "ErrorOnPending";
	    ThrowMode[ThrowMode["ThrowPromise"] = 1] = "ThrowPromise";
	})(ThrowMode || (StateRef.ThrowMode = ThrowMode = {}));
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
	class AbstractStateRef {
	    constructor(holder, state, onStatusChanged) {
	        this.holder = null;
	        this.onStatusChanged = null;
	        this.holder = holder;
	        this.state = state;
	        this.onStatusChanged = onStatusChanged;
	    }
	    getStatus() {
	        return this.state.status;
	    }
	    getState() {
	        return this.state;
	    }
	    setState(state) {
	        var _a;
	        const prevStatus = this.state.status;
	        this.state = state;
	        if (prevStatus !== state.status) {
	            (_a = this.onStatusChanged) === null || _a === void 0 ? void 0 : _a.call(this, state.status, prevStatus);
	        }
	    }
	    getHolderForProvided() {
	        return this.holder;
	    }
	    /**
	     * Allows Observables to inspect the data without subscribing or modifying it.
	     * The peek method does not provide context about the Promise or error status;
	     * it simply returns the value if available.
	     */
	    peek() {
	        return this.state.status === Status.Resolved ? this.state.result : null;
	    }
	    /**
	     * Returns the provided value if the status is Status.Pending or Status.Resolved.
	     * Throws an error if the status is Status.Rejected.
	     */
	    getOrThrowProvided() {
	        switch (this.state.status) {
	            case Status.Pending:
	            case Status.Resolved:
	                return (0, nullthrows_1.nullthrows)(this.holder, 'Initialized without a value and not in a rejected state.').provided;
	            case Status.Rejected:
	                throw this.state.error;
	            default:
	                this.state;
	        }
	        throw Error('This code path should be unreachable.');
	    }
	    /**
	     * Returns the result if available, otherwise the provided value.
	     * Throws an error only if the status is Status.Rejected.
	     */
	    getOrThrowAsync() {
	        switch (this.state.status) {
	            case Status.Pending:
	                return (0, nullthrows_1.nullthrows)(this.holder, 'Initialized without a value and not in a rejected state.').provided;
	            case Status.Resolved:
	                return this.state.result;
	            case Status.Rejected:
	                throw this.state.error;
	            default:
	                this.state;
	        }
	        throw Error('This code path should be unreachable.');
	    }
	    /**
	     * Throws if the status is not 'Resolved'. Handles promises based on the mode:
	     * - ThrowMode.ErrorOnPending: Throws an error if pending
	     * - ThrowMode.ThrowPromise: Throws the promise itself if pending
	     */
	    getOrThrowSync(mode) {
	        switch (this.state.status) {
	            case Status.Pending:
	                if (mode === ThrowMode.ThrowPromise) {
	                    throw this.state.promise;
	                }
	                else {
	                    throw new Error('Attempted to access a pending state from synchronous code.');
	                }
	            case Status.Resolved:
	                return this.state.result;
	            case Status.Rejected:
	                throw this.state.error;
	            default:
	                this.state;
	        }
	        throw Error('This code path should be unreachable.');
	    }
	}
	class AsyncStateRef extends AbstractStateRef {
	    constructor(promise, onStatusChanged) {
	        super({ provided: promise }, { status: Status.Pending, promise }, onStatusChanged);
	        this.promise = promise.then((result) => {
	            this.setState({ status: Status.Resolved, result });
	            return result;
	        }, (thrown) => {
	            const error = (0, isPromise_1.isPromise)(thrown)
	                ? new Error('Promise thrown inside of promise')
	                : thrown;
	            this.setState({ status: Status.Rejected, error });
	            throw error;
	        });
	    }
	}
	class SyncStateRef extends AbstractStateRef {
	    constructor(result, onStatusChanged) {
	        super({ provided: result }, { status: Status.Resolved, result }, onStatusChanged);
	    }
	}
	class FailedStateRef extends AbstractStateRef {
	    constructor(error) {
	        super(null, { status: Status.Rejected, error });
	    }
	}
	/**
	 * Creates a StateRef from a value or a promise of a value.
	 * - If a Promise is provided, an AsyncStateRef is created.
	 * - Otherwise, a SyncStateRef is created.
	 */
	function stateRefFromProvided(provided, onStatusChanged) {
	    if ((0, isPromise_1.isPromise)(provided)) {
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
	return StateRef;
}

var ObservableManager = {};

var hasRequiredObservableManager;

function requireObservableManager () {
	if (hasRequiredObservableManager) return ObservableManager;
	hasRequiredObservableManager = 1;
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
	Object.defineProperty(ObservableManager, "__esModule", { value: true });
	let ObservableManager$1 = class ObservableManager {
	    constructor() {
	        this.isUpdating = false;
	        this.pendingChanges = new Set();
	        this.observablesToCheck = new Set();
	        this.pendingComponentUpdates = new Set();
	        this.addChangedObserverImpl = (observer) => {
	            this.pendingChanges.add(observer);
	        };
	    }
	    /**
	     * Queues all observers of a given observable for notification updates.
	     */
	    addChangedObservers(observable, observers) {
	        observers.forEach(this.addChangedObserverImpl);
	        this.deferredCheckForNoObservers(observable);
	    }
	    /**
	     * Queues a change for the specified observer.
	     */
	    addChangedObserver(observer) {
	        this.addChangedObserverImpl(observer);
	        this.update();
	    }
	    /**
	     * Schedules a check for an observable that has no more observers.
	     */
	    deferredCheckForNoObservers(observable) {
	        this.observablesToCheck.add(observable);
	        this.update();
	    }
	    /**
	     * Initiates the process of processing the queue if it hasn't started yet.
	     */
	    update() {
	        if (this.isUpdating === false) {
	            this.isUpdating = true;
	            setImmediate(() => this.flushQueue());
	        }
	    }
	    /**
	     * Marks a change as handled for the specified observer, removing any pending
	     * component updates if present.
	     */
	    changeHandled(observer) {
	        // Remove any pending update, as the component may have already rendered.
	        this.pendingComponentUpdates.delete(observer);
	    }
	    /**
	     * Processes the queue of pending changes, ensuring that updates are handled
	     * in the correct order. This method assumes the process hasn't started yet.
	     */
	    flushQueue() {
	        // Continuously process the queue to handle dynamic changes that may occur
	        // during processing, ensuring no updates are missed.
	        while (this.pendingChanges.size > 0) {
	            // Sorting by creation order helps maintain a predictable update sequence,
	            // which is crucial for handling dependencies correctly. Although solving
	            // the dependency tree would be ideal, this approach is currently fast enough.
	            const changedQueue = Array.from(this.pendingChanges).sort((a, b) => a.__getCreationOrder() - b.__getCreationOrder());
	            const observer = changedQueue[0];
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
	        const componentObservers = Array.from(this.pendingComponentUpdates);
	        componentObservers.sort((a, b) => a.__getCreationOrder() - b.__getCreationOrder());
	        componentObservers.forEach((observer) => {
	            // The set of pending component updates can change during rendering due to
	            // new updates being triggered. Therefore, we only proceed with updates for
	            // components that are still in the original set to avoid redundant operations.
	            if (this.pendingComponentUpdates.has(observer)) {
	                observer.__observableChanged();
	            }
	        });
	        // Perform reference counter checks on any Observables that have been updated.
	        // This helps identify and clean up Observables that no longer have any observers,
	        // preventing memory leaks and ensuring efficient resource management.
	        this.observablesToCheck.forEach((observable) => observable.__checkForNoObservers());
	        // Clear the state for the next update cycle to ensure that the system is ready
	        // for new changes and does not carry over any stale data from the previous cycle.
	        this.observablesToCheck.clear();
	        this.pendingComponentUpdates.clear();
	        this.isUpdating = false;
	    }
	};
	const manager = new ObservableManager$1();
	ObservableManager.default = manager;
	return ObservableManager;
}

var config = {};

var hasRequiredConfig;

function requireConfig () {
	if (hasRequiredConfig) return config;
	hasRequiredConfig = 1;
	/**
	 * Copyright (c) Meta Platforms, Inc. and affiliates.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * Be sure to call setConfigOptions() before initializing any other modules.
	 */
	Object.defineProperty(config, "__esModule", { value: true });
	config.setConfigOptions = setConfigOptions;
	config.getConfig = getConfig;
	const AbstractObservable_1 = requireAbstractObservable();
	const areEqual_1 = requireAreEqual();
	/**
	 * Default configuration values.
	 */
	let config$1 = {
	    // Use shallow equality as the default comparison method to avoid unnecessary
	    // re-renders when using spread operators for updates.
	    defaultComparisonMethod: areEqual_1.ComparisonMethod.ShallowEqual,
	    // Wait a frame before releasing (1ms).
	    defaultReleaseDelayMS: 1,
	    // Base Observables are not worth releasing by default.
	    defaultObservableReleaseDelay: AbstractObservable_1.ReleaseDelay.Never,
	    // Selectors are usually worth releasing by default.
	    defaultSelectorReleaseDelay: AbstractObservable_1.ReleaseDelay.Default,
	    // Use global timers by default.
	    setTimeout: setTimeout,
	    clearTimeout: clearTimeout,
	    setInterval: setInterval,
	    clearInterval: clearInterval,
	    setImmediate: setImmediate,
	};
	function setConfigOptions(options) {
	    config$1 = Object.assign(Object.assign({}, config$1), options);
	}
	function getConfig() {
	    return config$1;
	}
	return config;
}

var hasRequiredAbstractObservable;

function requireAbstractObservable () {
	if (hasRequiredAbstractObservable) return AbstractObservable;
	hasRequiredAbstractObservable = 1;
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
	var __importDefault = (AbstractObservable && AbstractObservable.__importDefault) || function (mod) {
	    return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	Object.defineProperty(AbstractObservable, "__esModule", { value: true });
	AbstractObservable.TAbstractObservable = AbstractObservable.AbstractObservable = AbstractObservable.ReleaseDelay = void 0;
	const areEqual_1 = requireAreEqual();
	const nullthrows_1 = requireNullthrows();
	const StateRef_1 = requireStateRef();
	const ObservableManager_1 = __importDefault(requireObservableManager());
	const config_1 = requireConfig();
	/**
	 * Since ReleaseDelay is a union type that includes a number for exact release
	 * delays, we need to use a string literal to ensure type safety.
	 */
	var ReleaseDelay;
	(function (ReleaseDelay) {
	    ReleaseDelay["Default"] = "Default";
	    ReleaseDelay["Never"] = "Never";
	})(ReleaseDelay || (AbstractObservable.ReleaseDelay = ReleaseDelay = {}));
	/**
	 * Used to generate unique IDs for each observable instance.
	 */
	let nextDebugID = 1;
	/**
	 * AbstractObservable serves as a base class for managing references to
	 * Observables without requiring knowledge of their specific types. It defines
	 * the fundamental methods necessary for interacting with the observable,
	 * facilitating communication with other components.
	 */
	let AbstractObservable$1 = class AbstractObservable {
	    constructor() {
	        this.debugID = nextDebugID++;
	        this.setDebugPrefix = (prefix) => {
	            this.debugID = `${prefix}::${this.debugID}`;
	        };
	    }
	};
	AbstractObservable.AbstractObservable = AbstractObservable$1;
	/**
	 * TAbstractObservable servers as a base class for managing references to
	 * Observables when the types are important. For Sync Observables, the Provided type
	 * and the Resolved type are the same. For Async Observables, the Provided type
	 * is a Promise and the Resolved type is the result of the Promise.
	 */
	class TAbstractObservable extends AbstractObservable$1 {
	    constructor(options) {
	        super();
	        this.stateRef = null;
	        this.observers = new Set();
	        this.isDestroyed = false;
	        this.releaseTimeoutID = null;
	        /**
	         * Retrieves the cached state if it exists. Throws an error if the state has
	         * not been initialized. Returns null if there was an error or if a Promise is
	         * still pending. Note that if the Observable's type is nullable, using this
	         * method alone may not distinguish between a null value and a missing value.
	         */
	        this.peek = () => {
	            const ref = (0, nullthrows_1.nullthrows)(this.stateRef, `Observable not initialized: ${this.debugID}`);
	            return ref.peek();
	        };
	        /**
	         * Updates the value and notifies observers if the new value differs from the
	         * current value. This is defined as an arrow function to ensure it can be
	         * used directly as a callback in React components, preserving the correct
	         * `this` context.
	         */
	        this.set = (value) => {
	            this.setImpl(value);
	        };
	        /**
	         * Allows Observers and Observables to access the StateRef for a given key.
	         * Should only be called by internal systems.
	         */
	        this.__observeRef = (observer) => {
	            this.addObserver(observer);
	            return (0, nullthrows_1.nullthrows)(this.stateRef, 'Observable not initialized');
	        };
	        this.options = Object.assign({}, options);
	        if ((options === null || options === void 0 ? void 0 : options.debugID) != null) {
	            this.debugID = options === null || options === void 0 ? void 0 : options.debugID;
	        }
	        if ((options === null || options === void 0 ? void 0 : options.default) != null) {
	            this.stateRef = (0, StateRef_1.stateRefFromProvided)(options.default);
	        }
	    }
	    /**
	     * Checks if the state has been initialized. Accessing the state before
	     * initialization can lead to exceptions.
	     */
	    isInitialized() {
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
	     * Overridable method for setting the value. This method is provided to
	     * address issues with `this` binding that can occur when overriding the
	     * function expression used in the `set` method.
	     */
	    setImpl(value) {
	        var _a, _b, _c, _d, _e;
	        const currentValue = (_a = this.stateRef) === null || _a === void 0 ? void 0 : _a.peek();
	        if ((0, areEqual_1.areEqual)(value, currentValue, (_c = (_b = this.options) === null || _b === void 0 ? void 0 : _b.comparisonMethod) !== null && _c !== void 0 ? _c : (0, config_1.getConfig)().defaultComparisonMethod)) {
	            return;
	        }
	        const isInitialSet = this.stateRef == null;
	        this.stateRef = (0, StateRef_1.stateRefFromProvided)(value);
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
	    }
	    /**
	     * Sets the state to a failed state with the provided error. Once set, this
	     * error will be thrown each time the state is observed, instead of returning
	     * a value.
	     */
	    setError(error) {
	        this.stateRef = (0, StateRef_1.stateRefFromError)(error);
	    }
	    /**
	     * Clears the reference count for the specified observer.
	     * Should only be called by internal systems.
	     */
	    __removeObserver(observer) {
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
	            ((_a = this.stateRef) === null || _a === void 0 ? void 0 : _a.getStatus()) !== StateRef_1.Status.Pending) {
	            // Observers may be cleared during an update and quickly re-observed,
	            // so delay checking for missing observers to prevent thrashing.
	            ObservableManager_1.default.deferredCheckForNoObservers(this);
	        }
	    }
	    /**
	     * Checks if the state is ready to be released and initiates a timeout to
	     * release it after the specified delay. This is used by the ObservableManager
	     * to manage state lifecycle based on observer presence.
	     */
	    __checkForNoObservers() {
	        var _a, _b;
	        const ref = this.stateRef;
	        const releaseDelay = (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.releaseDelay) !== null && _b !== void 0 ? _b : (0, config_1.getConfig)().defaultObservableReleaseDelay;
	        if (
	        // Ensure the state has not already been cleaned up
	        ref != null &&
	            // Confirm there are no current observers
	            this.observers.size === 0 &&
	            // Ensure a release is not already scheduled
	            this.releaseTimeoutID == null &&
	            // Verify that a release is desired
	            releaseDelay != null &&
	            releaseDelay !== ReleaseDelay.Never) {
	            // Schedule the release with a delay to avoid unnecessary state disposal
	            // if something quickly re-subscribes.
	            this.releaseTimeoutID = (0, config_1.getConfig)().setTimeout(() => this.release(ref), releaseDelay === ReleaseDelay.Default
	                ? (0, config_1.getConfig)().defaultReleaseDelayMS
	                : releaseDelay);
	        }
	    }
	    /**
	     * Clears internal state and observers.
	     */
	    clearState() {
	        this.stateRef = null;
	        this.observers.clear();
	    }
	    /**
	     * Queues observers for notification of changes, then clears all references.
	     * Observers will re-evaluate their observables after each change.
	     */
	    changed(value) {
	        var _a, _b;
	        ObservableManager_1.default.addChangedObservers(this, this.observers);
	        this.observers.clear();
	        (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.onChanged) === null || _b === void 0 ? void 0 : _b.call(_a, value);
	    }
	    /**
	     * Adds an observer and cancels any pending release.
	     */
	    addObserver(observer) {
	        this.resetReleaseTimeout();
	        this.observers.add(observer);
	        observer.__addObservable(this);
	    }
	    /**
	     * Cancels any pending release timeout if it exists.
	     */
	    resetReleaseTimeout() {
	        this.releaseTimeoutID != null &&
	            (0, config_1.getConfig)().clearTimeout(this.releaseTimeoutID);
	        this.releaseTimeoutID = null;
	    }
	    /**
	     * Frees the state reference after the specified release delay in options.
	     */
	    release(ref) {
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
	        const holder = ref.getHolderForProvided();
	        if (holder != null) {
	            (_b = (_a = this.options).onRelease) === null || _b === void 0 ? void 0 : _b.call(_a, holder.provided);
	        }
	        this.clearState();
	    }
	}
	AbstractObservable.TAbstractObservable = TAbstractObservable;
	return AbstractObservable;
}

var hasRequiredAsyncObservable;

function requireAsyncObservable () {
	if (hasRequiredAsyncObservable) return AsyncObservable;
	hasRequiredAsyncObservable = 1;
	/**
	 * Copyright (c) Meta Platforms, Inc. and affiliates.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	Object.defineProperty(AsyncObservable, "__esModule", { value: true });
	AsyncObservable.AsyncObservable = void 0;
	const AbstractObservable_1 = requireAbstractObservable();
	let AsyncObservable$1 = class AsyncObservable extends AbstractObservable_1.TAbstractObservable {
	};
	AsyncObservable.AsyncObservable = AsyncObservable$1;
	AsyncObservable$1.factory = (options) => new AsyncObservable$1(options);
	return AsyncObservable;
}

var AsyncObservableMap = {};

var AbstractObservableMap = {};

var Observable = {};

var hasRequiredObservable;

function requireObservable () {
	if (hasRequiredObservable) return Observable;
	hasRequiredObservable = 1;
	/**
	 * Copyright (c) Meta Platforms, Inc. and affiliates.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	Object.defineProperty(Observable, "__esModule", { value: true });
	Observable.Observable = void 0;
	const AbstractObservable_1 = requireAbstractObservable();
	let Observable$1 = class Observable extends AbstractObservable_1.TAbstractObservable {
	};
	Observable.Observable = Observable$1;
	Observable$1.factory = (options) => new Observable$1(options);
	return Observable;
}

var hasRequiredAbstractObservableMap;

function requireAbstractObservableMap () {
	if (hasRequiredAbstractObservableMap) return AbstractObservableMap;
	hasRequiredAbstractObservableMap = 1;
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
	Object.defineProperty(AbstractObservableMap, "__esModule", { value: true });
	AbstractObservableMap.AbstractObservableMap = void 0;
	const nullthrows_1 = requireNullthrows();
	const Observable_1 = requireObservable();
	var SetMode;
	(function (SetMode) {
	    SetMode[SetMode["NORMAL"] = 0] = "NORMAL";
	    SetMode[SetMode["SILENT"] = 1] = "SILENT";
	})(SetMode || (SetMode = {}));
	let AbstractObservableMap$1 = class AbstractObservableMap {
	    constructor(getDefault, valueOptions, makeObservable) {
	        this.debugIdPrefix = null;
	        this.setDebugPrefix = (prefix) => {
	            var _a;
	            this.debugIdPrefix = prefix;
	            this.map.setDebugPrefix(prefix + '::map');
	            (_a = this.map.peek()) === null || _a === void 0 ? void 0 : _a.forEach((observable) => observable.setDebugPrefix(prefix));
	        };
	        /**
	         * Retrieves the state associated with the given key if it exists and, in the case
	         * of an async map, if the Promise has resolved. This method will not create a default
	         * entry, even if a default has been set. Note that if the map contains nullable types,
	         * using `peek` alone is insufficient to determine whether the state is `null` or if
	         * the state does not exist.
	         */
	        this.peek = (key) => {
	            var _a, _b;
	            return (_b = (_a = this.map.peek()) === null || _a === void 0 ? void 0 : _a.get(key)) === null || _b === void 0 ? void 0 : _b.peek();
	        };
	        this.peekEntries = () => {
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
	        this.set = (key, value) => {
	            // Internal setter for creating or updating items in the map
	            this.setImpl(key, value, SetMode.NORMAL);
	        };
	        /**
	         * Used by Observers and Observables to access the StateRef for a given key.
	         * Should only be accessed internally
	         */
	        this.__observeRef = (observer, key) => {
	            const map = observer.observe(this.map);
	            let observable = map.get(key);
	            // If the key does not exist but a default is specified, create it.
	            if (observable == null && this.getDefault != null) {
	                observable = this.setImpl(key, this.getDefault(key), SetMode.SILENT);
	            }
	            return observable === null || observable === void 0 ? void 0 : observable.__observeRef(observer);
	        };
	        this.map = new Observable_1.Observable({ default: new Map() });
	        this.getDefault = getDefault;
	        this.makeObservable = makeObservable;
	        this.options = valueOptions;
	    }
	    has(key) {
	        var _a;
	        return ((_a = this.map.peek()) === null || _a === void 0 ? void 0 : _a.has(key)) === true;
	    }
	    /**
	     * Removes all items from the map.
	     */
	    clear() {
	        var _a;
	        // Ensure all observables are properly cleaned up before removal
	        (_a = this.map.peek()) === null || _a === void 0 ? void 0 : _a.forEach((observable) => observable.destroy());
	        // Replace the current map with a new one to ensure all comparisons fail
	        this.map.set(new Map());
	    }
	    /**
	     * Internal setter that creates the observable for a given key if missing.
	     */
	    setImpl(key, value, updateMode) {
	        // Use the existing map in silent mode to avoid unnecessary updates and potential
	        // memory leaks when observers are reading keys. Otherwise, cloning the map
	        // ensures that changes are detected, triggering necessary updates.
	        const rawMap = (0, nullthrows_1.nullthrows)(this.map.peek(), 'Map not initialized');
	        const map = updateMode === SetMode.SILENT ? rawMap : new Map(rawMap);
	        let observable = map.get(key);
	        if (observable == null) {
	            const options = Object.assign(Object.assign({}, this.options), { default: value, 
	                // Wrap the onRelease function so we can clean up the map
	                onRelease: (value) => {
	                    var _a, _b, _c;
	                    (_a = this.map.peek()) === null || _a === void 0 ? void 0 : _a.delete(key);
	                    (_c = (_b = this.options) === null || _b === void 0 ? void 0 : _b.onRelease) === null || _c === void 0 ? void 0 : _c.call(_b, key, value);
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
	    }
	};
	AbstractObservableMap.AbstractObservableMap = AbstractObservableMap$1;
	return AbstractObservableMap;
}

var hasRequiredAsyncObservableMap;

function requireAsyncObservableMap () {
	if (hasRequiredAsyncObservableMap) return AsyncObservableMap;
	hasRequiredAsyncObservableMap = 1;
	/**
	 * Copyright (c) Meta Platforms, Inc. and affiliates.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	Object.defineProperty(AsyncObservableMap, "__esModule", { value: true });
	AsyncObservableMap.AsyncObservableMap = void 0;
	const AbstractObservableMap_1 = requireAbstractObservableMap();
	const AsyncObservable_1 = requireAsyncObservable();
	let AsyncObservableMap$1 = class AsyncObservableMap extends AbstractObservableMap_1.AbstractObservableMap {
	    constructor(getDefault, valueOptions) {
	        super(getDefault, valueOptions, AsyncObservable_1.AsyncObservable.factory);
	    }
	};
	AsyncObservableMap.AsyncObservableMap = AsyncObservableMap$1;
	return AsyncObservableMap;
}

var AsyncObserver = {};

var AbstractObserver = {};

var hasRequiredAbstractObserver;

function requireAbstractObserver () {
	if (hasRequiredAbstractObserver) return AbstractObserver;
	hasRequiredAbstractObserver = 1;
	/**
	 * Copyright (c) Meta Platforms, Inc. and affiliates.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	var __importDefault = (AbstractObserver && AbstractObserver.__importDefault) || function (mod) {
	    return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	Object.defineProperty(AbstractObserver, "__esModule", { value: true });
	AbstractObserver.AbstractObserver = void 0;
	const ObservableManager_1 = __importDefault(requireObservableManager());
	const StateRef_1 = requireStateRef();
	/**
	 * Static used for creating unique ids for each observable.
	 */
	let nextDebugID = 1;
	/**
	 * Observers monitor Observables, which contain state. An Observer can
	 * subscribe to as many Observables as needed, allowing it to detect changes
	 * to their combined state. When any of these Observables change, the Observer
	 * stops monitoring all of them and restarts observation in the onChange
	 * callback. This allows the Observer to adapt to changing conditions by
	 * re-evaluating which Observables are relevant, based on the current state
	 * of other Observables.
	 */
	let AbstractObserver$1 = class AbstractObserver {
	    constructor(debugPrefix) {
	        this.observables = new Set();
	        this.onChange = null;
	        this.creationOrder = nextDebugID++;
	        this.debugID = this.creationOrder;
	        this.isComponent = false;
	        this.observeState = (observable) => {
	            const state = observable.__observeRef(this).getState();
	            if (state.status === StateRef_1.Status.Pending) {
	                // When the promise finishes, consider it a change event.
	                state.promise.then(() => ObservableManager_1.default.addChangedObserver(this), () => ObservableManager_1.default.addChangedObserver(this));
	            }
	            return state;
	        };
	        this.observeKeyState = (observable, key) => {
	            var _a;
	            const state = (_a = observable.__observeRef(this, key)) === null || _a === void 0 ? void 0 : _a.getState();
	            if (state == null) {
	                return null;
	            }
	            if (state.status === StateRef_1.Status.Pending) {
	                // When the promise finishes, consider it a change event.
	                state.promise.then(() => ObservableManager_1.default.addChangedObserver(this), () => ObservableManager_1.default.addChangedObserver(this));
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
	    __getCreationOrder() {
	        return this.creationOrder;
	    }
	    setDebugPrefix(prefix) {
	        this.debugID = `${prefix}::${this.debugID}`;
	    }
	    setOnChange(onChange) {
	        this.onChange = onChange;
	    }
	    getIsComponent() {
	        return this.isComponent;
	    }
	    /**
	     * Called when the Observer is no longer needed. Cleans up any resources.
	     */
	    destroy() {
	        this.onChange = null;
	        this.reset();
	    }
	    /**
	     * Called to clear subscriptions to all Observables.
	     */
	    reset() {
	        this.observables.forEach((observable) => observable.__removeObserver(this));
	        this.observables.clear();
	    }
	    /**
	     * Should only be called by internal systems.
	     */
	    __addObservable(observable) {
	        if (this.onChange != null) {
	            this.observables.add(observable);
	        }
	    }
	    /**
	     * Should only be called by internal systems.
	     */
	    __observableChanged() {
	        var _a;
	        this.reset();
	        (_a = this.onChange) === null || _a === void 0 ? void 0 : _a.call(this);
	    }
	};
	AbstractObserver.AbstractObserver = AbstractObserver$1;
	return AbstractObserver;
}

var hasRequiredAsyncObserver;

function requireAsyncObserver () {
	if (hasRequiredAsyncObserver) return AsyncObserver;
	hasRequiredAsyncObserver = 1;
	/**
	 * Copyright (c) Meta Platforms, Inc. and affiliates.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * Use when you need to observe both synchronous and
	 * asynchronous observables.
	 */
	Object.defineProperty(AsyncObserver, "__esModule", { value: true });
	AsyncObserver.AsyncObserver = void 0;
	const AbstractObserver_1 = requireAbstractObserver();
	let AsyncObserver$1 = class AsyncObserver extends AbstractObserver_1.AbstractObserver {
	    constructor() {
	        super(...arguments);
	        this.observe = (observable) => {
	            const ref = observable.__observeRef(this);
	            return ref.getOrThrowProvided();
	        };
	        this.observeKey = (observable, key) => {
	            var _a;
	            return (_a = observable.__observeRef(this, key)) === null || _a === void 0 ? void 0 : _a.getOrThrowProvided();
	        };
	    }
	};
	AsyncObserver.AsyncObserver = AsyncObserver$1;
	AsyncObserver$1.factory = () => new AsyncObserver$1();
	return AsyncObserver;
}

var AsyncSelector = {};

var AbstractSelector = {};

var hasRequiredAbstractSelector;

function requireAbstractSelector () {
	if (hasRequiredAbstractSelector) return AbstractSelector;
	hasRequiredAbstractSelector = 1;
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
	Object.defineProperty(AbstractSelector, "__esModule", { value: true });
	AbstractSelector.AbstractSelector = void 0;
	const isPromise_1 = requireIsPromise();
	const config_1 = requireConfig();
	/**
	 * Static used for creating unique ids for each observable.
	 */
	let nextDebugID = 1;
	let AbstractSelector$1 = class AbstractSelector {
	    constructor(getState, options, createObserver, createObservable) {
	        this.debugID = nextDebugID++;
	        this.setDebugPrefix = (prefix) => {
	            this.debugID = prefix + '::' + this.debugID;
	            this.stateObserver.setDebugPrefix(prefix + '::observer');
	            this.stateObservable.setDebugPrefix(prefix + '::observable');
	        };
	        /**
	         * Retrieves the cached state if it exists from an observer's request.
	         * This method will not generate the state if it is missing. Note that if
	         * the selector is for a nullable type, using peek alone is insufficient to
	         * determine whether the state is null or does not exist.
	         */
	        this.peek = () => {
	            return this.stateObservable.peek();
	        };
	        this.peekSafe = () => {
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
	        this.set = (_) => {
	            throw new Error('Set on selectors not yet supported');
	        };
	        /**
	         * Used by Observers and Observables to access the StateRef.
	         */
	        this.__observeRef = (observer) => {
	            // Ensure the state is initialized if this is the first request for it.
	            if (!this.stateObservable.isInitialized()) {
	                this.updateState();
	            }
	            return this.stateObservable.__observeRef(observer);
	        };
	        /**
	         * Calls the getState callback and caches the result.
	         */
	        this.updateState = () => {
	            try {
	                const prevState = this.stateObservable.isInitialized()
	                    ? this.stateObservable.peek()
	                    : null;
	                const state = this.getState(this.stateObserver, prevState);
	                this.stateObservable.set(state);
	            }
	            catch (thrown) {
	                this.stateObservable.setError(
	                // Throwing promises only works inside React components. You can't
	                // access async state from synchronous code. You either need to make
	                // more of your code async or wrap promises in a handler such as a
	                // LoadObject.
	                ((0, isPromise_1.isPromise)(thrown)
	                    ? new Error('Promise thrown inside Promise')
	                    : thrown));
	            }
	        };
	        this.getState = getState;
	        this.stateObserver = createObserver();
	        this.stateObserver.setOnChange(this.updateState);
	        this.stateObservable = createObservable(Object.assign(Object.assign({ releaseDelay: (0, config_1.getConfig)().defaultSelectorReleaseDelay }, options), { 
	            // Wrap the onRelease function to ensure that anything this
	            // selector is observing stops being observed.
	            onRelease: (value) => {
	                var _a, _b;
	                (_a = this.stateObserver) === null || _a === void 0 ? void 0 : _a.reset();
	                (_b = options === null || options === void 0 ? void 0 : options.onRelease) === null || _b === void 0 ? void 0 : _b.call(options, value);
	            } }));
	    }
	    /**
	     * Cleans up the state when removing all references to this selector.
	     */
	    destroy() {
	        var _a;
	        (_a = this.stateObserver) === null || _a === void 0 ? void 0 : _a.destroy();
	        this.stateObservable.destroy();
	    }
	};
	AbstractSelector.AbstractSelector = AbstractSelector$1;
	return AbstractSelector;
}

var hasRequiredAsyncSelector;

function requireAsyncSelector () {
	if (hasRequiredAsyncSelector) return AsyncSelector;
	hasRequiredAsyncSelector = 1;
	/**
	 * Copyright (c) Meta Platforms, Inc. and affiliates.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	Object.defineProperty(AsyncSelector, "__esModule", { value: true });
	AsyncSelector.AsyncSelector = void 0;
	const AbstractSelector_1 = requireAbstractSelector();
	const AsyncObserver_1 = requireAsyncObserver();
	const AsyncObservable_1 = requireAsyncObservable();
	let AsyncSelector$1 = class AsyncSelector extends AbstractSelector_1.AbstractSelector {
	    constructor(getState, options) {
	        super(getState, options, AsyncObserver_1.AsyncObserver.factory, AsyncObservable_1.AsyncObservable.factory);
	    }
	};
	AsyncSelector.AsyncSelector = AsyncSelector$1;
	AsyncSelector$1.factory = (getState, options) => new AsyncSelector$1(getState, options);
	return AsyncSelector;
}

var AsyncSelectorMap = {};

var AbstractSelectorMap = {};

var hasRequiredAbstractSelectorMap;

function requireAbstractSelectorMap () {
	if (hasRequiredAbstractSelectorMap) return AbstractSelectorMap;
	hasRequiredAbstractSelectorMap = 1;
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
	Object.defineProperty(AbstractSelectorMap, "__esModule", { value: true });
	AbstractSelectorMap.AbstractSelectorMap = void 0;
	const AbstractObservable_1 = requireAbstractObservable();
	let AbstractSelectorMap$1 = class AbstractSelectorMap {
	    constructor(getState, options, createSelector) {
	        this.debugIdPrefix = null;
	        this.selectors = new Map();
	        this.setDebugPrefix = (prefix) => {
	            this.debugIdPrefix = prefix;
	            this.selectors.forEach((selector) => selector.setDebugPrefix(prefix));
	        };
	        /**
	         * Retrieves the cached state for a given key if it exists from an observer's request.
	         * This method will not generate the state if it is missing. Note that if the selector
	         * is for a nullable type, using peek alone is insufficient to determine whether the
	         * state is null or does not exist.
	         */
	        this.peek = (key) => {
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
	        this.set = (_key, _provide) => {
	            throw new Error('Set on selectors not yet supported');
	        };
	        /**
	         * Used by Observers and Observables to access the StateRef for a given key.
	         */
	        this.__observeRef = (observer, key) => {
	            const selector = this.getSelector(key);
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
	    getSelector(key) {
	        let selector = this.selectors.get(key);
	        if (selector == null) {
	            selector = this.createSelector(
	            // Create a GetStateCallback with the key bound to the function
	            (observer) => this.getState(observer, key), Object.assign(Object.assign({ 
	                // By default, we want selectors to release their state when not observed,
	                // as this data is derived and doesn't need to persist.
	                releaseDelay: AbstractObservable_1.ReleaseDelay.Default }, this.options), { onRelease: (value) => {
	                    var _a, _b, _c;
	                    (_a = this.selectors.get(key)) === null || _a === void 0 ? void 0 : _a.destroy();
	                    this.selectors.delete(key);
	                    (_c = (_b = this.options) === null || _b === void 0 ? void 0 : _b.onRelease) === null || _c === void 0 ? void 0 : _c.call(_b, key, value);
	                } }));
	            if (this.debugIdPrefix != null) {
	                selector.setDebugPrefix(this.debugIdPrefix);
	            }
	            this.selectors.set(key, selector);
	        }
	        return selector;
	    }
	};
	AbstractSelectorMap.AbstractSelectorMap = AbstractSelectorMap$1;
	return AbstractSelectorMap;
}

var hasRequiredAsyncSelectorMap;

function requireAsyncSelectorMap () {
	if (hasRequiredAsyncSelectorMap) return AsyncSelectorMap;
	hasRequiredAsyncSelectorMap = 1;
	/**
	 * Copyright (c) Meta Platforms, Inc. and affiliates.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	Object.defineProperty(AsyncSelectorMap, "__esModule", { value: true });
	AsyncSelectorMap.AsyncSelectorMap = void 0;
	const AbstractSelectorMap_1 = requireAbstractSelectorMap();
	const AsyncSelector_1 = requireAsyncSelector();
	let AsyncSelectorMap$1 = class AsyncSelectorMap extends AbstractSelectorMap_1.AbstractSelectorMap {
	    constructor(getState, options) {
	        super(getState, options, AsyncSelector_1.AsyncSelector.factory);
	    }
	};
	AsyncSelectorMap.AsyncSelectorMap = AsyncSelectorMap$1;
	return AsyncSelectorMap;
}

var ObservableAnimation = {};

var hasRequiredObservableAnimation;

function requireObservableAnimation () {
	if (hasRequiredObservableAnimation) return ObservableAnimation;
	hasRequiredObservableAnimation = 1;
	/**
	 * Copyright (c) Meta Platforms, Inc. and affiliates.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	Object.defineProperty(ObservableAnimation, "__esModule", { value: true });
	ObservableAnimation.ObservableAnimation = void 0;
	const Observable_1 = requireObservable();
	const nullthrows_1 = requireNullthrows();
	const areEqual_1 = requireAreEqual();
	const config_1 = requireConfig();
	function lerp(v1, v2, t) {
	    return v1 + (v2 - v1) * t;
	}
	let ObservableAnimation$1 = class ObservableAnimation {
	    constructor(targetOptions, currentOptions, options) {
	        var _a;
	        this.animationState = null;
	        this.onRelease = () => { };
	        this.startInterval = () => {
	            const animationState = (0, nullthrows_1.nullthrows)(this.animationState);
	            (0, config_1.getConfig)().clearInterval(animationState.id);
	            animationState.id = (0, config_1.getConfig)().setInterval(this.onFrame, animationState.delayMs);
	        };
	        this.onFrame = () => {
	            var _a;
	            const animationState = (0, nullthrows_1.nullthrows)(this.animationState);
	            const { start, end, t, tStep } = animationState;
	            const newT = t + tStep;
	            let interpolateCB = (_a = this.options.interpolateCB) !== null && _a !== void 0 ? _a : lerp;
	            this.current.set(interpolateCB(start, end, Math.min(1.0, newT)));
	            if (newT >= 1.0) {
	                this.clearAnimation();
	            }
	            else {
	                animationState.t = newT;
	            }
	        };
	        this.target = new Observable_1.Observable(Object.assign(Object.assign({}, (targetOptions !== null && targetOptions !== void 0 ? targetOptions : {})), { onRelease: this.onRelease }));
	        this.current = new Observable_1.Observable(Object.assign(Object.assign({}, ((_a = currentOptions !== null && currentOptions !== void 0 ? currentOptions : targetOptions) !== null && _a !== void 0 ? _a : {})), { onRelease: this.onRelease }));
	        this.options = Object.assign({ transitionDurationMs: 150, framesPerSecond: 30, waitMs: 0 }, options);
	    }
	    setTarget(value) {
	        this.clearAnimation();
	        this.target.set(value);
	        this.onChanged();
	    }
	    setCurrent(value) {
	        this.clearAnimation();
	        this.current.set(value);
	        this.onChanged();
	    }
	    setBoth(value) {
	        this.clearAnimation();
	        this.target.set(value);
	        this.current.set(value);
	        this.onChanged();
	    }
	    destroy() {
	        this.target.destroy();
	        this.current.destroy();
	    }
	    onChanged() {
	        const start = (0, nullthrows_1.nullthrows)(this.current.peek());
	        const end = (0, nullthrows_1.nullthrows)(this.target.peek());
	        if (!this.animationState &&
	            !(0, areEqual_1.areEqual)(start, end, areEqual_1.ComparisonMethod.ShallowEqual)) {
	            const { transitionDurationMs, framesPerSecond, waitMs } = this.options;
	            const delayMs = Math.ceil(1000 / framesPerSecond);
	            const tStep = delayMs / transitionDurationMs;
	            let id;
	            if (waitMs > 0) {
	                id = (0, config_1.getConfig)().setInterval(this.startInterval, waitMs);
	            }
	            else {
	                id = (0, config_1.getConfig)().setInterval(this.onFrame, delayMs);
	            }
	            this.animationState = { start, end, t: 0, tStep, id, delayMs };
	        }
	    }
	    clearAnimation() {
	        if (this.animationState) {
	            const { id } = this.animationState;
	            id && (0, config_1.getConfig)().clearInterval(id);
	            this.animationState = null;
	        }
	    }
	};
	ObservableAnimation.ObservableAnimation = ObservableAnimation$1;
	return ObservableAnimation;
}

var ObservableMap = {};

var hasRequiredObservableMap;

function requireObservableMap () {
	if (hasRequiredObservableMap) return ObservableMap;
	hasRequiredObservableMap = 1;
	/**
	 * Copyright (c) Meta Platforms, Inc. and affiliates.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	Object.defineProperty(ObservableMap, "__esModule", { value: true });
	ObservableMap.ObservableMap = void 0;
	const AbstractObservableMap_1 = requireAbstractObservableMap();
	const Observable_1 = requireObservable();
	let ObservableMap$1 = class ObservableMap extends AbstractObservableMap_1.AbstractObservableMap {
	    constructor(getDefault, valueOptions) {
	        super(getDefault, valueOptions, Observable_1.Observable.factory);
	    }
	};
	ObservableMap.ObservableMap = ObservableMap$1;
	return ObservableMap;
}

var ObservableStore = {};

var hasRequiredObservableStore;

function requireObservableStore () {
	if (hasRequiredObservableStore) return ObservableStore;
	hasRequiredObservableStore = 1;
	/**
	 * Copyright (c) Meta Platforms, Inc. and affiliates.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	Object.defineProperty(ObservableStore, "__esModule", { value: true });
	const config_1 = requireConfig();
	/**
	 * Optional base class for classes containing observables.
	 * Injects debug IDs into the observables for logging.
	 */
	let ObservableStore$1 = class ObservableStore {
	    constructor() {
	        (0, config_1.getConfig)().setImmediate(() => {
	            const className = this.constructor.name;
	            for (const propName in this) {
	                const prop = this[propName];
	                if (prop != null &&
	                    prop instanceof Object &&
	                    'setDebugPrefix' in prop &&
	                    prop.hasOwnProperty('setDebugPrefix') &&
	                    typeof prop.setDebugPrefix === 'function') {
	                    prop.setDebugPrefix(`${className}::${propName}`);
	                }
	            }
	        });
	    }
	};
	ObservableStore.default = ObservableStore$1;
	return ObservableStore;
}

var Selector = {};

var SyncObserver = {};

var hasRequiredSyncObserver;

function requireSyncObserver () {
	if (hasRequiredSyncObserver) return SyncObserver;
	hasRequiredSyncObserver = 1;
	/**
	 * Copyright (c) Meta Platforms, Inc. and affiliates.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * Use when you only need to observe synchronous observables.
	 */
	Object.defineProperty(SyncObserver, "__esModule", { value: true });
	SyncObserver.SyncObserver = void 0;
	const StateRef_1 = requireStateRef();
	const AbstractObserver_1 = requireAbstractObserver();
	let SyncObserver$1 = class SyncObserver extends AbstractObserver_1.AbstractObserver {
	    constructor() {
	        super(...arguments);
	        this.observe = (observable) => {
	            const ref = observable.__observeRef(this);
	            return ref.getOrThrowSync(StateRef_1.ThrowMode.ErrorOnPending);
	        };
	        this.observeKey = (observable, key) => {
	            const ref = observable.__observeRef(this, key);
	            return ref === null || ref === void 0 ? void 0 : ref.getOrThrowSync(StateRef_1.ThrowMode.ErrorOnPending);
	        };
	    }
	};
	SyncObserver.SyncObserver = SyncObserver$1;
	SyncObserver$1.factory = () => new SyncObserver$1();
	return SyncObserver;
}

var hasRequiredSelector;

function requireSelector () {
	if (hasRequiredSelector) return Selector;
	hasRequiredSelector = 1;
	/**
	 * Copyright (c) Meta Platforms, Inc. and affiliates.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	Object.defineProperty(Selector, "__esModule", { value: true });
	Selector.Selector = void 0;
	const AbstractSelector_1 = requireAbstractSelector();
	const SyncObserver_1 = requireSyncObserver();
	const Observable_1 = requireObservable();
	let Selector$1 = class Selector extends AbstractSelector_1.AbstractSelector {
	    constructor(getState, options) {
	        super(getState, options, SyncObserver_1.SyncObserver.factory, Observable_1.Observable.factory);
	    }
	};
	Selector.Selector = Selector$1;
	Selector$1.factory = (getState, options) => new Selector$1(getState, options);
	return Selector;
}

var SelectorMap = {};

var hasRequiredSelectorMap;

function requireSelectorMap () {
	if (hasRequiredSelectorMap) return SelectorMap;
	hasRequiredSelectorMap = 1;
	/**
	 * Copyright (c) Meta Platforms, Inc. and affiliates.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	Object.defineProperty(SelectorMap, "__esModule", { value: true });
	SelectorMap.SelectorMap = void 0;
	const AbstractSelectorMap_1 = requireAbstractSelectorMap();
	const Selector_1 = requireSelector();
	let SelectorMap$1 = class SelectorMap extends AbstractSelectorMap_1.AbstractSelectorMap {
	    constructor(getState, options) {
	        super(getState, options, Selector_1.Selector.factory);
	    }
	};
	SelectorMap.SelectorMap = SelectorMap$1;
	return SelectorMap;
}

var hasRequiredObservite;

function requireObservite () {
	if (hasRequiredObservite) return observite$1;
	hasRequiredObservite = 1;
	/**
	 * Copyright (c) Meta Platforms, Inc. and affiliates.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	var __importDefault = (observite$1 && observite$1.__importDefault) || function (mod) {
	    return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	Object.defineProperty(observite$1, "__esModule", { value: true });
	const AsyncObservable_1 = requireAsyncObservable();
	const AsyncObservableMap_1 = requireAsyncObservableMap();
	const AsyncObserver_1 = requireAsyncObserver();
	const AsyncSelector_1 = requireAsyncSelector();
	const AsyncSelectorMap_1 = requireAsyncSelectorMap();
	const config_1 = requireConfig();
	const Observable_1 = requireObservable();
	const ObservableAnimation_1 = requireObservableAnimation();
	const ObservableMap_1 = requireObservableMap();
	const ObservableStore_1 = __importDefault(requireObservableStore());
	const Selector_1 = requireSelector();
	const SelectorMap_1 = requireSelectorMap();
	observite$1.default = {
	    AsyncObservable: AsyncObservable_1.AsyncObservable,
	    AsyncObservableMap: AsyncObservableMap_1.AsyncObservableMap,
	    AsyncObserver: AsyncObserver_1.AsyncObserver,
	    AsyncSelector: AsyncSelector_1.AsyncSelector,
	    AsyncSelectorMap: AsyncSelectorMap_1.AsyncSelectorMap,
	    Observable: Observable_1.Observable,
	    ObservableAnimation: ObservableAnimation_1.ObservableAnimation,
	    ObservableMap: ObservableMap_1.ObservableMap,
	    ObservableStore: ObservableStore_1.default,
	    Selector: Selector_1.Selector,
	    SelectorMap: SelectorMap_1.SelectorMap,
	    setConfigOptions: config_1.setConfigOptions,
	};
	return observite$1;
}

var observiteExports = requireObservite();
var observite = /*@__PURE__*/getDefaultExportFromCjs(observiteExports);

export { observite as default };
