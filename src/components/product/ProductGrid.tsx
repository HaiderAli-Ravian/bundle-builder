import { useState } from 'react'
import type {
  Product,
  ProductConfiguration,
} from '../../domain/bundleTypes'
import { ProductCard } from './ProductCard'
import { ProductDetailsDialog } from './ProductDetailsDialog'

interface ProductGridProps {
  configurations: readonly ProductConfiguration[]
  onQuantityChange: (productId: string, variantId: string, delta: -1 | 1) => void
  onVariantChange: (productId: string, variantId: string) => void
  products: readonly Product[]
}

export function ProductGrid({
  configurations,
  onQuantityChange,
  onVariantChange,
  products,
}: ProductGridProps) {
  const [detailsProduct, setDetailsProduct] = useState<Product | null>(null)
  const orderedProducts = products.toSorted(
    (left, right) => left.builderSortOrder - right.builderSortOrder,
  )

  return (
    <>
      <div className="grid grid-cols-1 gap-product-grid px-panel-inset pt-[10px] tablet:grid-cols-2 wide:grid-cols-5 wide:pt-panel-inset">
        {orderedProducts.map((product, index) => {
          const configuration = configurations.find(
            (candidate) => candidate.productId === product.id,
          )

          if (!configuration) {
            throw new Error(`Missing configuration for product "${product.id}"`)
          }

          const isLastOddProduct =
            orderedProducts.length % 2 === 1 &&
            index === orderedProducts.length - 1

          return (
            <ProductCard
              className={
                isLastOddProduct
                  ? 'tablet:col-span-2 tablet:w-[calc((100%-15px)/2)] tablet:justify-self-center wide:col-span-1 wide:w-auto wide:justify-self-stretch'
                  : ''
              }
              configuration={configuration}
              key={product.id}
              onLearnMore={setDetailsProduct}
              onQuantityChange={onQuantityChange}
              onVariantChange={onVariantChange}
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
