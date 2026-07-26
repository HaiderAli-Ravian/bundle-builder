import { BundleBuilder } from './components/bundle/BundleBuilder'
import { ReviewPanel } from './components/review/ReviewPanel'

function App() {
  return (
    <main
      id="bundle-builder"
      className="min-h-dvh bg-page pt-[31px] sm:px-6 sm:pt-[49.32px] desktop:pb-[49.64px]"
    >
      <h1 className="mx-auto w-[348px] max-w-[calc(100%-42px)] text-center font-gilroy-bold text-page-heading leading-compact font-bold tracking-fine text-text-primary sm:sr-only">
        Let&apos;s get started!
      </h1>

      <div className="mx-auto mt-5 w-full max-w-bundle-shell sm:mt-0">
        <div className="grid w-full grid-cols-1 desktop:w-[min(100%,var(--container-design-content))] desktop:grid-cols-[minmax(0,1fr)_clamp(390px,calc(3.75vw_+_345px),399px)] desktop:items-start desktop:gap-x-[clamp(24px,calc(9.1667vw_-_86px),46px)] wide:grid-cols-1 wide:gap-x-0 wide:gap-y-[33.58px]">
          <BundleBuilder />
          <ReviewPanel />
        </div>
      </div>
    </main>
  )
}

export default App
