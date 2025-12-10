import { describe, it, expect, beforeEach } from 'vitest';
import { useLessonStore } from './useLessonStore';

describe('useLessonStore', () => {
  beforeEach(() => {
    useLessonStore.getState().reset();
  });

  it('should have initial state', () => {
    const state = useLessonStore.getState();
    expect(state.lessonData).toBeNull();
    expect(state.activeSectionId).toBe('');
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should set lesson data', () => {
    const mockData: any = { id: 'test', sections: [] };
    useLessonStore.getState().setLessonData(mockData);
    expect(useLessonStore.getState().lessonData).toEqual(mockData);
  });

  it('should set active section id', () => {
    useLessonStore.getState().setActiveSectionId('section-1');
    expect(useLessonStore.getState().activeSectionId).toBe('section-1');
  });

  it('should set loading state', () => {
    useLessonStore.getState().setLoading(true);
    expect(useLessonStore.getState().isLoading).toBe(true);
  });

  it('should set error state', () => {
    useLessonStore.getState().setError('Something went wrong');
    expect(useLessonStore.getState().error).toBe('Something went wrong');
  });
});
