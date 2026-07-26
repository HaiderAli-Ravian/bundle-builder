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
      className={`relative grid ${standardMinimumHeight} grid-cols-[101px_minmax(0,1fr)] gap-card-content rounded-card border-2 bg-card p-[9px] wide:aspect-[224.6/331.1] wide:h-auto wide:min-h-0 wide:grid-cols-1 wide:grid-rows-[minmax(0,1fr)_auto] wide:px-[9px] wide:py-[13px] wide:[container-type:inline-size] ${
        selected ? 'border-selected-border' : 'border-transparent'
      } ${className}`}
    >
      {product.badgeText ? (
        <span className="absolute top-[9px] left-[9px] z-10 rounded-savings-badge bg-wyze-purple px-[7px] py-[4px] font-gilroy-semibold text-ui-12 leading-solid font-semibold text-on-accent wide:top-[15px] wide:left-[11px] wide:px-[clamp(7px,3.455cqw,9px)] wide:py-[clamp(4px,1.974cqw,5px)] wide:text-[clamp(12px,5.923cqw,16px)]">
          {product.badgeText}
        </span>
      ) : null}

      <div
        className="flex min-h-[137px] w-[101px] items-center justify-center overflow-hidden wide:h-full wide:min-h-0 wide:w-full"
      >
        <img
          alt={product.name}
          className={`max-h-[137px] w-full object-contain ${
            product.id === 'wyze-cam-v4'
              ? 'scale-150 wide:scale-100'
              : product.id === 'wyze-cam-floodlight-v2'
                ? 'tablet:-translate-x-[20px] tablet:translate-y-[10px] tablet:scale-x-[1.5] tablet:scale-y-[1.3] wide:translate-x-0 wide:translate-y-0 wide:origin-top wide:scale-[1.35]'
                : ''
          } wide:h-full wide:max-h-full`}
          src={resolveAsset(imageAsset)}
        />
      </div>

      <div
        className={`flex min-w-0 flex-col ${
          product.id === 'wyze-duo-cam-doorbell'
            ? 'tablet:pt-[21px] wide:pt-0'
            : ''
        }`}
      >
        <h3
          className="font-gilroy-semibold text-ui-16 leading-solid font-semibold tracking-copy text-text-primary wide:text-[clamp(18px,8.8845cqw,24px)]"
          id={titleId}
        >
          {product.name}
        </h3>

        {product.description ? (
          <p className="mt-[6px] font-gilroy-medium text-ui-12 leading-copy font-medium tracking-copy text-text-secondary wide:mt-[clamp(6px,2.962cqw,8px)] wide:text-[clamp(14px,6.9102cqw,19px)]">
            {product.description}{' '}
            {product.learnMoreAction ? (
              <button
                className="inline font-gilroy-semibold font-semibold text-wyze-purple underline underline-offset-2 hover:no-underline active:opacity-75"
                onClick={() => onLearnMore(product)}
                type="button"
              >
                Learn More
              </button>
            ) : null}
          </p>
        ) : null}

        {hasVisibleVariants ? (
          <div className="mt-[7px] wide:mt-[clamp(7px,3.455cqw,9px)]">
            <VariantSelector
              activeVariantId={configuration.activeVariantId}
              label={product.name}
              onSelect={(variantId) => onVariantChange(product.id, variantId)}
              variants={product.variants}
            />
          </div>
        ) : null}

        <div className="mt-auto flex items-end justify-between gap-2 pt-[7px] wide:mt-0 wide:pt-[clamp(7px,3.455cqw,9px)]">
          <QuantityStepper
            fluidWide
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
          <PriceDisplay fluidWide pricing={pricing} />
        </div>
      </div>
    </article>
  )
}
