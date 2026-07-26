export type StepId = 'cameras' | 'plan' | 'sensors' | 'accessories'
export type StepNumber = 1 | 2 | 3 | 4
export type ProductId = string
export type VariantId = string
export type QuantityKey = `${ProductId}:${VariantId}`

export interface Category {
  readonly id: StepId
  readonly title: string
  readonly eyebrow: string
  readonly reviewLabel: string
  readonly iconAsset: string
  readonly stepNumber: StepNumber
  readonly builderSortOrder: number
  readonly reviewSortOrder: number
  readonly nextStepId?: StepId
}

export interface ProductPricing {
  readonly currency: 'USD'
  readonly unitPriceCents: number
  readonly compareAtUnitPriceCents?: number
  readonly billingInterval?: 'month'
}

export interface ProductVariant {
  readonly id: VariantId
  readonly name: string
  readonly imageAsset?: string
  readonly swatchAsset?: string
  readonly pricing?: ProductPricing
  readonly sortOrder: number
}

export interface Product {
  readonly id: ProductId
  readonly categoryId: StepId
  readonly name: string
  readonly reviewName?: string
  readonly description?: string
  readonly imageAsset: string
  readonly reviewThumbnailAsset?: string
  readonly badgeText?: string
  readonly learnMoreAction?: 'dialog'
  readonly basePricing: ProductPricing
  readonly variants: readonly ProductVariant[]
  readonly quantityEditable: boolean
  readonly minQuantity: number
  readonly maxQuantity?: number
  readonly visibleInBuilder: boolean
  readonly builderSortOrder: number
  readonly reviewSortOrder: number
}

export interface ShippingConfiguration {
  readonly label: string
  readonly iconAsset: string
  readonly actualCents: number
  readonly referenceCents: number
  readonly includeReferenceInCompareTotal: boolean
}

export interface FinancingConfiguration {
  readonly label: string
}

export interface BundleCatalog {
  readonly schemaVersion: 1
  readonly catalogVersion: string
  readonly currency: 'USD'
  readonly categories: readonly Category[]
  readonly products: readonly Product[]
  readonly shipping: ShippingConfiguration
  readonly financing: FinancingConfiguration
}

export interface ProductConfiguration {
  readonly productId: ProductId
  readonly activeVariantId: VariantId
  readonly quantities: Readonly<Record<VariantId, number>>
}

export interface SeededBundleConfiguration {
  readonly schemaVersion: 1
  readonly catalogVersion: string
  readonly openStepId: StepId | null
  readonly products: readonly ProductConfiguration[]
}

export interface BundleState {
  openStepId: StepId | null
  activeVariantByProduct: Record<ProductId, VariantId>
  quantityByKey: Record<QuantityKey, number>
  saveFeedback: 'idle' | 'saved' | 'error'
  checkoutFeedback: 'idle' | 'confirmed'
}

export interface ReviewLine {
  readonly key: QuantityKey
  readonly productId: ProductId
  readonly variantId: VariantId
  readonly categoryId: StepId
  readonly displayName: string
  readonly quantity: number
  readonly imageAsset: string
  readonly unitPriceCents: number
  readonly compareAtUnitPriceCents?: number
  readonly linePriceCents: number
  readonly compareAtLinePriceCents?: number
  readonly quantityEditable: boolean
}

export interface SavedConfiguration {
  readonly schemaVersion: 1
  readonly catalogVersion: string
  readonly savedAt: string
  readonly openStepId: StepId | null
  readonly activeVariantByProduct: Readonly<Record<ProductId, VariantId>>
  readonly quantityByKey: Readonly<Record<QuantityKey, number>>
}

export type AccordionStep = Category
