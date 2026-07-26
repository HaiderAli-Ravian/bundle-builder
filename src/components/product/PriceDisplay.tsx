import type { ProductPricing } from '../../domain/bundleTypes'

interface PriceDisplayProps {
  pricing: ProductPricing
}

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function formatCents(value: number): string {
  return usdFormatter.format(value / 100)
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
