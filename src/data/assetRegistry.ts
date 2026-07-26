import camUnlimitedIcon from '../assets/icons/cam-unlimited.svg'
import satisfactionGuaranteeBadge from '../assets/badges/wyze-satisfaction-guarantee.svg'
import accessoriesIcon from '../assets/icons/category-accessories.svg'
import camerasIcon from '../assets/icons/category-cameras.svg'
import planIcon from '../assets/icons/category-plan.svg'
import sensorsIcon from '../assets/icons/category-sensors.svg'
import shippingTruckIcon from '../assets/icons/shipping-truck.svg'
import batteryCamProImage from '../assets/products/wyze-battery-cam-pro.svg'
import batteryCamProBlackSwatch from '../assets/products/swatches/wyze-battery-cam-pro-black.svg'
import batteryCamProWhiteSwatch from '../assets/products/swatches/wyze-battery-cam-pro-white.svg'
import floodlightBlackSwatch from '../assets/products/swatches/wyze-cam-floodlight-v2-black.svg'
import floodlightWhiteSwatch from '../assets/products/swatches/wyze-cam-floodlight-v2-white.svg'
import panV3BlackSwatch from '../assets/products/swatches/wyze-cam-pan-v3-black.svg'
import panV3WhiteSwatch from '../assets/products/swatches/wyze-cam-pan-v3-white.svg'
import camV4BlackSwatch from '../assets/products/swatches/wyze-cam-v4-black.svg'
import camV4GreySwatch from '../assets/products/swatches/wyze-cam-v4-grey.svg'
import camV4WhiteSwatch from '../assets/products/swatches/wyze-cam-v4-white.svg'
import floodlightImage from '../assets/products/wyze-cam-floodlight-v2.svg'
import panV3Image from '../assets/products/wyze-cam-pan-v3.svg'
import camV4Image from '../assets/products/wyze-cam-v4.svg'
import duoCamDoorbellImage from '../assets/products/wyze-duo-cam-doorbell.svg'
import microSdCardImage from '../assets/products/wyze-microsd-card-256gb.svg'
import senseHubImage from '../assets/products/wyze-sense-hub.svg'
import motionSensorImage from '../assets/products/wyze-sense-motion-sensor.svg'

const assetRegistry = {
  'badges/wyze-satisfaction-guarantee.svg': satisfactionGuaranteeBadge,
  'icons/cam-unlimited.svg': camUnlimitedIcon,
  'icons/category-accessories.svg': accessoriesIcon,
  'icons/category-cameras.svg': camerasIcon,
  'icons/category-plan.svg': planIcon,
  'icons/category-sensors.svg': sensorsIcon,
  'icons/shipping-truck.svg': shippingTruckIcon,
  'products/wyze-battery-cam-pro.svg': batteryCamProImage,
  'products/wyze-cam-floodlight-v2.svg': floodlightImage,
  'products/wyze-cam-pan-v3.svg': panV3Image,
  'products/wyze-cam-v4.svg': camV4Image,
  'products/wyze-duo-cam-doorbell.svg': duoCamDoorbellImage,
  'products/wyze-microsd-card-256gb.svg': microSdCardImage,
  'products/wyze-sense-hub.svg': senseHubImage,
  'products/wyze-sense-motion-sensor.svg': motionSensorImage,
  'products/swatches/wyze-battery-cam-pro-black.svg':
    batteryCamProBlackSwatch,
  'products/swatches/wyze-battery-cam-pro-white.svg':
    batteryCamProWhiteSwatch,
  'products/swatches/wyze-cam-floodlight-v2-black.svg':
    floodlightBlackSwatch,
  'products/swatches/wyze-cam-floodlight-v2-white.svg':
    floodlightWhiteSwatch,
  'products/swatches/wyze-cam-pan-v3-black.svg': panV3BlackSwatch,
  'products/swatches/wyze-cam-pan-v3-white.svg': panV3WhiteSwatch,
  'products/swatches/wyze-cam-v4-black.svg': camV4BlackSwatch,
  'products/swatches/wyze-cam-v4-grey.svg': camV4GreySwatch,
  'products/swatches/wyze-cam-v4-white.svg': camV4WhiteSwatch,
} as const

export type AssetPath = keyof typeof assetRegistry

export function resolveAsset(assetPath: string): string {
  if (!Object.hasOwn(assetRegistry, assetPath)) {
    throw new Error(`Unregistered catalog asset "${assetPath}"`)
  }

  return assetRegistry[assetPath as AssetPath]
}
