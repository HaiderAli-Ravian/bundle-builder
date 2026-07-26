import { catalog } from '../../data/catalog'
import { calculateBundlePricing } from '../../domain/pricing'
import { selectReviewLines } from '../../store/bundleSelectors'
import { useBundleStore } from '../../store/bundleStore'
import { OrderSummary } from './OrderSummary'
import { ReviewGroup } from './ReviewGroup'
import { ShippingRow } from './ShippingRow'

export function ReviewPanel() {
  const quantityByKey = useBundleStore((state) => state.quantityByKey)
  const reviewLines = selectReviewLines({ quantityByKey })
  const reviewCategories = catalog.categories.toSorted(
    (left, right) => left.reviewSortOrder - right.reviewSortOrder,
  )
  const pricing = calculateBundlePricing(
    reviewLines,
    catalog.shipping,
  )

  return (
    <aside
      aria-label="Bundle review"
      className="mx-auto flex min-h-[846px] w-full max-w-[390px] flex-col gap-[5px] bg-builder-surface pt-panel-inset sm:max-w-builder-standard desktop:min-h-[855px] desktop:max-w-none desktop:rounded-panel wide:min-h-[658px]"
    >
      <p className="px-[15px] font-gilroy-medium text-ui-10 leading-solid font-medium tracking-eyebrow text-text-label uppercase tablet:text-ui-12 wide:hidden">
        Review
      </p>

      <div className="mx-auto min-h-[816px] w-full max-w-[390px] px-review-inset pt-review-inset pb-review-bottom sm:max-w-none tablet:min-h-[823px] desktop:mr-[9px] desktop:ml-0 desktop:max-w-[390px] wide:mx-auto wide:min-h-[643px] wide:max-w-none">
        <div className="wide:mx-auto wide:grid wide:w-[calc(100%-83px)] wide:grid-cols-[552fr_486fr] wide:gap-x-[4.7707%] wide:[container-type:inline-size]">
          <div>
            <section
              aria-labelledby="review-heading"
              className="border-b border-gray-c-400 pb-[11px] wide:pb-[clamp(11px,1.0092cqw,15px)]"
            >
              <h2
                id="review-heading"
                className="font-gilroy-semibold text-ui-22 leading-solid font-semibold tracking-copy text-text-primary wide:text-[clamp(28px,2.5688cqw,38px)]"
              >
                Your security system
              </h2>
              <p className="mt-[5px] font-gilroy-medium text-ui-12 leading-copy font-medium tracking-copy text-text-secondary desktop:text-ui-14 wide:mt-[clamp(5px,0.4587cqw,7px)] wide:text-[clamp(16px,1.4679cqw,22px)]">
                Review your personalized protection system designed to keep
                what matters most safe.
              </p>
            </section>

            {reviewLines.length === 0 ? (
              <div className="py-8 text-center">
                <p className="font-gilroy-medium text-ui-14 leading-copy text-text-secondary wide:text-[clamp(14px,1.2844cqw,19px)]">
                  Your selected products will appear here.
                </p>
              </div>
            ) : (
              <>
                {reviewCategories.map((category) => (
                  <ReviewGroup
                    category={category}
                    key={category.id}
                    lines={reviewLines.filter(
                      (line) => line.categoryId === category.id,
                    )}
                  />
                ))}
                <ShippingRow />
              </>
            )}
          </div>

          <OrderSummary
            hasItems={reviewLines.length > 0}
            pricing={pricing}
          />
        </div>
      </div>
    </aside>
  )
}
