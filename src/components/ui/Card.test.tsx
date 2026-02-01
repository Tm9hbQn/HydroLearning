import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';
import { Info } from 'lucide-react';
import React from 'react';

describe('Card Component', () => {
  it('renders title and description', () => {
    render(
      <Card title="Test Title" description="Test Description">
        <div>Content</div>
      </Card>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders instructions when provided', () => {
    render(
      <Card title="T" description="D" instructions="Do this">
        <div>C</div>
      </Card>
    );
    expect(screen.getByText('Do this')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    const { container } = render(
      <Card title="T" description="D" icon={Info}>
        <div>C</div>
      </Card>
    );
    expect(container.querySelector('.text-ink')).toBeInTheDocument();
  });
});
