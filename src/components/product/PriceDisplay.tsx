import type { ProductPricing } from '../../domain/bundleTypes'
import { formatCents } from '../../domain/currency'

interface PriceDisplayProps {
  pricing: ProductPricing
}

export function PriceDisplay({ pricing }: PriceDisplayProps) {
  return (
    <div className="flex shrink-0 flex-col items-end justify-center gap-[3px] font-gilroy-regular text-ui-16 leading-solid tracking-copy whitespace-nowrap">
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
