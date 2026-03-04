/**
 * Unit tests for muscleData.ts
 * Covers: data integrity, helper functions, LAYER_META coverage.
 */
import { describe, it, expect } from 'vitest';
import {
  musclesData,
  LAYER_META,
  getUniqueLayers,
  groupByLayer,
  type MuscleData,
} from './muscleData';

// ── Data integrity ────────────────────────────────────────────

describe('musclesData — data integrity', () => {
  it('contains at least 2 muscles', () => {
    expect(musclesData.length).toBeGreaterThanOrEqual(2);
  });

  it('each muscle has required non-empty string fields', () => {
    const stringFields: (keyof MuscleData)[] = [
      'id', 'name', 'latinName', 'layer', 'layerId',
      'description', 'location', 'actions', 'activation', 'contracted_position',
    ];
    for (const muscle of musclesData) {
      for (const field of stringFields) {
        const value = muscle[field];
        expect(typeof value, `${muscle.id}.${field} should be string`).toBe('string');
        expect((value as string).trim().length, `${muscle.id}.${field} should not be empty`)
          .toBeGreaterThan(0);
      }
    }
  });

  it('every muscle id is unique', () => {
    const ids = musclesData.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('isChronic is a boolean on every muscle', () => {
    for (const muscle of musclesData) {
      expect(typeof muscle.isChronic).toBe('boolean');
    }
  });

  it('each muscle has all three image paths', () => {
    for (const muscle of musclesData) {
      expect(muscle.images.regular_back, `${muscle.id}: regular_back`).toBeTruthy();
      expect(muscle.images.anatomical_cut, `${muscle.id}: anatomical_cut`).toBeTruthy();
      expect(muscle.images.stretch, `${muscle.id}: stretch`).toBeTruthy();
    }
  });

  it('stretch_basic has a title, steps (≥3), and duration', () => {
    for (const muscle of musclesData) {
      const sb = muscle.stretch_basic;
      expect(sb.title.trim()).not.toBe('');
      expect(sb.steps.length).toBeGreaterThanOrEqual(3);
      expect(sb.duration.trim()).not.toBe('');
    }
  });

  it('stretch_basic steps are all non-empty strings', () => {
    for (const muscle of musclesData) {
      for (const step of muscle.stretch_basic.steps) {
        expect(step.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('stretch_variants has between 2 and 4 entries per muscle', () => {
    for (const muscle of musclesData) {
      expect(muscle.stretch_variants.length, `${muscle.id} variants`)
        .toBeGreaterThanOrEqual(2);
      expect(muscle.stretch_variants.length, `${muscle.id} variants`)
        .toBeLessThanOrEqual(4);
    }
  });

  it('every variant has a title, steps (≥2), and duration', () => {
    for (const muscle of musclesData) {
      for (const variant of muscle.stretch_variants) {
        expect(variant.title.trim()).not.toBe('');
        expect(variant.steps.length).toBeGreaterThanOrEqual(2);
        expect(variant.duration.trim()).not.toBe('');
      }
    }
  });

  it('every muscle layer is covered by LAYER_META', () => {
    for (const muscle of musclesData) {
      expect(
        LAYER_META[muscle.layer],
        `No LAYER_META entry for layer "${muscle.layer}" used by muscle "${muscle.id}"`,
      ).toBeDefined();
    }
  });
});

// ── Specific muscles ──────────────────────────────────────────

describe('musclesData — specific muscles', () => {
  it('trapezius exists with correct properties', () => {
    const trap = musclesData.find((m) => m.id === 'trapezius');
    expect(trap).toBeDefined();
    expect(trap!.name).toBe('טרפז');
    expect(trap!.latinName).toBe('Trapezius');
    expect(trap!.layer).toBe('שטחית');
    expect(trap!.layerId).toBe('superficial');
    expect(trap!.isChronic).toBe(true);
  });

  it('erector-spinae exists with correct properties', () => {
    const erector = musclesData.find((m) => m.id === 'erector-spinae');
    expect(erector).toBeDefined();
    expect(erector!.name).toBe('זוקפי הגב');
    expect(erector!.latinName).toBe('Erector Spinae');
    expect(erector!.layer).toBe('עמוקה');
    expect(erector!.layerId).toBe('deep');
    expect(erector!.isChronic).toBe(true);
  });

  it('both sample muscles are isChronic (triggers warning section in UI)', () => {
    const chronicMuscles = musclesData.filter((m) => m.isChronic);
    expect(chronicMuscles.length).toBeGreaterThanOrEqual(2);
  });
});

// ── LAYER_META ────────────────────────────────────────────────

describe('LAYER_META', () => {
  it('covers שטחית, אמצעית, and עמוקה', () => {
    expect(LAYER_META['שטחית']).toBeDefined();
    expect(LAYER_META['אמצעית']).toBeDefined();
    expect(LAYER_META['עמוקה']).toBeDefined();
  });

  it('each entry has id, displayName, icon, and colorHex', () => {
    for (const [key, meta] of Object.entries(LAYER_META)) {
      expect(meta.id.trim(), `${key}.id`).not.toBe('');
      expect(meta.displayName.trim(), `${key}.displayName`).not.toBe('');
      expect(meta.icon.trim(), `${key}.icon`).not.toBe('');
      expect(meta.colorHex, `${key}.colorHex`).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });
});

// ── getUniqueLayers ───────────────────────────────────────────

describe('getUniqueLayers', () => {
  it('returns only unique layer names', () => {
    const layers = getUniqueLayers(musclesData);
    expect(new Set(layers).size).toBe(layers.length);
  });

  it('returns one entry per layer present in musclesData', () => {
    const layers = getUniqueLayers(musclesData);
    const allLayers = musclesData.map((m) => m.layer);
    const expected = [...new Set(allLayers)];
    // Same set of layers (order may differ from expected but must be same values)
    expect(layers.sort()).toEqual(expected.sort());
  });

  it('preserves first-appearance order', () => {
    const testData = [
      { ...musclesData[0], layer: 'B', id: 'm1' },
      { ...musclesData[0], layer: 'A', id: 'm2' },
      { ...musclesData[0], layer: 'B', id: 'm3' }, // duplicate — should be skipped
    ] as MuscleData[];
    expect(getUniqueLayers(testData)).toEqual(['B', 'A']);
  });

  it('returns an empty array for empty input', () => {
    expect(getUniqueLayers([])).toEqual([]);
  });
});

// ── groupByLayer ──────────────────────────────────────────────

describe('groupByLayer', () => {
  it('returns an empty object for empty input', () => {
    expect(groupByLayer([])).toEqual({});
  });

  it('groups every muscle under its layer key', () => {
    const grouped = groupByLayer(musclesData);
    for (const muscle of musclesData) {
      expect(grouped[muscle.layer]).toContain(muscle);
    }
  });

  it('trapezius appears only in the שטחית group', () => {
    const grouped = groupByLayer(musclesData);
    const trap = musclesData.find((m) => m.id === 'trapezius')!;
    expect(grouped['שטחית']).toContain(trap);
    // Should NOT appear in other groups
    for (const [layer, muscles] of Object.entries(grouped)) {
      if (layer !== 'שטחית') {
        expect(muscles).not.toContain(trap);
      }
    }
  });

  it('erector-spinae appears only in the עמוקה group', () => {
    const grouped = groupByLayer(musclesData);
    const erector = musclesData.find((m) => m.id === 'erector-spinae')!;
    expect(grouped['עמוקה']).toContain(erector);
    for (const [layer, muscles] of Object.entries(grouped)) {
      if (layer !== 'עמוקה') {
        expect(muscles).not.toContain(erector);
      }
    }
  });

  it('total muscles across all groups equals musclesData.length', () => {
    const grouped = groupByLayer(musclesData);
    const total = Object.values(grouped).reduce((sum, arr) => sum + arr.length, 0);
    expect(total).toBe(musclesData.length);
  });
});
