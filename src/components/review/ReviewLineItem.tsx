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
    <div className="flex min-w-[58px] shrink-0 flex-col items-end justify-center font-gilroy-medium text-ui-12 leading-control tracking-review whitespace-nowrap tablet:text-ui-14 wide:text-ui-16">
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

  return (
    <li
      className={`grid min-h-[47px] items-center gap-x-[10px] py-[3px] ${
        isPlan
          ? 'grid-cols-[auto_minmax(0,1fr)_auto]'
          : 'grid-cols-[41px_minmax(0,1fr)_80px_auto]'
      }`}
    >
      <span
        className={`flex shrink-0 items-center justify-center ${
          isPlan
            ? 'h-[31px] w-[26px]'
            : 'size-[41px] overflow-hidden rounded-[5px] bg-card'
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
            ? 'font-gilroy-bold text-ui-14 leading-solid font-bold tracking-plan tablet:text-ui-16 wide:text-ui-20'
            : 'font-gilroy-medium text-ui-12 leading-control font-medium tracking-review tablet:text-ui-14 wide:text-ui-18'
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
