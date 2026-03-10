import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PascalLab } from './PascalLab';
import React from 'react';

describe('PascalLab', () => {
  it('renders correctly', () => {
    render(<PascalLab />);
    expect(screen.getByText('חוק פסקל ומפל הלחצים')).toBeInTheDocument();
  });

  it('updates water level on slider change', () => {
    render(<PascalLab />);
    const slider = screen.getByRole('slider');

    expect(slider).toHaveValue('0');
    expect(screen.getByText('0.00m')).toBeInTheDocument();

    fireEvent.change(slider, { target: { value: '1' } });
    expect(slider).toHaveValue('1');
    expect(screen.getByText('1.00m')).toBeInTheDocument();
  });
});
