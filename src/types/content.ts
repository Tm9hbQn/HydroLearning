export interface DesignSystem {
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
}

export type BlockType = 'text' | 'image' | 'video' | 'simulation_fracture' | 'interactive_slider';

export interface ContentBlock {
  id: string;
  type: BlockType;
  // Content can be a string (text, url) or object depending on usage,
  // but simpler to keep 'content' as string/HTML and 'props' for configuration.
  content?: string;
  props?: Record<string, any>;
  title?: string;
}

export interface Unit {
  id: string;
  title: string;
  blocks: ContentBlock[];
}

export interface Module {
  id: string;
  title: string;
  units: Unit[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  design_system?: DesignSystem;
  modules: Module[];
}
