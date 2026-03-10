import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DiscHerniationTool } from './DiscHerniationTool';

describe('DiscHerniationTool', () => {
  it('renders correctly with initial state', () => {
    render(<DiscHerniationTool />);
    expect(screen.getByText('פתופיזיולוגיה של הדיסק הבין-חולייתי')).toBeInTheDocument();
    expect(screen.getByText(/מצב תקין\. הגרעין/)).toBeInTheDocument();
  });

  it('updates stage on button click', () => {
    render(<DiscHerniationTool />);

    const bulgeButton = screen.getByText('בלט');
    fireEvent.click(bulgeButton);
    expect(screen.getByText(/בלט דיסק \(Bulge\)/)).toBeInTheDocument();

    const extrusionButton = screen.getByText('פריצה');
    fireEvent.click(extrusionButton);
    expect(screen.getByText(/פריצת דיסק \(Herniation\)/)).toBeInTheDocument();
  });
});
