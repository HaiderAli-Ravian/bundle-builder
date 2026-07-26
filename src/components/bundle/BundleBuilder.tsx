import { useShallow } from 'zustand/react/shallow'
import { builderCategories, catalog } from '../../data/catalog'
import { resolveAsset } from '../../data/assetRegistry'
import type { StepId } from '../../domain/bundleTypes'
import { selectSelectedProductCount } from '../../store/bundleSelectors'
import { useBundleStore } from '../../store/bundleStore'
import { ProductGrid } from '../product/ProductGrid'
import { BundleStep } from './BundleStep'

export function BundleBuilder() {
  const openStepId = useBundleStore((state) => state.openStepId)
  const setOpenStep = useBundleStore((state) => state.setOpenStep)
  const toggleStep = useBundleStore((state) => state.toggleStep)
  const selectedProductCounts = useBundleStore(
    useShallow((state) =>
      Object.fromEntries(
        builderCategories.map((category) => [
          category.id,
          selectSelectedProductCount(state, category.id),
        ]),
      ) as Record<StepId, number>,
    ),
  )

  const focusHeader = (stepId: StepId) => {
    document.getElementById(`bundle-step-${stepId}-header`)?.focus()
  }

  const openStep = (stepId: StepId) => {
    setOpenStep(stepId)
    focusHeader(stepId)
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
            onToggle={() => toggleStep(step.id)}
            selectedCount={selectedProductCounts[step.id]}
            step={step.stepNumber}
            title={step.title}
          >
            {step.id === 'cameras' ? (
              <ProductGrid
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
