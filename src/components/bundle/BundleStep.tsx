import type { ReactNode } from 'react'

interface BundleStepProps {
  children?: ReactNode
  expanded: boolean
  icon: string
  id: string
  nextLabel?: string
  onNext?: () => void
  onToggle: () => void
  selectedCount: number
  step: 1 | 2 | 3 | 4
  title: string
}

const collapsedHeight = {
  1: 'min-h-[75px] tablet:min-h-[82px] wide:min-h-[88px]',
  2: 'min-h-[85px] tablet:min-h-[82px] wide:min-h-[88px]',
  3: 'min-h-[80px] tablet:min-h-[81px] wide:min-h-[87px]',
  4: 'min-h-[80px] tablet:min-h-[81px] wide:min-h-[87px]',
} as const

const headerHeight = {
  1: 'min-h-[45px] tablet:min-h-[52px]',
  2: 'min-h-[65px] wide:min-h-[71px]',
  3: 'min-h-[60px] tablet:min-h-[64px] wide:min-h-[70px]',
  4: 'min-h-[60px] tablet:min-h-[64px] wide:min-h-[70px]',
} as const

export function BundleStep({
  children,
  expanded,
  icon,
  id,
  nextLabel,
  onNext,
  onToggle,
  selectedCount,
  step,
  title,
}: BundleStepProps) {
  const headerId = `bundle-step-${id}-header`
  const panelId = `bundle-step-${id}-panel`
  const shellHeight = expanded && step === 1
    ? 'tablet:min-h-[695px] wide:min-h-[502.1px]'
    : collapsedHeight[step as keyof typeof collapsedHeight]

  return (
    <section
      aria-labelledby={headerId}
      className={`flex flex-col ${shellHeight} ${
        expanded
          ? 'bg-builder-surface pt-panel-inset tablet:rounded-panel'
          : step === 1
            ? 'pt-panel-inset tablet:pt-0'
            : 'pt-[5px] tablet:pt-0'
      }`}
    >
      <h2 className="font-normal">
        <button
          aria-controls={panelId}
          aria-expanded={expanded}
          className="group flex w-full flex-col text-left"
          id={headerId}
          onClick={onToggle}
          type="button"
        >
          <span className="px-[15px] font-gilroy-medium text-ui-10 leading-solid font-medium tracking-eyebrow text-text-label uppercase tablet:text-ui-12">
            Step {step} of 4
          </span>

          <span
            className={`mt-[5px] flex w-full items-center gap-[10px] border-gray-c-500 px-[15px] transition-colors group-hover:bg-white/45 group-active:bg-white/70 motion-reduce:transition-none ${
              expanded ? 'border-t' : 'border-y'
            } ${headerHeight[step]}`}
          >
            <img
              alt=""
              aria-hidden="true"
              className="size-5 shrink-0 object-contain tablet:size-[26px] wide:size-[30px]"
              src={icon}
            />
            <span className="min-w-0 font-gilroy-semibold text-ui-18 leading-solid font-semibold text-obsidian tablet:text-ui-22 wide:text-ui-28">
              {title}
            </span>
            <span className="ml-auto shrink-0 font-gilroy-medium text-ui-14 leading-control font-medium text-wyze-purple">
              {selectedCount} selected
            </span>
            <span
              aria-hidden="true"
              className={`h-[6px] w-[10px] shrink-0 bg-wyze-purple transition-transform motion-reduce:transition-none ${
                expanded ? '' : 'rotate-180'
              } [clip-path:polygon(50%_0,100%_100%,0_100%)]`}
            />
          </span>
        </button>
      </h2>

      <div
        aria-labelledby={headerId}
        className="min-h-0 flex-1"
        hidden={!expanded}
        id={panelId}
        role="region"
      >
        <div className="flex h-full min-h-0 flex-col">
          {children}

          {nextLabel && onNext ? (
            <div className="mt-auto flex min-h-[72px] justify-center pt-[14px] pb-[19px]">
              <button
                className={`h-[39px] max-w-[calc(100%-30px)] rounded-next-button border border-wyze-purple px-6 py-[5px] text-center font-gilroy-semibold text-ui-18 leading-button font-semibold whitespace-nowrap text-wyze-purple transition-colors hover:bg-wyze-purple hover:text-on-accent active:bg-wyze-purple/90 motion-reduce:transition-none ${
                  nextLabel === 'Choose your plan'
                    ? 'w-[242px]'
                    : 'min-w-[242px]'
                }`}
                onClick={onNext}
                type="button"
              >
                Next: {nextLabel}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
