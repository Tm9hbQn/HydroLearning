import { render, screen, fireEvent } from '@testing-library/react';
import { CourseManager } from './CourseManager';
import { Course } from '../../types/content';
import { describe, it, expect } from 'vitest';

const mockCourse: Course = {
  id: 'test-course',
  title: 'Test Course',
  description: 'Desc',
  modules: [
    {
      id: 'm1',
      title: 'Module 1',
      units: [
        {
          id: 'u1',
          title: 'Unit 1',
          blocks: [{ id: 'b1', type: 'text', content: 'Content 1' }]
        },
        {
          id: 'u2',
          title: 'Unit 2',
          blocks: [{ id: 'b2', type: 'text', content: 'Content 2' }]
        }
      ]
    }
  ]
};

describe('CourseManager', () => {
  it('renders course title and initial unit', () => {
    render(<CourseManager course={mockCourse} />);
    // Course title is H1
    expect(screen.getByRole('heading', { name: 'Test Course', level: 1 })).toBeInTheDocument();
    // Unit title is H2
    expect(screen.getByRole('heading', { name: 'Unit 1', level: 2 })).toBeInTheDocument();
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('navigates to next unit', () => {
    render(<CourseManager course={mockCourse} />);
    const nextBtn = screen.getByText('Next');
    fireEvent.click(nextBtn);
    // Should now see Unit 2 as H2
    expect(screen.getByRole('heading', { name: 'Unit 2', level: 2 })).toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });
});
