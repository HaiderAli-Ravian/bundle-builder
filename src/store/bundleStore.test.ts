import { describe, expect, it } from 'vitest'
import {
  selectProductConfiguration,
  selectProductQuantity,
  selectQuantity,
  selectSelectedProductCount,
} from './bundleSelectors'
import { createBundleStore } from './bundleStore'

describe('bundle store', () => {
  it('normalizes the approved seeded configuration', () => {
    const state = createBundleStore().getState()

    expect(state.openStepId).toBe('cameras')
    expect(
      selectQuantity(state, 'wyze-cam-v4', 'white'),
    ).toBe(1)
    expect(
      selectQuantity(state, 'wyze-cam-pan-v3', 'white'),
    ).toBe(2)
    expect(selectQuantity(state, 'wyze-sense-hub', 'default')).toBe(1)
    expect(selectSelectedProductCount(state, 'cameras')).toBe(2)
    expect(selectSelectedProductCount(state, 'plan')).toBe(1)
    expect(selectSelectedProductCount(state, 'sensors')).toBe(2)
    expect(selectSelectedProductCount(state, 'accessories')).toBe(1)
  })

  it('keeps quantities independent when the active variant changes', () => {
    const store = createBundleStore()

    store
      .getState()
      .setActiveVariant('wyze-cam-v4', 'black')
    store
      .getState()
      .adjustQuantity('wyze-cam-v4', 'black', 1)

    expect(
      selectProductConfiguration(
        store.getState(),
        'wyze-cam-v4',
      ),
    ).toMatchObject({
      activeVariantId: 'black',
      quantities: {
        black: 1,
        grey: 0,
        white: 1,
      },
    })

    store
      .getState()
      .setActiveVariant('wyze-cam-v4', 'white')

    expect(
      selectProductConfiguration(
        store.getState(),
        'wyze-cam-v4',
      ),
    ).toMatchObject({
      activeVariantId: 'white',
      quantities: {
        black: 1,
        grey: 0,
        white: 1,
      },
    })
  })

  it('counts a base product once when multiple variants are selected', () => {
    const store = createBundleStore()

    store
      .getState()
      .adjustQuantity('wyze-cam-v4', 'black', 1)

    expect(
      selectProductQuantity(store.getState(), 'wyze-cam-v4'),
    ).toBe(2)
    expect(
      selectSelectedProductCount(store.getState(), 'cameras'),
    ).toBe(2)
  })

  it('changes only the requested product and variant quantity', () => {
    const store = createBundleStore()

    store
      .getState()
      .adjustQuantity('wyze-cam-v4', 'white', -1)

    expect(
      selectQuantity(store.getState(), 'wyze-cam-v4', 'white'),
    ).toBe(0)
    expect(
      selectQuantity(store.getState(), 'wyze-cam-pan-v3', 'white'),
    ).toBe(2)
    expect(
      selectSelectedProductCount(store.getState(), 'cameras'),
    ).toBe(1)
  })

  it('never allows rapid decrements to create a negative quantity', () => {
    const store = createBundleStore()

    for (let index = 0; index < 25; index += 1) {
      store
        .getState()
        .adjustQuantity('wyze-cam-v4', 'white', -1)
    }

    expect(
      selectQuantity(store.getState(), 'wyze-cam-v4', 'white'),
    ).toBe(0)
  })

  it('enforces required and fixed product constraints', () => {
    const store = createBundleStore()

    store
      .getState()
      .adjustQuantity('wyze-sense-hub', 'default', -1)
    store
      .getState()
      .adjustQuantity('cam-unlimited', 'default', -1)
    store
      .getState()
      .adjustQuantity('cam-unlimited', 'default', 1)

    expect(
      selectQuantity(store.getState(), 'wyze-sense-hub', 'default'),
    ).toBe(1)
    expect(
      selectQuantity(store.getState(), 'cam-unlimited', 'default'),
    ).toBe(1)
  })

  it('ignores unknown product and variant combinations', () => {
    const store = createBundleStore()
    const initialState = store.getState()

    store
      .getState()
      .setActiveVariant('wyze-cam-v4', 'unknown')
    store
      .getState()
      .adjustQuantity('unknown', 'default', 1)

    expect(store.getState().activeVariantByProduct).toEqual(
      initialState.activeVariantByProduct,
    )
    expect(store.getState().quantityByKey).toEqual(
      initialState.quantityByKey,
    )
  })

  it('stores one open accordion step and supports closing it', () => {
    const store = createBundleStore()

    store.getState().setOpenStep('plan')
    expect(store.getState().openStepId).toBe('plan')

    store.getState().toggleStep('plan')
    expect(store.getState().openStepId).toBeNull()

    store.getState().toggleStep('sensors')
    expect(store.getState().openStepId).toBe('sensors')
  })
})
