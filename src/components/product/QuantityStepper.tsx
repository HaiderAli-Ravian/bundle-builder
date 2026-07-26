interface QuantityStepperProps {
  appearance?: 'card' | 'review' | 'review-required'
  fluidWide?: boolean
  label: string
  maximum?: number
  minimum: number
  onDecrease: () => void
  onIncrease: () => void
  quantity: number
}

export function QuantityStepper({
  appearance = 'card',
  fluidWide = false,
  label,
  maximum,
  minimum,
  onDecrease,
  onIncrease,
  quantity,
}: QuantityStepperProps) {
  const controlSurface =
    appearance === 'review-required'
      ? 'border border-gray-c-400 bg-required-control group-hover:bg-gray-c-300 group-active:bg-gray-c-400 group-disabled:bg-required-control'
      : appearance === 'review'
      ? 'bg-card group-hover:bg-gray-c-200 group-active:bg-gray-c-300 group-disabled:bg-gray-c-200'
      : 'bg-gray-c-200 group-hover:bg-gray-c-300 group-active:bg-gray-c-400'
  const controlText =
    appearance === 'review-required'
      ? 'text-text-secondary group-disabled:text-text-secondary'
      : 'text-gray-c-600 group-disabled:text-gray-c-400'
  const groupWidth =
    appearance === 'review' || appearance === 'review-required'
      ? 'w-[76px] justify-self-end translate-x-[2px]'
      : 'w-[80px]'
  const fluidReference =
    appearance === 'card'
      ? {
          button:
            'wide:size-[clamp(24px,11.846cqw,32px)]',
          control:
            'wide:size-[clamp(20px,9.872cqw,27px)] wide:text-[clamp(16px,7.8973cqw,22px)]',
          group:
            'wide:relative wide:top-[6px] wide:h-[clamp(35px,17.275cqw,47px)] wide:w-[clamp(80px,39.486cqw,108px)]',
          output:
            'wide:min-w-[clamp(16px,7.8973cqw,22px)] wide:text-[clamp(16px,7.8973cqw,22px)]',
        }
      : {
          button:
            'wide:size-[clamp(24px,2.2018cqw,32px)]',
          control:
            'wide:size-[clamp(20px,1.8349cqw,27px)] wide:text-[clamp(16px,1.4679cqw,22px)]',
          group:
            'wide:h-[clamp(35px,3.211cqw,47px)] wide:w-[clamp(76px,6.9725cqw,103px)]',
          output:
            'wide:min-w-[clamp(16px,1.4679cqw,22px)] wide:text-[clamp(16px,1.4679cqw,22px)]',
        }
  const fluidGroupSize = fluidWide ? fluidReference.group : ''
  const fluidButtonSize = fluidWide ? fluidReference.button : ''
  const fluidControlSize = fluidWide ? fluidReference.control : ''
  const fluidOutputSize = fluidWide ? fluidReference.output : ''

  return (
    <div
      aria-label={`${label} quantity`}
      className={`flex h-[35px] shrink-0 items-center justify-between ${groupWidth} ${fluidGroupSize}`}
      role="group"
    >
      <button
        aria-label={`Decrease ${label} quantity`}
        className={`group flex size-6 items-center justify-center rounded-[4px] disabled:cursor-not-allowed ${fluidButtonSize}`}
        disabled={quantity <= minimum}
        onClick={onDecrease}
        type="button"
      >
        <span
          className={`flex size-5 items-center justify-center rounded-[4px] font-gilroy-semibold text-ui-16 leading-solid transition-colors ${controlSurface} ${controlText} ${fluidControlSize}`}
        >
          −
        </span>
      </button>

      <output
        aria-label={`${label} quantity: ${quantity}`}
        className={`min-w-4 text-center font-gilroy-medium text-ui-16 leading-solid text-text-primary ${fluidOutputSize}`}
      >
        {quantity}
      </output>

      <button
        aria-label={`Increase ${label} quantity`}
        className={`group flex size-6 items-center justify-center rounded-[4px] disabled:cursor-not-allowed ${fluidButtonSize}`}
        disabled={maximum !== undefined && quantity >= maximum}
        onClick={onIncrease}
        type="button"
      >
        <span
          className={`flex size-5 items-center justify-center rounded-[4px] font-gilroy-semibold text-ui-16 leading-solid transition-colors ${controlSurface} ${controlText} ${fluidControlSize}`}
        >
          +
        </span>
      </button>
    </div>
  )
}
