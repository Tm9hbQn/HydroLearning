import React from 'react';
import { render, screen } from '@testing-library/react';
import { DiscHerniationTool } from './DiscHerniationTool';
import { describe, it, expect } from 'vitest';

describe('DiscHerniationTool', () => {
  it('renders correctly and uses the correct colors', () => {
    const { container } = render(<DiscHerniationTool />);

    // Check if the title is rendered (mocked translation returns key)
    expect(screen.getByText('disc_herniation.title')).toBeInTheDocument();

    // Check for vertebra color
    // We can look for the path element with the specific fill color
    const vertebra = container.querySelector('path[fill="#e2e8f0"]');
    expect(vertebra).toBeInTheDocument();

    // Check for annulus color
    // In normal stage (default), annulus is rendered
    const annulus = container.querySelector('path[fill="#94a3b8"]');
    expect(annulus).toBeInTheDocument();

    // Check for nucleus color (normal stage)
    // In normal stage, nucleus is a circle
    const nucleus = container.querySelector('circle[fill="#ef4444"]');
    expect(nucleus).toBeInTheDocument();
  });
});
