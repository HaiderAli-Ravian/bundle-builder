import accessoriesIcon from '../../assets/icons/category-accessories.svg'
import camerasIcon from '../../assets/icons/category-cameras.svg'
import planIcon from '../../assets/icons/category-plan.svg'
import sensorsIcon from '../../assets/icons/category-sensors.svg'
import { BundleStep } from './BundleStep'

const steps = [
  {
    icon: camerasIcon,
    selectedCount: 2,
    title: 'Choose your cameras',
  },
  {
    icon: planIcon,
    selectedCount: 1,
    title: 'Choose your plan',
  },
  {
    icon: sensorsIcon,
    selectedCount: 2,
    title: 'Choose your sensors',
  },
  {
    icon: accessoriesIcon,
    selectedCount: 1,
    title: 'Add extra protection',
  },
] as const

export function BundleBuilder() {
  return (
    <div className="mx-auto flex w-full max-w-builder-standard flex-col gap-0 tablet:gap-builder-section desktop:max-w-none">
      {steps.map((step, index) => (
        <BundleStep
          expanded={index === 0}
          icon={step.icon}
          key={step.title}
          selectedCount={step.selectedCount}
          step={index + 1}
          title={step.title}
        />
      ))}
    </div>
  )
}
