import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DiscHerniationTool } from './DiscHerniationTool';

describe('DiscHerniationTool', () => {
  it('renders correctly with initial state', () => {
    render(<DiscHerniationTool />);
    // Check for title
    expect(screen.getByText('disc_herniation.title')).toBeInTheDocument();
    // Check for initial stage description (normal)
    expect(screen.getByText('disc_herniation.stage_descriptions.normal')).toBeInTheDocument();
  });

  it('updates stage on button click', () => {
    render(<DiscHerniationTool />);

    // Find and click the 'bulge' button
    // The button text is translated using key `disc_herniation.stages.bulge`
    const bulgeButton = screen.getByText('disc_herniation.stages.bulge');
    fireEvent.click(bulgeButton);

    // Verify stage description updates
    expect(screen.getByText('disc_herniation.stage_descriptions.bulge')).toBeInTheDocument();

    // Find and click the 'extrusion' button
    const extrusionButton = screen.getByText('disc_herniation.stages.extrusion');
    fireEvent.click(extrusionButton);

    // Verify stage description updates
    expect(screen.getByText('disc_herniation.stage_descriptions.extrusion')).toBeInTheDocument();
  });
});
