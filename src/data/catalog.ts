import catalogJson from './catalog.json'
import initialConfigurationJson from './initialConfiguration.json'
import { resolveAsset } from './assetRegistry'
import {
  CatalogValidationError,
  getSelectedProductCounts,
  validateCatalog,
  validateInitialConfiguration,
} from './validation'

export const catalog = validateCatalog(catalogJson)
export const initialConfiguration = validateInitialConfiguration(
  initialConfigurationJson,
  catalog,
)

const catalogAssetPaths = [
  ...catalog.categories.map((category) => category.iconAsset),
  ...catalog.products.flatMap((product) => [
    product.imageAsset,
    ...(product.reviewThumbnailAsset
      ? [product.reviewThumbnailAsset]
      : []),
    ...product.variants.flatMap((variant) => [
      ...(variant.imageAsset ? [variant.imageAsset] : []),
      ...(variant.swatchAsset ? [variant.swatchAsset] : []),
    ]),
  ]),
  catalog.shipping.iconAsset,
]

catalogAssetPaths.forEach(resolveAsset)

export const builderCategories = [...catalog.categories].sort(
  (left, right) => left.builderSortOrder - right.builderSortOrder,
)

export const seededSelectedProductCounts = getSelectedProductCounts(
  catalog,
  initialConfiguration,
)

const namedColorVariantCount = catalog.products.reduce(
  (count, product) =>
    count +
    product.variants.filter((variant) => variant.id !== 'default').length,
  0,
)

if (catalog.products.length !== 9 || namedColorVariantCount !== 9) {
  throw new CatalogValidationError(
    'catalog.products',
    'the approved assignment contract requires nine products and nine named color variants',
  )
}

const expectedSelectedCounts = {
  cameras: 2,
  plan: 1,
  sensors: 2,
  accessories: 1,
} as const

for (const category of builderCategories) {
  if (
    seededSelectedProductCounts[category.id] !==
    expectedSelectedCounts[category.id]
  ) {
    throw new CatalogValidationError(
      `initialConfiguration.products.${category.id}`,
      `expected ${expectedSelectedCounts[category.id]} selected products`,
    )
  }
}
