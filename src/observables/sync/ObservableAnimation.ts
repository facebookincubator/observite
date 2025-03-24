/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Maybe } from '@/Maybe';
import { Options as ObservableOptions } from '@/AbstractObservable';
import { Observable } from '@/Observable';
import { nullthrows } from '@/nullthrows';
import { areEqual, ComparisonMethod } from '@/areEqual';

type Options<T> = {
  // How long does it take to go from current to target
  transitionDurationMs: number;
  // Throttle how many updates per second we get
  framesPerSecond: number;
  // How long to wait for potential changes before we start
  waitMs: number;
  // Optional callback function to interpolate between start and end values
  interpolateCB?: <T>(start: T, end: T, t: number) => T;
};

function lerp(v1: number, v2: number, t: number): number {
  return v1 + (v2 - v1) * t;
}

export class ObservableAnimation<T> {
  target: Observable<T>;
  current: Observable<T>;
  private options: Options<T>;
  animationState: Maybe<{
    start: T;
    end: T;
    t: number;
    tStep: number;
    delayMs: number;
    id: ReturnType<typeof setInterval>;
  }> = null;

  constructor(
    targetOptions?: Maybe<ObservableOptions<T>>,
    currentOptions?: Maybe<ObservableOptions<T>>,
    options?: Maybe<Partial<Options<T>>>
  ) {
    this.target = new Observable({
      ...(targetOptions ?? {}),
      onRelease: this.onRelease,
    });
    this.current = new Observable({
      ...(currentOptions ?? targetOptions ?? {}),
      onRelease: this.onRelease,
    });
    this.options = {
      transitionDurationMs: 150,
      framesPerSecond: 30,
      waitMs: 0,
      ...options,
    };
  }

  setTarget(value: T) {
    this.clearAnimation();
    this.target.set(value);
    this.onChanged();
  }

  setCurrent(value: T) {
    this.clearAnimation();
    this.current.set(value);
    this.onChanged();
  }

  setBoth(value: T) {
    this.clearAnimation();
    this.target.set(value);
    this.current.set(value);
    this.onChanged();
  }

  destroy() {
    this.target.destroy();
    this.current.destroy();
  }

  private onRelease = () => {};

  private onChanged() {
    const start = nullthrows(this.current.peek());
    const end = nullthrows(this.target.peek());
    if (
      !this.animationState &&
      !areEqual(start, end, ComparisonMethod.ShallowEqual)
    ) {
      const { transitionDurationMs, framesPerSecond, waitMs } = this.options;
      const delayMs = Math.ceil(1000 / framesPerSecond);
      const tStep = delayMs / transitionDurationMs;
      let id;
      if (waitMs > 0) {
        id = setInterval(this.startInterval, waitMs);
      } else {
        id = setInterval(this.onFrame, delayMs);
      }
      this.animationState = { start, end, t: 0, tStep, id, delayMs };
    }
  }

  private startInterval = () => {
    const animationState = nullthrows(this.animationState);
    clearInterval(animationState.id);
    animationState.id = setInterval(this.onFrame, animationState.delayMs);
  };

  private onFrame = () => {
    const animationState = nullthrows(this.animationState);
    const { start, end, t, tStep } = animationState;
    const newT = t + tStep;
    let interpolateCB =
      this.options.interpolateCB ??
      (lerp as <T>(start: T, end: T, t: number) => T);
    this.current.set(interpolateCB(start, end, Math.min(1.0, newT)));
    if (newT >= 1.0) {
      this.clearAnimation();
    } else {
      animationState.t = newT;
    }
  };

  clearAnimation(): void {
    if (this.animationState) {
      const { id } = this.animationState;
      id && clearInterval(id);
      this.animationState = null;
    }
  }
}
