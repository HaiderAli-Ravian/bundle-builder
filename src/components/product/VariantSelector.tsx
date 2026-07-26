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
      className="flex flex-wrap items-center gap-[5px]"
      role="group"
    >
      {visibleVariants.map((variant) => {
        const isActive = variant.id === activeVariantId

        return (
          <button
            aria-pressed={isActive}
            className={`flex h-[26px] items-center gap-[5px] rounded-[2px] border px-[7px] font-gilroy-medium text-ui-10 leading-solid tracking-copy text-text-primary transition-colors ${
              isActive
                ? 'border-savings bg-white'
                : 'border-gray-c-400 bg-white hover:border-gray-c-600'
            }`}
            key={variant.id}
            onClick={() => onSelect(variant.id)}
            type="button"
          >
            {variant.swatchAsset ? (
              <img
                alt=""
                aria-hidden="true"
                className="size-[14px] object-contain"
                src={resolveAsset(variant.swatchAsset)}
              />
            ) : null}
            {variant.name}
          </button>
        )
      })}
    </div>
  )
}
