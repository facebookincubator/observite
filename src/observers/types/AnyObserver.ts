/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { AsyncObserver } from '@/AsyncObserver';
import { SyncObserver } from '@/SyncObserver';

export type AnyObserver = AsyncObserver | SyncObserver;
