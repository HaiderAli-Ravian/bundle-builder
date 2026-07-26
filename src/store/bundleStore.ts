import { create } from 'zustand'
import { createStore } from 'zustand/vanilla'
import { catalog, initialConfiguration } from '../data/catalog'
import type {
  BundleState,
  ProductId,
  QuantityKey,
  StepId,
  VariantId,
} from '../domain/bundleTypes'

type QuantityDelta = -1 | 1

export interface BundleActions {
  adjustQuantity: (
    productId: ProductId,
    variantId: VariantId,
    delta: QuantityDelta,
  ) => void
  setActiveVariant: (
    productId: ProductId,
    variantId: VariantId,
  ) => void
  setOpenStep: (stepId: StepId | null) => void
  toggleStep: (stepId: StepId) => void
}

export type BundleStore = BundleState & BundleActions

const productsById = new Map(
  catalog.products.map((product) => [product.id, product]),
)
const stepIds = new Set(catalog.categories.map((category) => category.id))

export function createQuantityKey(
  productId: ProductId,
  variantId: VariantId,
): QuantityKey {
  return `${productId}:${variantId}`
}

export function createInitialBundleState(): BundleState {
  const activeVariantByProduct: Record<ProductId, VariantId> = {}
  const quantityByKey: Record<QuantityKey, number> = {}

  for (const configuration of initialConfiguration.products) {
    activeVariantByProduct[configuration.productId] =
      configuration.activeVariantId

    for (const [variantId, quantity] of Object.entries(
      configuration.quantities,
    )) {
      quantityByKey[
        createQuantityKey(configuration.productId, variantId)
      ] = quantity
    }
  }

  return {
    activeVariantByProduct,
    checkoutFeedback: 'idle',
    openStepId: initialConfiguration.openStepId,
    quantityByKey,
    saveFeedback: 'idle',
  }
}

function createBundleState(
  set: (
    update:
      | Partial<BundleStore>
      | ((state: BundleStore) => Partial<BundleStore>),
  ) => void,
): BundleStore {
  return {
    ...createInitialBundleState(),

    adjustQuantity: (productId, variantId, delta) => {
      const product = productsById.get(productId)

      if (
        !product?.quantityEditable ||
        !Number.isInteger(delta) ||
        !product.variants.some((variant) => variant.id === variantId)
      ) {
        return
      }

      set((state) => {
        const quantityKey = createQuantityKey(productId, variantId)
        const currentQuantity = state.quantityByKey[quantityKey] ?? 0
        const otherVariantQuantity = product.variants.reduce(
          (total, variant) =>
            variant.id === variantId
              ? total
              : total +
                (state.quantityByKey[
                  createQuantityKey(productId, variant.id)
                ] ?? 0),
          0,
        )
        const minimum = Math.max(
          0,
          product.minQuantity - otherVariantQuantity,
        )
        const maximum =
          product.maxQuantity === undefined
            ? Number.POSITIVE_INFINITY
            : Math.max(0, product.maxQuantity - otherVariantQuantity)
        const nextQuantity = Math.min(
          maximum,
          Math.max(minimum, currentQuantity + delta),
        )

        if (nextQuantity === currentQuantity) {
          return state
        }

        return {
          quantityByKey: {
            ...state.quantityByKey,
            [quantityKey]: nextQuantity,
          },
        }
      })
    },

    setActiveVariant: (productId, variantId) => {
      const product = productsById.get(productId)

      if (!product?.variants.some((variant) => variant.id === variantId)) {
        return
      }

      set((state) => {
        if (state.activeVariantByProduct[productId] === variantId) {
          return state
        }

        return {
          activeVariantByProduct: {
            ...state.activeVariantByProduct,
            [productId]: variantId,
          },
        }
      })
    },

    setOpenStep: (stepId) => {
      if (stepId !== null && !stepIds.has(stepId)) {
        return
      }

      set((state) =>
        state.openStepId === stepId ? state : { openStepId: stepId },
      )
    },

    toggleStep: (stepId) => {
      if (!stepIds.has(stepId)) {
        return
      }

      set((state) => ({
        openStepId: state.openStepId === stepId ? null : stepId,
      }))
    },
  }
}

export function createBundleStore() {
  return createStore<BundleStore>()(createBundleState)
}

export const useBundleStore = create<BundleStore>()(createBundleState)
