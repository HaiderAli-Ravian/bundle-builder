import { resolveAsset } from '../../data/assetRegistry'
import { catalog } from '../../data/catalog'
import { formatCents } from '../../domain/currency'

export function ShippingRow() {
  const { shipping } = catalog

  return (
    <section
      aria-label={shipping.label}
      className="grid min-h-[55px] grid-cols-[41px_minmax(0,1fr)_auto] items-center gap-x-[10px] wide:min-h-[clamp(55px,5.0459cqw,74px)] wide:grid-cols-[clamp(41px,3.7615cqw,55px)_minmax(0,1fr)_auto] wide:gap-x-[clamp(10px,0.9174cqw,13px)]"
    >
      <span className="flex size-[41px] self-end items-center justify-center rounded-[5px] bg-card wide:size-[clamp(41px,3.7615cqw,55px)]">
        <img
          alt=""
          aria-hidden="true"
          className="size-[29px] wide:size-[clamp(29px,2.6606cqw,39px)]"
          src={resolveAsset(shipping.iconAsset)}
        />
      </span>

      <span className="font-gilroy-medium text-ui-12 leading-control font-medium tracking-review text-obsidian tablet:text-ui-14 wide:text-[clamp(18px,1.6514cqw,24px)] wide:leading-[clamp(16px,1.4679cqw,22px)]">
        {shipping.label}
      </span>

      <span className="flex min-w-[58px] flex-col items-end font-gilroy-medium text-ui-12 leading-control tracking-review whitespace-nowrap tablet:text-ui-14 wide:min-w-[clamp(58px,5.3211cqw,78px)] wide:text-[clamp(16px,1.4679cqw,22px)] wide:leading-[clamp(16px,1.4679cqw,22px)]">
        <span className="text-gray-c-600 line-through">
          {formatCents(shipping.referenceCents)}
        </span>
        <span className="font-gilroy-semibold font-semibold text-wyze-purple">
          {shipping.actualCents === 0
            ? 'FREE'
            : formatCents(shipping.actualCents)}
        </span>
      </span>
    </section>
  )
}
