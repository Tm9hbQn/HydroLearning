import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import '../features/back-anatomy/BackMuscleGuide.css';
import {
  musclesData,
  LAYER_META,
  getUniqueLayers,
  groupByLayer,
  type MuscleData,
  type LayerMeta,
} from '../features/back-anatomy/muscleData';

/* ============================================================
   Back Muscle Anatomy Guide
   ============================================================
   Data-driven — add muscles to muscleData.ts and they appear
   automatically in the nav, sections, and quick-jump chips.
   ============================================================ */

/* ============================================================
   MUSCLE CARD COMPONENT
   ============================================================ */
interface MuscleCardProps {
  muscle: MuscleData;
  meta: LayerMeta;
}

const MuscleCard: React.FC<MuscleCardProps> = ({ muscle, meta }) => {
  const [expanded, setExpanded] = useState(false);
  const toggle = () => setExpanded((prev) => !prev);

  return (
    <article id={muscle.id} className="bmg-card" role="listitem">

      {/* ── Header (always visible — click to expand) ──── */}
      <div
        className="bmg-card__header"
        onClick={toggle}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        aria-controls={`card-body-${muscle.id}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
        }}
      >
        <div className="bmg-card__info">
          {/* Coloured dot — layer colour via inline style */}
          <div className="bmg-card__dot" style={{ backgroundColor: meta.colorHex }} />
          <div>
            <div className="bmg-card__title-row">
              <h3 className="bmg-card__name">{muscle.name}</h3>
              {/* Layer badge */}
              <span
                className="bmg-card__layer-badge"
                style={{
                  backgroundColor: `${meta.colorHex}18`,
                  color: meta.colorHex,
                  borderColor: `${meta.colorHex}40`,
                }}
              >
                {muscle.layer}
              </span>
              {/* Chronic tension badge */}
              {muscle.isChronic && (
                <span className="bmg-card__badge bmg-card__badge--chronic">
                  ⚠ נוטה לתפיסה
                </span>
              )}
            </div>
            <p className="bmg-card__latin">{muscle.latinName}</p>
          </div>
        </div>
        <span
          className={`bmg-card__chevron ${expanded ? 'bmg-card__chevron--open' : ''}`}
          aria-hidden="true"
        >
          <ChevronDown size={18} />
        </span>
      </div>

      {/* ── Expanded Body ──────────────────────────────── */}
      {expanded && (
        <div id={`card-body-${muscle.id}`} className="bmg-card__body">

          {/* Overview / description */}
          <div className="bmg-card__section">
            <p className="bmg-card__desc">{muscle.description}</p>
          </div>

          {/* Anatomical location */}
          <div className="bmg-card__section">
            <div className="bmg-card__section-label">
              <span aria-hidden="true">📍</span> מיקום
            </div>
            <p className="bmg-card__section-text">{muscle.location}</p>
          </div>

          {/* Range of motion & resistance */}
          <div className="bmg-card__section bmg-card__section--alt">
            <div className="bmg-card__section-label">
              <span aria-hidden="true">↔️</span> פעולות וטווח תנועה
            </div>
            <p className="bmg-card__section-text">{muscle.actions}</p>
          </div>

          {/* Contracted position — chronic muscles only */}
          {muscle.isChronic && (
            <div className="bmg-card__section bmg-card__section--warning">
              <div className="bmg-card__section-label bmg-card__section-label--warning">
                <span aria-hidden="true">⚠️</span> הכי מכווץ ב…
              </div>
              <p className="bmg-card__section-text">{muscle.contracted_position}</p>
            </div>
          )}

          {/* Basic stretch */}
          <div className="bmg-card__section">
            <div className="bmg-card__section-label">
              <span aria-hidden="true">🤸</span> מתיחה עיקרית
              <span className="bmg-card__equipment-tag">{muscle.stretch_basic.equipment}</span>
            </div>
            <div className="bmg-card__stretch">
              <h4 className="bmg-card__stretch-title">{muscle.stretch_basic.title}</h4>
              <ol className="bmg-card__stretch-steps" aria-label="שלבי המתיחה">
                {muscle.stretch_basic.steps.map((step, i) => (
                  <li key={i} className="bmg-card__stretch-step">
                    <span
                      className="bmg-card__step-num"
                      style={{ backgroundColor: meta.colorHex }}
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <p className="bmg-card__stretch-duration">⏱ {muscle.stretch_basic.duration}</p>
            </div>
          </div>

          {/* Additional variants count — full carousel comes in Phase 4 */}
          {muscle.stretch_variants.length > 0 && (
            <div className="bmg-card__more-variants">
              <span
                className="bmg-card__more-variants__badge"
                style={{ borderColor: `${meta.colorHex}50`, color: meta.colorHex }}
              >
                +{muscle.stretch_variants.length} דרכי מתיחה נוספות
              </span>
              <span className="bmg-card__more-variants__hint">יוצגו בשלב הבא</span>
            </div>
          )}

        </div>
      )}
    </article>
  );
};

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

  /* ── Data: group muscles by layer (order from musclesData) ─ */
  const layerGroups = useMemo(() => {
    const grouped = groupByLayer(musclesData);
    return getUniqueLayers(musclesData).map((layer) => ({
      layer,
      // Fall back gracefully if a layer isn't in LAYER_META yet
      meta: LAYER_META[layer] ?? {
        id: layer,
        displayName: layer,
        icon: '💪',
        colorHex: '#64748b',
      } as LayerMeta,
      muscles: grouped[layer] ?? [],
    }));
  }, []);

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
            {layerGroups.map(({ layer, meta, muscles }) => (
              <button
                key={meta.id}
                className={`bmg-nav__link ${activeGroup === meta.id ? 'bmg-nav__link--active' : ''}`}
                onClick={() => scrollToGroup(meta.id)}
                aria-current={activeGroup === meta.id ? 'true' : undefined}
              >
                <span aria-hidden="true">{meta.icon}</span>
                {meta.displayName}
                <span className="bmg-nav__count" aria-label={`${muscles.length} שרירים`}>
                  {muscles.length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════
          PEDAGOGICAL INTRODUCTION
          ══════════════════════════════════════════════════ */}
      <section className="bmg-intro bmg-container" aria-labelledby="intro-heading">
        {/* ── Main intro card ───────────────────────────── */}
        <article className="bmg-intro__card">

          {/* Title */}
          <h2 id="intro-heading" className="bmg-intro__heading">
            מבוא: המכונה המופלאה של שרירי הגב
          </h2>

          {/* Lead paragraph — always visible */}
          <p className="bmg-intro__lead">
            הגב שלנו הוא לא סתם &quot;קיר&quot; אחורי, אלא מערכת מורכבת ורב-שכבתית של
            שרירים, שעובדים בהרמוניה מושלמת כדי להחזיק אותנו זקופים, לאפשר לנו לנוע
            במרחב, ולהגן על עמוד השדרה שלנו.
          </p>

          {/* Anatomical illustration placeholder */}
          <div
            className="bmg-intro__image-placeholder"
            role="img"
            aria-label="מקום שמור לאיור אנטומי של שכבות שרירי הגב"
          >
            <span className="bmg-intro__image-placeholder__icon" aria-hidden="true">🩻</span>
            <span>איור אנטומי — שכבות שרירי הגב</span>
            <span className="bmg-intro__image-placeholder__sub">תמונה תוכנס בשלב הבא</span>
          </div>

          {/* Bridge paragraph */}
          <p className="bmg-intro__bridge">
            כדי להבין למה הגב שלנו כואב, נתפס או מפתח דלקות, צריך קודם כל להבין איך הוא
            בנוי. נהוג לחלק את שרירי הגב ל<strong>שלוש קבוצות עיקריות (שכבות)</strong>,
            שלכל אחת תפקיד שונה לחלוטין:
          </p>

          {/* Expand/collapse toggle */}
          <button
            className="bmg-intro__toggle"
            onClick={() => setIntroExpanded((prev) => !prev)}
            aria-expanded={introExpanded}
            aria-controls="intro-expanded"
          >
            {introExpanded ? 'הסתר הסבר מלא' : 'קרא את ההסבר המלא על שלוש השכבות'}
            <span
              className={`bmg-intro__toggle-icon ${introExpanded ? 'bmg-intro__toggle-icon--open' : ''}`}
              aria-hidden="true"
            >
              <ChevronDown size={16} />
            </span>
          </button>

          {/* ── Expandable body ────────────────────────────── */}
          {introExpanded && (
            <div id="intro-expanded" className="bmg-intro__expanded">

              {/* The 3 layers */}
              <ol className="bmg-intro__layer-list" aria-label="שלוש שכבות שרירי הגב">

                <li className="bmg-intro__layer-item bmg-intro__layer-item--superficial">
                  <h3 className="bmg-intro__layer-heading">
                    <span className="bmg-intro__layer-num" aria-hidden="true">1</span>
                    השכבה השטחית
                    <span className="bmg-intro__layer-sub">(Superficial)</span>
                    <span className="bmg-intro__layer-role">שרירי התנועה הגדולה</span>
                  </h3>
                  <p className="bmg-intro__layer-text">
                    אלו השרירים הגדולים והבולטים ביותר (כמו{' '}
                    <strong>הטרפז</strong> או <strong>הרחב-גבי</strong>). התפקיד העיקרי
                    שלהם הוא בכלל לא להחזיק את הגב, אלא <strong>להניע את הכתפיים
                    והזרועות שלנו</strong>. הם נכנסים לפעולה כשאנחנו מרימים משא, מושכים
                    משהו, או שוחים. כאשר הם עובדים קשה מדי או בתנוחה לא נכונה (כמו רכינה
                    ממושכת מול מסך), הם נוטים <strong>להתקצר ולהיתפס</strong>.
                  </p>
                </li>

                <li className="bmg-intro__layer-item bmg-intro__layer-item--erector">
                  <h3 className="bmg-intro__layer-heading">
                    <span className="bmg-intro__layer-num" aria-hidden="true">2</span>
                    השכבה האמצעית
                    <span className="bmg-intro__layer-sub">(Intermediate)</span>
                    <span className="bmg-intro__layer-role">שרירי הנשימה והייצוב</span>
                  </h3>
                  <p className="bmg-intro__layer-text">
                    שכבה זו כוללת שרירים קטנים יותר (כמו <strong>המעוינים</strong>), שיושבים
                    מתחת לשכבה השטחית. התפקיד שלהם הוא לייצב את השכמות ולעזור לכלוב הצלעות
                    להתרחב ולהתכווץ בזמן נשימה עמוקה. מתח נפשי או נשימה שטחית משפיעים
                    עליהם ישירות ויוצרים <strong>&quot;קשרים&quot; (נקודות טריגר)</strong> כואבים
                    בין השכמות.
                  </p>
                </li>

                <li className="bmg-intro__layer-item bmg-intro__layer-item--deep">
                  <h3 className="bmg-intro__layer-heading">
                    <span className="bmg-intro__layer-num" aria-hidden="true">3</span>
                    השכבה העמוקה
                    <span className="bmg-intro__layer-sub">(Deep)</span>
                    <span className="bmg-intro__layer-role">שרירי היציבה והליבה</span>
                  </h3>
                  <p className="bmg-intro__layer-text">
                    אלו שרירים קטנים וחזקים (כמו <strong>זוקפי הגב</strong>) שצמודים ממש
                    לעמוד השדרה. הם עובדים <strong>24/7</strong> (כל עוד אנחנו לא שוכבים)
                    כדי להתנגד לכוח המשיכה ולשמור עלינו זקופים. ישיבה ממושכת מחלישה אותם,
                    מה שגורם לעומס לעבור לרצועות ולדיסקים, ומוביל ל
                    <strong>כאבים כרוניים בגב התחתון</strong>.
                  </p>
                </li>

              </ol>

              {/* System integration section */}
              <section className="bmg-intro__integration" aria-labelledby="integration-heading">
                <h3 id="integration-heading" className="bmg-intro__integration-heading">
                  איך זה משתלב עם שאר הגוף?
                </h3>
                <p className="bmg-intro__layer-text">
                  שרירי הגב לא עובדים בוואקום. הם מחוברים למערכות אחרות בצורה הדוקה:
                </p>
                <ul className="bmg-intro__integration-list">
                  <li className="bmg-intro__integration-item">
                    <strong>מערכת העצבים:</strong> חוט השדרה עובר ממש בתוך המערכת הזו.
                    שריר גב מכווץ מדי עלול ללחוץ על עצב (כמו במקרה של סיאטיקה), מה שיקרין
                    כאב חד לאגן או לרגליים.
                  </li>
                  <li className="bmg-intro__integration-item">
                    <strong>רקמת החיבור (Fascia):</strong> הגב התחתון מכוסה ברקמת חיבור
                    רחבה (<em>Thoracolumbar fascia</em>) שמחברת בין פלג הגוף העליון לתחתון.
                    לכן לפעמים כאב בגב נובע בכלל משרירי ישבן או ירך אחורית קצרים מדי.
                  </li>
                </ul>
              </section>

              {/* Closing mission callout */}
              <p className="bmg-intro__callout">
                המטרה של המדריך הזה היא לעזור לכם{' '}
                <strong>לזהות בדיוק איזה שריר &quot;צועק&quot; עכשיו</strong>, להבין מה
                המכניקה שלו, ובעיקר — ללמוד איך לשחרר אותו בצורה עצמאית דרך מתיחות מדויקות
                והרפיה. בהמשך תוכלו לנווט לכל שריר באופן ספציפי ולראות אותו מבפנים ומבחוץ.
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
              השרירים הגדולים והבולטים (טרפז, רחב-גבי). אחראיים על הנעת הכתפיים
              והזרועות — <strong>נוטים להתקצר ולהיתפס</strong> בישיבה ממושכת.
            </p>
          </article>

          {/* Erector Spinae / Intermediate */}
          <article className="bmg-group-overview bmg-group-overview--erector" role="listitem">
            <div className="bmg-group-overview__header">
              <span className="bmg-group-overview__icon" aria-hidden="true">⚡</span>
              <h3 className="bmg-group-overview__name">שכבה אמצעית</h3>
            </div>
            <p className="bmg-group-overview__desc">
              שרירים קטנים (מעוינים) שמייצבים שכמות ומסייעים בנשימה. מתח נפשי
              יוצר <strong>נקודות טריגר כואבות</strong> בין השכמות.
            </p>
          </article>

          {/* Deep */}
          <article className="bmg-group-overview bmg-group-overview--deep" role="listitem">
            <div className="bmg-group-overview__header">
              <span className="bmg-group-overview__icon" aria-hidden="true">🔬</span>
              <h3 className="bmg-group-overview__name">שרירים עמוקים</h3>
            </div>
            <p className="bmg-group-overview__desc">
              זוקפי הגב — עובדים 24/7 נגד כוח המשיכה. ישיבה ממושכת מחלישה אותם
              ומעבירה את העומס <strong>לדיסקים ולרצועות</strong>.
            </p>
          </article>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          MAIN CONTENT — MUSCLE GROUP SECTIONS
          ══════════════════════════════════════════════════ */}
      <main className="bmg-main bmg-container" role="main">

        {layerGroups.map(({ layer, meta, muscles }) => (
          <section
            key={meta.id}
            id={`group-${meta.id}`}
            ref={(el) => { sectionRefs.current[meta.id] = el; }}
            className="bmg-section"
            aria-labelledby={`section-title-${meta.id}`}
          >
            {/* ── Section Header ───────────────────────── */}
            <div className="bmg-section__header">
              <div
                className="bmg-section__color-bar"
                style={{ backgroundColor: meta.colorHex }}
              />
              <div>
                <h2 id={`section-title-${meta.id}`} className="bmg-section__title">
                  <span aria-hidden="true">{meta.icon} </span>
                  {meta.displayName}
                </h2>
                <span className="bmg-section__count">{muscles.length} שרירים</span>
              </div>
            </div>

            {/* ── Quick-jump chips — one per muscle in this layer ── */}
            <div
              className="bmg-section__chips"
              role="list"
              aria-label={`ניווט מהיר — ${meta.displayName}`}
            >
              {muscles.map((m) => (
                <button
                  key={m.id}
                  className="bmg-chip"
                  style={{'--chip-hover-color': meta.colorHex} as React.CSSProperties}
                  role="listitem"
                  onClick={() =>
                    document.getElementById(m.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                >
                  {m.name}
                </button>
              ))}
            </div>

            {/* ── Muscle Cards Grid ─────────────────────── */}
            <div
              className="bmg-cards-grid"
              role="list"
              aria-label={`כרטיסי שרירים — ${meta.displayName}`}
            >
              {muscles.map((muscle) => (
                <MuscleCard key={muscle.id} muscle={muscle} meta={meta} />
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
