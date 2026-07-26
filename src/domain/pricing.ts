import type {
  ReviewLine,
  ShippingConfiguration,
} from './bundleTypes'

export interface BundlePricingSummary {
  readonly actualTotalCents: number
  readonly compareTotalCents: number
  readonly itemActualSubtotalCents: number
  readonly itemCompareSubtotalCents: number
  readonly savingsCents: number
  readonly shippingActualCents: number
}

export function calculateBundlePricing(
  lines: readonly ReviewLine[],
  shipping: ShippingConfiguration,
): BundlePricingSummary {
  const itemActualSubtotalCents = lines.reduce(
    (total, line) => total + line.linePriceCents,
    0,
  )
  const itemCompareSubtotalCents = lines.reduce(
    (total, line) =>
      total +
      (line.compareAtLinePriceCents ?? line.linePriceCents),
    0,
  )
  const compareShippingCents = shipping.includeReferenceInCompareTotal
    ? shipping.referenceCents
    : 0
  const compareTotalCents =
    itemCompareSubtotalCents + compareShippingCents

  return {
    actualTotalCents:
      itemActualSubtotalCents + shipping.actualCents,
    compareTotalCents,
    itemActualSubtotalCents,
    itemCompareSubtotalCents,
    savingsCents: Math.max(
      0,
      compareTotalCents - itemActualSubtotalCents,
    ),
    shippingActualCents: shipping.actualCents,
  }
}
