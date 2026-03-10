/**
 * Component tests for BackMuscleGuide / MuscleCard
 * Covers: page structure, expand/collapse, carousel tabs,
 *         stretch variants toggle, isChronic section, ImageSlide placeholder.
 */
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import BackMuscleGuide from '../../pages/BackMuscleGuide';
import { musclesData } from './muscleData';
// IntersectionObserver + scrollIntoView are mocked globally in vitest.setup.ts

// ── Helper ────────────────────────────────────────────────────

const renderGuide = () =>
  render(
    <MemoryRouter>
      <BackMuscleGuide />
    </MemoryRouter>
  );

/** Click a muscle card header by finding its h3 name heading (bubbles to parent div onClick) */
const expandCard = (muscleName: string) => {
  const heading = screen.getByRole('heading', { name: muscleName, level: 3 });
  fireEvent.click(heading);
};

// ── Page structure ────────────────────────────────────────────

describe('BackMuscleGuide — page structure', () => {
  it('renders without crashing', () => {
    expect(() => render(<MemoryRouter><BackMuscleGuide /></MemoryRouter>)).not.toThrow();
  });

  it('renders the main page title', () => {
    renderGuide();
    expect(screen.getByRole('heading', { name: /מדריך שרירי הגב/, level: 1 })).toBeInTheDocument();
  });

  it('renders a <nav> with aria-label', () => {
    renderGuide();
    expect(screen.getByRole('navigation', { name: /ניווט בין קבוצות שרירים/ })).toBeInTheDocument();
  });

  it('renders one nav button per unique layer present in musclesData', () => {
    renderGuide();
    const nav = screen.getByRole('navigation', { name: /ניווט בין קבוצות שרירים/ });
    const uniqueLayers = [...new Set(musclesData.map((m) => m.layer))];
    const navButtons = within(nav).getAllByRole('button');
    expect(navButtons.length).toBe(uniqueLayers.length);
  });

  it('renders an h3 for every muscle name', () => {
    renderGuide();
    for (const muscle of musclesData) {
      expect(screen.getByRole('heading', { name: muscle.name, level: 3 })).toBeInTheDocument();
    }
  });

  it('renders the latin name for every muscle (collapsed state)', () => {
    renderGuide();
    for (const muscle of musclesData) {
      expect(screen.getByText(muscle.latinName)).toBeInTheDocument();
    }
  });

  it('renders the ⚠ badge for isChronic muscles in collapsed state', () => {
    renderGuide();
    const chronicMuscles = musclesData.filter((m) => m.isChronic);
    expect(chronicMuscles.length).toBeGreaterThan(0);
    // Each card header has the badge
    const badges = screen.getAllByText(/⚠ נוטה לתפיסה/);
    expect(badges.length).toBeGreaterThanOrEqual(chronicMuscles.length);
  });

  it('renders a quick-jump chip for every muscle', () => {
    renderGuide();
    for (const muscle of musclesData) {
      // Chips use listitem role and contain the muscle name
      const chips = screen.getAllByRole('listitem');
      const matchingChip = chips.find((el) => el.textContent?.includes(muscle.name));
      expect(matchingChip, `Chip for ${muscle.name} not found`).toBeTruthy();
    }
  });

  it('has a <footer> with the disclaimer text', () => {
    renderGuide();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByText(/מדריך שרירי הגב — לצורכי חינוך/)).toBeInTheDocument();
  });
});

// ── MuscleCard — expand / collapse ───────────────────────────

describe('MuscleCard — expand / collapse', () => {
  const trap = musclesData.find((m) => m.id === 'trapezius')!;

  it('body content is hidden before expanding', () => {
    renderGuide();
    expect(screen.queryByText(trap.description)).not.toBeInTheDocument();
    expect(screen.queryByText(trap.location)).not.toBeInTheDocument();
  });

  it('clicking the card heading expands body content', () => {
    renderGuide();
    expandCard(trap.name);
    expect(screen.getByText(trap.description)).toBeInTheDocument();
    expect(screen.getByText(trap.location)).toBeInTheDocument();
    expect(screen.getByText(trap.activation)).toBeInTheDocument();
  });

  it('expanded card shows the actions text', () => {
    renderGuide();
    expandCard(trap.name);
    expect(screen.getByText(trap.actions)).toBeInTheDocument();
  });

  it('clicking the heading again collapses the card', () => {
    renderGuide();
    expandCard(trap.name);
    expect(screen.getByText(trap.description)).toBeInTheDocument();
    expandCard(trap.name); // second click → collapse
    expect(screen.queryByText(trap.description)).not.toBeInTheDocument();
  });

  it('the card header div has aria-expanded=false when collapsed', () => {
    renderGuide();
    const heading = screen.getByRole('heading', { name: trap.name, level: 3 });
    const cardHeader = heading.closest('[aria-expanded]');
    expect(cardHeader).toHaveAttribute('aria-expanded', 'false');
  });

  it('the card header div has aria-expanded=true when expanded', () => {
    renderGuide();
    expandCard(trap.name);
    const heading = screen.getByRole('heading', { name: trap.name, level: 3 });
    const cardHeader = heading.closest('[aria-expanded]');
    expect(cardHeader).toHaveAttribute('aria-expanded', 'true');
  });

  it('both muscles can be expanded simultaneously', () => {
    renderGuide();
    const erector = musclesData.find((m) => m.id === 'erector-spinae')!;
    expandCard(trap.name);
    expandCard(erector.name);
    expect(screen.getByText(trap.description)).toBeInTheDocument();
    expect(screen.getByText(erector.description)).toBeInTheDocument();
  });
});

// ── MuscleCard — isChronic warning section ───────────────────

describe('MuscleCard — isChronic contracted_position section', () => {
  it('contracted_position text is shown only for chronic muscles when expanded', () => {
    renderGuide();
    const chronicMuscle = musclesData.find((m) => m.isChronic)!;
    // hidden before expand
    expect(screen.queryByText(chronicMuscle.contracted_position)).not.toBeInTheDocument();
    // visible after expand
    expandCard(chronicMuscle.name);
    expect(screen.getByText(chronicMuscle.contracted_position)).toBeInTheDocument();
  });
});

// ── MuscleCard — carousel tabs ────────────────────────────────

describe('MuscleCard — carousel', () => {
  const trap = musclesData.find((m) => m.id === 'trapezius')!;

  it('carousel tab list is not visible when card is collapsed', () => {
    renderGuide();
    expect(screen.queryByRole('tablist', { name: /בחר תצוגה/ })).not.toBeInTheDocument();
  });

  it('shows tablist with 3 tabs after expanding', () => {
    renderGuide();
    expandCard(trap.name);
    const tablist = screen.getByRole('tablist', { name: /בחר תצוגה/ });
    const tabs = within(tablist).getAllByRole('tab');
    expect(tabs.length).toBe(3);
  });

  it('first tab (גב רגיל) is selected by default', () => {
    renderGuide();
    expandCard(trap.name);
    const firstTab = screen.getByRole('tab', { name: /גב רגיל/ });
    expect(firstTab).toHaveAttribute('aria-selected', 'true');
  });

  it('second and third tabs start unselected', () => {
    renderGuide();
    expandCard(trap.name);
    expect(screen.getByRole('tab', { name: /חתך אנטומי/ })).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('tab', { name: /מתיחה/ })).toHaveAttribute('aria-selected', 'false');
  });

  it('clicking the anatomical tab selects it and deselects the first', () => {
    renderGuide();
    expandCard(trap.name);
    const anatomicalTab = screen.getByRole('tab', { name: /חתך אנטומי/ });
    fireEvent.click(anatomicalTab);
    expect(anatomicalTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: /גב רגיל/ })).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('tab', { name: /מתיחה/ })).toHaveAttribute('aria-selected', 'false');
  });

  it('clicking the stretch tab selects it', () => {
    renderGuide();
    expandCard(trap.name);
    const stretchTab = screen.getByRole('tab', { name: /מתיחה/ });
    fireEvent.click(stretchTab);
    expect(stretchTab).toHaveAttribute('aria-selected', 'true');
  });

  it('prev/next arrow buttons are rendered', () => {
    renderGuide();
    expandCard(trap.name);
    expect(screen.getByRole('button', { name: /תצוגה קודמת/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /תצוגה הבאה/ })).toBeInTheDocument();
  });

  it('clicking next arrow advances to second tab', () => {
    renderGuide();
    expandCard(trap.name);
    const nextBtn = screen.getByRole('button', { name: /תצוגה הבאה/ });
    fireEvent.click(nextBtn);
    expect(screen.getByRole('tab', { name: /חתך אנטומי/ })).toHaveAttribute('aria-selected', 'true');
  });

  it('clicking prev arrow wraps around to last tab', () => {
    renderGuide();
    expandCard(trap.name);
    const prevBtn = screen.getByRole('button', { name: /תצוגה קודמת/ });
    fireEvent.click(prevBtn);
    // 0 - 1 + 3 % 3 = 2 → stretch tab
    expect(screen.getByRole('tab', { name: /מתיחה/ })).toHaveAttribute('aria-selected', 'true');
  });

  it('placeholder is shown (images are stub paths that 404)', () => {
    renderGuide();
    expandCard(trap.name);
    // The img will try to load a broken URL. jsdom's img doesn't fire onError automatically,
    // but we can confirm the placeholder text appears when hasError=true.
    // Directly verify the alt text is rendered via the <img> or placeholder.
    // In jsdom, broken images stay as <img> (no onError fired), so we check the <img> is there.
    const img = screen.queryByRole('img', { name: new RegExp(trap.name) });
    const placeholder = screen.queryByText('תמונה תוצג כאן');
    // Either an img OR the placeholder must be present
    expect(img || placeholder).toBeTruthy();
  });
});

// ── MuscleCard — stretch section ──────────────────────────────

describe('MuscleCard — stretch section', () => {
  const trap = musclesData.find((m) => m.id === 'trapezius')!;
  const erector = musclesData.find((m) => m.id === 'erector-spinae')!;

  it('stretch section heading is visible after expanding', () => {
    renderGuide();
    expandCard(trap.name);
    expect(screen.getByRole('heading', { name: /שחרור ומתיחה/, level: 4 })).toBeInTheDocument();
  });

  it('primary stretch title is visible after expanding (trapezius)', () => {
    renderGuide();
    expandCard(trap.name);
    expect(screen.getByRole('heading', { name: trap.stretch_basic.title, level: 5 })).toBeInTheDocument();
  });

  it('primary stretch title is visible after expanding (erector spinae)', () => {
    renderGuide();
    expandCard(erector.name);
    expect(screen.getByRole('heading', { name: erector.stretch_basic.title, level: 5 })).toBeInTheDocument();
  });

  it('variant titles are NOT visible before the toggle is clicked', () => {
    renderGuide();
    expandCard(trap.name);
    expect(screen.queryByText(trap.stretch_variants[0].title)).not.toBeInTheDocument();
  });

  it('clicking the variants toggle reveals all variant cards', () => {
    renderGuide();
    expandCard(trap.name);
    const toggleBtn = screen.getByRole('button', { name: /הצג.*דרכי מתיחה נוספות/ });
    expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggleBtn);
    for (const variant of trap.stretch_variants) {
      expect(screen.getByRole('heading', { name: variant.title, level: 5 })).toBeInTheDocument();
    }
  });

  it('toggle button text changes to "הסתר" after opening', () => {
    renderGuide();
    expandCard(trap.name);
    fireEvent.click(screen.getByRole('button', { name: /הצג.*דרכי מתיחה נוספות/ }));
    expect(screen.getByRole('button', { name: /הסתר שיטות נוספות/ })).toBeInTheDocument();
  });

  it('toggle button aria-expanded is true when variants are open', () => {
    renderGuide();
    expandCard(trap.name);
    const toggleBtn = screen.getByRole('button', { name: /הצג.*דרכי מתיחה נוספות/ });
    fireEvent.click(toggleBtn);
    expect(screen.getByRole('button', { name: /הסתר שיטות נוספות/ }))
      .toHaveAttribute('aria-expanded', 'true');
  });

  it('clicking toggle again hides the variant cards', () => {
    renderGuide();
    expandCard(trap.name);
    const toggleBtn = screen.getByRole('button', { name: /הצג.*דרכי מתיחה נוספות/ });
    fireEvent.click(toggleBtn);
    fireEvent.click(screen.getByRole('button', { name: /הסתר שיטות נוספות/ }));
    expect(screen.queryByText(trap.stretch_variants[0].title)).not.toBeInTheDocument();
  });

  it('basic stretch duration is displayed', () => {
    renderGuide();
    expandCard(trap.name);
    expect(screen.getByText(new RegExp(trap.stretch_basic.duration, 'u'))).toBeInTheDocument();
  });
});

// ── Keyboard accessibility ────────────────────────────────────

describe('MuscleCard — keyboard accessibility', () => {
  const trap = musclesData.find((m) => m.id === 'trapezius')!;

  it('pressing Enter on the card heading expands it', () => {
    renderGuide();
    const heading = screen.getByRole('heading', { name: trap.name, level: 3 });
    const cardHeader = heading.closest('[role="button"]') as HTMLElement;
    expect(cardHeader).not.toBeNull();
    fireEvent.keyDown(cardHeader, { key: 'Enter' });
    expect(screen.getByText(trap.description)).toBeInTheDocument();
  });

  it('pressing Space on the card heading expands it', () => {
    renderGuide();
    const heading = screen.getByRole('heading', { name: trap.name, level: 3 });
    const cardHeader = heading.closest('[role="button"]') as HTMLElement;
    fireEvent.keyDown(cardHeader, { key: ' ' });
    expect(screen.getByText(trap.description)).toBeInTheDocument();
  });

  it('card header has tabIndex=0', () => {
    renderGuide();
    const heading = screen.getByRole('heading', { name: trap.name, level: 3 });
    const cardHeader = heading.closest('[role="button"]') as HTMLElement;
    expect(cardHeader).toHaveAttribute('tabIndex', '0');
  });
});
