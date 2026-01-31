# Current State Analysis

## 1. Repository Structure Map
The project follows a **Feature-Based Architecture**, where distinct functional units are contained within `src/features`.

```
src/
├── features/               # Core Logic & Visualizations
│   ├── disc-herniation/    # Disc pathology visualization
│   ├── drag-force/         # Hydrodynamic drag simulation
│   ├── fluid-journey/      # Step-by-step physiological animation
│   ├── fracture-mechanics/ # Bone fracture simulation
│   └── pascal-lab/         # Hydrostatic pressure visualization
├── components/
│   └── ui/                 # Atomic UI (Card, Slider, Button)
├── pages/
│   └── Dashboard.tsx       # Main entry point (currently renders all features)
├── locales/
│   └── he.json             # Hebrew translation strings
└── lib/                    # Utilities (i18n, utils)
```

## 2. Content Audit: Hardcoded vs. Dynamic
*   **Text Content:** mostly **Dynamic**. The project uses `i18next`. Strings for titles, descriptions, and instructions are externalized in `src/locales/he.json`.
*   **Pedagogical Logic:** **Hardcoded**. The "lessons" are implicit in the component logic. For example, `PascalLab` calculates pressure based on a hardcoded loop of landmarks (`ankles`, `knees`, etc.) inside the component. There is no external definition of "what constitutes the lesson".
*   **Visual Logic:** **Hardcoded**. SVGs and animations are defined directly within the TSX files.
*   **Flow:** **Hardcoded**. `Dashboard.tsx` manually imports and renders each feature in a specific order.

## 3. Visualization Tools Inventory
| Feature | Libraries/Technique | Complexity | Purpose |
| :--- | :--- | :--- | :--- |
| **PascalLab** | Native SVG, React State | Medium | Dynamic SVG manipulation based on slider input. |
| **DragForceSim** | `chart.js`, `react-chartjs-2` | Medium | Real-time graphing of quadratic functions. |
| **FluidJourney** | Native CSS/SVG, `framer-motion` (inferred) | Low/Medium | Step-by-step state visualization. |
| **FractureMechanics** | Native SVG, React State | High | Complex grid distortion and failure point logic. |
| **DiscHerniation** | Native SVG (Switchable views) | Low | Static image switching based on state. |

**Key Libraries:**
*   `framer-motion`: For animations.
*   `chart.js`: For graphing data.
*   `lucide-react`: For icons.
*   `tailwind-merge` & `clsx`: For dynamic styling.

## 4. UX/UI Critique
*   **Navigation:** Non-existent. It's a single scrolling page. No "Course" feel.
*   **Progression:** No tracking of what the user has learned or completed.
*   **Context:** Features are isolated. There is no theoretical "glue" connecting the `PascalLab` to clinical applications of hydrostatic pressure beyond brief descriptions.
*   **Responsiveness:** Seems mobile-friendly (Tailwind), but complex SVGs might need specific attention on small screens.
*   **Accessibility:** Relies heavily on visual change. Needs screen-reader descriptions for dynamic values (e.g., "Pressure is now X Pa").
