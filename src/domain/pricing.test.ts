import { describe, expect, it } from 'vitest'
import { catalog } from '../data/catalog'
import { selectReviewLines } from '../store/bundleSelectors'
import { createInitialBundleState } from '../store/bundleStore'
import { calculateBundlePricing } from './pricing'

describe('calculateBundlePricing', () => {
  it('reproduces the approved canonical seeded totals', () => {
    const lines = selectReviewLines(createInitialBundleState())
    const pricing = calculateBundlePricing(lines, catalog.shipping)

    expect(pricing.actualTotalCents).toBe(20_987)
    expect(pricing.compareTotalCents).toBe(26_079)
    expect(pricing.savingsCents).toBe(5_092)
  })

  it('uses actual line prices as the baseline when compare-at is absent', () => {
    const lines = selectReviewLines(createInitialBundleState()).filter(
      (line) => line.productId === 'wyze-sense-motion-sensor',
    )
    const pricing = calculateBundlePricing(lines, catalog.shipping)

    expect(pricing.actualTotalCents).toBe(5_998)
    expect(pricing.compareTotalCents).toBe(5_998)
    expect(pricing.savingsCents).toBe(0)
  })

  it('excludes the display-only shipping reference from totals and savings', () => {
    const lines = selectReviewLines(createInitialBundleState())
    const pricing = calculateBundlePricing(lines, catalog.shipping)

    expect(catalog.shipping.referenceCents).toBe(599)
    expect(catalog.shipping.includeReferenceInCompareTotal).toBe(false)
    expect(pricing.compareTotalCents).toBe(26_079)
    expect(pricing.savingsCents).toBe(5_092)
  })

  it('documents the illustrative Figma totals without using them at runtime', () => {
    const figmaIllustrativeLines = selectReviewLines(
      createInitialBundleState(),
    ).map((line) =>
      line.productId === 'wyze-cam-pan-v3'
        ? {
            ...line,
            compareAtLinePriceCents: 5_798,
            linePriceCents: 4_798,
          }
        : line,
    )
    const pricing = calculateBundlePricing(
      figmaIllustrativeLines,
      catalog.shipping,
    )

    expect(pricing.actualTotalCents).toBe(18_789)
    expect(pricing.compareTotalCents).toBe(23_881)
    expect(pricing.savingsCents).toBe(5_092)
  })
})
