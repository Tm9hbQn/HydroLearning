# Project Specifications

## Overview
This is an interactive learning platform for "Integrated Rehabilitation Sciences". It visualizes complex biomechanical and physiological concepts.

## Target Audience
Students and professionals in rehabilitation sciences.

## Core Features (v1)

### 1. Pascal's Law Lab (`pascal-lab`)
*   **Goal**: Demonstrate hydrostatic pressure changes with depth.
*   **Mechanics**: Vertical slider controls water level. Visual indicators for pressure (arrows) and venous return (blue arrows inside leg).
*   **Key Concept**: Deeper immersion = higher pressure.

### 2. Drag Force Simulator (`drag-force`)
*   **Goal**: Demonstrate the quadratic relationship between velocity and drag.
*   **Mechanics**: Slider for velocity, toggle for hand shape (Drag Coefficient).
*   **Visuals**: Gauge chart, hand animation.

### 3. Disc Herniation Visualizer (`disc-herniation`)
*   **Goal**: Visualize stages of disc degeneration/herniation.
*   **Mechanics**: Toggle between Top/Side views. Select stage (Normal -> Sequestration).
*   **Visuals**: SVG Morphing/replacement.

### 4. Fracture Mechanics (`fracture-mechanics`)
*   **Goal**: Show how different forces cause specific fracture types.
*   **Mechanics**: Select force type (Torsion, Compression, Tension, Shear). Slider for magnitude.
*   **Visuals**: Bone deformation (CSS transforms), Fracture overlay.

### 5. Fluid Journey (`fluid-journey`)
*   **Goal**: Explain the physiological response to immersion (Immersion Diuresis).
*   **Mechanics**: Step-by-step wizard/slider.
*   **Visuals**: Animated SVG showing blood shift to heart, hormonal changes, and kidney function.

## Technical Specs
*   **Framework**: React 18 + Vite
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **Routing**: React Router DOM
*   **i18n**: i18next (JSON based)
*   **Testing**: Vitest + React Testing Library
