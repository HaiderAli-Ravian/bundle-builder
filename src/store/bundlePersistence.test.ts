import { describe, expect, it } from 'vitest'
import {
  BUNDLE_STORAGE_KEY,
  type BundleStorage,
} from './bundlePersistence'
import {
  createBundleStore,
  createInitialBundleState,
} from './bundleStore'

function createMemoryStorage(
  initialEntries: Record<string, string> = {},
): BundleStorage & { entries: Map<string, string> } {
  const entries = new Map(Object.entries(initialEntries))

  return {
    entries,
    getItem: (key) => entries.get(key) ?? null,
    setItem: (key, value) => {
      entries.set(key, value)
    },
  }
}

describe('bundle persistence', () => {
  it('writes only after the explicit save action', () => {
    const storage = createMemoryStorage()
    const store = createBundleStore({ storage })

    store
      .getState()
      .adjustQuantity('wyze-cam-v4', 'black', 1)

    expect(storage.entries.has(BUNDLE_STORAGE_KEY)).toBe(false)

    store.getState().saveConfiguration()

    expect(storage.entries.has(BUNDLE_STORAGE_KEY)).toBe(true)
    expect(store.getState().saveFeedback).toBe('saved')
  })

  it('restores the last saved state without restoring later unsaved edits', () => {
    const storage = createMemoryStorage()
    const firstStore = createBundleStore({
      now: () => new Date('2026-07-27T10:00:00.000Z'),
      storage,
    })

    firstStore.getState().setOpenStep('sensors')
    firstStore
      .getState()
      .setActiveVariant('wyze-cam-v4', 'black')
    firstStore
      .getState()
      .adjustQuantity('wyze-cam-v4', 'black', 1)
    firstStore.getState().saveConfiguration()
    firstStore
      .getState()
      .adjustQuantity('wyze-cam-v4', 'black', 1)

    const restoredState = createBundleStore({ storage }).getState()

    expect(restoredState.openStepId).toBe('sensors')
    expect(restoredState.activeVariantByProduct['wyze-cam-v4']).toBe(
      'black',
    )
    expect(
      restoredState.quantityByKey['wyze-cam-v4:black'],
    ).toBe(1)
    expect(restoredState.saveFeedback).toBe('idle')
    expect(restoredState.checkoutFeedback).toBe('idle')
  })

  it('stores configuration fields without derived or transient state', () => {
    const storage = createMemoryStorage()
    const store = createBundleStore({
      now: () => new Date('2026-07-27T10:00:00.000Z'),
      storage,
    })

    store.getState().saveConfiguration()

    const serialized = storage.entries.get(BUNDLE_STORAGE_KEY)
    const snapshot = JSON.parse(serialized ?? '{}')

    expect(snapshot).toMatchObject({
      catalogVersion: '2026-07-26',
      openStepId: 'cameras',
      savedAt: '2026-07-27T10:00:00.000Z',
      schemaVersion: 1,
    })
    expect(snapshot).not.toHaveProperty('checkoutFeedback')
    expect(snapshot).not.toHaveProperty('saveFeedback')
    expect(snapshot).not.toHaveProperty('reviewLines')
    expect(snapshot).not.toHaveProperty('totals')
  })

  it('falls back to the seed when stored JSON is corrupt', () => {
    const storage = createMemoryStorage({
      [BUNDLE_STORAGE_KEY]: '{not-valid-json',
    })

    expect(createBundleStore({ storage }).getState()).toMatchObject(
      createInitialBundleState(),
    )
  })

  it('falls back to the seed for an incompatible schema version', () => {
    const storage = createMemoryStorage({
      [BUNDLE_STORAGE_KEY]: JSON.stringify({
        activeVariantByProduct: {},
        catalogVersion: '2026-07-26',
        openStepId: null,
        quantityByKey: {},
        savedAt: '2026-07-27T10:00:00.000Z',
        schemaVersion: 2,
      }),
    })

    expect(createBundleStore({ storage }).getState()).toMatchObject(
      createInitialBundleState(),
    )
  })

  it('ignores unknown IDs and repairs invalid saved values', () => {
    const seededState = createInitialBundleState()
    const storage = createMemoryStorage({
      [BUNDLE_STORAGE_KEY]: JSON.stringify({
        activeVariantByProduct: {
          'unknown-product': 'default',
          'wyze-cam-v4': 'unknown-variant',
        },
        catalogVersion: 'older-catalog',
        openStepId: 'unknown-step',
        quantityByKey: {
          'unknown-product:default': 10,
          'wyze-cam-v4:black': -2,
          'wyze-cam-v4:grey': 1.5,
          'wyze-sense-hub:default': 0,
        },
        savedAt: '2026-07-27T10:00:00.000Z',
        schemaVersion: 1,
      }),
    })

    const state = createBundleStore({ storage }).getState()

    expect(state.openStepId).toBe(seededState.openStepId)
    expect(state.activeVariantByProduct['wyze-cam-v4']).toBe('white')
    expect(state.activeVariantByProduct).not.toHaveProperty(
      'unknown-product',
    )
    expect(state.quantityByKey['wyze-cam-v4:black']).toBe(0)
    expect(state.quantityByKey['wyze-cam-v4:grey']).toBe(0)
    expect(state.quantityByKey['wyze-sense-hub:default']).toBe(1)
    expect(state.quantityByKey).not.toHaveProperty(
      'unknown-product:default',
    )
  })

  it('reports storage write errors without changing the bundle', () => {
    const storage: BundleStorage = {
      getItem: () => null,
      setItem: () => {
        throw new Error('Storage unavailable')
      },
    }
    const store = createBundleStore({ storage })
    const quantities = store.getState().quantityByKey

    store.getState().saveConfiguration()

    expect(store.getState().saveFeedback).toBe('error')
    expect(store.getState().quantityByKey).toEqual(quantities)
  })
})
