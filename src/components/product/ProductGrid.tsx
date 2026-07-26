import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import type {
  Product,
  ProductConfiguration,
} from '../../domain/bundleTypes'
import {
  createQuantityKey,
  useBundleStore,
} from '../../store/bundleStore'
import { ProductCard } from './ProductCard'
import { ProductDetailsDialog } from './ProductDetailsDialog'

interface ProductGridProps {
  products: readonly Product[]
}

interface ConnectedProductCardProps {
  className: string
  onLearnMore: (product: Product) => void
  product: Product
}

function ConnectedProductCard({
  className,
  onLearnMore,
  product,
}: ConnectedProductCardProps) {
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
  const adjustQuantity = useBundleStore((state) => state.adjustQuantity)
  const setActiveVariant = useBundleStore(
    (state) => state.setActiveVariant,
  )
  const configuration: ProductConfiguration = {
    activeVariantId,
    productId: product.id,
    quantities: Object.fromEntries(
      product.variants.map((variant, index) => [
        variant.id,
        quantities[index] ?? 0,
      ]),
    ),
  }

  return (
    <ProductCard
      className={className}
      configuration={configuration}
      onLearnMore={onLearnMore}
      onQuantityChange={adjustQuantity}
      onVariantChange={setActiveVariant}
      product={product}
    />
  )
}

export function ProductGrid({ products }: ProductGridProps) {
  const [detailsProduct, setDetailsProduct] = useState<Product | null>(null)
  const orderedProducts = products.toSorted(
    (left, right) => left.builderSortOrder - right.builderSortOrder,
  )

  return (
    <>
      <div className="grid grid-cols-1 gap-product-grid px-panel-inset pt-[10px] tablet:grid-cols-2 wide:grid-cols-5 wide:pt-panel-inset">
        {orderedProducts.map((product, index) => {
          const isLastOddProduct =
            orderedProducts.length % 2 === 1 &&
            index === orderedProducts.length - 1

          return (
            <ConnectedProductCard
              className={
                isLastOddProduct
                  ? 'tablet:col-span-2 tablet:w-[calc((100%-15px)/2)] tablet:justify-self-center wide:col-span-1 wide:w-auto wide:justify-self-stretch'
                  : ''
              }
              key={product.id}
              onLearnMore={setDetailsProduct}
              product={product}
            />
          )
        })}
      </div>

      <ProductDetailsDialog
        onClose={() => setDetailsProduct(null)}
        product={detailsProduct}
      />
    </>
  )
}
