import { catalog } from '../../data/catalog'
import { selectReviewLines } from '../../store/bundleSelectors'
import { useBundleStore } from '../../store/bundleStore'
import { ReviewGroup } from './ReviewGroup'

export function ReviewPanel() {
  const quantityByKey = useBundleStore((state) => state.quantityByKey)
  const reviewLines = selectReviewLines({ quantityByKey })
  const reviewCategories = catalog.categories.toSorted(
    (left, right) => left.reviewSortOrder - right.reviewSortOrder,
  )

  return (
    <aside
      aria-label="Bundle review"
      className="mx-auto flex min-h-[846px] w-full max-w-[390px] flex-col gap-[5px] bg-builder-surface pt-panel-inset desktop:min-h-[855px] desktop:max-w-none desktop:rounded-panel wide:min-h-[658px]"
    >
      <p className="px-[15px] font-gilroy-medium text-ui-10 leading-solid font-medium tracking-eyebrow text-text-label uppercase tablet:text-ui-12 wide:hidden">
        Review
      </p>

      <div className="mx-auto min-h-[816px] w-full max-w-[390px] px-review-inset pt-review-inset pb-review-bottom tablet:min-h-[823px] wide:min-h-[643px] wide:max-w-none">
        <div className="wide:mx-auto wide:grid wide:w-[1090px] wide:grid-cols-[552px_486px] wide:gap-x-wide-review-columns">
          <div>
            <section
              aria-labelledby="review-heading"
              className="border-b border-gray-c-400 pb-[11px]"
            >
              <h2
                id="review-heading"
                className="font-gilroy-semibold text-ui-22 leading-solid font-semibold tracking-copy text-text-primary wide:text-ui-28"
              >
                Your security system
              </h2>
              <p className="mt-[5px] font-gilroy-medium text-ui-12 leading-copy font-medium tracking-copy text-text-secondary desktop:text-ui-14 wide:text-ui-16">
                Review your personalized protection system designed to keep
                what matters most safe.
              </p>
            </section>

            {reviewLines.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <p className="font-gilroy-medium text-ui-14 leading-copy text-text-secondary">
                  Your selected products will appear here.
                </p>
                <button
                  className="h-12 w-full rounded-checkout-button bg-wyze-purple px-4 font-tt-norms text-ui-17 leading-solid font-bold text-on-accent opacity-45"
                  disabled
                  type="button"
                >
                  Checkout
                </button>
              </div>
            ) : (
              reviewCategories.map((category) => (
                <ReviewGroup
                  category={category}
                  key={category.id}
                  lines={reviewLines.filter(
                    (line) => line.categoryId === category.id,
                  )}
                />
              ))
            )}
          </div>

          <div aria-hidden="true" className="hidden min-h-[284px] wide:block" />
        </div>
      </div>
    </aside>
  )
}
