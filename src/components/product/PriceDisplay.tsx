import type { ProductPricing } from '../../domain/bundleTypes'
import { formatCents } from '../../domain/currency'

interface PriceDisplayProps {
  fluidWide?: boolean
  pricing: ProductPricing
}

export function PriceDisplay({
  fluidWide = false,
  pricing,
}: PriceDisplayProps) {
  return (
    <div
      className={`flex shrink-0 flex-col items-end justify-center gap-[3px] font-gilroy-regular text-ui-16 leading-solid tracking-copy whitespace-nowrap ${
        fluidWide
          ? 'wide:relative wide:bottom-[2px] wide:flex-row wide:items-baseline wide:gap-[clamp(3px,1.481cqw,4px)] wide:text-[clamp(16px,7.8973cqw,22px)]'
          : ''
      }`}
    >
      {pricing.compareAtUnitPriceCents !== undefined ? (
        <span className="text-price-reduction line-through">
          {formatCents(pricing.compareAtUnitPriceCents)}
        </span>
      ) : null}
      <span className="text-text-secondary">
        {formatCents(pricing.unitPriceCents)}
      </span>
    </div>
  )
}
