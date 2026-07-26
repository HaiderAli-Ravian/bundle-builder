import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from '../../App'
import {
  createInitialBundleState,
  useBundleStore,
} from '../../store/bundleStore'
import { BundleBuilder } from './BundleBuilder'

beforeEach(() => {
  useBundleStore.setState(createInitialBundleState())
})

afterEach(() => {
  cleanup()
})

describe('BundleBuilder accessibility', () => {
  it('opens the next accordion step and moves focus to its header', async () => {
    const user = userEvent.setup()

    render(<BundleBuilder />)

    const camerasHeader = screen.getByRole('button', {
      name: /Step 1 of 4.*Choose your cameras/,
    })
    const planHeader = screen.getByRole('button', {
      name: /Step 2 of 4.*Choose your plan/,
    })

    expect(camerasHeader).toHaveAttribute('aria-expanded', 'true')
    expect(planHeader).toHaveAttribute('aria-expanded', 'false')
    expect(
      document.getElementById('bundle-step-plan-panel'),
    ).toHaveAttribute('inert')
    expect(
      document.getElementById('bundle-step-plan-panel'),
    ).toHaveAttribute('aria-hidden', 'true')

    await user.click(
      screen.getByRole('button', {
        name: 'Next: Choose your plan',
      }),
    )

    expect(camerasHeader).toHaveAttribute('aria-expanded', 'false')
    expect(planHeader).toHaveAttribute('aria-expanded', 'true')
    expect(planHeader).toHaveFocus()
    expect(
      document.getElementById('bundle-step-cameras-panel'),
    ).toHaveAttribute('inert')
    expect(
      document.getElementById('bundle-step-plan-panel'),
    ).not.toHaveAttribute('inert')
  })

  it('toggles headers directly while keeping only one step open', async () => {
    const user = userEvent.setup()

    render(<BundleBuilder />)

    const camerasHeader = screen.getByRole('button', {
      name: /Step 1 of 4.*Choose your cameras/,
    })
    const sensorsHeader = screen.getByRole('button', {
      name: /Step 3 of 4.*Choose your sensors/,
    })

    await user.click(camerasHeader)

    expect(camerasHeader).toHaveAttribute('aria-expanded', 'false')

    await user.click(sensorsHeader)

    expect(camerasHeader).toHaveAttribute('aria-expanded', 'false')
    expect(sensorsHeader).toHaveAttribute('aria-expanded', 'true')
  })

  it('supports radio semantics and arrow-key navigation for variants', async () => {
    const user = userEvent.setup()

    render(<BundleBuilder />)

    const colorSelector = screen.getByRole('radiogroup', {
      name: 'Wyze Cam v4 color',
    })
    const whiteOption = within(colorSelector).getByRole('radio', {
      name: 'White',
    })
    const greyOption = within(colorSelector).getByRole('radio', {
      name: 'Grey',
    })

    expect(whiteOption).toHaveAttribute('aria-checked', 'true')
    expect(whiteOption).toHaveAttribute('tabindex', '0')
    expect(greyOption).toHaveAttribute('tabindex', '-1')

    whiteOption.focus()
    await user.keyboard('{ArrowRight}')

    expect(greyOption).toHaveFocus()
    expect(greyOption).toHaveAttribute('aria-checked', 'true')
    expect(greyOption).toHaveAttribute('tabindex', '0')
    expect(whiteOption).toHaveAttribute('tabindex', '-1')
  })

  it('synchronizes card quantity changes with the review and totals', async () => {
    const user = userEvent.setup()

    render(<App />)

    const card = screen.getByRole('article', {
      name: 'Wyze Cam v4',
    })
    const review = screen.getByRole('complementary', {
      name: 'Bundle review',
    })

    await user.click(
      within(card).getByRole('button', {
        name: 'Increase Wyze Cam v4 White quantity',
      }),
    )

    expect(
      within(review).getByRole('status', {
        name: 'Wyze Cam v4 quantity: 2',
      }),
    ).toHaveTextContent('2')
    expect(screen.getAllByText('$237.85')).toHaveLength(2)
    expect(screen.getAllByText('$296.77')).toHaveLength(2)
  })

  it('synchronizes review quantity changes with the product card and totals', async () => {
    const user = userEvent.setup()

    render(<App />)

    const card = screen.getByRole('article', {
      name: 'Wyze Cam Pan v3',
    })
    const review = screen.getByRole('complementary', {
      name: 'Bundle review',
    })

    await user.click(
      within(review).getByRole('button', {
        name: 'Decrease Wyze Cam Pan v3 quantity',
      }),
    )

    expect(
      within(card).getByRole('status', {
        name: 'Wyze Cam Pan v3 White quantity: 1',
      }),
    ).toHaveTextContent('1')
    expect(screen.getAllByText('$174.89')).toHaveLength(2)
    expect(screen.getAllByText('$220.81')).toHaveLength(2)
  })

  it('restores each variant quantity when the active option changes', async () => {
    const user = userEvent.setup()

    render(<App />)

    const card = screen.getByRole('article', {
      name: 'Wyze Cam v4',
    })
    const review = screen.getByRole('complementary', {
      name: 'Bundle review',
    })
    const colorSelector = within(card).getByRole('radiogroup', {
      name: 'Wyze Cam v4 color',
    })

    await user.click(
      within(colorSelector).getByRole('radio', {
        name: 'Black',
      }),
    )

    expect(
      within(card).getByRole('status', {
        name: 'Wyze Cam v4 Black quantity: 0',
      }),
    ).toHaveTextContent('0')

    await user.click(
      within(card).getByRole('button', {
        name: 'Increase Wyze Cam v4 Black quantity',
      }),
    )

    expect(
      screen.getByText('Wyze Cam v4 (Black)'),
    ).toBeInTheDocument()

    await user.click(
      within(colorSelector).getByRole('radio', {
        name: 'White',
      }),
    )

    expect(
      within(card).getByRole('status', {
        name: 'Wyze Cam v4 White quantity: 1',
      }),
    ).toHaveTextContent('1')
    expect(
      within(review).getByText('Wyze Cam v4'),
    ).toBeInTheDocument()
    expect(
      within(review).getByText('Wyze Cam v4 (Black)'),
    ).toBeInTheDocument()
  })
})
