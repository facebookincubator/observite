/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Type compatibility compile test.
 *
 * This file verifies that the types from 'observite' and 'observite/react'
 * are compatible when used together. The test passes if this file compiles
 * without TypeScript errors.
 *
 * This is a compile-time test only - it doesn't need to be executed.
 * It guards against the issue where dts-bundle-generator inlines types,
 * causing TypeScript to see different nominal class types.
 *
 * Run with: npm run test:types
 */

// These imports resolve to lib/*.d.ts via tsconfig.test-types.json paths
import {
    Observable,
    ObservableMap,
    ComponentObserver,
} from 'observite';
import { useObserver } from 'observite/react';

// Type-level test: useObserver return type should be ComponentObserver
type UseObserverReturnType = ReturnType<typeof useObserver>;
type _AssertUseObserverReturnsComponentObserver = UseObserverReturnType extends ComponentObserver ? true : never;
const _typeCheck1: _AssertUseObserverReturnsComponentObserver = true;

// Type-level test: ComponentObserver should be assignable to useObserver return type
type _AssertComponentObserverAssignable = ComponentObserver extends UseObserverReturnType ? true : never;
const _typeCheck2: _AssertComponentObserverAssignable = true;

// Test function that simulates real usage
// This function exists to verify the types work in practice
function createTestObserver(): ComponentObserver {
    // In real code this would be: const observer = useObserver('test');
    // For compile test, we just need to verify the type compatibility
    return null as unknown as ComponentObserver;
}

// Test 1: useObserver should return a ComponentObserver that is compatible
// with Observable.observe method
function testBasicTypeCompatibility(): string {
    const o = new Observable<string>({ default: 'x' });
    const observer = createTestObserver();

    // The observer's observe method should accept Observable<string>
    // and return string
    const s: string = observer.observe(o);
    return s;
}

// Test 2: Verify ComponentObserver from both imports are the same type
function testTypeIdentity(): ComponentObserver[] {
    const observer1 = createTestObserver();
    const observer2 = new ComponentObserver('test');

    // These should be assignable to each other (same type)
    const a: ComponentObserver = observer1;
    const b: ComponentObserver = observer2;

    // Array should accept both
    const observers: ComponentObserver[] = [a, b];
    return observers;
}

// Test 3: observeKey should work with ObservableMap
function testObserveKey(): number | null | undefined {
    const map = new ObservableMap<string, number>();
    const observer = createTestObserver();

    // observeKey should accept ObservableMap and return the value type or undefined
    const value = observer.observeKey(map, 'key');
    return value;
}

// Test 4: Exact scenario from the issue description
function testExactScenario(): string {
    const o = new Observable<string>({ default: 'x' });
    const { observe } = createTestObserver();

    const s: string = observe(o);
    return s;
}

// Export to prevent "unused" errors
export {
    testBasicTypeCompatibility,
    testTypeIdentity,
    testObserveKey,
    testExactScenario,
};
