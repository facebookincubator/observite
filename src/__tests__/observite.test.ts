/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

import { AsyncSelector } from '@/AsyncSelector';
import { nullthrows } from '@/nullthrows';
import { Observable } from '@/Observable';
import { Selector } from '@/Selector';
import { SelectorMap } from '@/SelectorMap';
import { Status } from '@/StateRef';
import { SyncObserver } from '@/SyncObserver';

type Loadable<T> = LoadSuccess<T> | LoadFailed | Loading;

type LoadSuccess<T> = Readonly<{
  status: 'LoadSuccess';
  data: T;
}>;

type LoadFailed = Readonly<{
  status: 'LoadFailed';
  errors: Set<Error>;
}>;

type Loading = Readonly<{
  status: 'Loading';
  promise: Promise<void>;
}>;

function loading(promise: Promise<void>): Loading {
  return { status: 'Loading', promise };
}

function loadSuccess<T>(data: T): Loadable<T> {
  return { status: 'LoadSuccess', data };
}

// async test utility function
async function currentEventLoopEnd() {
  jest.advanceTimersByTime(2);
  await new Promise((resolve) => setTimeout(resolve, 0));
}

const DEFAULT_SIZE_OF_UNIVERSE = 94;
class UniverseStore {
  // Simple Observable for testing basic sets and updates
  size = new Observable<number>({
    default: DEFAULT_SIZE_OF_UNIVERSE,
    debugID: 'UniverseStore::size',
  });
}

const starMap: Record<string, Array<string>> = {
  MilkyWay: ['Sol', 'Proxima Centauri'],
  Andromeda: ['Alpheratz'],
};

class GalaxyStore {
  __releaseCount = 0;
  // Sync Selector for testing
  galaxies = new SelectorMap<string, Array<string>>(
    (_, galaxyName) => starMap[galaxyName],
    {
      debugID: 'GalaxyStore::galaxies',
    }
  );
}

class StarStore {
  // Would probably be more normal to use an ObservableMap for this kind of
  // thing however want to test releasing of stored data so using an Observable
  // and a SelectorMap into that Observable's data.
  starData = new Observable<Record<string, Loadable<string>>>({
    default: {},
    debugID: 'StarStore::starData',
  });
  stars = new SelectorMap<string, Loadable<string>>(
    ({ observe }, starName) => {
      console.log('getState', starName);
      const loadedStars = observe(this.starData);
      if (loadedStars[starName] == null) {
        loadedStars[starName] = loading(
          new Promise((resolve) => {
            setTimeout(() => {
              this.starData.set({
                ...nullthrows(this.starData.peek()),
                [starName]: loadSuccess(starName),
              });
              resolve();
            }, starName.length);
          })
        );
      }
      return loadedStars[starName];
    },
    {
      debugID: 'StarStore::stars',
      releaseDelay: 50,
      onRelease: (starName) => {
        console.log('onRelease', starName);
        const starData = { ...nullthrows(this.starData.peek()) };
        delete starData[starName];
        this.starData.set(starData);
      },
    }
  );

  extraStarData = new AsyncSelector<string>(async () => {
    const timeout = new Promise((resolve) => setTimeout(resolve, 10));
    await timeout;
    return 'Ardos';
  });

  extraStar = new Selector<string>(({ observeState }) => {
    const result = observeState(this.extraStarData);
    if (result.status !== Status.Resolved) {
      return 'IsLoading';
    }
    return nullthrows(result.result);
  });
}

describe('Observite Integration Tests', () => {
  beforeAll(async () => {
    jest.useFakeTimers({ advanceTimers: true });
  });
  afterAll(async () => {
    jest.useRealTimers();
  });

  test('Observable Basics', async () => {
    const universeStore = new UniverseStore();
    console.log('Init...');
    let getStateCount = 0;
    let onChangeCount = 0;
    const sizeSelector = new Selector<number>(({ observe }) => {
      getStateCount++;
      const newState = observe(universeStore.size);
      console.log('getState', newState);
      return newState;
    });
    const observer = new SyncObserver();
    let size: number;
    observer.setOnChange(() => {
      console.log('onChange');
      size = observer.observe(sizeSelector);
      onChangeCount++;
    });
    size = observer.observe(sizeSelector);
    console.log('Initially we should have fetched state once with no changes');
    await currentEventLoopEnd();
    expect(getStateCount).toBe(1);
    expect(onChangeCount).toBe(0);
    expect(size).toBe(DEFAULT_SIZE_OF_UNIVERSE);
    console.log('After a change, one more fetch of state and one change');
    let newSize = size + 1;
    universeStore.size.set(newSize);
    await currentEventLoopEnd();
    expect(getStateCount).toBe(2);
    expect(onChangeCount).toBe(1);
    expect(size).toBe(newSize);
    console.log('Set that causes no change, one more check but no change');
    universeStore.size.set(newSize);
    await currentEventLoopEnd();
    expect(getStateCount).toBe(2);
    expect(onChangeCount).toBe(1);
    expect(size).toBe(newSize);
    console.log('Changes after we stop observing are ignored');
    observer.destroy();
    await currentEventLoopEnd();
    await currentEventLoopEnd();
    newSize = size + 1;
    universeStore.size.set(newSize);
    await currentEventLoopEnd();
    expect(getStateCount).toBe(2);
    expect(onChangeCount).toBe(1);
    expect(size).toBe(newSize - 1);
  });

  test('Resource Maps', async () => {
    const galaxyStore = new GalaxyStore();
    const starStore = new StarStore();
    console.log('Init...');
    const starsSelector = new Selector<Loadable<string>[]>(
      ({ observeKey }) => {
        console.log('getState');
        const starNames = observeKey(galaxyStore.galaxies, 'MilkyWay');
        console.log('starNames', starNames);
        return nullthrows(starNames).map((name) =>
          nullthrows(observeKey(starStore.stars, name))
        );
      },
      { debugID: 'starsSelector' }
    );
    let stars: Array<Loadable<string>>;
    let extraStar: string;
    const observer = new SyncObserver();
    observer.setOnChange(() => {
      stars = observer.observe(starsSelector);
      console.log('onChange (stars)', stars);
      extraStar = observer.observe(starStore.extraStar);
      console.log('onChange (extraStar)', extraStar);
    });
    stars = observer.observe(starsSelector);
    extraStar = observer.observe(starStore.extraStar);
    console.log('Initially Loading');
    expect(stars.length).toBe(2);
    expect(stars[0].status).toBe('Loading');
    expect(stars[1].status).toBe('Loading');
    console.log('Advancing Time: Both should be loaded');
    jest.advanceTimersByTime(100);
    await currentEventLoopEnd();
    expect(stars[0].status).toBe('LoadSuccess');
    expect(stars[1].status).toBe('LoadSuccess');
    expect(extraStar).toBe('Ardos');
    console.log('Unlistening: Data should still be held onto');
    observer.destroy();
    await currentEventLoopEnd();
    expect(starStore.starData.peek()?.Sol).not.toBeUndefined();
    expect(starStore.starData.peek()?.['Proxima Centauri']).not.toBeUndefined();
    console.log('Advancing Time: Data should still be held onto');
    jest.advanceTimersByTime(10);
    await currentEventLoopEnd();
    expect(starStore.starData.peek()?.Sol).not.toBeUndefined();
    expect(starStore.starData.peek()?.['Proxima Centauri']).not.toBeUndefined();
    console.log(
      'Relistening and Advancing Time: Data should still be held onto'
    );
    observer.setOnChange(() => { });
    observer.observe(starsSelector);
    jest.advanceTimersByTime(100);
    await currentEventLoopEnd();
    expect(starStore.starData.peek()?.Sol).not.toBeUndefined();
    expect(starStore.starData.peek()?.['Proxima Centauri']).not.toBeUndefined();
    console.log(
      'Unlistening and Advancing Time: Data should no longer be held onto'
    );
    observer.destroy();
    // Releases slowly cascade so the base selector waits to release then releases
    // its references to the next selectors which wait to release their selectors
    // etc etc. This might seem bad but we the tree is not going to be that deep
    // and all we are really talking about is holding onto date for few extra
    // frames. Garbage collection is not going to happen instantly by the browser
    // anyways.
    await currentEventLoopEnd();
    await currentEventLoopEnd();
    jest.advanceTimersByTime(100);
    await currentEventLoopEnd();
    await currentEventLoopEnd();
    expect(starStore.starData.peek()?.Sol).toBeUndefined();
    expect(starStore.starData.peek()?.['Proxima Centauri']).toBeUndefined();
  });
});
