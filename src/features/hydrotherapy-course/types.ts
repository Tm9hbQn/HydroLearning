export interface KeyTerm {
  he: string;
  en: string;
}

export interface FormulaVariable {
  symbol: string;
  description: string;
}

export interface ListItem {
  text: string;
  title?: string;
}

export type ContentBlockType =
  | 'text'
  | 'definition'
  | 'formula'
  | 'clinical_analysis'
  | 'clinical_application'
  | 'clinical_example'
  | 'clinical_implication'
  | 'enrichment'
  | 'warning'
  | 'list'
  | 'table'
  | 'protocol';

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  text: string;
  title?: string;
  keyTerms?: KeyTerm[];
  ordered?: boolean;
  items?: ListItem[];
  headers?: string[];
  rows?: string[][];
  variables?: FormulaVariable[];
}

export interface Subtopic {
  id: string;
  subtopicNumber: string;
  title: string;
  englishTitle: string;
  content: ContentBlock[];
}

export interface Topic {
  id: string;
  topicNumber: number;
  title: string;
  englishTitle: string;
  introduction: string | null;
  subtopics: Subtopic[];
  content?: ContentBlock[];
}

export interface Unit {
  id: string;
  unitNumber: number;
  title: string;
  englishTitle: string;
  introduction: string | null;
  topics: Topic[];
}

export interface IntroSection {
  id: string;
  title: string;
  content: ContentBlock[];
}

export interface Reference {
  id: number;
  text: string;
  url: string;
}

export interface HydrotherapyCourseData {
  courseId: string;
  title: string;
  englishTitle: string;
  version: string;
  lastUpdated: string;
  introduction: IntroSection;
  units: Unit[];
  summary: string | null;
  references: Reference[];
}
