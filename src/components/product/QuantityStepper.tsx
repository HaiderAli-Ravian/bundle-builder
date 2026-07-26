interface QuantityStepperProps {
  label: string
  maximum?: number
  minimum: number
  onDecrease: () => void
  onIncrease: () => void
  quantity: number
}

export function QuantityStepper({
  label,
  maximum,
  minimum,
  onDecrease,
  onIncrease,
  quantity,
}: QuantityStepperProps) {
  return (
    <div
      aria-label={`${label} quantity`}
      className="flex h-[35px] w-[80px] shrink-0 items-center justify-between"
      role="group"
    >
      <button
        aria-label={`Decrease ${label} quantity`}
        className="group flex size-6 items-center justify-center rounded-[4px] disabled:cursor-not-allowed"
        disabled={quantity <= minimum}
        onClick={onDecrease}
        type="button"
      >
        <span className="flex size-5 items-center justify-center rounded-[4px] bg-gray-c-200 font-gilroy-semibold text-ui-16 leading-solid text-gray-c-600 transition-colors group-hover:bg-gray-c-300 group-active:bg-gray-c-400 group-disabled:text-gray-c-400">
          −
        </span>
      </button>

      <output
        aria-label={`${label} quantity: ${quantity}`}
        className="min-w-4 text-center font-gilroy-medium text-ui-16 leading-solid text-text-primary"
      >
        {quantity}
      </output>

      <button
        aria-label={`Increase ${label} quantity`}
        className="group flex size-6 items-center justify-center rounded-[4px] disabled:cursor-not-allowed"
        disabled={maximum !== undefined && quantity >= maximum}
        onClick={onIncrease}
        type="button"
      >
        <span className="flex size-5 items-center justify-center rounded-[4px] bg-gray-c-200 font-gilroy-semibold text-ui-16 leading-solid text-gray-c-600 transition-colors group-hover:bg-gray-c-300 group-active:bg-gray-c-400 group-disabled:text-gray-c-400">
          +
        </span>
      </button>
    </div>
  )
}
