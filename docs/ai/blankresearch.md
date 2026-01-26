# Blank Page Research & Diagnostics

## Overview
The user reports a "blank page" (White Screen of Death) after recent major refactoring. This document outlines the investigation into the codebase configuration, structure, and deployment settings to identify the cause.

## Findings

### 1. Deployment Configuration
- **GitHub Actions**: `.github/workflows/static.yml` correctly installs dependencies (`npm ci`), builds (`npm run build`), and uploads the `dist` artifact.
- **GitHub Pages**: `public/.nojekyll` exists. This is crucial for Vite builds to ensure files starting with `_` (like assets) are not ignored by GitHub Pages' Jekyll processing.
- **Status**: ✅ Correct.

### 2. Vite Configuration
- **Base Path**: `vite.config.ts` sets `base: './'`. This ensures assets use relative paths, making the app compatible with any subdirectory structure (e.g., `username.github.io/repo-name/`).
- **Status**: ✅ Correct.

### 3. Entry Points
- **HTML**: `index.html` contains the `#root` div and correctly points to `/src/main.tsx` as a module.
- **React Root**: `src/main.tsx` correctly mounts the app to `document.getElementById('root')`.
- **Error Handling**: `src/main.tsx` includes an `ErrorBoundary`, which should catch render errors. If the screen is white, the error might be happening *outside* the React tree or before mount, or the ErrorBoundary itself is failing to render its fallback.
- **Status**: ✅ Correct.

### 4. Routing
- **Router**: `src/App.tsx` uses `HashRouter`. This is the recommended approach for GitHub Pages to avoid 404s on refresh (since GH Pages doesn't support SPA fallback routing natively without a hack).
- **Routes**: Currently, only the root route `/` is defined, pointing to `Dashboard`.
- **Status**: ✅ Correct.

### 5. Content & Features
- **Dashboard**: `src/pages/Dashboard.tsx` imports and renders all feature components (`PascalLab`, `DragForceSim`, etc.).
- **Features**: Verified that `src/features/pascal-lab/PascalLab.tsx` and others exist and export components matching the imports.
- **Translations**: `src/lib/i18n.ts` initializes i18next. `src/locales/he.json` exists and contains valid JSON.
- **Status**: ✅ Appears valid.

## Hypotheses for the "Blank Page"
1.  **Caching**: The browser might be serving an old version of `index.html` that points to non-existent JS chunks.
2.  **Runtime Crash**: A silent runtime error (e.g., missing prop, undefined variable) might be occurring before the `ErrorBoundary` can catch it, or effectively "blanking" the content.
3.  **Deployment Path**: While `base: './'` is correct, visiting the URL without a trailing slash (rarely) might cause issues if the server doesn't redirect, but GitHub Pages usually handles this.

## Action Plan
To resolve and diagnose:
1.  **Test Page**: Create `public/test.html` to confirm the server is reachable and serving static files.
2.  **Diagnostic Route**: Add `/test` route to `App.tsx` to confirm React Router is functioning.
3.  **Logging**: Add `console.log` in `main.tsx` and `Dashboard.tsx` to trace the mounting process in the browser console.
