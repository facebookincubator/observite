/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { AsyncObservable } from '@/AsyncObservable';
import { AsyncObservableMap } from '@/AsyncObservableMap';
import { AsyncSelector } from '@/AsyncSelector';
import { Observable } from '@/Observable';
import { ObservableMap } from '@/ObservableMap';
import { Selector } from '@/Selector';

export type AnyObservable<TResolve> =
  | AnySyncObservable<TResolve>
  | AnyAsyncObservable<TResolve>;

export type AnySyncObservable<TResolve> =
  | Observable<TResolve>
  | Selector<TResolve>;
export type AnyAsyncObservable<TResolve> =
  | AsyncObservable<TResolve>
  | AsyncSelector<TResolve>;

export type AnyObservableMap<TKey, TResolve> =
  | AnySyncObservableMap<TKey, TResolve>
  | AnyAsyncObservableMap<TKey, TResolve>;

export type AnySyncObservableMap<TKey, TResolve> = ObservableMap<
  TKey,
  TResolve
>;
export type AnyAsyncObservableMap<TKey, TResolve> = AsyncObservableMap<
  TKey,
  TResolve
>;
