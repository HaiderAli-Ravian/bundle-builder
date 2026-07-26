import { resolveAsset } from '../../data/assetRegistry'
import { catalog } from '../../data/catalog'
import { formatCents } from '../../domain/currency'
import type { ReviewLine } from '../../domain/bundleTypes'
import { selectProductQuantity } from '../../store/bundleSelectors'
import { useBundleStore } from '../../store/bundleStore'
import { QuantityStepper } from '../product/QuantityStepper'

interface ReviewLineItemProps {
  line: ReviewLine
}

function ReviewPrice({
  billingInterval,
  compareAtCents,
  currentCents,
}: {
  billingInterval?: 'month'
  compareAtCents?: number
  currentCents: number
}) {
  const suffix = billingInterval === 'month' ? '/mo' : ''

  return (
    <div className="flex min-w-[58px] shrink-0 flex-col items-end justify-center font-gilroy-medium text-ui-12 leading-control tracking-review whitespace-nowrap tablet:text-ui-14 desktop:min-w-[45px] wide:min-w-[clamp(58px,5.3211cqw,78px)] wide:text-[clamp(16px,1.4679cqw,22px)] wide:leading-[clamp(16px,1.4679cqw,22px)]">
      {compareAtCents !== undefined ? (
        <span className="text-gray-c-600 line-through">
          {formatCents(compareAtCents)}
          {suffix}
        </span>
      ) : null}
      <span className="font-gilroy-semibold font-semibold text-wyze-purple">
        {currentCents === 0 ? 'FREE' : formatCents(currentCents)}
        {currentCents === 0 ? '' : suffix}
      </span>
    </div>
  )
}

export function ReviewLineItem({ line }: ReviewLineItemProps) {
  const product = catalog.products.find(
    (candidate) => candidate.id === line.productId,
  )
  const totalQuantity = useBundleStore((state) =>
    selectProductQuantity(state, line.productId),
  )
  const adjustQuantity = useBundleStore(
    (state) => state.adjustQuantity,
  )

  if (!product) {
    return null
  }

  const variant = product.variants.find(
    (candidate) => candidate.id === line.variantId,
  )
  const minimum = Math.max(
    0,
    product.minQuantity - (totalQuantity - line.quantity),
  )
  const maximum =
    product.maxQuantity === undefined
      ? undefined
      : Math.max(0, product.maxQuantity - (totalQuantity - line.quantity))
  const billingInterval =
    variant?.pricing?.billingInterval ?? product.basePricing.billingInterval
  const isPlan = product.categoryId === 'plan'
  const rowHeight = isPlan
    ? 'min-h-[47px] desktop:min-h-[40px] wide:min-h-[clamp(49.5px,4.5413cqw,67px)]'
    : 'min-h-[47px] desktop:min-h-[50px] wide:min-h-[clamp(49.5px,4.5413cqw,67px)]'
  const wideColumns = isPlan
    ? 'wide:grid-cols-[auto_minmax(0,1fr)_auto]'
    : 'wide:grid-cols-[clamp(41px,3.7615cqw,55px)_minmax(0,1fr)_clamp(80px,7.3394cqw,108px)_auto]'

  return (
    <li
      className={`grid items-center gap-x-[10px] py-[3px] wide:gap-x-[clamp(10px,0.9174cqw,13px)] wide:py-[clamp(3px,0.2752cqw,4px)] ${rowHeight} ${wideColumns} ${
        isPlan
          ? 'grid-cols-[auto_minmax(0,1fr)_auto]'
          : 'grid-cols-[41px_minmax(0,1fr)_80px_auto]'
      }`}
    >
      <span
        className={`flex shrink-0 items-center justify-center ${
          isPlan
            ? 'h-[31px] w-[26px] wide:h-[clamp(31px,2.844cqw,42px)] wide:w-[clamp(26px,2.3853cqw,35px)]'
            : 'size-[41px] overflow-hidden rounded-[5px] bg-card wide:size-[clamp(41px,3.7615cqw,55px)]'
        }`}
      >
        <img
          alt=""
          aria-hidden="true"
          className="size-full object-contain"
          src={resolveAsset(line.imageAsset)}
        />
      </span>

      <span
        className={`min-w-0 text-obsidian ${
          isPlan
            ? 'font-gilroy-bold text-ui-14 leading-solid font-bold tracking-plan tablet:text-ui-16 wide:text-[clamp(20px,1.8349cqw,27px)]'
            : 'font-gilroy-medium text-ui-12 leading-control font-medium tracking-review tablet:text-ui-14 wide:text-[clamp(18px,1.6514cqw,24px)] wide:leading-[clamp(16px,1.4679cqw,22px)]'
        }`}
      >
        {isPlan ? (
          <>
            Cam <span className="text-wyze-purple">Unlimited</span>
          </>
        ) : (
          line.displayName
        )}
      </span>

      {line.quantityEditable ? (
        <QuantityStepper
          appearance={
            product.minQuantity > 0 ? 'review-required' : 'review'
          }
          fluidWide
          label={line.displayName}
          maximum={maximum}
          minimum={minimum}
          onDecrease={() =>
            adjustQuantity(line.productId, line.variantId, -1)
          }
          onIncrease={() =>
            adjustQuantity(line.productId, line.variantId, 1)
          }
          quantity={line.quantity}
        />
      ) : null}

      <ReviewPrice
        billingInterval={billingInterval}
        compareAtCents={line.compareAtLinePriceCents}
        currentCents={line.linePriceCents}
      />
    </li>
  )
}
