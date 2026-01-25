# Project Rules & Guidelines

## Architecture
*   **Feature-Based**: Everything related to a specific feature (components, hooks, utils, assets) goes into `src/features/[feature-name]`.
*   **Shared UI**: Generic, reusable components (Buttons, Cards, Inputs) go into `src/components/ui`.
*   **State Management**: Use local state (`useState`, `useReducer`) for isolated features. Use Context or Zustand only for global app state (user session, theme).
*   **Routing**: Use `react-router-dom`. Define routes in `App.tsx` or a dedicated route config.

## Coding Standards
*   **TypeScript**: Use strict typing. Avoid `any`. Define interfaces for all props.
*   **Functional Components**: Use React functional components with hooks.
*   **Tailwind CSS**: Use Tailwind for styling. Use `clsx` and `tailwind-merge` for conditional class names.
*   **Internationalization**: All user-facing text must be extracted to `src/locales/he.json` (or other languages). Use the `useTranslation` hook.

## Do's
*   DO create small, single-purpose components.
*   DO write tests for new features.
*   DO use the `Layout` component for page structure.
*   DO check `docs/ai/DESIGN_SYSTEM.md` before creating new UI elements.

## Don'ts
*   DON'T hardcode Hebrew text in components.
*   DON'T modify build artifacts (dist, build).
*   DON'T ignore linting errors.
*   DON'T leave unused imports.
