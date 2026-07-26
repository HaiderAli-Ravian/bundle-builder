import { catalog } from '../data/catalog'
import type {
  ProductConfiguration,
  ProductId,
  ReviewLine,
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

export function selectReviewLines(
  state: Pick<BundleStore, 'quantityByKey'>,
): readonly ReviewLine[] {
  const orderedCategories = catalog.categories.toSorted(
    (left, right) => left.reviewSortOrder - right.reviewSortOrder,
  )

  return orderedCategories.flatMap((category) =>
    catalog.products
      .filter((product) => product.categoryId === category.id)
      .toSorted(
        (left, right) => left.reviewSortOrder - right.reviewSortOrder,
      )
      .flatMap((product) =>
        product.variants
          .toSorted(
            (left, right) => left.sortOrder - right.sortOrder,
          )
          .flatMap((variant) => {
            const key = createQuantityKey(product.id, variant.id)
            const quantity = state.quantityByKey[key] ?? 0

            if (quantity <= 0) {
              return []
            }

            const pricing = variant.pricing ?? product.basePricing
            const baseName = product.reviewName ?? product.name
            const displayName =
              variant.id === 'default' || variant.id === 'white'
                ? baseName
                : `${baseName} (${variant.name})`

            return [
              {
                categoryId: product.categoryId,
                compareAtLinePriceCents:
                  pricing.compareAtUnitPriceCents === undefined
                    ? undefined
                    : pricing.compareAtUnitPriceCents * quantity,
                compareAtUnitPriceCents:
                  pricing.compareAtUnitPriceCents,
                displayName,
                imageAsset:
                  product.reviewThumbnailAsset ??
                  variant.imageAsset ??
                  product.imageAsset,
                key,
                linePriceCents: pricing.unitPriceCents * quantity,
                productId: product.id,
                quantity,
                quantityEditable: product.quantityEditable,
                unitPriceCents: pricing.unitPriceCents,
                variantId: variant.id,
              } satisfies ReviewLine,
            ]
          }),
      ),
  )
}
