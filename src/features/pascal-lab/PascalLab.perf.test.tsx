import { render, fireEvent, screen } from '@testing-library/react';
import { PascalLab } from './PascalLab';
import React from 'react';
import { test } from 'vitest';

test('PascalLab performance benchmark', () => {
  render(<PascalLab />);
  const slider = screen.getByRole('slider');

  const start = performance.now();
  for (let i = 0; i < 2000; i++) {
    // Alternate values to force re-renders
    const value = (i % 200) / 100; // 0 to 1.99
    fireEvent.change(slider, { target: { value: value.toString() } });
  }
  const end = performance.now();
  console.log(`BENCHMARK_DURATION: ${end - start}ms`);
});
