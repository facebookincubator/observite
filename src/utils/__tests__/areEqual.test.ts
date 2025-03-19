/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { areEqual, ComparisonMethod } from '../areEqual';

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
});
