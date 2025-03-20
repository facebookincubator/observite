/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { AsyncObservable } from './AsyncObservable';
import { Observable } from './Observable';

export type AnyObservable<TResolve> =
  | Observable<TResolve>
  | AsyncObservable<TResolve>;

export type AnyObservableMap<_Key, TResolve> =
  | Observable<TResolve>
  | AsyncObservable<TResolve>;
