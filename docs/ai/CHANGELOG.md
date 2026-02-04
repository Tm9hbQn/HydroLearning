# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
### Fixes
- **PascalLab**: Scaled human visualization height to ~1.8m (was visually ~2.2m) to maintain realistic proportions within the 2m water container.
- **PascalLab**: Reverted water level gauge maximum to 2 meters. Fixed z-index layering to ensure the current level gauge is always visible on top.
- **FractureMechanics**: Removed redundant "(0-100)" text from force gauge label. Removed the right-side arrow in "Shear" mode to declutter the visualization.
- **FluidJourney**: Increased font sizes for better readability. adjusted zoom level for the Heart step (Step 3) to improve focus. Enhanced visualization of venous return to the heart with clearer paths and labels.
- **Deployment Diagnosis**: Identified GitHub Pages "Source" setting as the root cause of blank page/404 issues. Created `docs/ai/deployment_fix.md` with instructions.
- **Verification**: Verified `public/test.html` and `public/.nojekyll` are correctly included in the build artifact.
- **Debugging**: Added console version log to `App.tsx` to verify successful deployment.
- **Restoration**: Reconstructed `index.html` with correct Hebrew configuration (`lang="he"`, `dir="rtl"`), Google Fonts (Assistant, Frank Ruhl Libre), and Vite entry point.
- **Deployment**: Added `public/.nojekyll` to ensure correct asset serving on GitHub Pages.
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
