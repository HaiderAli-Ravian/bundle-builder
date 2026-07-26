import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
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

    await user.click(
      screen.getByRole('button', {
        name: 'Next: Choose your plan',
      }),
    )

    expect(camerasHeader).toHaveAttribute('aria-expanded', 'false')
    expect(planHeader).toHaveAttribute('aria-expanded', 'true')
    expect(planHeader).toHaveFocus()
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
})
