import { resolveAsset } from '../../data/assetRegistry'
import { catalog } from '../../data/catalog'
import { formatCents } from '../../domain/currency'
import type { BundlePricingSummary } from '../../domain/pricing'
import { useBundleStore } from '../../store/bundleStore'

interface OrderSummaryProps {
  hasItems: boolean
  pricing: BundlePricingSummary
}

function FinancingAndTotals({
  pricing,
}: {
  pricing: BundlePricingSummary
}) {
  return (
    <div className="flex flex-col items-end gap-[7px] max-[323px]:items-center wide:flex-row wide:items-end wide:justify-between wide:gap-[clamp(10px,0.9174cqw,13px)]">
      <span className="rounded-finance-label bg-wyze-purple px-[8px] py-[5px] font-gilroy-medium text-ui-12 leading-solid font-medium tracking-financing whitespace-nowrap text-on-accent wide:px-[clamp(8px,0.7339cqw,11px)] wide:py-[clamp(5px,0.4587cqw,7px)] wide:text-[clamp(16px,1.4679cqw,22px)]">
        {catalog.financing.label}
      </span>

      <span className="flex items-baseline justify-end gap-[6px] whitespace-nowrap max-[323px]:justify-center wide:gap-[clamp(6px,0.5505cqw,8px)]">
        <span className="font-gilroy-medium text-ui-18 leading-total-compare font-medium tracking-total-compare text-gray-c-600 line-through wide:text-[clamp(22px,2.0183cqw,30px)] wide:leading-[clamp(20px,1.8349cqw,27px)]">
          {formatCents(pricing.compareTotalCents)}
        </span>
        <span className="font-gilroy-bold text-ui-24 leading-total font-bold tracking-total text-wyze-purple wide:text-[clamp(28px,2.5688cqw,38px)] wide:leading-[clamp(32px,2.9358cqw,43px)]">
          {formatCents(pricing.actualTotalCents)}
        </span>
      </span>
    </div>
  )
}

export function OrderSummary({
  hasItems,
  pricing,
}: OrderSummaryProps) {
  const checkoutFeedback = useBundleStore(
    (state) => state.checkoutFeedback,
  )
  const confirmCheckout = useBundleStore(
    (state) => state.confirmCheckout,
  )
  const saveConfiguration = useBundleStore(
    (state) => state.saveConfiguration,
  )
  const saveFeedback = useBundleStore((state) => state.saveFeedback)
  const guaranteeAsset = resolveAsset(
    'badges/wyze-satisfaction-guarantee.svg',
  )

  return (
    <section
      aria-label="Order summary"
      className="mt-[33px] desktop:mt-[13px] wide:mt-0"
    >
      <div className="grid grid-cols-[78px_minmax(0,1fr)] items-start gap-x-[10px] max-[323px]:grid-cols-1 max-[323px]:justify-items-center max-[323px]:gap-y-[10px] wide:hidden">
        <img
          alt="100% Wyze satisfaction guarantee"
          className="size-[78px]"
          src={guaranteeAsset}
        />
        <div className="pt-[8px] max-[323px]:w-full max-[323px]:pt-0">
          <FinancingAndTotals pricing={pricing} />
        </div>
      </div>

      <div className="hidden wide:block">
        <div className="grid grid-cols-[clamp(131px,12.0183cqw,177px)_minmax(0,1fr)] items-center gap-x-[clamp(25px,2.2936cqw,34px)]">
          <img
            alt="100% Wyze satisfaction guarantee"
            className="size-[clamp(131px,12.0183cqw,177px)]"
            src={guaranteeAsset}
          />
          <p className="font-gilroy-regular text-[clamp(18px,1.6514cqw,24px)] leading-[110%] tracking-copy text-text-primary">
            <strong className="font-gilroy-semibold font-semibold">
              30-day hassle-free returns
            </strong>
            <span className="mt-[clamp(20px,1.8349cqw,27px)] block">
              If you&apos;re not totally in love with the product, we will
              refund you 100%.
            </span>
          </p>
        </div>

        <div className="mt-[clamp(20px,1.8349cqw,27px)]">
          <FinancingAndTotals pricing={pricing} />
        </div>
      </div>

      <p className="mt-[10px] text-center font-gilroy-semibold text-ui-12 leading-solid font-semibold tracking-fine text-savings desktop:mt-[14px] wide:text-[15px]">
        Congrats! You&apos;re saving {formatCents(pricing.savingsCents)} on
        your security bundle!
      </p>

      <button
        className="mt-[3px] h-12 w-full rounded-checkout-button bg-wyze-purple px-4 font-tt-norms text-ui-17 leading-solid font-bold text-on-accent transition-colors hover:bg-wyze-purple/90 active:bg-wyze-purple/80 disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none wide:mt-[clamp(6px,0.5505cqw,8px)] wide:h-[clamp(48px,4.4037cqw,65px)] wide:text-[clamp(17px,1.5596cqw,23px)]"
        disabled={!hasItems}
        onClick={confirmCheckout}
        type="button"
      >
        Checkout
      </button>

      <button
        className="relative mx-auto mt-[6px] block font-gilroy-italic text-ui-12 leading-save-action tracking-save-action text-text-label italic underline underline-offset-2 after:absolute after:-inset-x-2 after:-inset-y-[5px] after:content-[''] hover:no-underline tablet:text-ui-14 wide:mt-[6px] wide:text-[15px]"
        onClick={saveConfiguration}
        type="button"
      >
        Save my system for later
      </button>

      {saveFeedback !== 'idle' && (
        <p
          aria-live="polite"
          className="mt-[5px] text-center font-gilroy-medium text-ui-12 leading-copy text-text-secondary"
          role="status"
        >
          {saveFeedback === 'saved'
            ? 'Your system has been saved.'
            : "We couldn't save your system. Please try again."}
        </p>
      )}

      {checkoutFeedback === 'confirmed' && (
        <p
          aria-live="polite"
          className="mt-[5px] text-center font-gilroy-medium text-ui-12 leading-copy text-text-secondary"
          role="status"
        >
          Checkout is a demonstration and no order has been placed.
        </p>
      )}
    </section>
  )
}
