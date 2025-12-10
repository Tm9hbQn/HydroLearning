import { create } from 'zustand';
import { LessonData } from '../types';

interface LessonStore {
  lessonData: LessonData | null;
  activeSectionId: string;
  isLoading: boolean;
  error: string | null;
  setLessonData: (data: LessonData) => void;
  setActiveSectionId: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useLessonStore = create<LessonStore>((set) => ({
  lessonData: null,
  activeSectionId: '',
  isLoading: false,
  error: null,
  setLessonData: (data) => set({ lessonData: data }),
  setActiveSectionId: (id) => set({ activeSectionId: id }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  reset: () => set({ lessonData: null, activeSectionId: '', isLoading: false, error: null }),
}));
