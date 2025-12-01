export interface LessonData {
  id: string;
  title: string;
  description?: string;
  sections: Section[];
}

export interface Section {
  id: string;
  title: string;
  components: ComponentModel[];
}

export type ComponentModel =
  | { type: 'text-block'; content: string; title?: string; style?: 'standard' | 'warning' }
  | { type: 'info-card-grid'; columns: number; items: CardItem[] }
  | { type: 'calculator'; mode: 'buoyancy'; title: string; labels: any }
  | { type: 'temp-slider'; min: number; max: number; default: number }
  | { type: 'safety-grid'; items: SafetyItem[] }
  | { type: 'process-steps'; steps: {title: string; description: string}[] }
  | { type: 'pain-cycle-diagram'; title: string; description: string };

export interface CardItem { title: string; content: string; borderColor?: string; icon?: string; }
export interface SafetyItem { title: string; type: 'absolute' | 'relative'; desc: string; }
