/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export enum ComparisonMethod {
  // Uses strict equality to determine changes. If you create a new object
  // or array with each "set" operation, such as by spreading values into a new
  // object (e.g., `{ ...oldObject }`), onChange events will always be triggered
  // because the reference will differ.
  Exact,
  // Compares each value in an object or array. This allows you to spread values
  // into a new object or array without triggering updates to all observers, as
  // long as the top-level values remain unchanged.
  ShallowEqual,
  // Recursively compares all nested properties to determine changes, walking
  // through all children for a deep comparison. This is useful for complex
  // data structures where deep equality is necessary.
  DeepEquals,
}

/**
 * Returns true if the two values are equal, false otherwise. The comparison
 * method determines how equality is determined.
 */
export function areEqual(
  a: unknown,
  b: unknown,
  method: ComparisonMethod
): boolean {
  // Check for exact equality between 'a' and 'b'
  if (Object.is(a, b)) {
    return true;
  }

  let nextMethod = method;
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
    for (const [key, value] of a) {
      if (!b.has(key)) {
        return false;
      }
      if (!areEqual(value, b.get(key), nextMethod)) {
        return false;
      }
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
    for (const value of a) {
      if (!b.has(value)) {
        return false;
      }
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
    for (let i = 0; i < a.length; i++) {
      if (!areEqual(a[i], b[i], nextMethod)) {
        return false;
      }
    }
    return true;
  }

  // Compare Objects
  if (typeof a === 'object' && typeof b === 'object') {
    const aKeys = Object.keys(a as object);
    const bKeys = Object.keys(b as object);
    if (aKeys.length !== bKeys.length) {
      return false;
    }
    for (const key of aKeys) {
      if (
        !b.hasOwnProperty(key) ||
        !areEqual(
          (a as Record<string, unknown>)[key],
          (b as Record<string, unknown>)[key],
          nextMethod
        )
      ) {
        return false;
      }
    }
    return true;
  }

  return false;
}
