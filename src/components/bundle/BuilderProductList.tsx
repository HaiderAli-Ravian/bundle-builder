import { useShallow } from 'zustand/react/shallow'
import { resolveAsset } from '../../data/assetRegistry'
import type { Product } from '../../domain/bundleTypes'
import {
  createQuantityKey,
  useBundleStore,
} from '../../store/bundleStore'
import { PriceDisplay } from '../product/PriceDisplay'
import { QuantityStepper } from '../product/QuantityStepper'

interface BuilderProductListProps {
  products: readonly Product[]
}

function BuilderProductRow({ product }: { product: Product }) {
  const activeVariantId = useBundleStore(
    (state) => state.activeVariantByProduct[product.id],
  )
  const quantities = useBundleStore(
    useShallow((state) =>
      product.variants.map(
        (variant) =>
          state.quantityByKey[
            createQuantityKey(product.id, variant.id)
          ] ?? 0,
      ),
    ),
  )
  const adjustQuantity = useBundleStore(
    (state) => state.adjustQuantity,
  )
  const activeVariantIndex = product.variants.findIndex(
    (variant) => variant.id === activeVariantId,
  )
  const activeVariant = product.variants[activeVariantIndex]
  const quantity = quantities[activeVariantIndex] ?? 0
  const totalQuantity = quantities.reduce(
    (total, currentQuantity) => total + currentQuantity,
    0,
  )
  const minimum = Math.max(
    0,
    product.minQuantity - (totalQuantity - quantity),
  )
  const maximum =
    product.maxQuantity === undefined
      ? undefined
      : Math.max(0, product.maxQuantity - (totalQuantity - quantity))
  const pricing = activeVariant?.pricing ?? product.basePricing

  return (
    <article
      aria-label={product.name}
      className={`grid min-h-[88px] grid-cols-[64px_minmax(0,1fr)] items-center gap-[12px] rounded-card border-2 bg-card p-[10px] ${
        totalQuantity > 0 ? 'border-selected-border' : 'border-transparent'
      }`}
    >
      <span className="flex size-16 items-center justify-center overflow-hidden rounded-[5px]">
        <img
          alt=""
          aria-hidden="true"
          className="size-full object-contain"
          src={resolveAsset(
            activeVariant?.imageAsset ?? product.imageAsset,
          )}
        />
      </span>

      <div className="flex min-w-0 flex-col gap-[8px]">
        <h3 className="font-gilroy-semibold text-ui-16 leading-solid font-semibold tracking-copy text-text-primary">
          {product.name}
        </h3>

        <div className="flex items-end justify-between gap-3">
          {product.quantityEditable ? (
            <QuantityStepper
              label={product.name}
              maximum={maximum}
              minimum={minimum}
              onDecrease={() =>
                adjustQuantity(product.id, activeVariantId, -1)
              }
              onIncrease={() =>
                adjustQuantity(product.id, activeVariantId, 1)
              }
              quantity={quantity}
            />
          ) : (
            <span aria-hidden="true" />
          )}
          <PriceDisplay pricing={pricing} />
        </div>
      </div>
    </article>
  )
}

export function BuilderProductList({
  products,
}: BuilderProductListProps) {
  return (
    <div className="grid grid-cols-1 gap-product-grid px-panel-inset pt-panel-inset tablet:grid-cols-2">
      {products
        .toSorted(
          (left, right) => left.builderSortOrder - right.builderSortOrder,
        )
        .map((product) => (
          <BuilderProductRow key={product.id} product={product} />
        ))}
    </div>
  )
}
