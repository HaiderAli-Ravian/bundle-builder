import { useState } from 'react'
import accessoriesIcon from '../../assets/icons/category-accessories.svg'
import camerasIcon from '../../assets/icons/category-cameras.svg'
import planIcon from '../../assets/icons/category-plan.svg'
import sensorsIcon from '../../assets/icons/category-sensors.svg'
import { BundleStep } from './BundleStep'

type StepId = 'cameras' | 'plan' | 'sensors' | 'accessories'

interface StepDefinition {
  icon: string
  id: StepId
  selectedCount: number
  step: 1 | 2 | 3 | 4
  title: string
}

const steps = [
  {
    id: 'cameras',
    icon: camerasIcon,
    selectedCount: 2,
    step: 1,
    title: 'Choose your cameras',
  },
  {
    id: 'plan',
    icon: planIcon,
    selectedCount: 1,
    step: 2,
    title: 'Choose your plan',
  },
  {
    id: 'sensors',
    icon: sensorsIcon,
    selectedCount: 2,
    step: 3,
    title: 'Choose your sensors',
  },
  {
    id: 'accessories',
    icon: accessoriesIcon,
    selectedCount: 1,
    step: 4,
    title: 'Add extra protection',
  },
] as const satisfies readonly StepDefinition[]

export function BundleBuilder() {
  const [openStepId, setOpenStepId] = useState<StepId | null>('cameras')

  const focusHeader = (stepId: StepId) => {
    document.getElementById(`bundle-step-${stepId}-header`)?.focus()
  }

  const openStep = (stepId: StepId) => {
    setOpenStepId(stepId)
    focusHeader(stepId)
  }

  return (
    <div className="mx-auto flex w-full max-w-builder-standard flex-col gap-0 tablet:gap-builder-section desktop:max-w-none">
      {steps.map((step, index) => {
        const nextStep = steps[index + 1]

        return (
          <BundleStep
            expanded={openStepId === step.id}
            icon={step.icon}
            id={step.id}
            key={step.id}
            nextLabel={nextStep?.title}
            onNext={nextStep ? () => openStep(nextStep.id) : undefined}
            onToggle={() =>
              setOpenStepId((currentStepId) =>
                currentStepId === step.id ? null : step.id,
              )
            }
            selectedCount={step.selectedCount}
            step={step.step}
            title={step.title}
          />
        )
      })}
    </div>
  )
}
