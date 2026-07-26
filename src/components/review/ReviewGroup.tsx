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

  return (
    <section
      aria-labelledby={headingId}
      className="border-b border-gray-c-400 pt-[10px] pb-[7px]"
    >
      <h3
        aria-label={category.reviewLabel}
        className="font-gilroy-regular text-ui-12 leading-control tracking-review-group text-gray-c-500 uppercase"
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

      <ul className="mt-[4px]">
        {lines.map((line) => (
          <ReviewLineItem key={line.key} line={line} />
        ))}
      </ul>
    </section>
  )
}
