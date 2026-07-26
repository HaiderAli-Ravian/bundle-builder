import { catalog } from '../data/catalog'
import type {
  BundleState,
  ProductId,
  QuantityKey,
  SavedConfiguration,
  StepId,
  VariantId,
} from '../domain/bundleTypes'

export const BUNDLE_STORAGE_KEY = 'ecomexperts.bundle-builder.v1'

export interface BundleStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

type PersistedBundleState = Pick<
  BundleState,
  'activeVariantByProduct' | 'openStepId' | 'quantityByKey'
>

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isSavedConfiguration(value: unknown): value is SavedConfiguration {
  return (
    isRecord(value) &&
    value.schemaVersion === 1 &&
    typeof value.catalogVersion === 'string' &&
    typeof value.savedAt === 'string' &&
    (value.openStepId === null || typeof value.openStepId === 'string') &&
    isRecord(value.activeVariantByProduct) &&
    isRecord(value.quantityByKey)
  )
}

function createQuantityKey(
  productId: ProductId,
  variantId: VariantId,
): QuantityKey {
  return `${productId}:${variantId}`
}

function reconcileSavedConfiguration(
  saved: SavedConfiguration,
  seededState: BundleState,
): BundleState {
  const stepIds = new Set(catalog.categories.map((category) => category.id))
  const activeVariantByProduct = {
    ...seededState.activeVariantByProduct,
  }
  const quantityByKey = { ...seededState.quantityByKey }

  for (const product of catalog.products) {
    const savedActiveVariant =
      saved.activeVariantByProduct[product.id]

    if (
      product.variants.some(
        (variant) => variant.id === savedActiveVariant,
      )
    ) {
      activeVariantByProduct[product.id] = savedActiveVariant
    }

    if (!product.quantityEditable) {
      continue
    }

    const quantities = product.variants.map((variant) => {
      const quantityKey = createQuantityKey(product.id, variant.id)
      const savedQuantity = saved.quantityByKey[quantityKey]

      return {
        key: quantityKey,
        quantity:
          Number.isInteger(savedQuantity) && savedQuantity >= 0
            ? savedQuantity
            : (quantityByKey[quantityKey] ?? 0),
        variantId: variant.id,
      }
    })

    if (product.maxQuantity !== undefined) {
      let remaining = product.maxQuantity

      for (const entry of quantities) {
        entry.quantity = Math.min(entry.quantity, remaining)
        remaining -= entry.quantity
      }
    }

    const totalQuantity = quantities.reduce(
      (total, entry) => total + entry.quantity,
      0,
    )

    if (totalQuantity < product.minQuantity) {
      const preferredVariantId =
        activeVariantByProduct[product.id] ??
        product.variants[0]?.id
      const preferredEntry = quantities.find(
        (entry) => entry.variantId === preferredVariantId,
      )

      if (preferredEntry) {
        preferredEntry.quantity += product.minQuantity - totalQuantity
      }
    }

    for (const entry of quantities) {
      quantityByKey[entry.key] = entry.quantity
    }
  }

  const openStepId =
    saved.openStepId === null || stepIds.has(saved.openStepId as StepId)
      ? (saved.openStepId as StepId | null)
      : seededState.openStepId

  return {
    activeVariantByProduct,
    checkoutFeedback: 'idle',
    openStepId,
    quantityByKey,
    saveFeedback: 'idle',
  }
}

export function getBrowserStorage(): BundleStorage | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function restoreBundleState(
  storage: BundleStorage | null,
  seededState: BundleState,
): BundleState {
  if (!storage) {
    return seededState
  }

  try {
    const serialized = storage.getItem(BUNDLE_STORAGE_KEY)

    if (!serialized) {
      return seededState
    }

    const saved: unknown = JSON.parse(serialized)

    return isSavedConfiguration(saved)
      ? reconcileSavedConfiguration(saved, seededState)
      : seededState
  } catch {
    return seededState
  }
}

export function saveBundleState(
  storage: BundleStorage,
  state: PersistedBundleState,
  savedAt: Date,
): SavedConfiguration {
  const snapshot: SavedConfiguration = {
    activeVariantByProduct: { ...state.activeVariantByProduct },
    catalogVersion: catalog.catalogVersion,
    openStepId: state.openStepId,
    quantityByKey: { ...state.quantityByKey },
    savedAt: savedAt.toISOString(),
    schemaVersion: 1,
  }

  storage.setItem(BUNDLE_STORAGE_KEY, JSON.stringify(snapshot))

  return snapshot
}
