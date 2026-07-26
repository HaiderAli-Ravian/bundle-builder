# Bundle Builder

Responsive React implementation of the EcomExperts bundle-builder take-home assignment.

The interface follows the supplied mobile, standard-desktop, and wide-desktop
Figma compositions. Shoppers can configure products and variants, review the
bundle, see derived pricing, and explicitly save the configuration for a later
visit.

## Links

- [Live demo](https://bundle-builder-ecru.vercel.app/)
- [GitHub repository](https://github.com/HaiderAli-Ravian/bundle-builder)

## Requirements

- Node.js `^20.19.0` or `>=22.12.0`
- npm

No backend, environment variables, or external services are required.

## Run locally

```bash
git clone https://github.com/HaiderAli-Ravian/bundle-builder.git
cd bundle-builder
npm ci
npm run dev
```

Vite prints the local development URL after startup.

## Verification

```bash
npm run lint
npm run test
npm run build
npm run preview
```

`npm run preview` serves the production build locally after `npm run build`.

## Available scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run lint` | Run ESLint across the repository |
| `npm run test` | Run the Vitest suite once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run build` | Type-check and create the production build |
| `npm run preview` | Preview the production build |

## Core behavior

- Four-step accessible accordion with the first step open initially.
- Next controls move through the written step order and transfer focus to the
  newly opened step.
- Quantities are independent for every product-and-variant combination.
- Switching variants does not modify quantities stored for inactive variants.
- Selected counters count distinct base products rather than units or variants.
- Product cards and review lines update through the same store actions.
- Every variant with a positive quantity becomes its own review line.
- Prices, compare-at totals, shipping, and savings are calculated from the
  current review lines using integer cents.
- Save is explicit rather than automatic. A saved configuration is restored
  after reload; unsaved changes are not persisted.
- Checkout and Learn More use accessible placeholder dialogs because payment
  and product-detail destinations are outside the assignment scope.

## Architecture

The project uses React, TypeScript, Vite, React Compiler, Tailwind CSS v4, and
Zustand.

Static catalog data and the seeded configuration live separately under
`src/data`. Runtime state stores the open accordion step, active variants, and
quantities keyed by `productId:variantId`. Review lines, selected counts, and
pricing summaries are selectors rather than duplicated state.

Zustand provides a small shared store for the builder and review panel without
the additional structure of a larger state-management framework. Versioned
`localStorage` persistence validates saved product and variant identifiers
against the current catalog before restoration.

The component structure is organized by responsibility:

```text
src/
├── components/
│   ├── bundle/    Accordion and builder composition
│   ├── product/   Product cards, variants, prices, and steppers
│   └── review/    Review groups, order summary, shipping, and actions
├── data/          Catalog, seed configuration, assets, and validation
├── domain/        Shared types, currency, and pricing rules
└── store/         Zustand state, selectors, and persistence
```

## Responsive design

The implementation preserves the three supplied compositions:

- Mobile uses a single-column accordion followed by the review panel.
- Standard desktop uses a builder and review-panel column layout.
- Wide desktop expands the product grid to five columns and places the review
  section below the builder in its wide composition.

Intermediate widths use implementation breakpoints chosen to transition
between those supplied frames without horizontal overflow.

## Accessibility

- Native buttons are used for accordion, quantity, Save, Checkout, and dialog
  actions.
- Accordion headers expose `aria-expanded` and `aria-controls`.
- Variant choices use radio semantics and keyboard arrow-key navigation.
- Quantity controls have contextual accessible names and valid disabled states.
- Focus is transferred during Next navigation and restored when dialogs close.
- Save and Checkout feedback is announced through live status messaging.
- Visible focus styles, reduced-motion handling, useful image alternative text,
  and touch-friendly targets are included.

## Testing

The focused Vitest and Testing Library suite covers:

- Independent quantities for product variants.
- Active-variant switching.
- Bidirectional card and review-panel synchronization.
- Distinct-product selected counters.
- Review-line generation and ordering.
- Pricing and savings calculations.
- Minimum and zero-quantity behavior.
- Accordion navigation and focus movement.
- Explicit save, restoration, and corrupt-storage fallback.
- Checkout and product-details placeholder interactions.

## Design decisions and limitations

- Product-card unit prices are the canonical pricing source. The total shown in
  the supplied Figma review is illustrative and does not reconcile with those
  unit prices, so runtime totals are calculated from the catalog.
- The required hub keeps its minimum quantity while remaining connected to the
  shared stepper behavior.
- The plan is fixed and not quantity-editable, matching the supplied states.
- Original Figma SVG exports are retained to avoid degrading the embedded
  product imagery.
- The supplied design names Gilroy and TT Norms Pro, but their licensed font
  files were not included. The CSS preserves those family hooks and uses
  explicit system fallbacks.

## Design source

[Frontend Test Figma](https://www.figma.com/design/JYf61etQVqeseX7oY5alGz/Frontend-Test-Figma)
