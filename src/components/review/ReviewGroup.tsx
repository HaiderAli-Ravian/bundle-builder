import type { Category, ReviewLine } from '../../domain/bundleTypes'
import { ReviewLineItem } from './ReviewLineItem'

interface ReviewGroupProps {
  category: Category
  lines: readonly ReviewLine[]
}

export function ReviewGroup({ category, lines }: ReviewGroupProps) {
  if (lines.length === 0) {
    return null
  }

  const headingId = `review-group-${category.id}`
  const desktopPadding =
    category.id === 'sensors'
      ? 'desktop:pb-[7px]'
      : category.id === 'accessories'
        ? 'desktop:pb-[9px]'
        : 'desktop:pb-[10px]'

  return (
    <section
      aria-labelledby={headingId}
      className={`border-b border-gray-c-400 pt-[10px] pb-[7px] wide:pt-[clamp(10px,0.9174cqw,13px)] wide:pb-[clamp(7px,0.6422cqw,9px)] ${desktopPadding}`}
    >
      <h3
        aria-label={category.reviewLabel}
        className="font-gilroy-regular text-ui-12 leading-control tracking-review-group text-gray-c-500 uppercase wide:text-[clamp(12px,1.1009cqw,16px)] wide:leading-[clamp(16px,1.4679cqw,22px)]"
        id={headingId}
      >
        {category.id === 'plan' ? (
          <>
            <span className="desktop:hidden">Home monitoring plan</span>
            <span className="hidden desktop:inline">Plan</span>
          </>
        ) : (
          category.reviewLabel
        )}
      </h3>

      <ul className="mt-[4px] wide:mt-[clamp(4px,0.367cqw,5px)]">
        {lines.map((line) => (
          <ReviewLineItem key={line.key} line={line} />
        ))}
      </ul>
    </section>
  )
}
