import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from '../../App'
import {
  createInitialBundleState,
  useBundleStore,
} from '../../store/bundleStore'
import { ReviewPanel } from './ReviewPanel'

const saveConfiguration = useBundleStore.getState().saveConfiguration

beforeEach(() => {
  useBundleStore.setState({
    ...createInitialBundleState(),
    saveConfiguration,
  })
})

afterEach(() => {
  cleanup()
})

describe('ReviewPanel', () => {
  it('renders the seeded lines in review order', () => {
    render(<ReviewPanel />)

    const review = screen.getByRole('complementary', {
      name: 'Bundle review',
    })
    const content = review.textContent ?? ''
    const orderedNames = [
      'Wyze Cam v4',
      'Wyze Cam Pan v3',
      'Wyze Sense Motion Sensor',
      'Wyze Sense Hub (Required)',
      'Wyze MicroSD Card (256GB)',
      'Cam Unlimited',
    ]

    orderedNames.reduce((previousIndex, name) => {
      const currentIndex = content.indexOf(name)

      expect(currentIndex).toBeGreaterThan(previousIndex)
      return currentIndex
    }, -1)
  })

  it('renders every positive variant as its own line', () => {
    useBundleStore
      .getState()
      .adjustQuantity('wyze-cam-v4', 'black', 1)

    render(<ReviewPanel />)

    expect(screen.getByText('Wyze Cam v4')).toBeInTheDocument()
    expect(
      screen.getByText('Wyze Cam v4 (Black)'),
    ).toBeInTheDocument()
  })

  it('removes a zero-quantity line without affecting sibling lines', async () => {
    const user = userEvent.setup()

    render(<ReviewPanel />)

    const review = screen.getByRole('complementary', {
      name: 'Bundle review',
    })
    await user.click(
      within(review).getByRole('button', {
        name: 'Decrease Wyze Cam v4 quantity',
      }),
    )

    expect(
      within(review).queryByText('Wyze Cam v4'),
    ).not.toBeInTheDocument()
    expect(
      within(review).getByText('Wyze Cam Pan v3'),
    ).toBeInTheDocument()
  })

  it('keeps the required Hub at one and the plan non-editable', () => {
    render(<ReviewPanel />)

    const review = screen.getByRole('complementary', {
      name: 'Bundle review',
    })

    expect(
      within(review).getByRole('button', {
        name: 'Decrease Wyze Sense Hub (Required) quantity',
      }),
    ).toBeDisabled()
    expect(
      within(review).getByRole('button', {
        name: 'Increase Wyze Sense Hub (Required) quantity',
      }),
    ).toBeEnabled()
    expect(
      within(review).queryByRole('group', {
        name: 'Cam Unlimited quantity',
      }),
    ).not.toBeInTheDocument()
  })

  it('shows a defensive empty state with Checkout disabled', () => {
    useBundleStore.setState({ quantityByKey: {} })

    render(<ReviewPanel />)

    expect(
      screen.getByText('Your selected products will appear here.'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Checkout' }),
    ).toBeDisabled()
    expect(screen.getAllByText('$0.00')).toHaveLength(4)
  })

  it('renders derived totals and updates them with quantities', () => {
    useBundleStore
      .getState()
      .adjustQuantity('wyze-cam-v4', 'white', 1)

    render(<ReviewPanel />)

    expect(screen.getAllByText('$237.85')).toHaveLength(2)
    expect(screen.getAllByText('$296.77')).toHaveLength(2)
    expect(
      screen.getByText(
        "Congrats! You're saving $58.92 on your security bundle!",
      ),
    ).toBeInTheDocument()
  })

  it('confirms that Checkout is a demonstration without navigating', async () => {
    const user = userEvent.setup()

    render(<ReviewPanel />)

    await user.click(
      screen.getByRole('button', { name: 'Checkout' }),
    )

    expect(
      screen.getByText(
        'Checkout is a demonstration and no order has been placed.',
      ),
    ).toBeVisible()
  })

  it('shows confirmation after saving the current configuration', async () => {
    const user = userEvent.setup()

    useBundleStore.setState({
      saveConfiguration: () => {
        useBundleStore.setState({ saveFeedback: 'saved' })
      },
    })

    render(<ReviewPanel />)

    await user.click(
      screen.getByRole('button', {
        name: 'Save my system for later',
      }),
    )

    expect(
      screen.getByText('Your system has been saved.'),
    ).toHaveTextContent('Your system has been saved.')
  })

  it('restores a removed accessory from its builder control', async () => {
    const user = userEvent.setup()

    useBundleStore
      .getState()
      .adjustQuantity('wyze-microsd-card-256gb', 'default', -1)
    useBundleStore
      .getState()
      .adjustQuantity('wyze-microsd-card-256gb', 'default', -1)

    render(<App />)

    const review = screen.getByRole('complementary', {
      name: 'Bundle review',
    })

    expect(
      within(review).queryByText('Wyze MicroSD Card (256GB)'),
    ).not.toBeInTheDocument()

    await user.click(
      screen.getByRole('button', {
        name: /Step 4 of 4.*Add extra protection/,
      }),
    )

    const accessoryControl = screen.getByRole('article', {
      name: 'Wyze MicroSD Card (256GB)',
    })

    await user.click(
      within(accessoryControl).getByRole('button', {
        name: 'Increase Wyze MicroSD Card (256GB) quantity',
      }),
    )

    expect(
      within(review).getByText('Wyze MicroSD Card (256GB)'),
    ).toBeInTheDocument()
  })
})
