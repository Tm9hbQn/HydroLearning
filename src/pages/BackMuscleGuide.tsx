import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import '../features/back-anatomy/BackMuscleGuide.css';

/* ============================================================
   Back Muscle Anatomy Guide — Phase 1: HTML/CSS Skeleton
   ============================================================
   Semantic HTML5 structure with:
   • <header>  – site title
   • <nav>     – sticky group navigation (quick-jump)
   • <section> – pedagogical intro
   • <section> – muscle cards grid (empty container)
   • <footer>  – disclaimer
   ============================================================ */

/* ── Placeholder data for the navigation & section shells ── */
const MUSCLE_GROUPS = [
  { id: 'superficial', name: 'שרירים שטחיים', icon: '🦾', count: 6 },
  { id: 'erector',     name: 'שרירי יישר עמוד השדרה', icon: '⚡', count: 3 },
  { id: 'deep',        name: 'שרירים עמוקים', icon: '🔬', count: 3 },
] as const;

/* ============================================================
   COMPONENT
   ============================================================ */
const BackMuscleGuide: React.FC = () => {
  /* ── State ────────────────────────────────────────────── */
  const [introExpanded, setIntroExpanded] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  /* ── Refs ─────────────────────────────────────────────── */
  const navRef = useRef<HTMLElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  /* ── Sticky nav shadow on scroll ─────────────────────── */
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const observer = new IntersectionObserver(
      ([entry]) => setNavScrolled(!entry.isIntersecting),
      { threshold: 0, rootMargin: `-${nav.offsetHeight}px 0px 0px 0px` }
    );

    // Observe a sentinel element placed right above the nav
    const sentinel = document.getElementById('bmg-nav-sentinel');
    if (sentinel) observer.observe(sentinel);

    return () => observer.disconnect();
  }, []);

  /* ── Scroll to group handler ─────────────────────────── */
  const scrollToGroup = (groupId: string) => {
    setActiveGroup(groupId);
    sectionRefs.current[groupId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /* ════════════════════════════════════════════════════════
     RENDER
     ════════════════════════════════════════════════════════ */
  return (
    <div className="bmg-page" dir="rtl" lang="he">

      {/* ══════════════════════════════════════════════════
          HEADER
          ══════════════════════════════════════════════════ */}
      <header className="bmg-header" role="banner">
        <div className="bmg-container bmg-header__content">
          <h1 className="bmg-header__title">מדריך שרירי הגב</h1>
          <p className="bmg-header__subtitle">
            אנטומיה &bull; טווחי תנועה &bull; מתיחות והרפיה
          </p>
        </div>
      </header>

      {/* Sentinel for IntersectionObserver (sticky shadow) */}
      <div id="bmg-nav-sentinel" aria-hidden="true" style={{ height: 0 }} />

      {/* ══════════════════════════════════════════════════
          STICKY NAVIGATION
          ══════════════════════════════════════════════════ */}
      <nav
        ref={navRef}
        className={`bmg-nav ${navScrolled ? 'bmg-nav--scrolled' : ''}`}
        role="navigation"
        aria-label="ניווט בין קבוצות שרירים"
      >
        <div className="bmg-container">
          <div className="bmg-nav__inner">
            {MUSCLE_GROUPS.map((group) => (
              <button
                key={group.id}
                className={`bmg-nav__link ${activeGroup === group.id ? 'bmg-nav__link--active' : ''}`}
                onClick={() => scrollToGroup(group.id)}
                aria-current={activeGroup === group.id ? 'true' : undefined}
              >
                <span aria-hidden="true">{group.icon}</span>
                {group.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════
          PEDAGOGICAL INTRODUCTION
          ══════════════════════════════════════════════════ */}
      <section className="bmg-intro bmg-container" aria-labelledby="intro-heading">
        {/* Main intro card */}
        <article className="bmg-intro__card">
          <h2 id="intro-heading" className="bmg-intro__heading">
            מה זה שרירי הגב ולמה חשוב להכיר אותם?
          </h2>
          <p className="bmg-intro__text">
            {/* Placeholder — real pedagogical content will go here */}
            הגב הוא מרכז התמיכה, התנועה והיציבות של כל הגוף. הבנה אנטומית של שרירי הגב
            מאפשרת לנו לזהות מקורות כאב, למנוע פציעות, ולשחרר מתחים כרוניים בצורה ממוקדת.
          </p>

          <button
            className="bmg-intro__toggle"
            onClick={() => setIntroExpanded((prev) => !prev)}
            aria-expanded={introExpanded}
            aria-controls="intro-expanded"
          >
            {introExpanded ? 'הסתר הסבר מלא' : 'הרחב: הסבר פדגוגי מלא'}
            <span
              className={`bmg-intro__toggle-icon ${introExpanded ? 'bmg-intro__toggle-icon--open' : ''}`}
              aria-hidden="true"
            >
              <ChevronDown size={16} />
            </span>
          </button>

          {introExpanded && (
            <div id="intro-expanded" className="bmg-intro__expanded">
              <p>
                {/* Placeholder paragraph 1 */}
                שרירי הגב מאורגנים בשלוש שכבות עיקריות: שטחית, ביניים ועמוקה.
                כל שכבה ממלאה תפקיד שונה — מתנועה גסה ועד לייצוב עדין של חוליה בודדת.
              </p>
              <p>
                {/* Placeholder paragraph 2 */}
                שרירים רבים בגב &quot;אוגרים&quot; מתח רגשי ופיזי: הטרפציוס העליון
                מגיב ללחץ, המולטיפידוס נחלש בעקבות כאב, וריבועי המותן מוגבל בישיבה ממושכת.
              </p>
              <p>
                {/* Placeholder paragraph 3 */}
                לימוד שרירי הגב עוזר לנו להבין: מה הגורם לכאב, כיצד למנוע אותו,
                ואיך לשחרר ולחזק בצורה ממוקדת ומדויקת.
              </p>
            </div>
          )}
        </article>

        {/* ── Group Overview Cards ─────────────────────── */}
        <div className="bmg-intro__groups" role="list">
          {/* Superficial */}
          <article className="bmg-group-overview bmg-group-overview--superficial" role="listitem">
            <div className="bmg-group-overview__header">
              <span className="bmg-group-overview__icon" aria-hidden="true">🦾</span>
              <h3 className="bmg-group-overview__name">שרירים שטחיים</h3>
            </div>
            <p className="bmg-group-overview__desc">
              {/* Placeholder */}
              השרירים הגדולים והנראים של הגב — אחראיים על תנועה גסה וגישור בין עמוד השדרה לכתפיים.
            </p>
          </article>

          {/* Erector Spinae */}
          <article className="bmg-group-overview bmg-group-overview--erector" role="listitem">
            <div className="bmg-group-overview__header">
              <span className="bmg-group-overview__icon" aria-hidden="true">⚡</span>
              <h3 className="bmg-group-overview__name">שרירי יישר עמוד השדרה</h3>
            </div>
            <p className="bmg-group-overview__desc">
              {/* Placeholder */}
              שלושה עמודים של שרירים הרצים לאורך כל עמוד השדרה — הכוח שמחזיק את הגוף זקוף.
            </p>
          </article>

          {/* Deep */}
          <article className="bmg-group-overview bmg-group-overview--deep" role="listitem">
            <div className="bmg-group-overview__header">
              <span className="bmg-group-overview__icon" aria-hidden="true">🔬</span>
              <h3 className="bmg-group-overview__name">שרירים עמוקים</h3>
            </div>
            <p className="bmg-group-overview__desc">
              {/* Placeholder */}
              השרירים הבלתי נראים — אחראיים על יציבות עדינה בין חוליה לחוליה.
            </p>
          </article>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          MAIN CONTENT — MUSCLE GROUP SECTIONS
          ══════════════════════════════════════════════════ */}
      <main className="bmg-main bmg-container" role="main">

        {MUSCLE_GROUPS.map((group) => (
          <section
            key={group.id}
            id={`group-${group.id}`}
            ref={(el) => { sectionRefs.current[group.id] = el; }}
            className="bmg-section"
            aria-labelledby={`section-title-${group.id}`}
          >
            {/* ── Section Header ───────────────────────── */}
            <div className="bmg-section__header">
              <div className={`bmg-section__color-bar bmg-section__color-bar--${group.id}`} />
              <div>
                <h2 id={`section-title-${group.id}`} className="bmg-section__title">
                  <span aria-hidden="true">{group.icon} </span>
                  {group.name}
                </h2>
                <span className="bmg-section__count">{group.count} שרירים</span>
              </div>
            </div>

            {/* ── Quick-jump chips (placeholders) ──────── */}
            <div className="bmg-section__chips" role="list" aria-label={`ניווט מהיר — ${group.name}`}>
              {Array.from({ length: group.count }, (_, i) => (
                <button
                  key={i}
                  className={`bmg-chip bmg-chip--${group.id}`}
                  role="listitem"
                >
                  שריר {i + 1}
                </button>
              ))}
            </div>

            {/* ── Cards Grid (empty container) ─────────── */}
            <div className="bmg-cards-grid" role="list" aria-label={`כרטיסי שרירים — ${group.name}`}>
              {/*
                Muscle cards will be dynamically rendered here.
                Each card will be an <article> with class "bmg-card".

                Example skeleton of a single card:
              */}
              {Array.from({ length: group.count }, (_, i) => (
                <article key={i} className="bmg-card" role="listitem">
                  <div className="bmg-card__header" tabIndex={0} aria-expanded={false}>
                    <div className="bmg-card__info">
                      <div
                        className="bmg-card__dot"
                        style={{
                          backgroundColor:
                            group.id === 'superficial'
                              ? 'var(--clr-accent-orange)'
                              : group.id === 'erector'
                                ? 'var(--clr-accent-blue)'
                                : 'var(--clr-accent-purple)',
                        }}
                      />
                      <div>
                        <h3 className="bmg-card__name">שם השריר {i + 1}</h3>
                        <p className="bmg-card__latin">Muscle Latin Name</p>
                        {i === 0 && (
                          <span className="bmg-card__badge bmg-card__badge--chronic">
                            ⚠ נוטה לתפיסה כרונית
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="bmg-card__chevron" aria-hidden="true">
                      <ChevronDown size={18} />
                    </span>
                  </div>
                  {/* Card body will be rendered here when expanded */}
                </article>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* ══════════════════════════════════════════════════
          FOOTER
          ══════════════════════════════════════════════════ */}
      <footer className="bmg-footer bmg-container" role="contentinfo">
        <p className="bmg-footer__text">
          מדריך שרירי הגב — לצורכי חינוך והפנמה בלבד. מומלץ לפנות לאיש מקצוע לייעוץ אישי.
        </p>
      </footer>
    </div>
  );
};

export default BackMuscleGuide;
