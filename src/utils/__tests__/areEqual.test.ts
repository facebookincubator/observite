/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { areEqual, ComparisonMethod } from '@/areEqual';

describe('areEqual function', () => {
  test('Exact comparison: identical primitives', () => {
    expect(areEqual(1, 1, ComparisonMethod.Exact)).toBe(true);
    expect(areEqual('test', 'test', ComparisonMethod.Exact)).toBe(true);
    expect(areEqual(true, true, ComparisonMethod.Exact)).toBe(true);
    expect(areEqual(NaN, NaN, ComparisonMethod.Exact)).toBe(true);
  });

  test('Exact comparison: different primitives', () => {
    expect(areEqual(1, 2, ComparisonMethod.Exact)).toBe(false);
    expect(areEqual('test', 'Test', ComparisonMethod.Exact)).toBe(false);
    expect(areEqual(true, false, ComparisonMethod.Exact)).toBe(false);
    expect(areEqual(2, NaN, ComparisonMethod.Exact)).toBe(false);
  });

  test('Exact comparison: objects and arrays', () => {
    expect(areEqual({ a: 1 }, { a: 1 }, ComparisonMethod.Exact)).toBe(false);
    expect(areEqual([1, 2], [1, 2], ComparisonMethod.Exact)).toBe(false);
  });

  test('ShallowEqual comparison: identical objects', () => {
    expect(
      areEqual({ a: 1, b: 2 }, { a: 1, b: 2 }, ComparisonMethod.ShallowEqual)
    ).toBe(true);
  });

  test('ShallowEqual comparison: different objects', () => {
    expect(
      areEqual({ a: 1, b: 2 }, { a: 1, b: 3 }, ComparisonMethod.ShallowEqual)
    ).toBe(false);
  });

  test('ShallowEqual comparison: identical arrays', () => {
    expect(areEqual([1, 2, 3], [1, 2, 3], ComparisonMethod.ShallowEqual)).toBe(
      true
    );
  });

  test('ShallowEqual comparison: different arrays', () => {
    expect(areEqual([1, 2, 3], [1, 2, 4], ComparisonMethod.ShallowEqual)).toBe(
      false
    );
  });

  test('DeepEquals comparison: identical nested objects', () => {
    expect(
      areEqual({ a: { b: 2 } }, { a: { b: 2 } }, ComparisonMethod.DeepEquals)
    ).toBe(true);
  });

  test('DeepEquals comparison: different nested objects', () => {
    expect(
      areEqual({ a: { b: 2 } }, { a: { b: 3 } }, ComparisonMethod.DeepEquals)
    ).toBe(false);
  });

  test('DeepEquals comparison: identical nested arrays', () => {
    expect(
      areEqual(
        [
          [1, 2],
          [3, 4],
        ],
        [
          [1, 2],
          [3, 4],
        ],
        ComparisonMethod.DeepEquals
      )
    ).toBe(true);
  });

  test('DeepEquals comparison: different nested arrays', () => {
    expect(
      areEqual(
        [
          [1, 2],
          [3, 4],
        ],
        [
          [1, 2],
          [4, 3],
        ],
        ComparisonMethod.DeepEquals
      )
    ).toBe(false);
  });

  test('Comparison with null or undefined', () => {
    expect(areEqual(null, undefined, ComparisonMethod.Exact)).toBe(false);
    expect(areEqual(null, null, ComparisonMethod.Exact)).toBe(true);
    expect(areEqual(undefined, undefined, ComparisonMethod.Exact)).toBe(true);
  });

  test('Comparison of Maps', () => {
    const map1 = new Map([
      ['key1', 'value1'],
      ['key2', 'value2'],
    ]);
    const map2 = new Map([
      ['key1', 'value1'],
      ['key2', 'value2'],
    ]);
    const map3 = new Map([
      ['key1', 'value1'],
      ['key2', 'differentValue'],
    ]);
    expect(areEqual(map1, map2, ComparisonMethod.DeepEquals)).toBe(true);
    expect(areEqual(map1, map3, ComparisonMethod.DeepEquals)).toBe(false);
  });

  test('Comparison of Sets', () => {
    const set1 = new Set([1, 2, 3]);
    const set2 = new Set([1, 2, 3]);
    const set3 = new Set([1, 2, 4]);
    expect(areEqual(set1, set2, ComparisonMethod.DeepEquals)).toBe(true);
    expect(areEqual(set1, set3, ComparisonMethod.DeepEquals)).toBe(false);
  });

  test('Comparison of Maps with complex keys', () => {
    const key1 = { id: 1 };
    const key2 = { id: 2 };
    const map1 = new Map([
      [key1, 'value1'],
      [key2, 'value2'],
    ]);
    const map2 = new Map([
      [key1, 'value1'],
      [key2, 'value2'],
    ]);
    const map3 = new Map([
      [key1, 'value1'],
      [{ id: 2 }, 'value2'],
    ]);
    expect(areEqual(map1, map2, ComparisonMethod.DeepEquals)).toBe(true);
    expect(areEqual(map1, map3, ComparisonMethod.DeepEquals)).toBe(false);
  });

  test('Comparison of Sets with complex values', () => {
    const value1 = { id: 1 };
    const value2 = { id: 2 };
    const set1 = new Set([value1, value2]);
    const set2 = new Set([value1, value2]);
    const set3 = new Set([value1, { id: 2 }]);
    expect(areEqual(set1, set2, ComparisonMethod.DeepEquals)).toBe(true);
    expect(areEqual(set1, set3, ComparisonMethod.DeepEquals)).toBe(false);
  });

  test('Comparison of Maps with NaN values', () => {
    const map1 = new Map([['key1', NaN]]);
    const map2 = new Map([['key1', NaN]]);
    expect(areEqual(map1, map2, ComparisonMethod.DeepEquals)).toBe(true);
  });

  test('Comparison of Sets with NaN values', () => {
    const set1 = new Set([NaN]);
    const set2 = new Set([NaN]);
    expect(areEqual(set1, set2, ComparisonMethod.DeepEquals)).toBe(true);
  });

  // Type mismatch tests - ensures comparing different types returns false
  describe('Type mismatch comparisons', () => {
    test('Map vs non-Map returns false', () => {
      const map = new Map([['key', 'value']]);
      expect(areEqual(map, { key: 'value' }, ComparisonMethod.ShallowEqual)).toBe(
        false
      );
      expect(areEqual({ key: 'value' }, map, ComparisonMethod.ShallowEqual)).toBe(
        false
      );
      expect(areEqual(map, { key: 'value' }, ComparisonMethod.DeepEquals)).toBe(
        false
      );
      expect(areEqual({ key: 'value' }, map, ComparisonMethod.DeepEquals)).toBe(
        false
      );
    });

    test('Set vs non-Set returns false', () => {
      const set = new Set([1, 2, 3]);
      expect(areEqual(set, [1, 2, 3], ComparisonMethod.ShallowEqual)).toBe(false);
      expect(areEqual([1, 2, 3], set, ComparisonMethod.ShallowEqual)).toBe(false);
      expect(areEqual(set, [1, 2, 3], ComparisonMethod.DeepEquals)).toBe(false);
      expect(areEqual([1, 2, 3], set, ComparisonMethod.DeepEquals)).toBe(false);
    });

    test('Array vs non-Array returns false', () => {
      const arr = [1, 2, 3];
      const obj = { 0: 1, 1: 2, 2: 3, length: 3 };
      expect(areEqual(arr, obj, ComparisonMethod.ShallowEqual)).toBe(false);
      expect(areEqual(obj, arr, ComparisonMethod.ShallowEqual)).toBe(false);
      expect(areEqual(arr, obj, ComparisonMethod.DeepEquals)).toBe(false);
      expect(areEqual(obj, arr, ComparisonMethod.DeepEquals)).toBe(false);
    });

    test('Map vs Set returns false', () => {
      const map = new Map([['a', 1]]);
      const set = new Set(['a', 1]);
      expect(areEqual(map, set, ComparisonMethod.ShallowEqual)).toBe(false);
      expect(areEqual(set, map, ComparisonMethod.ShallowEqual)).toBe(false);
      expect(areEqual(map, set, ComparisonMethod.DeepEquals)).toBe(false);
      expect(areEqual(set, map, ComparisonMethod.DeepEquals)).toBe(false);
    });

    test('Map vs Array returns false', () => {
      const map = new Map([[0, 'a']]);
      const arr = ['a'];
      expect(areEqual(map, arr, ComparisonMethod.ShallowEqual)).toBe(false);
      expect(areEqual(arr, map, ComparisonMethod.ShallowEqual)).toBe(false);
      expect(areEqual(map, arr, ComparisonMethod.DeepEquals)).toBe(false);
      expect(areEqual(arr, map, ComparisonMethod.DeepEquals)).toBe(false);
    });

    test('Set vs Array returns false', () => {
      const set = new Set([1, 2, 3]);
      const arr = [1, 2, 3];
      expect(areEqual(set, arr, ComparisonMethod.ShallowEqual)).toBe(false);
      expect(areEqual(arr, set, ComparisonMethod.ShallowEqual)).toBe(false);
      expect(areEqual(set, arr, ComparisonMethod.DeepEquals)).toBe(false);
      expect(areEqual(arr, set, ComparisonMethod.DeepEquals)).toBe(false);
    });

    test('Map vs primitive returns false', () => {
      const map = new Map();
      expect(areEqual(map, 'string', ComparisonMethod.ShallowEqual)).toBe(false);
      expect(areEqual(map, 42, ComparisonMethod.ShallowEqual)).toBe(false);
      expect(areEqual(map, true, ComparisonMethod.DeepEquals)).toBe(false);
    });

    test('Set vs primitive returns false', () => {
      const set = new Set();
      expect(areEqual(set, 'string', ComparisonMethod.ShallowEqual)).toBe(false);
      expect(areEqual(set, 42, ComparisonMethod.ShallowEqual)).toBe(false);
      expect(areEqual(set, true, ComparisonMethod.DeepEquals)).toBe(false);
    });

    test('Array vs primitive returns false', () => {
      const arr: unknown[] = [];
      expect(areEqual(arr, 'string', ComparisonMethod.ShallowEqual)).toBe(false);
      expect(areEqual(arr, 42, ComparisonMethod.ShallowEqual)).toBe(false);
      expect(areEqual(arr, true, ComparisonMethod.DeepEquals)).toBe(false);
    });

    test('Nested type mismatches in deep comparison', () => {
      const obj1 = { data: new Map([['key', 'value']]) };
      const obj2 = { data: { key: 'value' } };
      expect(areEqual(obj1, obj2, ComparisonMethod.DeepEquals)).toBe(false);
      expect(areEqual(obj2, obj1, ComparisonMethod.DeepEquals)).toBe(false);
    });

    test('Nested type mismatches with Sets in deep comparison', () => {
      const obj1 = { data: new Set([1, 2, 3]) };
      const obj2 = { data: [1, 2, 3] };
      expect(areEqual(obj1, obj2, ComparisonMethod.DeepEquals)).toBe(false);
      expect(areEqual(obj2, obj1, ComparisonMethod.DeepEquals)).toBe(false);
    });

    test('Nested type mismatches with Arrays in deep comparison', () => {
      const obj1 = { data: [1, 2, 3] };
      const obj2 = { data: { 0: 1, 1: 2, 2: 3 } };
      expect(areEqual(obj1, obj2, ComparisonMethod.DeepEquals)).toBe(false);
      expect(areEqual(obj2, obj1, ComparisonMethod.DeepEquals)).toBe(false);
    });
  });

  // ShallowEqual should only compare one level deep - nested objects use Exact comparison
  describe('ShallowEqual nested comparison behavior', () => {
    test('ShallowEqual with nested objects uses Exact comparison for nested values', () => {
      // These nested objects have the same structure but different references
      const obj1 = { a: { b: 1 } };
      const obj2 = { a: { b: 1 } };
      // ShallowEqual compares the first level, but nested objects are compared by reference
      expect(areEqual(obj1, obj2, ComparisonMethod.ShallowEqual)).toBe(false);
      // DeepEquals should still work
      expect(areEqual(obj1, obj2, ComparisonMethod.DeepEquals)).toBe(true);
    });

    test('ShallowEqual with same nested object reference returns true', () => {
      const nested = { b: 1 };
      const obj1 = { a: nested };
      const obj2 = { a: nested };
      // Same reference for nested object, so ShallowEqual should return true
      expect(areEqual(obj1, obj2, ComparisonMethod.ShallowEqual)).toBe(true);
    });

    test('ShallowEqual with nested arrays uses Exact comparison for nested values', () => {
      const obj1 = { data: [1, 2, 3] };
      const obj2 = { data: [1, 2, 3] };
      // Different array references at nested level
      expect(areEqual(obj1, obj2, ComparisonMethod.ShallowEqual)).toBe(false);
      // DeepEquals should still work
      expect(areEqual(obj1, obj2, ComparisonMethod.DeepEquals)).toBe(true);
    });

    test('ShallowEqual with same nested array reference returns true', () => {
      const nestedArray = [1, 2, 3];
      const obj1 = { data: nestedArray };
      const obj2 = { data: nestedArray };
      expect(areEqual(obj1, obj2, ComparisonMethod.ShallowEqual)).toBe(true);
    });

    test('ShallowEqual arrays with nested objects uses Exact comparison', () => {
      const arr1 = [{ a: 1 }, { b: 2 }];
      const arr2 = [{ a: 1 }, { b: 2 }];
      // Different object references within arrays
      expect(areEqual(arr1, arr2, ComparisonMethod.ShallowEqual)).toBe(false);
      // DeepEquals should still work
      expect(areEqual(arr1, arr2, ComparisonMethod.DeepEquals)).toBe(true);
    });

    test('ShallowEqual arrays with same object references returns true', () => {
      const obj1 = { a: 1 };
      const obj2 = { b: 2 };
      const arr1 = [obj1, obj2];
      const arr2 = [obj1, obj2];
      expect(areEqual(arr1, arr2, ComparisonMethod.ShallowEqual)).toBe(true);
    });

    test('ShallowEqual Maps with nested objects uses Exact comparison', () => {
      const map1 = new Map([['key', { value: 1 }]]);
      const map2 = new Map([['key', { value: 1 }]]);
      // Different object references within maps
      expect(areEqual(map1, map2, ComparisonMethod.ShallowEqual)).toBe(false);
      // DeepEquals should still work
      expect(areEqual(map1, map2, ComparisonMethod.DeepEquals)).toBe(true);
    });

    test('ShallowEqual Maps with same object references returns true', () => {
      const nestedObj = { value: 1 };
      const map1 = new Map([['key', nestedObj]]);
      const map2 = new Map([['key', nestedObj]]);
      expect(areEqual(map1, map2, ComparisonMethod.ShallowEqual)).toBe(true);
    });

    test('ShallowEqual deeply nested objects only compares one level', () => {
      // Three levels of nesting
      const obj1 = { level1: { level2: { level3: 'value' } } };
      const obj2 = { level1: { level2: { level3: 'value' } } };
      // ShallowEqual should fail because level1 objects are different references
      expect(areEqual(obj1, obj2, ComparisonMethod.ShallowEqual)).toBe(false);
    });

    test('ShallowEqual with primitives at top level works correctly', () => {
      const obj1 = { a: 1, b: 'string', c: true, d: null };
      const obj2 = { a: 1, b: 'string', c: true, d: null };
      // Primitives are compared by value, so this should be true
      expect(areEqual(obj1, obj2, ComparisonMethod.ShallowEqual)).toBe(true);
    });

    test('ShallowEqual with mixed primitives and objects', () => {
      const nested = { x: 1 };
      const obj1 = { a: 1, b: nested };
      const obj2 = { a: 1, b: nested };
      // Primitive 'a' matches, and 'b' is the same reference
      expect(areEqual(obj1, obj2, ComparisonMethod.ShallowEqual)).toBe(true);

      const obj3 = { a: 1, b: { x: 1 } };
      const obj4 = { a: 1, b: { x: 1 } };
      // Primitive 'a' matches, but 'b' is a different reference
      expect(areEqual(obj3, obj4, ComparisonMethod.ShallowEqual)).toBe(false);
    });
  });
});
