import { useState } from 'react'
import {
  builderCategories,
  catalog,
  initialConfiguration,
} from '../../data/catalog'
import { resolveAsset } from '../../data/assetRegistry'
import { getSelectedProductCounts } from '../../data/validation'
import type {
  ProductConfiguration,
  StepId,
} from '../../domain/bundleTypes'
import { ProductGrid } from '../product/ProductGrid'
import { BundleStep } from './BundleStep'

export function BundleBuilder() {
  const [openStepId, setOpenStepId] = useState<StepId | null>(
    initialConfiguration.openStepId,
  )
  const [productConfigurations, setProductConfigurations] = useState<
    readonly ProductConfiguration[]
  >(() =>
    initialConfiguration.products.map((configuration) => ({
      ...configuration,
      quantities: { ...configuration.quantities },
    })),
  )

  const runtimeConfiguration = {
    ...initialConfiguration,
    products: productConfigurations,
  }
  const selectedProductCounts = getSelectedProductCounts(
    catalog,
    runtimeConfiguration,
  )

  const focusHeader = (stepId: StepId) => {
    document.getElementById(`bundle-step-${stepId}-header`)?.focus()
  }

  const openStep = (stepId: StepId) => {
    setOpenStepId(stepId)
    focusHeader(stepId)
  }

  const setActiveVariant = (productId: string, variantId: string) => {
    const product = catalog.products.find(
      (candidate) => candidate.id === productId,
    )

    if (!product?.variants.some((variant) => variant.id === variantId)) {
      return
    }

    setProductConfigurations((currentConfigurations) =>
      currentConfigurations.map((configuration) =>
        configuration.productId === productId
          ? { ...configuration, activeVariantId: variantId }
          : configuration,
      ),
    )
  }

  const adjustQuantity = (
    productId: string,
    variantId: string,
    delta: -1 | 1,
  ) => {
    const product = catalog.products.find(
      (candidate) => candidate.id === productId,
    )

    if (!product?.quantityEditable) {
      return
    }

    setProductConfigurations((currentConfigurations) =>
      currentConfigurations.map((configuration) => {
        if (
          configuration.productId !== productId ||
          !(variantId in configuration.quantities)
        ) {
          return configuration
        }

        const currentQuantity = configuration.quantities[variantId] ?? 0
        const otherVariantQuantity = Object.entries(
          configuration.quantities,
        ).reduce(
          (total, [currentVariantId, quantity]) =>
            currentVariantId === variantId ? total : total + quantity,
          0,
        )
        const minimum = Math.max(
          0,
          product.minQuantity - otherVariantQuantity,
        )
        const maximum =
          product.maxQuantity === undefined
            ? Number.POSITIVE_INFINITY
            : Math.max(0, product.maxQuantity - otherVariantQuantity)
        const quantity = Math.min(
          maximum,
          Math.max(minimum, currentQuantity + delta),
        )

        return {
          ...configuration,
          quantities: {
            ...configuration.quantities,
            [variantId]: quantity,
          },
        }
      }),
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-builder-standard flex-col gap-0 tablet:gap-builder-section desktop:max-w-none">
      {builderCategories.map((step) => {
        const nextStep = step.nextStepId
          ? builderCategories.find(
              (candidate) => candidate.id === step.nextStepId,
            )
          : undefined

        return (
          <BundleStep
            expanded={openStepId === step.id}
            icon={resolveAsset(step.iconAsset)}
            id={step.id}
            key={step.id}
            nextLabel={nextStep?.title}
            onNext={nextStep ? () => openStep(nextStep.id) : undefined}
            onToggle={() =>
              setOpenStepId((currentStepId) =>
                currentStepId === step.id ? null : step.id,
              )
            }
            selectedCount={selectedProductCounts[step.id]}
            step={step.stepNumber}
            title={step.title}
          >
            {step.id === 'cameras' ? (
              <ProductGrid
                configurations={productConfigurations}
                onQuantityChange={adjustQuantity}
                onVariantChange={setActiveVariant}
                products={catalog.products.filter(
                  (product) =>
                    product.categoryId === step.id && product.visibleInBuilder,
                )}
              />
            ) : null}
          </BundleStep>
        )
      })}
    </div>
  )
}
