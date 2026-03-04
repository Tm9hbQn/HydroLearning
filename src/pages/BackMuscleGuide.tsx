import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import '../features/back-anatomy/BackMuscleGuide.css';
import {
  musclesData,
  LAYER_META,
  getUniqueLayers,
  groupByLayer,
  type MuscleData,
  type MuscleImages,
  type LayerMeta,
  type StretchMethod,
} from '../features/back-anatomy/muscleData';

/* ============================================================
   Back Muscle Anatomy Guide
   ============================================================
   Data-driven — add muscles to muscleData.ts and they appear
   automatically in the nav, sections, and quick-jump chips.
   ============================================================ */

/* ============================================================
   CAROUSEL VIEWS CONFIG
   ============================================================ */
interface CarouselView { key: keyof MuscleImages; label: string; icon: string; }
const CAROUSEL_VIEWS: CarouselView[] = [
  { key: 'regular_back',   label: 'גב רגיל',    icon: '🧍' },
  { key: 'anatomical_cut', label: 'חתך אנטומי',  icon: '🔬' },
  { key: 'stretch',        label: 'מתיחה',        icon: '🤸' },
];

/* ============================================================
   IMAGE SLIDE — graceful placeholder when asset is missing
   ============================================================ */
interface ImageSlideProps { src: string; alt: string; label: string; colorHex: string; }
const ImageSlide: React.FC<ImageSlideProps> = ({ src, alt, label, colorHex }) => {
  const [hasError, setHasError] = useState(false);
  if (hasError || !src) {
    return (
      <div className="bmg-carousel__placeholder" style={{ '--ph-color': colorHex } as React.CSSProperties}>
        <span className="bmg-carousel__ph-icon" aria-hidden="true">🖼</span>
        <span className="bmg-carousel__ph-label">{label}</span>
        <span className="bmg-carousel__ph-hint">תמונה תוצג כאן</span>
      </div>
    );
  }
  return <img className="bmg-carousel__img" src={src} alt={alt} loading="lazy" onError={() => setHasError(true)} />;
};

/* ============================================================
   STRETCH CARD — used for primary stretch + each variant
   ============================================================ */
interface StretchCardProps { stretch: StretchMethod; colorHex: string; isMain?: boolean; }
const StretchCard: React.FC<StretchCardProps> = ({ stretch, colorHex, isMain = false }) => (
  <div className={`bmg-stretch-card ${isMain ? 'bmg-stretch-card--main' : ''}`}
       style={isMain ? { borderInlineStartColor: colorHex } : {}}>
    <div className="bmg-stretch-card__header">
      <h5 className="bmg-stretch-card__title">{stretch.title}</h5>
      <span className="bmg-stretch-card__equipment"
            style={{ backgroundColor: `${colorHex}12`, color: colorHex, borderColor: `${colorHex}35` }}>
        {stretch.equipment}
      </span>
    </div>
    <ol className="bmg-stretch-card__steps" aria-label="שלבי המתיחה">
      {stretch.steps.map((step, i) => (
        <li key={i} className="bmg-stretch-card__step">
          <span className="bmg-stretch-card__step-num" style={{ backgroundColor: colorHex }} aria-hidden="true">
            {i + 1}
          </span>
          <span>{step}</span>
        </li>
      ))}
    </ol>
    <p className="bmg-stretch-card__duration">⏱ {stretch.duration}</p>
  </div>
);

/* ============================================================
   MUSCLE CARD COMPONENT
   ============================================================ */
interface MuscleCardProps { muscle: MuscleData; meta: LayerMeta; }

const MuscleCard: React.FC<MuscleCardProps> = ({ muscle, meta }) => {
  const [expanded,     setExpanded]     = useState(false);
  const [activeView,   setActiveView]   = useState(0);
  const [variantsOpen, setVariantsOpen] = useState(false);

  const currentView = CAROUSEL_VIEWS[activeView];
  const total       = CAROUSEL_VIEWS.length;

  const prevView = (e: React.MouseEvent) => { e.stopPropagation(); setActiveView((v) => (v - 1 + total) % total); };
  const nextView = (e: React.MouseEvent) => { e.stopPropagation(); setActiveView((v) => (v + 1) % total); };

  return (
    <article id={muscle.id} className="bmg-card" role="listitem">

      {/* ── Header — always visible ──────────────────────── */}
      <div
        className="bmg-card__header"
        onClick={() => setExpanded((p) => !p)}
        role="button" tabIndex={0}
        aria-expanded={expanded}
        aria-controls={`card-body-${muscle.id}`}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpanded((p) => !p); } }}
      >
        <div className="bmg-card__info">
          <div className="bmg-card__dot" style={{ backgroundColor: meta.colorHex }} />
          <div>
            <div className="bmg-card__title-row">
              <h3 className="bmg-card__name">{muscle.name}</h3>
              <span className="bmg-card__layer-badge"
                    style={{ backgroundColor: `${meta.colorHex}18`, color: meta.colorHex, borderColor: `${meta.colorHex}40` }}>
                {muscle.layer}
              </span>
              {muscle.isChronic && (
                <span className="bmg-card__badge bmg-card__badge--chronic">⚠ נוטה לתפיסה</span>
              )}
            </div>
            <p className="bmg-card__latin">{muscle.latinName}</p>
          </div>
        </div>
        <span className={`bmg-card__chevron ${expanded ? 'bmg-card__chevron--open' : ''}`} aria-hidden="true">
          <ChevronDown size={18} />
        </span>
      </div>

      {/* ── Expanded body ────────────────────────────────── */}
      {expanded && (
        <div id={`card-body-${muscle.id}`} className="bmg-card__body">

          {/* Overview description */}
          <div className="bmg-card__overview">
            <p className="bmg-card__desc">{muscle.description}</p>
          </div>

          {/* ── Two-column layout: [carousel] | [info sections] ── */}
          <div className="bmg-card__layout">

            {/* CAROUSEL */}
            <div className="bmg-card__carousel-col">
              <div className="bmg-card__carousel" aria-label={`תצוגות ${muscle.name}`}>

                <div className="bmg-card__carousel-stage">
                  <ImageSlide
                    src={muscle.images[currentView.key]}
                    alt={`${muscle.name} — ${currentView.label}`}
                    label={currentView.label}
                    colorHex={meta.colorHex}
                  />
                  {/* View label overlay */}
                  <div className="bmg-card__view-badge" style={{ backgroundColor: `${meta.colorHex}d9` }}>
                    <span aria-hidden="true">{currentView.icon}</span> {currentView.label}
                  </div>
                  {/* Arrow navigation */}
                  <button className="bmg-card__carousel-arrow bmg-card__carousel-arrow--prev" onClick={prevView} aria-label="תצוגה קודמת">
                    <ChevronRight size={16} />
                  </button>
                  <button className="bmg-card__carousel-arrow bmg-card__carousel-arrow--next" onClick={nextView} aria-label="תצוגה הבאה">
                    <ChevronLeft size={16} />
                  </button>
                </div>

                {/* Tab row */}
                <div className="bmg-card__carousel-tabs" role="tablist" aria-label="בחר תצוגה">
                  {CAROUSEL_VIEWS.map((view, i) => (
                    <button
                      key={view.key} role="tab"
                      aria-selected={activeView === i}
                      className={`bmg-card__tab ${activeView === i ? 'bmg-card__tab--active' : ''}`}
                      style={activeView === i ? { borderColor: meta.colorHex, color: meta.colorHex, backgroundColor: `${meta.colorHex}0f` } : {}}
                      onClick={(e) => { e.stopPropagation(); setActiveView(i); }}
                    >
                      <span aria-hidden="true">{view.icon}</span>
                      <span>{view.label}</span>
                    </button>
                  ))}
                </div>

                {/* Dot indicators */}
                <div className="bmg-card__carousel-dots" aria-hidden="true">
                  {CAROUSEL_VIEWS.map((_, i) => (
                    <span key={i}
                          className={`bmg-card__dot-ind ${activeView === i ? 'bmg-card__dot-ind--active' : ''}`}
                          style={activeView === i ? { backgroundColor: meta.colorHex } : {}} />
                  ))}
                </div>

              </div>
            </div>{/* end carousel col */}

            {/* INFO SECTIONS */}
            <div className="bmg-card__info-col">

              <div className="bmg-card__section">
                <div className="bmg-card__section-label">
                  <span aria-hidden="true">📍</span> איתור — היכן השריר?
                </div>
                <p className="bmg-card__section-text">{muscle.location}</p>
              </div>

              <div className="bmg-card__section bmg-card__section--alt">
                <div className="bmg-card__section-label">
                  <span aria-hidden="true">↔️</span> פעולה והתנגדות
                </div>
                <p className="bmg-card__section-text">{muscle.actions}</p>
              </div>

              <div className="bmg-card__section">
                <div className="bmg-card__section-label">
                  <span aria-hidden="true">💪</span> איך להפעיל ולהרגיש?
                </div>
                <p className="bmg-card__section-text">{muscle.activation}</p>
              </div>

              {muscle.isChronic && (
                <div className="bmg-card__section bmg-card__section--warning">
                  <div className="bmg-card__section-label bmg-card__section-label--warning">
                    <span aria-hidden="true">⚠️</span> תנוחת כיווץ מקסימלי
                  </div>
                  <p className="bmg-card__section-text">{muscle.contracted_position}</p>
                </div>
              )}

            </div>{/* end info col */}
          </div>{/* end .bmg-card__layout */}

          {/* ── STRETCH SECTION — full-width strip below ── */}
          <div className="bmg-card__stretch-section">

            <div className="bmg-card__stretch-section-header">
              <h4 className="bmg-card__stretch-section-title">🤸 שחרור ומתיחה</h4>
              <div className="bmg-card__stretch-divider" style={{ backgroundColor: meta.colorHex }} />
            </div>

            {/* Primary — always visible */}
            <div className="bmg-card__stretch-main">
              <StretchCard stretch={muscle.stretch_basic} colorHex={meta.colorHex} isMain />
            </div>

            {/* Variants — toggled */}
            {muscle.stretch_variants.length > 0 && (
              <div className="bmg-card__variants-area">
                <button
                  className="bmg-card__variants-toggle"
                  onClick={(e) => { e.stopPropagation(); setVariantsOpen((v) => !v); }}
                  style={{ color: meta.colorHex, borderColor: `${meta.colorHex}45` }}
                  aria-expanded={variantsOpen}
                >
                  <span className={`bmg-card__variants-chevron ${variantsOpen ? 'bmg-card__variants-chevron--open' : ''}`} aria-hidden="true">▼</span>
                  {variantsOpen ? 'הסתר שיטות נוספות' : `הצג ${muscle.stretch_variants.length} דרכי מתיחה נוספות`}
                </button>

                {variantsOpen && (
                  <div className="bmg-card__variants-grid">
                    {muscle.stretch_variants.map((variant, i) => (
                      <StretchCard key={i} stretch={variant} colorHex={meta.colorHex} />
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>{/* end stretch section */}

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
