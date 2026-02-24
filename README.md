<p align="center">
  <img src="logo.svg" alt="Observite Logo" width="180" height="180">
</p>

<h1 align="center">Observite</h1>

<p align="center">
  <strong>A lightweight global state management library with automatic memory cleanup and dynamic state containers.
</strong>
</p>

<p align="center">
  <a href="#installation">Installation</a> •
  <a href="#core-concepts">Core Concepts</a> •
  <a href="#api-reference">API Reference</a> •
  <a href="#contributing">Contributing</a>
</p>

---

## Overview

Observite is a lightweight state management library built around three core primitives:

- **Observables** — Units of shared state (sync or async) that notify subscribers when they change
- **Selectors** — Pure functions that derive new state from Observables or other Selectors
- **Observers** — Subscribe to Observables and Selectors, reacting when values update

These primitives form a data-flow graph: state flows from Observables through Selectors and into your application via Observers.

Observite offers:

- **Flexible subscriptions** — Subscribe to state changes conditionally, in any order, and even within loops or dynamic contexts
- **Controlled memory management** — Create state dynamically and configure exactly when it gets released
- **Framework-agnostic design** — Works in React, vanilla JS, or any JavaScript environment
- **First-class async support** — Built-in Promise handling with pending/resolved/rejected states

## Installation

```bash
npm install observite-js
```

> **Note:** This package was previously published as `observite`, but that name was taken. The official package is now `observite-js`.

---

## Core Concepts

### Observables

Observables are units of state. They're updatable and subscribable: when an observable is updated, each subscriber is notified with the new value.

Create your observables in a freely accessible place, like a global context or a module:

```typescript
const fontSize = new Observable<number>({
  default: 14,
});
```

Subscribe to them in your application code. For example, in React it might look something like this:

```typescript
const {observe} = useObserver();
return <FontSlider
  value={observe(fontSize)} // Subscribe to fontSize
  onChange={fontSize.set} // Update fontSize
/>;
```

### Selectors

**Selectors** are used to calculate derived data that is based on other state.

```typescript
const fontSizeLabel = new Selector<string>(({ observe }) => {
  // Every time fontSize changes, fontSizeLabel updates
  const size = observe(fontSize);
  return `${size}px`;
});
```

They are subscribable just like observables. You can use them anywhere you'd use an observable:

```typescript
const {observe} = useObserver();
return <FontSlider
  label={observe(fontSizeLabel)}
  value={observe(fontSize)}
  onChange={fontSize.set}
/>;
```

### Observers

**Observers** are the bridge between your state and your application. They subscribe to state changes and notify your code when updates occur.

Usually you will wrap observer creation based on your framework or environment. For example, in React you might use `useObserver()`.

Example without a framework:

```typescript
const {observe} = new SyncObserver();

// On changes, subscriptions are reset so that you can subscribe to different state.
// Each time, you should observe the state you want to use until the next change.
const render = () => {
  const label = observe(fontSizeLabel);
  document.querySelector('#font-size-label').textContent = label;
};

// Set up onChange and subscribe for the first time
observer.setOnChange(render);
render(); // label: "14px"

fontSize.set(16); // label: "16px"
fontSize.set(18); // label: "18px"
```

### Dynamic Subscriptions

Observite allows fully dynamic subscriptions. On each update, you can change what you're subscribed to freely—conditionally, in loops, or in any order.

**Conditional subscriptions:**

```typescript
const detailsSelector = new Selector<Details | null>(({ observe }) => {
  const showDetails = observe(showDetailsState);

  // Only subscribe to details when needed
  if (showDetails) {
    return observe(expensiveDetailsState);
  }
  return null;
});
```

**Subscriptions in loops:**

```typescript
const totalSelector = new Selector<number>(({ observeKey }) => {
  const itemIds = ['item-1', 'item-2', 'item-3'];

  // Subscribe to a dynamic list of items
  let total = 0;
  for (const id of itemIds) {
    const item = observeKey(itemPriceMap, id);
    total += item?.price ?? 0;
  }
  return total;
});
```

**Changing subscription sets:**

```typescript
const dataSelector = new Selector<Data>(({ observe }) => {
  const mode = observe(modeState);

  // Different subscriptions based on current mode
  switch (mode) {
    case 'simple':
      return observe(simpleDataState);
    case 'detailed':
      return observe(simpleDataState) + observe(extraDataState);
    case 'full':
      return observe(simpleDataState) + observe(extraDataState) + observe(metaDataState);
  }
});
```

This flexibility means your selectors can efficiently subscribe to exactly what they need based on the current state, automatically unsubscribing from unused dependencies when conditions change.

### Async Observables

Observite has first-class support for asynchronous state. Use `AsyncObservable` and `AsyncSelector` for data that comes from promises:

```typescript
const userDataState = new AsyncSelector<UserData>(async ({ observe }) => {
  const userId = observe(currentUserIdState);
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
});
```

Async selectors automatically track their loading state. When the promise is pending, observers can choose how to handle it:

- **AsyncObserver** — Returns the promise for async/await handling

```typescript
// Waits until userData is loaded before logging
const data = await observe(userData);
console.log(`Hello, ${data.name}!`);
```

- **ComponentObserver** — Throws the promise for React Suspense integration

```typescript
function UserProfile() {
  const { observe } = useObserver(); // wraps ComponentObserver

  // Throws promise to Suspense if still loading
  const userData = observe(userDataState);

  return <div>Hello, {userData.name}!</div>;
}
```

- **observeState** — Returns the raw state object with status, result, and error

```typescript
function UserProfile() {
  const { observeState } = useObserver();

  const result = observeState(userDataState);

  if (result.status === Status.Pending) {
    return <Loading />;
  }
  if (result.status === Status.Rejected) {
    return <Error error={result.error} />;
  }
  return <div>Hello, {result.result.name}!</div>;
}
```

### Keyed Collections

For dynamic data where you need multiple instances of state keyed by an identifier, use `ObservableMap` and `SelectorMap`:

```typescript
const fieldValidation = new SelectorMap<string, string | null>(
  ({ observe }, fieldName) => {
    const formData = observe(formState);
    const value = formData[fieldName];
    return validateField(fieldName, value);
  }
);

// Access data by key
const emailValidation = observeKey(fieldValidation, 'email');
```

### Memory Management

When no observers are watching an observable or selector, Observite can automatically clean up that entry instantly, never, or after a configurable delay.

```typescript
const cachedData = new Selector<ExpensiveData>(
  ({ observe }) => fetchData(observe(inputState)),
  {
    releaseDelay: 30000, // Keep cached for 30 seconds after last observer leaves
    onRelease: (data) => {
      console.log('Cleaning up cached data');
    },
  }
);
```

---

## API Reference

### Observables

| Class | Description |
|-------|-------------|
| `Observable<T>` | Basic synchronous state container |
| `AsyncObservable<T>` | State container for Promises |
| `ObservableMap<K, V>` | Keyed collection of sync observables |
| `AsyncObservableMap<K, V>` | Keyed collection of async observables |
| `ObservableAnimation<T>` | Animated transitions between values |

#### Observable Options

```typescript
new Observable<T>({
  default?: T,                          // Initial value
  debugID?: string,                     // Unique identifier for debugging
  onChanged?: (value: T) => void,       // Callback on value change
  releaseDelay?: number | ReleaseDelay, // Cleanup delay in ms
  onRelease?: (value: T) => void,       // Cleanup callback
  comparisonMethod?: ComparisonMethod,  // Equality check method
});
```

#### Observable Methods

```typescript
observable.set(value)       // Update the value
observable.peek()           // Get current value without subscribing
observable.isInitialized()  // Check if value has been set
observable.destroy()        // Clean up the observable
```

### Selectors

| Class | Description |
|-------|-------------|
| `Selector<T>` | Derived synchronous state |
| `AsyncSelector<T>` | Derived async state |
| `SelectorMap<K, V>` | Keyed collection of sync selectors |
| `AsyncSelectorMap<K, V>` | Keyed collection of async selectors |

#### Selector Methods

```typescript
selector.peek()           // Get current value without subscribing
selector.peekSafe()       // Get current value if initialized, otherwise null
selector.destroy()        // Clean up the selector
```

### Observers

| Class | Description |
|-------|-------------|
| `SyncObserver` | For synchronous-only state |
| `AsyncObserver` | Returns promises for pending async state |
| `ComponentObserver` | Throws promises for React Suspense |

#### Observer Methods

```typescript
observer.setOnChange(callback)       // Set change notification callback
observer.observe(observable)         // Subscribe and get current value
observer.observeKey(map, key)        // Subscribe to a keyed entry
observer.observeState(observable)    // Subscribe and get raw state with status
observer.observeKeyState(map, key)   // Subscribe to keyed entry raw state
observer.destroy()                   // Unsubscribe from all observables
observer.reset()                     // Reset without destroying
```

---

## Contributing

Development of Observite happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving Observite.

- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Contributing Guide](./CONTRIBUTING.md)

## License

Observite is [MIT licensed](./LICENSE).
