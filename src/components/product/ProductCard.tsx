import { resolveAsset } from '../../data/assetRegistry'
import type {
  Product,
  ProductConfiguration,
  ProductPricing,
} from '../../domain/bundleTypes'
import { PriceDisplay } from './PriceDisplay'
import { QuantityStepper } from './QuantityStepper'
import { VariantSelector } from './VariantSelector'

interface ProductCardProps {
  className?: string
  configuration: ProductConfiguration
  onLearnMore: (product: Product) => void
  onQuantityChange: (productId: string, variantId: string, delta: -1 | 1) => void
  onVariantChange: (productId: string, variantId: string) => void
  product: Product
}

const wideMediaHeight: Readonly<Record<string, string>> = {
  'wyze-cam-v4': 'wide:h-[117.39px]',
  'wyze-cam-pan-v3': 'wide:h-[143px]',
  'wyze-cam-floodlight-v2': 'wide:h-[117px]',
  'wyze-duo-cam-doorbell': 'wide:h-[152.1px]',
  'wyze-battery-cam-pro': 'wide:h-[101px]',
}

function getPricing(
  product: Product,
  activeVariantId: string,
): ProductPricing {
  return (
    product.variants.find((variant) => variant.id === activeVariantId)
      ?.pricing ?? product.basePricing
  )
}

export function ProductCard({
  className = '',
  configuration,
  onLearnMore,
  onQuantityChange,
  onVariantChange,
  product,
}: ProductCardProps) {
  const activeVariant = product.variants.find(
    (variant) => variant.id === configuration.activeVariantId,
  )
  const quantity = configuration.quantities[configuration.activeVariantId] ?? 0
  const totalQuantity = Object.values(configuration.quantities).reduce(
    (total, value) => total + value,
    0,
  )
  const selected = totalQuantity > 0
  const minimumForActiveVariant = Math.max(
    0,
    product.minQuantity - (totalQuantity - quantity),
  )
  const maximumForActiveVariant =
    product.maxQuantity === undefined
      ? undefined
      : Math.max(0, product.maxQuantity - (totalQuantity - quantity))
  const pricing = getPricing(product, configuration.activeVariantId)
  const imageAsset = activeVariant?.imageAsset ?? product.imageAsset
  const titleId = `product-${product.id}-title`
  const hasVisibleVariants = product.variants.some(
    (variant) => variant.id !== 'default',
  )
  const standardMinimumHeight =
    product.id === 'wyze-cam-floodlight-v2'
      ? 'min-h-[173px]'
      : product.id === 'wyze-battery-cam-pro'
        ? 'min-h-[167px]'
      : 'min-h-[159px]'

  return (
    <article
      aria-labelledby={titleId}
      className={`relative grid ${standardMinimumHeight} grid-cols-[101px_minmax(0,1fr)] gap-card-content rounded-card border-2 bg-card p-[9px] wide:h-[331.1px] wide:min-h-0 wide:grid-cols-1 wide:grid-rows-[auto_1fr] wide:px-[9px] wide:py-[13px] ${
        selected ? 'border-selected-border' : 'border-transparent'
      } ${className}`}
    >
      {product.badgeText ? (
        <span className="absolute top-[9px] left-[9px] z-10 rounded-savings-badge bg-wyze-purple px-[7px] py-[4px] font-gilroy-semibold text-ui-12 leading-solid font-semibold text-on-accent wide:top-[15px] wide:left-[11px]">
          {product.badgeText}
        </span>
      ) : null}

      <div
        className={`flex min-h-[137px] w-[101px] items-center justify-center overflow-hidden wide:min-h-0 wide:w-full ${wideMediaHeight[product.id] ?? 'wide:h-[137px]'}`}
      >
        <img
          alt={product.name}
          className="max-h-[137px] w-full object-contain wide:h-full wide:max-h-full"
          src={resolveAsset(imageAsset)}
        />
      </div>

      <div className="flex min-w-0 flex-col">
        <h3
          className="font-gilroy-semibold text-ui-16 leading-solid font-semibold tracking-copy text-text-primary wide:text-ui-18"
          id={titleId}
        >
          {product.name}
        </h3>

        {product.description ? (
          <p className="mt-[6px] font-gilroy-medium text-ui-12 leading-copy font-medium tracking-copy text-text-secondary wide:text-ui-14">
            {product.description}{' '}
            {product.learnMoreAction ? (
              <button
                className="inline text-wyze-purple underline underline-offset-2 hover:no-underline active:opacity-75"
                onClick={() => onLearnMore(product)}
                type="button"
              >
                Learn More
              </button>
            ) : null}
          </p>
        ) : null}

        {hasVisibleVariants ? (
          <div className="mt-[7px]">
            <VariantSelector
              activeVariantId={configuration.activeVariantId}
              label={product.name}
              onSelect={(variantId) => onVariantChange(product.id, variantId)}
              variants={product.variants}
            />
          </div>
        ) : null}

        <div className="mt-auto flex items-end justify-between gap-2 pt-[7px]">
          <QuantityStepper
            label={`${product.name} ${activeVariant?.name ?? ''}`.trim()}
            maximum={maximumForActiveVariant}
            minimum={minimumForActiveVariant}
            onDecrease={() =>
              onQuantityChange(product.id, configuration.activeVariantId, -1)
            }
            onIncrease={() =>
              onQuantityChange(product.id, configuration.activeVariantId, 1)
            }
            quantity={quantity}
          />
          <PriceDisplay pricing={pricing} />
        </div>
      </div>
    </article>
  )
}
