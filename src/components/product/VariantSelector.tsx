import { resolveAsset } from '../../data/assetRegistry'
import type { ProductVariant } from '../../domain/bundleTypes'

interface VariantSelectorProps {
  activeVariantId: string
  label: string
  onSelect: (variantId: string) => void
  variants: readonly ProductVariant[]
}

export function VariantSelector({
  activeVariantId,
  label,
  onSelect,
  variants,
}: VariantSelectorProps) {
  const visibleVariants = variants
    .filter((variant) => variant.id !== 'default')
    .toSorted((left, right) => left.sortOrder - right.sortOrder)

  if (visibleVariants.length === 0) {
    return null
  }

  return (
    <div
      aria-label={`${label} color`}
      className="flex flex-wrap items-center gap-[5px] wide:gap-[clamp(5px,2.468cqw,7px)]"
      role="group"
    >
      {visibleVariants.map((variant) => {
        const isActive = variant.id === activeVariantId

        return (
          <button
            aria-pressed={isActive}
            className={`flex h-[26px] items-center gap-[5px] rounded-[2px] border px-[7px] font-gilroy-medium text-ui-10 leading-solid tracking-copy text-text-primary transition-colors wide:h-[clamp(26px,12.833cqw,35px)] wide:gap-[clamp(5px,2.468cqw,7px)] wide:px-[clamp(7px,3.455cqw,9px)] wide:text-[clamp(10px,4.936cqw,14px)] ${
              isActive
                ? 'border-savings bg-white'
                : 'border-gray-c-400 bg-white hover:border-gray-c-600'
            }`}
            key={variant.id}
            onClick={() => onSelect(variant.id)}
            type="button"
          >
            {variant.swatchAsset ? (
              <span className="relative size-[14px] shrink-0 wide:size-[clamp(14px,6.91cqw,19px)]">
                <img
                  alt=""
                  aria-hidden="true"
                  className="absolute top-1/2 left-1/2 h-auto w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-contain"
                  src={resolveAsset(variant.swatchAsset)}
                />
              </span>
            ) : null}
            {variant.name}
          </button>
        )
      })}
    </div>
  )
}
