import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ChevronUp,
  Home,
  BookOpen,
  AlertTriangle,
  Lightbulb,
  Stethoscope,
  FlaskConical,
  List as ListIcon,
  Table as TableIcon,
  FileText,
  ClipboardList,
  Info,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';
import '../features/hydrotherapy-course/HydrotherapyCourse.css';
import { courseData } from '../features/hydrotherapy-course/courseData';
import type {
  ContentBlock,
  Unit,
  Topic,
  Subtopic,
  KeyTerm,
} from '../features/hydrotherapy-course/types';

/* ============================================================
   HELPERS
   ============================================================ */

/** Parse **bold** markdown into React nodes */
function renderBoldText(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

/** Icon for content block type */
function blockIcon(type: string) {
  switch (type) {
    case 'definition': return <BookOpen size={16} />;
    case 'formula': return <FlaskConical size={16} />;
    case 'clinical_analysis': return <Stethoscope size={16} />;
    case 'clinical_application': return <Stethoscope size={16} />;
    case 'clinical_example': return <Stethoscope size={16} />;
    case 'clinical_implication': return <Info size={16} />;
    case 'enrichment': return <Lightbulb size={16} />;
    case 'warning': return <AlertTriangle size={16} />;
    case 'list': return <ListIcon size={16} />;
    case 'table': return <TableIcon size={16} />;
    case 'protocol': return <ClipboardList size={16} />;
    default: return <FileText size={16} />;
  }
}

/** CSS class for block type */
function blockClass(type: string): string {
  switch (type) {
    case 'warning': return 'htc-block htc-block--warning';
    case 'definition': return 'htc-block htc-block--definition';
    case 'formula': return 'htc-block htc-block--formula';
    case 'clinical_application':
    case 'clinical_analysis':
    case 'clinical_example':
    case 'clinical_implication':
      return 'htc-block htc-block--clinical';
    case 'enrichment': return 'htc-block htc-block--enrichment';
    case 'protocol': return 'htc-block htc-block--protocol';
    case 'table': return 'htc-block htc-block--table';
    case 'list': return 'htc-block htc-block--list';
    default: return 'htc-block htc-block--text';
  }
}

/** Human label for block type */
function blockLabel(type: string): string {
  switch (type) {
    case 'definition': return 'הגדרה';
    case 'formula': return 'נוסחה';
    case 'clinical_analysis': return 'ניתוח קליני';
    case 'clinical_application': return 'יישום קליני';
    case 'clinical_example': return 'דוגמה קלינית';
    case 'clinical_implication': return 'אימפליקציה קלינית';
    case 'enrichment': return 'העשרה';
    case 'warning': return 'אזהרה';
    case 'protocol': return 'פרוטוקול';
    case 'list': return 'רשימה';
    case 'table': return 'טבלה';
    default: return '';
  }
}

/* ============================================================
   KEY TERMS BADGE
   ============================================================ */
const KeyTermsBadge: React.FC<{ terms: KeyTerm[] }> = ({ terms }) => (
  <div className="htc-keyterms">
    {terms.map((term, i) => (
      <span key={i} className="htc-keyterms__badge">
        <span className="htc-keyterms__he">{term.he}</span>
        <span className="htc-keyterms__en">{term.en}</span>
      </span>
    ))}
  </div>
);

/* ============================================================
   CONTENT BLOCK RENDERER
   ============================================================ */
const ContentBlockRenderer: React.FC<{ block: ContentBlock }> = ({ block }) => {
  const label = blockLabel(block.type);

  return (
    <div className={blockClass(block.type)} id={block.id}>
      {/* Block header (type badge + title) */}
      {(label || block.title) && (
        <div className="htc-block__header">
          {label && (
            <span className="htc-block__type-badge">
              {blockIcon(block.type)}
              {label}
            </span>
          )}
          {block.title && (
            <h4 className="htc-block__title">{renderBoldText(block.title)}</h4>
          )}
        </div>
      )}

      {/* Main text */}
      <div className="htc-block__text">
        {renderBoldText(block.text)}
      </div>

      {/* Formula variables */}
      {block.variables && block.variables.length > 0 && (
        <div className="htc-block__variables">
          {block.variables.map((v, i) => (
            <div key={i} className="htc-block__variable">
              <code className="htc-block__var-symbol">{v.symbol}</code>
              <span className="htc-block__var-desc">{renderBoldText(v.description)}</span>
            </div>
          ))}
        </div>
      )}

      {/* List items */}
      {block.items && block.items.length > 0 && (
        block.ordered ? (
          <ol className="htc-block__list htc-block__list--ordered">
            {block.items.map((item, i) => (
              <li key={i} className="htc-block__list-item">
                {item.title && <strong className="htc-block__item-title">{item.title}: </strong>}
                {renderBoldText(item.text)}
              </li>
            ))}
          </ol>
        ) : (
          <ul className="htc-block__list">
            {block.items.map((item, i) => (
              <li key={i} className="htc-block__list-item">
                {item.title && <strong className="htc-block__item-title">{item.title}: </strong>}
                {renderBoldText(item.text)}
              </li>
            ))}
          </ul>
        )
      )}

      {/* Table */}
      {block.headers && block.rows && (
        <div className="htc-block__table-wrap">
          <table className="htc-block__table">
            <thead>
              <tr>
                {block.headers.map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci}>{renderBoldText(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Key terms */}
      {block.keyTerms && block.keyTerms.length > 0 && (
        <KeyTermsBadge terms={block.keyTerms} />
      )}
    </div>
  );
};

/* ============================================================
   SUBTOPIC SECTION
   ============================================================ */
const SubtopicSection: React.FC<{ subtopic: Subtopic }> = ({ subtopic }) => (
  <section className="htc-subtopic" id={subtopic.id}>
    <div className="htc-subtopic__header">
      <span className="htc-subtopic__number">{subtopic.subtopicNumber}</span>
      <div>
        <h4 className="htc-subtopic__title">{subtopic.title}</h4>
        <p className="htc-subtopic__en">{subtopic.englishTitle}</p>
      </div>
    </div>
    <div className="htc-subtopic__content">
      {subtopic.content.map((block) => (
        <ContentBlockRenderer key={block.id} block={block} />
      ))}
    </div>
  </section>
);

/* ============================================================
   TOPIC SECTION
   ============================================================ */
const TopicSection: React.FC<{ topic: Topic; unitNumber: number }> = ({ topic, unitNumber }) => (
  <section className="htc-topic" id={topic.id}>
    <div className="htc-topic__header">
      <span className="htc-topic__number">{unitNumber}.{topic.topicNumber}</span>
      <div>
        <h3 className="htc-topic__title">{topic.title}</h3>
        <p className="htc-topic__en">{topic.englishTitle}</p>
      </div>
    </div>

    {topic.introduction && (
      <div className="htc-topic__intro">
        {renderBoldText(topic.introduction)}
      </div>
    )}

    {/* Direct content (when no subtopics) */}
    {topic.content && topic.content.length > 0 && (
      <div className="htc-topic__content">
        {topic.content.map((block) => (
          <ContentBlockRenderer key={block.id} block={block} />
        ))}
      </div>
    )}

    {/* Subtopics */}
    {topic.subtopics.length > 0 && (
      <div className="htc-topic__subtopics">
        {topic.subtopics.map((sub) => (
          <SubtopicSection key={sub.id} subtopic={sub} />
        ))}
      </div>
    )}
  </section>
);

/* ============================================================
   UNIT SECTION
   ============================================================ */
const UnitSection: React.FC<{ unit: Unit }> = ({ unit }) => (
  <section className="htc-unit" id={unit.id}>
    <div className="htc-unit__header">
      <span className="htc-unit__number">יחידה {unit.unitNumber}</span>
      <h2 className="htc-unit__title">{unit.title}</h2>
      <p className="htc-unit__en">{unit.englishTitle}</p>
    </div>

    {unit.introduction && (
      <div className="htc-unit__intro">
        {renderBoldText(unit.introduction)}
      </div>
    )}

    <div className="htc-unit__topics">
      {unit.topics.map((topic) => (
        <TopicSection key={topic.id} topic={topic} unitNumber={unit.unitNumber} />
      ))}
    </div>
  </section>
);

/* ============================================================
   SIDEBAR NAV
   ============================================================ */
const SidebarNav: React.FC<{
  units: Unit[];
  activeId: string;
  onNavigate: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}> = ({ units, activeId, onNavigate, isOpen, onClose }) => {
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(() => new Set(units.map(u => u.id)));

  const toggleUnit = (id: string) => {
    setExpandedUnits(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleNav = (id: string) => {
    onNavigate(id);
    onClose();
  };

  return (
    <nav className={`htc-sidebar ${isOpen ? 'htc-sidebar--open' : ''}`} aria-label="ניווט בין יחידות">
      <div className="htc-sidebar__header">
        <span className="htc-sidebar__logo">
          <BookOpen size={18} />
          תוכן עניינים
        </span>
        <button className="htc-sidebar__close" onClick={onClose} aria-label="סגור תפריט">
          <X size={20} />
        </button>
      </div>

      {/* Intro link */}
      <button
        className={`htc-sidebar__item htc-sidebar__item--intro ${activeId === 'intro' ? 'htc-sidebar__item--active' : ''}`}
        onClick={() => handleNav('intro')}
      >
        מבוא
      </button>

      {/* Units */}
      {units.map((unit) => (
        <div key={unit.id} className="htc-sidebar__unit">
          <button
            className="htc-sidebar__unit-btn"
            onClick={() => toggleUnit(unit.id)}
            aria-expanded={expandedUnits.has(unit.id)}
          >
            <span className="htc-sidebar__unit-num">{unit.unitNumber}</span>
            <span className="htc-sidebar__unit-title">{unit.title}</span>
            {expandedUnits.has(unit.id) ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {expandedUnits.has(unit.id) && (
            <div className="htc-sidebar__topics">
              {unit.topics.map((topic) => (
                <button
                  key={topic.id}
                  className={`htc-sidebar__item ${activeId === topic.id ? 'htc-sidebar__item--active' : ''}`}
                  onClick={() => handleNav(topic.id)}
                >
                  <span className="htc-sidebar__topic-num">{unit.unitNumber}.{topic.topicNumber}</span>
                  {topic.title}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* References link */}
      <button
        className={`htc-sidebar__item htc-sidebar__item--refs ${activeId === 'references' ? 'htc-sidebar__item--active' : ''}`}
        onClick={() => handleNav('references')}
      >
        מקורות
      </button>
    </nav>
  );
};

/* ============================================================
   MAIN PAGE
   ============================================================ */
const HydrotherapyCourse: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeId, setActiveId] = useState('intro');
  const mainRef = useRef<HTMLDivElement>(null);

  const navigateTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const sections = document.querySelectorAll('.htc-unit, .htc-topic, #intro, #references');
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );

    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="htc-page" dir="rtl">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && <div className="htc-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Sticky header */}
      <header className="htc-header">
        <div className="htc-header__inner">
          <div className="htc-header__right">
            <button
              className="htc-header__menu-btn"
              onClick={() => setSidebarOpen(prev => !prev)}
              aria-label="תפריט ניווט"
            >
              <Menu size={20} />
            </button>
            <div className="htc-header__title-group">
              <h1 className="htc-header__title">{courseData.title}</h1>
              <span className="htc-header__subtitle">{courseData.englishTitle}</span>
            </div>
          </div>
          <Link to="/" className="htc-header__home" aria-label="חזרה לדף הבית">
            <Home size={18} />
          </Link>
        </div>
      </header>

      <div className="htc-layout">
        {/* Sidebar */}
        <SidebarNav
          units={courseData.units}
          activeId={activeId}
          onNavigate={navigateTo}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main content */}
        <main className="htc-main" ref={mainRef}>
          {/* Introduction */}
          <section className="htc-intro" id="intro">
            <h2 className="htc-intro__title">{courseData.introduction.title}</h2>
            <div className="htc-intro__content">
              {courseData.introduction.content.map((block) => (
                <ContentBlockRenderer key={block.id} block={block} />
              ))}
            </div>
          </section>

          {/* Units */}
          {courseData.units.map((unit) => (
            <UnitSection key={unit.id} unit={unit} />
          ))}

          {/* References */}
          <section className="htc-references" id="references">
            <h2 className="htc-references__title">מקורות ביבליוגרפיים</h2>
            <ol className="htc-references__list">
              {courseData.references.map((ref) => (
                <li key={ref.id} className="htc-references__item">
                  <span className="htc-references__text">{ref.text}</span>
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="htc-references__link"
                  >
                    <ExternalLink size={12} />
                    קישור
                  </a>
                </li>
              ))}
            </ol>
          </section>

          {/* Footer */}
          <footer className="htc-footer">
            <p>גרסה {courseData.version} • עדכון אחרון: {courseData.lastUpdated}</p>
            <p>תוכן זה מוצג לצורכי חינוך והפנמה בלבד.</p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default HydrotherapyCourse;
