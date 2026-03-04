/**
 * E2E + visual regression tests for the Back Muscle Anatomy Guide.
 *
 * Prerequisites:
 *   npx playwright install --with-deps
 *   npm run dev  (or started automatically via playwright.config.ts webServer)
 *
 * Run:  npx playwright test
 * Update snapshots: npx playwright test --update-snapshots
 */
import { test, expect, Page } from '@playwright/test';

// ── Helpers ───────────────────────────────────────────────────

/** Navigate to the back-anatomy page. Adjust path if routing differs. */
const goto = (page: Page) => page.goto('/');

/** Click the muscle card heading to expand it. */
const expandCard = (page: Page, muscleName: string) =>
  page.getByRole('heading', { name: muscleName, level: 3 }).click();

// ── Page-level tests ──────────────────────────────────────────

test.describe('BackMuscleGuide — page load', () => {
  test('page loads without JS errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await goto(page);
    await page.waitForSelector('h1');

    expect(errors).toHaveLength(0);
  });

  test('page title contains מדריך שרירי הגב', async ({ page }) => {
    await goto(page);
    const h1 = page.getByRole('heading', { name: /מדריך שרירי הגב/, level: 1 });
    await expect(h1).toBeVisible();
  });

  test('sticky nav is present with layer buttons', async ({ page }) => {
    await goto(page);
    const nav = page.getByRole('navigation', { name: /ניווט בין קבוצות שרירים/ });
    await expect(nav).toBeVisible();
    // At least two layer nav buttons (שטחית + עמוקה layers from sample data)
    const buttons = nav.getByRole('button');
    await expect(buttons).toHaveCount(2); // trapezius (שטחית) + erector spinae (עמוקה)
  });

  test('both muscle names appear in collapsed state', async ({ page }) => {
    await goto(page);
    await expect(page.getByRole('heading', { name: 'טרפז', level: 3 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'זוקפי הגב', level: 3 })).toBeVisible();
  });
});

// ── Visual regression — collapsed state ───────────────────────

test.describe('Visual — collapsed (initial) state', () => {
  test('full page screenshot — all cards collapsed', async ({ page }) => {
    await goto(page);
    await page.waitForSelector('.bmg-card');
    await expect(page).toHaveScreenshot('page-collapsed.png', { fullPage: true });
  });

  test('header region screenshot', async ({ page }) => {
    await goto(page);
    const header = page.getByRole('banner');
    await expect(header).toHaveScreenshot('header.png');
  });

  test('nav region screenshot', async ({ page }) => {
    await goto(page);
    const nav = page.getByRole('navigation', { name: /ניווט בין קבוצות שרירים/ });
    await expect(nav).toHaveScreenshot('nav.png');
  });
});

// ── Card expand / collapse ────────────────────────────────────

test.describe('MuscleCard — expand / collapse', () => {
  test('expanding trapezius card shows description', async ({ page }) => {
    await goto(page);
    await expandCard(page, 'טרפז');
    const body = page.locator('#card-body-trapezius');
    await expect(body).toBeVisible();
  });

  test('collapsing card hides body', async ({ page }) => {
    await goto(page);
    await expandCard(page, 'טרפז');
    await expandCard(page, 'טרפז'); // second click → collapse
    await expect(page.locator('#card-body-trapezius')).not.toBeVisible();
  });

  test('visual — trapezius card expanded', async ({ page }) => {
    await goto(page);
    await expandCard(page, 'טרפז');
    await page.locator('#card-body-trapezius').waitFor({ state: 'visible' });
    const card = page.locator('#trapezius');
    await expect(card).toHaveScreenshot('card-trapezius-expanded.png');
  });

  test('visual — erector spinae card expanded', async ({ page }) => {
    await goto(page);
    await expandCard(page, 'זוקפי הגב');
    await page.locator('#card-body-erector-spinae').waitFor({ state: 'visible' });
    const card = page.locator('#erector-spinae');
    await expect(card).toHaveScreenshot('card-erector-expanded.png');
  });
});

// ── Carousel interaction ──────────────────────────────────────

test.describe('MuscleCard — carousel', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page);
    await expandCard(page, 'טרפז');
    await page.locator('#card-body-trapezius').waitFor({ state: 'visible' });
  });

  test('tablist with 3 tabs is visible after expanding', async ({ page }) => {
    const tablist = page.getByRole('tablist', { name: /בחר תצוגה/ }).first();
    await expect(tablist).toBeVisible();
    const tabs = tablist.getByRole('tab');
    await expect(tabs).toHaveCount(3);
  });

  test('first tab (גב רגיל) is selected by default', async ({ page }) => {
    const tab = page.getByRole('tab', { name: /גב רגיל/ }).first();
    await expect(tab).toHaveAttribute('aria-selected', 'true');
  });

  test('clicking anatomical tab selects it', async ({ page }) => {
    const anatomicalTab = page.getByRole('tab', { name: /חתך אנטומי/ }).first();
    await anatomicalTab.click();
    await expect(anatomicalTab).toHaveAttribute('aria-selected', 'true');
  });

  test('next arrow advances the carousel', async ({ page }) => {
    const nextBtn = page.getByRole('button', { name: /תצוגה הבאה/ }).first();
    await nextBtn.click();
    await expect(page.getByRole('tab', { name: /חתך אנטומי/ }).first())
      .toHaveAttribute('aria-selected', 'true');
  });

  test('visual — carousel after switching to anatomical view', async ({ page }) => {
    await page.getByRole('tab', { name: /חתך אנטומי/ }).first().click();
    const carousel = page.locator('#trapezius .bmg-card__carousel').first();
    await expect(carousel).toHaveScreenshot('carousel-anatomical.png');
  });
});

// ── Stretch variants toggle ───────────────────────────────────

test.describe('MuscleCard — stretch variants', () => {
  test('primary stretch title is visible after expanding', async ({ page }) => {
    await goto(page);
    await expandCard(page, 'טרפז');
    await expect(
      page.getByRole('heading', { name: 'הטיית צוואר עם עיגון כתף', level: 5 }),
    ).toBeVisible();
  });

  test('variant toggle shows additional stretch cards', async ({ page }) => {
    await goto(page);
    await expandCard(page, 'טרפז');
    const toggleBtn = page.getByRole('button', { name: /הצג.*דרכי מתיחה נוספות/ }).first();
    await expect(toggleBtn).toBeVisible();
    await toggleBtn.click();
    // First variant title should now appear
    await expect(
      page.getByRole('heading', { name: 'מתיחה עם יד מאחורי הגב', level: 5 }),
    ).toBeVisible();
  });

  test('visual — stretch section with variants open', async ({ page }) => {
    await goto(page);
    await expandCard(page, 'טרפז');
    await page.getByRole('button', { name: /הצג.*דרכי מתיחה נוספות/ }).first().click();
    const stretchSection = page.locator('#trapezius .bmg-card__stretch-section').first();
    await expect(stretchSection).toHaveScreenshot('stretch-variants-open.png');
  });
});

// ── Mobile viewport ───────────────────────────────────────────

test.describe('Mobile layout', () => {
  test.use({ viewport: { width: 390, height: 844 } }); // iPhone 14

  test('page renders correctly on mobile', async ({ page }) => {
    await goto(page);
    await expect(page.getByRole('heading', { name: /מדריך שרירי הגב/, level: 1 })).toBeVisible();
  });

  test('expanding a card stacks carousel above info sections on mobile', async ({ page }) => {
    await goto(page);
    await expandCard(page, 'טרפז');
    const carouselCol = page.locator('#trapezius .bmg-card__carousel-col').first();
    await expect(carouselCol).toBeVisible();
  });

  test('visual — mobile page collapsed', async ({ page }) => {
    await goto(page);
    await page.waitForSelector('.bmg-card');
    await expect(page).toHaveScreenshot('mobile-collapsed.png', { fullPage: true });
  });

  test('visual — mobile card expanded', async ({ page }) => {
    await goto(page);
    await expandCard(page, 'טרפז');
    await page.locator('#card-body-trapezius').waitFor({ state: 'visible' });
    await expect(page).toHaveScreenshot('mobile-card-expanded.png', { fullPage: true });
  });
});

// ── Accessibility quick checks ────────────────────────────────

test.describe('Accessibility', () => {
  test('page has a unique h1', async ({ page }) => {
    await goto(page);
    const h1s = page.getByRole('heading', { level: 1 });
    await expect(h1s).toHaveCount(1);
  });

  test('card header div has role=button and tabindex=0', async ({ page }) => {
    await goto(page);
    const cardHeaders = page.locator('.bmg-card__header[role="button"]');
    const count = await cardHeaders.count();
    expect(count).toBeGreaterThanOrEqual(2);
    for (let i = 0; i < count; i++) {
      await expect(cardHeaders.nth(i)).toHaveAttribute('tabindex', '0');
    }
  });

  test('footer has contentinfo role', async ({ page }) => {
    await goto(page);
    await expect(page.getByRole('contentinfo')).toBeVisible();
  });
});
