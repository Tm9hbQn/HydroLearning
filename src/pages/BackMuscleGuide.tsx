import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
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

/* ============================================================
   IMAGE SLIDE — graceful placeholder when asset is missing
   ============================================================ */
interface ImageSlideProps { src: string; alt: string; label: string; colorHex: string; placeholderText: string; }
const ImageSlide: React.FC<ImageSlideProps> = ({ src, alt, label, colorHex, placeholderText }) => {
  const [hasError, setHasError] = useState(false);
  if (hasError || !src) {
    return (
      <div className="bmg-carousel__placeholder" style={{ '--ph-color': colorHex } as React.CSSProperties}>
        <span className="bmg-carousel__ph-icon" aria-hidden="true">🖼</span>
        <span className="bmg-carousel__ph-label">{label}</span>
        <span className="bmg-carousel__ph-hint">{placeholderText}</span>
      </div>
    );
  }
  return <img className="bmg-carousel__img" src={src} alt={alt} loading="lazy" onError={() => setHasError(true)} />;
};

/* ============================================================
   STRETCH CARD — used for primary stretch + each variant
   ============================================================ */
interface StretchCardProps { stretch: StretchMethod; colorHex: string; isMain?: boolean; stepsLabel: string; }
const StretchCard: React.FC<StretchCardProps> = ({ stretch, colorHex, isMain = false, stepsLabel }) => (
  <div className={`bmg-stretch-card ${isMain ? 'bmg-stretch-card--main' : ''}`}
       style={isMain ? { borderInlineStartColor: colorHex } : {}}>
    <div className="bmg-stretch-card__header">
      <h5 className="bmg-stretch-card__title">{stretch.title}</h5>
      <span className="bmg-stretch-card__equipment"
            style={{ backgroundColor: `${colorHex}12`, color: colorHex, borderColor: `${colorHex}35` }}>
        {stretch.equipment}
      </span>
    </div>
    <ol className="bmg-stretch-card__steps" aria-label={stepsLabel}>
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
interface MuscleCardProps { muscle: MuscleData; meta: LayerMeta; carouselViews: CarouselView[]; }

const MuscleCard: React.FC<MuscleCardProps> = ({ muscle, meta, carouselViews }) => {
  const { t } = useTranslation();
  const [expanded,     setExpanded]     = useState(false);
  const [activeView,   setActiveView]   = useState(0);
  const [variantsOpen, setVariantsOpen] = useState(false);

  const currentView = carouselViews[activeView];
  const total       = carouselViews.length;

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
                <span className="bmg-card__badge bmg-card__badge--chronic">⚠ {t('back_muscle_guide.card_sections.chronic_badge')}</span>
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
              <div className="bmg-card__carousel" aria-label={`${t('back_muscle_guide.carousel_label')} ${muscle.name}`}>

                <div className="bmg-card__carousel-stage">
                  <ImageSlide
                    src={muscle.images[currentView.key]}
                    alt={`${muscle.name} — ${currentView.label}`}
                    label={currentView.label}
                    colorHex={meta.colorHex}
                    placeholderText={t('back_muscle_guide.image_placeholder')}
                  />
                  {/* View label overlay */}
                  <div className="bmg-card__view-badge" style={{ backgroundColor: `${meta.colorHex}d9` }}>
                    <span aria-hidden="true">{currentView.icon}</span> {currentView.label}
                  </div>
                  {/* Arrow navigation */}
                  <button className="bmg-card__carousel-arrow bmg-card__carousel-arrow--prev" onClick={prevView} aria-label={t('back_muscle_guide.carousel_prev')}>
                    <ChevronRight size={16} />
                  </button>
                  <button className="bmg-card__carousel-arrow bmg-card__carousel-arrow--next" onClick={nextView} aria-label={t('back_muscle_guide.carousel_next')}>
                    <ChevronLeft size={16} />
                  </button>
                </div>

                {/* Tab row */}
                <div className="bmg-card__carousel-tabs" role="tablist" aria-label={t('back_muscle_guide.carousel_tab_label')}>
                  {carouselViews.map((view, i) => (
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
                  {carouselViews.map((_, i) => (
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
                  <span aria-hidden="true">📍</span> {t('back_muscle_guide.card_sections.location_label')}
                </div>
                <p className="bmg-card__section-text">{muscle.location}</p>
              </div>

              <div className="bmg-card__section bmg-card__section--alt">
                <div className="bmg-card__section-label">
                  <span aria-hidden="true">↔️</span> {t('back_muscle_guide.card_sections.actions_label')}
                </div>
                <p className="bmg-card__section-text">{muscle.actions}</p>
              </div>

              <div className="bmg-card__section">
                <div className="bmg-card__section-label">
                  <span aria-hidden="true">💪</span> {t('back_muscle_guide.card_sections.activation_label')}
                </div>
                <p className="bmg-card__section-text">{muscle.activation}</p>
              </div>

              {muscle.isChronic && (
                <div className="bmg-card__section bmg-card__section--warning">
                  <div className="bmg-card__section-label bmg-card__section-label--warning">
                    <span aria-hidden="true">⚠️</span> {t('back_muscle_guide.card_sections.contracted_label')}
                  </div>
                  <p className="bmg-card__section-text">{muscle.contracted_position}</p>
                </div>
              )}

            </div>{/* end info col */}
          </div>{/* end .bmg-card__layout */}

          {/* ── STRETCH SECTION — full-width strip below ── */}
          <div className="bmg-card__stretch-section">

            <div className="bmg-card__stretch-section-header">
              <h4 className="bmg-card__stretch-section-title">🤸 {t('back_muscle_guide.card_sections.stretch_title')}</h4>
              <div className="bmg-card__stretch-divider" style={{ backgroundColor: meta.colorHex }} />
            </div>

            {/* Primary — always visible */}
            <div className="bmg-card__stretch-main">
              <StretchCard stretch={muscle.stretch_basic} colorHex={meta.colorHex} isMain stepsLabel={t('back_muscle_guide.stretch_steps_label')} />
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
                  {variantsOpen
                    ? t('back_muscle_guide.card_sections.hide_variants')
                    : t('back_muscle_guide.card_sections.show_variants', { count: muscle.stretch_variants.length })}
                </button>

                {variantsOpen && (
                  <div className="bmg-card__variants-grid">
                    {muscle.stretch_variants.map((variant, i) => (
                      <StretchCard key={i} stretch={variant} colorHex={meta.colorHex} stepsLabel={t('back_muscle_guide.stretch_steps_label')} />
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
   MAIN PAGE COMPONENT
   ============================================================ */
const BackMuscleGuide: React.FC = () => {
  const { t } = useTranslation();

  /* ── State ────────────────────────────────────────────── */
  const [introExpanded, setIntroExpanded] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  /* ── Refs ─────────────────────────────────────────────── */
  const navRef = useRef<HTMLElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  /* ── Carousel views from i18n ─────────────────────────── */
  const carouselViews: CarouselView[] = useMemo(() => {
    const views = t('back_muscle_guide.carousel_views', { returnObjects: true }) as Record<string, string>;
    const icons = t('back_muscle_guide.carousel_icons', { returnObjects: true }) as Record<string, string>;
    return (Object.keys(views) as (keyof MuscleImages)[]).map((key) => ({
      key,
      label: views[key],
      icon: icons[key] ?? '📷',
    }));
  }, [t]);

  /* ── Data: group muscles by layer (order from musclesData) ─ */
  const layerGroups = useMemo(() => {
    const grouped = groupByLayer(musclesData);
    return getUniqueLayers(musclesData).map((layer) => ({
      layer,
      meta: LAYER_META[layer] ?? {
        id: layer,
        displayName: layer,
        icon: '💪',
        colorHex: '#64748b',
      } as LayerMeta,
      muscles: grouped[layer] ?? [],
    }));
  }, []);

  /* ── Layer data from i18n ──────────────────────────────── */
  const layerKeys = ['superficial', 'intermediate', 'deep'] as const;
  const layerData = useMemo(() =>
    layerKeys.map((key) => ({
      key,
      number: t(`back_muscle_guide.layers.${key}.number`),
      title: t(`back_muscle_guide.layers.${key}.title`),
      subtitle: t(`back_muscle_guide.layers.${key}.subtitle`),
      role: t(`back_muscle_guide.layers.${key}.role`),
      text: t(`back_muscle_guide.layers.${key}.text`),
      overview: t(`back_muscle_guide.layers.${key}.overview`),
    })),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [t]);

  const integrationItems = t('back_muscle_guide.integration_items', { returnObjects: true }) as Array<{ label: string; text: string }>;

  /* ── Sticky nav shadow on scroll ─────────────────────── */
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const observer = new IntersectionObserver(
      ([entry]) => setNavScrolled(!entry.isIntersecting),
      { threshold: 0, rootMargin: `-${nav.offsetHeight}px 0px 0px 0px` }
    );

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
          <Link to="/" className="text-white/70 hover:text-white text-sm mb-2 inline-block transition-colors">
            ← {t('common.nav_home')}
          </Link>
          <h1 className="bmg-header__title">{t('back_muscle_guide.page_title')}</h1>
          <p className="bmg-header__subtitle">
            {t('back_muscle_guide.page_subtitle')}
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
        aria-label={t('back_muscle_guide.nav_label')}
      >
        <div className="bmg-container">
          <div className="bmg-nav__inner">
            {layerGroups.map(({ meta, muscles }) => (
              <button
                key={meta.id}
                className={`bmg-nav__link ${activeGroup === meta.id ? 'bmg-nav__link--active' : ''}`}
                onClick={() => scrollToGroup(meta.id)}
                aria-current={activeGroup === meta.id ? 'true' : undefined}
              >
                <span aria-hidden="true">{meta.icon}</span>
                {meta.displayName}
                <span className="bmg-nav__count" aria-label={t('back_muscle_guide.section_count', { count: muscles.length })}>
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
        <article className="bmg-intro__card">

          <h2 id="intro-heading" className="bmg-intro__heading">
            {t('back_muscle_guide.intro_heading')}
          </h2>

          <p className="bmg-intro__lead">
            {t('back_muscle_guide.intro_lead')}
          </p>

          <div
            className="bmg-intro__image-placeholder"
            role="img"
            aria-label={t('back_muscle_guide.intro_image_label')}
          >
            <span className="bmg-intro__image-placeholder__icon" aria-hidden="true">🩻</span>
            <span>{t('back_muscle_guide.intro_image_label')}</span>
            <span className="bmg-intro__image-placeholder__sub">{t('back_muscle_guide.intro_image_hint')}</span>
          </div>

          <p className="bmg-intro__bridge">
            {t('back_muscle_guide.intro_bridge')}
          </p>

          <button
            className="bmg-intro__toggle"
            onClick={() => setIntroExpanded((prev) => !prev)}
            aria-expanded={introExpanded}
            aria-controls="intro-expanded"
          >
            {introExpanded ? t('back_muscle_guide.intro_collapse') : t('back_muscle_guide.intro_expand')}
            <span
              className={`bmg-intro__toggle-icon ${introExpanded ? 'bmg-intro__toggle-icon--open' : ''}`}
              aria-hidden="true"
            >
              <ChevronDown size={16} />
            </span>
          </button>

          {introExpanded && (
            <div id="intro-expanded" className="bmg-intro__expanded">

              <ol className="bmg-intro__layer-list" aria-label={t('back_muscle_guide.nav_label')}>
                {layerData.map((layer) => (
                  <li key={layer.key} className={`bmg-intro__layer-item bmg-intro__layer-item--${layer.key === 'intermediate' ? 'erector' : layer.key}`}>
                    <h3 className="bmg-intro__layer-heading">
                      <span className="bmg-intro__layer-num" aria-hidden="true">{layer.number}</span>
                      {layer.title}
                      <span className="bmg-intro__layer-sub">({layer.subtitle})</span>
                      <span className="bmg-intro__layer-role">{layer.role}</span>
                    </h3>
                    <p className="bmg-intro__layer-text">{layer.text}</p>
                  </li>
                ))}
              </ol>

              <section className="bmg-intro__integration" aria-labelledby="integration-heading">
                <h3 id="integration-heading" className="bmg-intro__integration-heading">
                  {t('back_muscle_guide.integration_heading')}
                </h3>
                <p className="bmg-intro__layer-text">
                  {t('back_muscle_guide.integration_intro')}
                </p>
                <ul className="bmg-intro__integration-list">
                  {Array.isArray(integrationItems) && integrationItems.map((item, i) => (
                    <li key={i} className="bmg-intro__integration-item">
                      <strong>{item.label}</strong> {item.text}
                    </li>
                  ))}
                </ul>
              </section>

              <p className="bmg-intro__callout">
                {t('back_muscle_guide.intro_callout')}
              </p>

            </div>
          )}
        </article>

        {/* ── Group Overview Cards ─────────────────────── */}
        <div className="bmg-intro__groups" role="list">
          {layerData.map((layer) => (
            <article key={layer.key} className={`bmg-group-overview bmg-group-overview--${layer.key === 'intermediate' ? 'erector' : layer.key}`} role="listitem">
              <div className="bmg-group-overview__header">
                <span className="bmg-group-overview__icon" aria-hidden="true">
                  {layer.key === 'superficial' ? '🦾' : layer.key === 'intermediate' ? '⚡' : '🔬'}
                </span>
                <h3 className="bmg-group-overview__name">{layer.title}</h3>
              </div>
              <p className="bmg-group-overview__desc">{layer.overview}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          MAIN CONTENT — MUSCLE GROUP SECTIONS
          ══════════════════════════════════════════════════ */}
      <main className="bmg-main bmg-container" role="main">

        {layerGroups.map(({ meta, muscles }) => (
          <section
            key={meta.id}
            id={`group-${meta.id}`}
            ref={(el) => { sectionRefs.current[meta.id] = el; }}
            className="bmg-section"
            aria-labelledby={`section-title-${meta.id}`}
          >
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
                <span className="bmg-section__count">{t('back_muscle_guide.section_count', { count: muscles.length })}</span>
              </div>
            </div>

            <div
              className="bmg-section__chips"
              role="list"
              aria-label={`${t('back_muscle_guide.quick_jump_label')} — ${meta.displayName}`}
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

            <div
              className="bmg-cards-grid"
              role="list"
              aria-label={`${t('back_muscle_guide.carousel_label')} — ${meta.displayName}`}
            >
              {muscles.map((muscle) => (
                <MuscleCard key={muscle.id} muscle={muscle} meta={meta} carouselViews={carouselViews} />
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
          {t('back_muscle_guide.footer_text')}
        </p>
      </footer>
    </div>
  );
};

export default BackMuscleGuide;
