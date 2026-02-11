import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { DragForceSim } from './DragForceSim';
import React from 'react';

describe('DragForceSim Performance', () => {
  it('measures render time', () => {
    const start = performance.now();
    const iterations = 1000;

    for (let i = 0; i < iterations; i++) {
      const { unmount } = render(<DragForceSim />);
      unmount();
    }

    const end = performance.now();
    const duration = end - start;
    console.log(`Rendered ${iterations} times in ${duration.toFixed(2)}ms`);
    console.log(`Average render time: ${(duration / iterations).toFixed(4)}ms`);

    // Basic assertion to ensure it's fast enough (arbitrary threshold to prevent timeouts)
    expect(duration).toBeLessThan(10000);
  });
});
