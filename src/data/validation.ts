import type {
  BundleCatalog,
  Product,
  SeededBundleConfiguration,
  StepId,
} from '../domain/bundleTypes'

type UnknownRecord = Record<string, unknown>

const stepIds = new Set<StepId>([
  'cameras',
  'plan',
  'sensors',
  'accessories',
])

export class CatalogValidationError extends Error {
  constructor(path: string, message: string) {
    super(`${path}: ${message}`)
    this.name = 'CatalogValidationError'
  }
}

function fail(path: string, message: string): never {
  throw new CatalogValidationError(path, message)
}

function assertRecord(
  value: unknown,
  path: string,
): asserts value is UnknownRecord {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    fail(path, 'expected an object')
  }
}

function assertArray(value: unknown, path: string): asserts value is unknown[] {
  if (!Array.isArray(value)) {
    fail(path, 'expected an array')
  }
}

function readString(record: UnknownRecord, key: string, path: string): string {
  const value = record[key]

  if (typeof value !== 'string' || value.length === 0) {
    fail(`${path}.${key}`, 'expected a non-empty string')
  }

  return value
}

function readInteger(
  record: UnknownRecord,
  key: string,
  path: string,
  minimum = 0,
): number {
  const value = record[key]

  if (!Number.isInteger(value) || (value as number) < minimum) {
    fail(`${path}.${key}`, `expected an integer greater than or equal to ${minimum}`)
  }

  return value as number
}

function readBoolean(record: UnknownRecord, key: string, path: string): boolean {
  const value = record[key]

  if (typeof value !== 'boolean') {
    fail(`${path}.${key}`, 'expected a boolean')
  }

  return value
}

function assertOptionalString(
  record: UnknownRecord,
  key: string,
  path: string,
): void {
  if (key in record) {
    readString(record, key, path)
  }
}

function assertOptionalInteger(
  record: UnknownRecord,
  key: string,
  path: string,
  minimum = 0,
): void {
  if (key in record) {
    readInteger(record, key, path, minimum)
  }
}

function assertStepId(value: string, path: string): asserts value is StepId {
  if (!stepIds.has(value as StepId)) {
    fail(path, `unknown step ID "${value}"`)
  }
}

function assertUnique(values: readonly string[], path: string): void {
  const duplicate = values.find((value, index) => values.indexOf(value) !== index)

  if (duplicate) {
    fail(path, `duplicate value "${duplicate}"`)
  }
}

function assertPricing(value: unknown, path: string): void {
  assertRecord(value, path)

  if (value.currency !== 'USD') {
    fail(`${path}.currency`, 'expected USD')
  }

  const unitPriceCents = readInteger(value, 'unitPriceCents', path)
  assertOptionalInteger(value, 'compareAtUnitPriceCents', path)

  if (
    typeof value.compareAtUnitPriceCents === 'number' &&
    value.compareAtUnitPriceCents < unitPriceCents
  ) {
    fail(
      `${path}.compareAtUnitPriceCents`,
      'cannot be lower than the active unit price',
    )
  }

  if ('billingInterval' in value && value.billingInterval !== 'month') {
    fail(`${path}.billingInterval`, 'expected month when provided')
  }
}

function assertCategory(value: unknown, path: string): void {
  assertRecord(value, path)

  const id = readString(value, 'id', path)
  assertStepId(id, `${path}.id`)
  readString(value, 'title', path)
  readString(value, 'eyebrow', path)
  readString(value, 'reviewLabel', path)
  readString(value, 'iconAsset', path)

  const stepNumber = readInteger(value, 'stepNumber', path, 1)
  if (stepNumber > 4) {
    fail(`${path}.stepNumber`, 'expected a value from 1 through 4')
  }

  readInteger(value, 'builderSortOrder', path, 1)
  readInteger(value, 'reviewSortOrder', path, 1)

  if ('nextStepId' in value) {
    const nextStepId = readString(value, 'nextStepId', path)
    assertStepId(nextStepId, `${path}.nextStepId`)
  }
}

function assertVariant(value: unknown, path: string): void {
  assertRecord(value, path)
  readString(value, 'id', path)
  readString(value, 'name', path)
  assertOptionalString(value, 'imageAsset', path)
  assertOptionalString(value, 'swatchAsset', path)
  readInteger(value, 'sortOrder', path, 1)

  if ('pricing' in value) {
    assertPricing(value.pricing, `${path}.pricing`)
  }
}

function assertProduct(value: unknown, path: string): void {
  assertRecord(value, path)
  readString(value, 'id', path)

  const categoryId = readString(value, 'categoryId', path)
  assertStepId(categoryId, `${path}.categoryId`)

  readString(value, 'name', path)
  assertOptionalString(value, 'reviewName', path)
  assertOptionalString(value, 'description', path)
  readString(value, 'imageAsset', path)
  assertOptionalString(value, 'reviewThumbnailAsset', path)
  assertOptionalString(value, 'badgeText', path)

  if ('learnMoreAction' in value && value.learnMoreAction !== 'dialog') {
    fail(`${path}.learnMoreAction`, 'expected dialog when provided')
  }

  assertPricing(value.basePricing, `${path}.basePricing`)
  assertArray(value.variants, `${path}.variants`)

  if (value.variants.length === 0) {
    fail(`${path}.variants`, 'expected at least one variant')
  }

  value.variants.forEach((variant, index) =>
    assertVariant(variant, `${path}.variants[${index}]`),
  )

  const variantIds = value.variants.map((variant, index) => {
    assertRecord(variant, `${path}.variants[${index}]`)
    return readString(variant, 'id', `${path}.variants[${index}]`)
  })
  assertUnique(variantIds, `${path}.variants`)

  const quantityEditable = readBoolean(value, 'quantityEditable', path)
  const minQuantity = readInteger(value, 'minQuantity', path)
  assertOptionalInteger(value, 'maxQuantity', path)
  readBoolean(value, 'visibleInBuilder', path)
  readInteger(value, 'builderSortOrder', path, 1)
  readInteger(value, 'reviewSortOrder', path, 1)

  if (
    typeof value.maxQuantity === 'number' &&
    value.maxQuantity < minQuantity
  ) {
    fail(`${path}.maxQuantity`, 'cannot be lower than minQuantity')
  }

  if (
    !quantityEditable &&
    (value.maxQuantity !== minQuantity || value.maxQuantity === undefined)
  ) {
    fail(
      path,
      'a fixed product must use matching minQuantity and maxQuantity values',
    )
  }
}

function assertShipping(value: unknown, path: string): void {
  assertRecord(value, path)
  readString(value, 'label', path)
  readString(value, 'iconAsset', path)
  readInteger(value, 'actualCents', path)
  readInteger(value, 'referenceCents', path)
  readBoolean(value, 'includeReferenceInCompareTotal', path)
}

function assertFinancing(value: unknown, path: string): void {
  assertRecord(value, path)
  readString(value, 'label', path)
}

export function validateCatalog(value: unknown): BundleCatalog {
  const path = 'catalog'
  assertRecord(value, path)

  if (value.schemaVersion !== 1) {
    fail(`${path}.schemaVersion`, 'expected schema version 1')
  }

  readString(value, 'catalogVersion', path)

  if (value.currency !== 'USD') {
    fail(`${path}.currency`, 'expected USD')
  }

  assertArray(value.categories, `${path}.categories`)
  assertArray(value.products, `${path}.products`)

  if (value.categories.length !== stepIds.size) {
    fail(`${path}.categories`, `expected ${stepIds.size} builder categories`)
  }

  value.categories.forEach((category, index) =>
    assertCategory(category, `${path}.categories[${index}]`),
  )
  value.products.forEach((product, index) =>
    assertProduct(product, `${path}.products[${index}]`),
  )
  assertShipping(value.shipping, `${path}.shipping`)
  assertFinancing(value.financing, `${path}.financing`)

  const categories = value.categories as unknown as BundleCatalog['categories']
  const products = value.products as unknown as BundleCatalog['products']
  const categoryIds = categories.map((category) => category.id)
  const productIds = products.map((product) => product.id)

  assertUnique(categoryIds, `${path}.categories`)
  assertUnique(
    categories.map((category) => String(category.stepNumber)),
    `${path}.categories.stepNumber`,
  )
  assertUnique(
    categories.map((category) => String(category.builderSortOrder)),
    `${path}.categories.builderSortOrder`,
  )
  assertUnique(
    categories.map((category) => String(category.reviewSortOrder)),
    `${path}.categories.reviewSortOrder`,
  )
  assertUnique(productIds, `${path}.products`)

  for (const expectedStepId of stepIds) {
    if (!categoryIds.includes(expectedStepId)) {
      fail(`${path}.categories`, `missing category "${expectedStepId}"`)
    }
  }

  categories.forEach((category, index) => {
    if (category.nextStepId && !categoryIds.includes(category.nextStepId)) {
      fail(
        `${path}.categories[${index}].nextStepId`,
        `unknown category "${category.nextStepId}"`,
      )
    }
  })

  products.forEach((product, index) => {
    if (!categoryIds.includes(product.categoryId)) {
      fail(
        `${path}.products[${index}].categoryId`,
        `unknown category "${product.categoryId}"`,
      )
    }
  })

  for (const categoryId of categoryIds) {
    const categoryProducts = products.filter(
      (product) => product.categoryId === categoryId,
    )
    assertUnique(
      categoryProducts.map((product) => String(product.builderSortOrder)),
      `${path}.products.${categoryId}.builderSortOrder`,
    )
    assertUnique(
      categoryProducts.map((product) => String(product.reviewSortOrder)),
      `${path}.products.${categoryId}.reviewSortOrder`,
    )
  }

  return value as unknown as BundleCatalog
}

function getProductById(
  catalog: BundleCatalog,
  productId: string,
  path: string,
): Product {
  const product = catalog.products.find((candidate) => candidate.id === productId)

  if (!product) {
    fail(path, `unknown product ID "${productId}"`)
  }

  return product
}

export function validateInitialConfiguration(
  value: unknown,
  catalog: BundleCatalog,
): SeededBundleConfiguration {
  const path = 'initialConfiguration'
  assertRecord(value, path)

  if (value.schemaVersion !== 1) {
    fail(`${path}.schemaVersion`, 'expected schema version 1')
  }

  if (value.catalogVersion !== catalog.catalogVersion) {
    fail(
      `${path}.catalogVersion`,
      `expected catalog version "${catalog.catalogVersion}"`,
    )
  }

  if (value.openStepId !== null) {
    const openStepId = readString(value, 'openStepId', path)
    assertStepId(openStepId, `${path}.openStepId`)
  }

  assertArray(value.products, `${path}.products`)

  if (value.products.length !== catalog.products.length) {
    fail(
      `${path}.products`,
      `expected one configuration for each of ${catalog.products.length} products`,
    )
  }

  const configuredProductIds: string[] = []

  value.products.forEach((configuration, index) => {
    const configurationPath = `${path}.products[${index}]`
    assertRecord(configuration, configurationPath)

    const productId = readString(configuration, 'productId', configurationPath)
    const product = getProductById(
      catalog,
      productId,
      `${configurationPath}.productId`,
    )
    const activeVariantId = readString(
      configuration,
      'activeVariantId',
      configurationPath,
    )
    const variantIds = product.variants.map((variant) => variant.id)

    if (!variantIds.includes(activeVariantId)) {
      fail(
        `${configurationPath}.activeVariantId`,
        `unknown variant "${activeVariantId}" for product "${productId}"`,
      )
    }

    const quantities = configuration.quantities
    assertRecord(quantities, `${configurationPath}.quantities`)
    const quantityVariantIds = Object.keys(quantities)
    assertUnique(quantityVariantIds, `${configurationPath}.quantities`)

    if (
      quantityVariantIds.length !== variantIds.length ||
      variantIds.some((variantId) => !quantityVariantIds.includes(variantId))
    ) {
      fail(
        `${configurationPath}.quantities`,
        'expected exactly one quantity for every catalog variant',
      )
    }

    const totalQuantity = variantIds.reduce(
      (total, variantId) =>
        total +
        readInteger(
          quantities,
          variantId,
          `${configurationPath}.quantities`,
        ),
      0,
    )

    if (totalQuantity < product.minQuantity) {
      fail(
        `${configurationPath}.quantities`,
        `total quantity cannot be lower than ${product.minQuantity}`,
      )
    }

    if (
      product.maxQuantity !== undefined &&
      totalQuantity > product.maxQuantity
    ) {
      fail(
        `${configurationPath}.quantities`,
        `total quantity cannot exceed ${product.maxQuantity}`,
      )
    }

    configuredProductIds.push(productId)
  })

  assertUnique(configuredProductIds, `${path}.products`)

  return value as unknown as SeededBundleConfiguration
}

export function getSelectedProductCounts(
  catalog: BundleCatalog,
  configuration: SeededBundleConfiguration,
): Record<StepId, number> {
  const counts: Record<StepId, number> = {
    cameras: 0,
    plan: 0,
    sensors: 0,
    accessories: 0,
  }

  for (const productConfiguration of configuration.products) {
    const product = getProductById(
      catalog,
      productConfiguration.productId,
      'initialConfiguration.products',
    )
    const isSelected = Object.values(productConfiguration.quantities).some(
      (quantity) => quantity > 0,
    )

    if (isSelected) {
      counts[product.categoryId] += 1
    }
  }

  return counts
}
