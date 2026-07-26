import { catalog } from '../data/catalog'
import type {
  ProductConfiguration,
  ProductId,
  StepId,
  VariantId,
} from '../domain/bundleTypes'
import type { BundleStore } from './bundleStore'
import { createQuantityKey } from './bundleStore'

export function selectQuantity(
  state: BundleStore,
  productId: ProductId,
  variantId: VariantId,
): number {
  return state.quantityByKey[createQuantityKey(productId, variantId)] ?? 0
}

export function selectProductQuantity(
  state: BundleStore,
  productId: ProductId,
): number {
  const product = catalog.products.find(
    (candidate) => candidate.id === productId,
  )

  if (!product) {
    return 0
  }

  return product.variants.reduce(
    (total, variant) =>
      total + selectQuantity(state, product.id, variant.id),
    0,
  )
}

export function selectProductConfiguration(
  state: BundleStore,
  productId: ProductId,
): ProductConfiguration | undefined {
  const product = catalog.products.find(
    (candidate) => candidate.id === productId,
  )
  const activeVariantId = state.activeVariantByProduct[productId]

  if (
    !product ||
    !product.variants.some((variant) => variant.id === activeVariantId)
  ) {
    return undefined
  }

  return {
    activeVariantId,
    productId,
    quantities: Object.fromEntries(
      product.variants.map((variant) => [
        variant.id,
        selectQuantity(state, product.id, variant.id),
      ]),
    ),
  }
}

export function selectSelectedProductCount(
  state: BundleStore,
  stepId: StepId,
): number {
  return catalog.products.reduce(
    (count, product) =>
      product.categoryId === stepId &&
      selectProductQuantity(state, product.id) > 0
        ? count + 1
        : count,
    0,
  )
}
