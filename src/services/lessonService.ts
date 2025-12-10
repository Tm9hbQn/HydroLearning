import { LessonData } from '../types';

export const fetchLessonData = async (lessonId: string = 'lesson-01'): Promise<LessonData> => {
  // Logic to handle base URL for GitHub Pages
  // If base is set to './', we need to be careful.
  // import.meta.env.BASE_URL is '/' in dev and './' (or configured value) in prod.

  let baseUrl = import.meta.env.BASE_URL;

  // Clean up baseUrl
  if (!baseUrl.endsWith('/')) {
    baseUrl += '/';
  }

  // If baseUrl is './', it works relative to current path.
  // However, on GitHub Pages with HashRouter, the path might not be reliable if we are deep in hash.
  // But fetch is relative to index.html location unless using absolute path.
  // Since we use HashRouter, the browser's "location" for relative fetch is the root URL + path.

  // Safe bet: Construct a path that works.
  // We assume 'data' folder is at the build root.

  const url = `${baseUrl}data/${lessonId}.json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch lesson data: ${response.statusText}`);
    }
    const data = await response.json();
    return data as LessonData;
  } catch (error) {
    console.error("Error loading lesson:", error);
    throw error;
  }
};
