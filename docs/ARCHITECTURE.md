# Architectural Blueprint

## 1. High-Level Concept
Transition from a **Page-Based** demo to a **JSON-Driven** Learning Management System. The application will consume a structured "Course Manifest" and dynamically render learning units composed of atomic blocks.

## 2. Data Schema (TypeScript Interfaces)
The core of the system is the content structure.

```typescript
// types/course.ts

export type BlockType = 'text' | 'image' | 'video' | 'tool' | 'pearl' | 'quiz';

export interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  content: string; // Markdown supported
}

export interface ToolBlock extends BaseBlock {
  type: 'tool';
  toolId: string; // e.g., 'pascal-lab'
  defaultState?: Record<string, any>; // e.g., { waterLevel: 1.2 }
}

export interface PearlBlock extends BaseBlock {
  type: 'pearl';
  title: string;
  content: string;
  variant: 'info' | 'warning' | 'tip';
}

export type CourseBlock = TextBlock | ToolBlock | PearlBlock;

export interface Unit {
  id: string;
  title: string;
  blocks: CourseBlock[];
}

export interface Module {
  id: string;
  title: string;
  units: Unit[];
}

export interface Course {
  id: string;
  title: string;
  modules: Module[];
}
```

## 3. Component Architecture

### A. The "Renderer" Pattern
Instead of hardcoding pages, a generic renderer builds the UI from the JSON.

```tsx
// components/course/BlockRenderer.tsx
import { ToolRegistry } from './ToolRegistry';

export const BlockRenderer = ({ block }: { block: CourseBlock }) => {
  switch (block.type) {
    case 'text':
      return <MarkdownViewer content={block.content} />;
    case 'pearl':
      return <ClinicalPearl title={block.title} content={block.content} />;
    case 'tool':
      const ToolComponent = ToolRegistry[block.toolId];
      return <ToolComponent initialState={block.defaultState} />;
    default:
      return null;
  }
};
```

### B. The Tool Registry
A central map connecting JSON strings to actual React components.

```tsx
// components/course/ToolRegistry.tsx
import { PascalLab } from '../../features/pascal-lab/PascalLab';
import { DragForceSim } from '../../features/drag-force/DragForceSim';

export const ToolRegistry = {
  'pascal-lab': PascalLab,
  'drag-force': DragForceSim,
  // ... others
};
```

## 4. State Management (Zustand)
We need to track user progress and, optionally, synchronize text scrolling with tool states (Scrollytelling).

```typescript
// store/useCourseStore.ts
import { create } from 'zustand';

interface CourseState {
  currentModuleId: string | null;
  currentUnitId: string | null;
  completedUnits: string[]; // IDs of completed units

  // Actions
  completeUnit: (unitId: string) => void;
  navigateTo: (moduleId: string, unitId: string) => void;
}

export const useCourseStore = create<CourseState>((set) => ({
  currentModuleId: null,
  currentUnitId: null,
  completedUnits: [],
  completeUnit: (id) => set((state) => ({ completedUnits: [...state.completedUnits, id] })),
  navigateTo: (modId, unitId) => set({ currentModuleId: modId, currentUnitId: unitId }),
}));
```

## 5. Proposed Folder Structure
Refactoring the current structure to support the new architecture:

```
src/
├── data/
│   └── course-content.json   # The Source of Truth
├── types/
│   └── course.ts             # TS Definitions
├── features/                 # Existing tools (Keep as is, but treat as "Tools")
│   ├── pascal-lab/
│   └── ...
├── components/
│   ├── course/               # LMS specific components
│   │   ├── BlockRenderer.tsx
│   │   ├── UnitRenderer.tsx
│   │   ├── ToolRegistry.tsx
│   │   └── Navigation.tsx
│   └── ui/                   # Shared UI (Cards, Buttons)
├── layouts/
│   └── CourseLayout.tsx      # Sidebar + Content Area
└── store/
    └── useCourseStore.ts
```

## 6. Implementation Strategy
1.  **Extract Content:** Move text from `he.json` and components into `data/course-content.json`.
2.  **Refactor Features:** Modify existing features (PascalLab, etc.) to accept `props` for their internal state (so the Block system can control them if needed).
3.  **Build Shell:** Create `CourseLayout` and `Navigation`.
4.  **Connect:** Implement `BlockRenderer` to load the tools.
