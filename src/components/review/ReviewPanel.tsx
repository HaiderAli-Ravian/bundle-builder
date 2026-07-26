export function ReviewPanel() {
  return (
    <aside className="mx-auto flex min-h-[846px] w-full max-w-[390px] flex-col gap-[5px] bg-builder-surface pt-panel-inset desktop:min-h-[855px] desktop:max-w-none desktop:rounded-panel wide:min-h-[658px]">
      <p className="px-[15px] font-gilroy-medium text-ui-10 leading-solid font-medium tracking-eyebrow text-text-label uppercase tablet:text-ui-12 wide:hidden">
        Review
      </p>

      <div className="mx-auto min-h-[816px] w-full max-w-[390px] px-review-inset pt-review-inset pb-review-bottom tablet:min-h-[823px] wide:min-h-[643px] wide:max-w-none">
        <div className="wide:grid wide:grid-cols-[552px_486px] wide:justify-between">
          <section aria-labelledby="review-heading">
            <h2
              id="review-heading"
              className="font-gilroy-semibold text-ui-22 leading-solid font-semibold tracking-copy text-text-primary wide:text-ui-28"
            >
              Your security system
            </h2>
            <p className="mt-[5px] font-gilroy-medium text-ui-12 leading-copy font-medium tracking-copy text-text-secondary desktop:text-ui-14 wide:text-ui-16">
              Review your personalized protection system designed to keep what
              matters most safe.
            </p>
          </section>

          <div aria-hidden="true" className="hidden min-h-[284px] wide:block" />
        </div>
      </div>
    </aside>
  )
}
