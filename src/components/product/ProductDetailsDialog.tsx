import { useEffect, useRef } from 'react'
import type { Product } from '../../domain/bundleTypes'

interface ProductDetailsDialogProps {
  onClose: () => void
  product: Product | null
}

export function ProductDetailsDialog({
  onClose,
  product,
}: ProductDetailsDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current

    if (product && dialog && !dialog.open) {
      dialog.showModal()
    }

    if (!product && dialog?.open) {
      dialog.close()
    }
  }, [product])

  return (
    <dialog
      aria-describedby="product-details-description"
      aria-labelledby="product-details-title"
      className="m-auto w-[min(420px,calc(100%-32px))] rounded-panel border-0 bg-card p-6 text-text-primary shadow-xl backdrop:bg-black/40"
      onCancel={onClose}
      onClose={onClose}
      ref={dialogRef}
    >
      {product ? (
        <>
          <h2
            className="font-gilroy-semibold text-ui-22 leading-compact font-semibold"
            id="product-details-title"
          >
            {product.name}
          </h2>
          <p
            className="mt-3 font-gilroy-medium text-ui-14 leading-copy text-text-secondary"
            id="product-details-description"
          >
            {product.description}
          </p>
          <p className="mt-3 font-gilroy-regular text-ui-14 leading-copy text-text-secondary">
            Additional product details are not included in this assignment.
          </p>
          <button
            className="mt-6 rounded-checkout-button bg-wyze-purple px-5 py-3 font-gilroy-semibold text-ui-16 leading-solid font-semibold text-on-accent hover:opacity-90 active:opacity-80"
            onClick={() => dialogRef.current?.close()}
            type="button"
          >
            Close
          </button>
        </>
      ) : null}
    </dialog>
  )
}
