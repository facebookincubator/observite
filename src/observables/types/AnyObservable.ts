/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { AsyncObservable } from '@/AsyncObservable';
import { AsyncObservableMap } from '@/AsyncObservableMap';
import { AsyncSelector } from '@/AsyncSelector';
import { AsyncSelectorMap } from '@/AsyncSelectorMap';
import { Observable } from '@/Observable';
import { ObservableMap } from '@/ObservableMap';
import { Selector } from '@/Selector';
import { SelectorMap } from '@/SelectorMap';

export type AnyObservable<TResolve, TProvide> = TProvide extends TResolve
  ? AnySyncObservable<TResolve, TProvide>
  : TProvide extends Promise<TResolve>
    ? AnyAsyncObservable<TResolve, TProvide>
    : never;

export type AnySyncObservable<TResolve, TProvide extends TResolve> =
  | Observable<TResolve, TProvide>
  | Selector<TResolve, TProvide>;

export type AnyAsyncObservable<TResolve, TProvide extends Promise<TResolve>> =
  | AsyncObservable<TResolve, TProvide>
  | AsyncSelector<TResolve, TProvide>;

export type AnyObservableMap<TKey, TResolve, TProvide> =
  TProvide extends TResolve
    ? AnySyncObservableMap<TKey, TResolve, TProvide>
    : TProvide extends Promise<TResolve>
      ? AnyAsyncObservableMap<TKey, TResolve, TProvide>
      : never;

export type AnySyncObservableMap<TKey, TResolve, TProvide extends TResolve> =
  | ObservableMap<TKey, TResolve, TProvide>
  | SelectorMap<TKey, TResolve, TProvide>;

export type AnyAsyncObservableMap<
  TKey,
  TResolve,
  TProvide extends Promise<TResolve>,
> =
  | AsyncObservableMap<TKey, TResolve, TProvide>
  | AsyncSelectorMap<TKey, TResolve, TProvide>;
