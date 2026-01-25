# Design System

## Philosophy
Clean, clinical, professional, yet engaging. High contrast for accessibility.

## Colors
*   **Primary**: Blue (`blue-600` for actions, `blue-50` for backgrounds).
*   **Secondary**: Slate (`slate-800` for text, `slate-500` for muted text).
*   **Alerts**:
    *   Red (`red-500`): Error, High Pressure, Pathology.
    *   Yellow (`yellow-500`): Warning, Nerves.
    *   Green (`green-500`): Success, Normal state.

## Components

### Card
*   **Container**: `bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden mb-8`.
*   **Header**: `bg-slate-50 p-4 border-b border-slate-100`.
*   **Icon**: Wrapped in `bg-blue-100 rounded-lg text-blue-600`.

### Typography
*   **Headings**: `font-bold text-slate-800`.
*   **Body**: `text-slate-600 leading-relaxed`.
*   **Labels**: `text-xs font-bold text-slate-500`.

### Interaction
*   **Buttons**: Rounded corners, clear hover states.
*   **Sliders**: Custom styled to match the theme (blue track).

## Animations
*   Use `framer-motion` for smooth transitions between states (e.g., morphing SVGs).
*   CSS animations for continuous effects (flow, pulse).
