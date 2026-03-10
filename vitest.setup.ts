import '@testing-library/jest-dom';
import { vi } from 'vitest';
import he from './src/locales/he.json';

// Resolve a nested key like "back_muscle_guide.card_sections.chronic_badge"
function resolveKey(key: string, options?: Record<string, unknown>): unknown {
  const parts = key.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result: any = he;
  for (const part of parts) {
    if (result == null || typeof result !== 'object') return key;
    result = result[part];
  }
  if (result == null) return key;

  // Handle returnObjects option — return the raw object/array
  if (options?.returnObjects && typeof result === 'object') {
    return result;
  }

  // Handle interpolation: {{count}}, {{current}}, etc.
  if (typeof result === 'string' && options) {
    return result.replace(/\{\{(\w+)\}\}/g, (_match, varName) =>
      options[varName] != null ? String(options[varName]) : `{{${varName}}}`
    );
  }

  return result;
}

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, unknown>) => resolveKey(key, options),
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
}));

// ── Browser API stubs not available in jsdom ─────────────────

// IntersectionObserver — must be a real class so `new` works
class MockIntersectionObserver {
  observe    = vi.fn();
  unobserve  = vi.fn();
  disconnect = vi.fn();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(_cb: IntersectionObserverCallback, _opts?: IntersectionObserverInit) {}
}
global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

// scrollIntoView (used by quick-jump chips & nav scroll)
window.HTMLElement.prototype.scrollIntoView = vi.fn();
