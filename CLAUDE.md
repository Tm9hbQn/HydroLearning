# CLAUDE.md — HydroLearning Project Guide

## Project Overview

HydroLearning is an interactive learning platform for Integrated Rehabilitation Sciences. It visualizes biomechanical and physiological concepts (Pascal's Law, drag force, disc herniation, fracture mechanics, fluid journey) and includes a **Back Muscle Anatomy Guide** as the main landing page.

- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS + custom CSS (BEM for BackMuscleGuide)
- **Routing**: `react-router-dom` (HashRouter for GitHub Pages compatibility)
- **State**: Local React state (`useState`, `useRef`, `useMemo`)
- **Testing**: Vitest (unit/component) + Playwright (E2E)
- **Deployment**: GitHub Pages via GitHub Actions (`static.yml`)

## Architecture

```
src/
├── features/           # Feature-based modules (each feature is self-contained)
│   ├── back-anatomy/   # BackMuscleGuide data, CSS, and tests
│   ├── disc-herniation/
│   ├── pascal-lab/
│   ├── drag-force/
│   ├── fluid-journey/
│   └── fracture-mechanics/
├── pages/              # Page-level components (compose features)
├── components/ui/      # Shared reusable UI components (Button, Card, Slider)
├── layouts/            # Layout wrappers
├── locales/            # i18n JSON files (Hebrew)
├── lib/                # Shared utilities (utils.ts, i18n.ts)
├── App.tsx             # Router + route definitions
├── main.tsx            # Entry point
└── worker.ts           # Dummy Cloudflare worker (not used for serving)
```

## Commands

```bash
npm run dev       # Start dev server
npm run build     # TypeScript check + Vite production build
npm run lint      # ESLint with zero warnings policy
npm test          # Vitest (watch mode)
npm test -- --run # Vitest single run (CI mode)
npx tsc --noEmit  # TypeScript type-check only
```

## CI Pipeline

Two GitHub Actions workflows:

1. **`ci.yml`** — Runs on push (non-main) and PRs to main/master:
   - Lint & type-check → Vitest → Vite build → Playwright E2E

2. **`static.yml`** — Runs on push to main:
   - Lint & type-check → Vitest → Build & deploy to GitHub Pages

## Critical Rules

1. **No `any` types** — ESLint enforces `@typescript-eslint/recommended`. Use proper types.
2. **No unused variables** — TSConfig has `noUnusedParameters: true`; ESLint catches unused locals. Prefix with `_` only in function signatures where the parameter is required by an interface but not used.
3. **Zero lint warnings** — `--max-warnings 0` is enforced in CI.
4. **Test files are excluded from tsc** — See `tsconfig.json` `exclude` array. Tests run via Vitest with its own TS handling.
5. **Don't break the build** — Always run `npx tsc --noEmit && npm run lint && npm test -- --run` before pushing.
6. **Feature-based architecture** — New features go in `src/features/<name>/`. Don't dump code in generic folders.
7. **Hebrew content** — The BackMuscleGuide uses inline Hebrew (pedagogical content). Other features should use `src/locales/he.json` via `react-i18next`.
8. **GitHub Pages base path** — `vite.config.ts` uses `base: './'` for relative asset paths.

## Back Muscle Anatomy Guide

The main landing page (`/` route). Key files:

- `src/pages/BackMuscleGuide.tsx` — Full page component with MuscleCard, ImageSlide, StretchCard sub-components
- `src/features/back-anatomy/muscleData.ts` — Single source of truth for all muscle data, types, layer metadata, and helper functions
- `src/features/back-anatomy/BackMuscleGuide.css` — BEM-style custom CSS
- `src/features/back-anatomy/BackMuscleGuide.test.tsx` — 46 component tests
- `src/features/back-anatomy/muscleData.test.ts` — 24 data integrity + helper function tests

**To add a new muscle**: Add an entry to `musclesData` array in `muscleData.ts`. The UI (nav, sections, quick-jump chips) renders automatically.

## Testing Notes

- `vitest.setup.ts` mocks `react-i18next`, `IntersectionObserver`, and `scrollIntoView`
- Tests use `@testing-library/react` with `jsdom` environment
- Playwright E2E tests are in `e2e/` and excluded from Vitest

## Documentation

- `AGENTS.md` — AI agent instructions (points to `docs/ai/`)
- `docs/ai/RULES.md` — Coding standards and architectural guidelines
- `docs/ai/SPECS.md` — Feature specifications
- `docs/ai/DESIGN_SYSTEM.md` — UI/UX guidelines
- `docs/ai/CHANGELOG.md` — Change history
