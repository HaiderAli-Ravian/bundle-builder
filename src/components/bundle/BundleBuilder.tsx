import { useState } from 'react'
import {
  builderCategories,
  initialConfiguration,
  seededSelectedProductCounts,
} from '../../data/catalog'
import { resolveAsset } from '../../data/assetRegistry'
import type { StepId } from '../../domain/bundleTypes'
import { BundleStep } from './BundleStep'

export function BundleBuilder() {
  const [openStepId, setOpenStepId] = useState<StepId | null>(
    initialConfiguration.openStepId,
  )

  const focusHeader = (stepId: StepId) => {
    document.getElementById(`bundle-step-${stepId}-header`)?.focus()
  }

  const openStep = (stepId: StepId) => {
    setOpenStepId(stepId)
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
            onToggle={() =>
              setOpenStepId((currentStepId) =>
                currentStepId === step.id ? null : step.id,
              )
            }
            selectedCount={seededSelectedProductCounts[step.id]}
            step={step.stepNumber}
            title={step.title}
          />
        )
      })}
    </div>
  )
}
