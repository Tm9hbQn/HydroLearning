# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
### Fixes
- **Routing**: Switched from `BrowserRouter` to `HashRouter` to support GitHub Pages subdirectory hosting.
- **Cleanup**: Removed unused `Chart.html` and `wrangler.json` files.

## [0.1.0] - 2024-05-23 (Initial Rebuild)
### Architecture
- **Complete Rebuild**: Deleted old `src` and established a Feature-Based Architecture (`src/features/...`).
- **AI Context System**: Created `docs/ai/` with `AGENTS.md`, `RULES.md`, `SPECS.md`, `DESIGN_SYSTEM.md`.
- **Localization**: Implemented `i18next` with Hebrew support (`src/locales/he.json`).
- **Routing**: Added `react-router-dom` with a basic Dashboard layout.
- **Testing**: Configured `vitest` and `react-testing-library`.

### Components
- **UI Library**: Created `Card`, `Slider`, `Button` components in `src/components/ui`.
- **Layout**: Created `Layout` component with persistent header and footer.

### Features
- **PascalLab**: Re-implemented with reusable components and extracted text.
- **DragForceSim**: Re-implemented with horizontal slider and reusable components.
- **DiscHerniation**: Re-implemented state logic and SVG rendering.
- **FractureMechanics**: Re-implemented force logic and visualizations.
- **FluidJourney**: Re-implemented step-based animation and logic.

### Testing
- Added unit tests for `Card` component.
- Added integration tests for `PascalLab` feature.
