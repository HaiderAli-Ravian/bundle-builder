interface BundleStepProps {
  expanded?: boolean
  icon: string
  selectedCount: number
  step: number
  title: string
}

const collapsedHeight = {
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
  expanded = false,
  icon,
  selectedCount,
  step,
  title,
}: BundleStepProps) {
  const titleId = `bundle-step-${step}-title`
  const shellHeight = expanded
    ? 'tablet:min-h-[695px] wide:min-h-[502.1px]'
    : collapsedHeight[step as keyof typeof collapsedHeight]

  return (
    <section
      aria-labelledby={titleId}
      className={`flex flex-col ${shellHeight} ${
        expanded
          ? 'bg-builder-surface pt-panel-inset tablet:rounded-panel'
          : 'pt-[5px] tablet:pt-0'
      }`}
    >
      <p className="px-[15px] font-gilroy-medium text-ui-10 leading-solid tracking-eyebrow text-text-label uppercase tablet:text-ui-12">
        Step {step} of 4
      </p>

      <div
        className={`mt-[5px] flex items-center gap-[10px] border-y border-gray-c-500 px-[15px] ${headerHeight[step as keyof typeof headerHeight]}`}
      >
        <img
          alt=""
          aria-hidden="true"
          className="size-5 shrink-0 object-contain tablet:size-[26px] wide:size-[30px]"
          src={icon}
        />
        <h2
          id={titleId}
          className="min-w-0 font-gilroy-semibold text-ui-18 leading-solid text-obsidian tablet:text-ui-22 wide:text-ui-28"
        >
          {title}
        </h2>
        <span className="ml-auto shrink-0 font-gilroy-medium text-ui-14 leading-control text-wyze-purple">
          {selectedCount} selected
        </span>
        <span
          aria-hidden="true"
          className={`h-[6px] w-[10px] shrink-0 bg-wyze-purple [clip-path:polygon(50%_0,100%_100%,0_100%)] ${
            expanded ? '' : 'rotate-180'
          }`}
        />
      </div>

      {expanded ? <div className="min-h-0 flex-1" /> : null}
    </section>
  )
}
