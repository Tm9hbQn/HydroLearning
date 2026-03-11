import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Home, BookOpen } from 'lucide-react';
import { ContentBlockRenderer } from '../features/hydrotherapy-course/ContentBlock';
import type { CourseData, Topic, Subtopic } from '../features/hydrotherapy-course/types';
import courseJson from '../features/hydrotherapy-course/courseData.json';
import '../features/hydrotherapy-course/HydrotherapyCourse.css';

const course = courseJson as CourseData;

// "intro" is index -1 internally, units are 0..N-1
const INTRO_INDEX = -1;

const HydrotherapyCoursePage: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(INTRO_INDEX);
  const mainRef = useRef<HTMLDivElement>(null);

  const totalSections = 1 + course.units.length; // intro + units
  const progressPercent =
    ((activeIndex - INTRO_INDEX + 1) / totalSections) * 100;

  const navigateTo = useCallback((index: number) => {
    setActiveIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const prevIndex = activeIndex > INTRO_INDEX ? activeIndex - 1 : null;
  const nextIndex =
    activeIndex < course.units.length - 1 ? activeIndex + 1 : null;

  const getPrevLabel = () => {
    if (prevIndex === null) return '';
    if (prevIndex === INTRO_INDEX) return course.introduction.title;
    return course.units[prevIndex].title;
  };

  const getNextLabel = () => {
    if (nextIndex === null) return '';
    return course.units[nextIndex].title;
  };

  return (
    <div className="hc-page">
      {/* Header */}
      <header className="hc-header">
        <h1 className="hc-header__title">{course.title}</h1>
        <p className="hc-header__subtitle">{course.englishTitle}</p>
        <div className="hc-header__nav">
          <Link to="/" className="hc-header__home-btn">
            <Home size={14} />
            דף הבית
          </Link>
        </div>
        <div className="hc-progress">
          <div
            className="hc-progress__bar"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* Unit Navigation Pills */}
      <nav className="hc-unit-nav" aria-label="ניווט בין יחידות">
        <button
          className={`hc-unit-nav__pill hc-unit-nav__pill--intro ${
            activeIndex === INTRO_INDEX ? 'hc-unit-nav__pill--active' : ''
          }`}
          onClick={() => navigateTo(INTRO_INDEX)}
        >
          מבוא
        </button>
        {course.units.map((unit, i) => (
          <button
            key={unit.id}
            className={`hc-unit-nav__pill ${
              activeIndex === i ? 'hc-unit-nav__pill--active' : ''
            }`}
            onClick={() => navigateTo(i)}
          >
            {unit.unitNumber}. {unit.title}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="hc-main" ref={mainRef}>
        {activeIndex === INTRO_INDEX ? (
          <IntroSection />
        ) : (
          <UnitSection unit={course.units[activeIndex]} />
        )}

        {/* Prev/Next Navigation */}
        <div className="hc-nav-footer">
          <button
            className="hc-nav-footer__btn"
            disabled={prevIndex === null}
            onClick={() => prevIndex !== null && navigateTo(prevIndex)}
          >
            <ChevronRight size={20} />
            <div>
              <span className="hc-nav-footer__label">הקודם</span>
              <span className="hc-nav-footer__title">{getPrevLabel()}</span>
            </div>
          </button>
          <button
            className="hc-nav-footer__btn"
            disabled={nextIndex === null}
            onClick={() => nextIndex !== null && navigateTo(nextIndex)}
            style={{ flexDirection: 'row-reverse', textAlign: 'left' }}
          >
            <ChevronLeft size={20} />
            <div>
              <span className="hc-nav-footer__label">הבא</span>
              <span className="hc-nav-footer__title">{getNextLabel()}</span>
            </div>
          </button>
        </div>

        {/* References (only on last unit) */}
        {activeIndex === course.units.length - 1 && course.references.length > 0 && (
          <ReferencesSection />
        )}
      </main>
    </div>
  );
};

/* ---- Intro Section ---- */
const IntroSection: React.FC = () => {
  const intro = course.introduction;
  return (
    <section>
      <div className="hc-unit-header">
        <span className="hc-unit-header__number hc-unit-header__number--intro">
          <BookOpen size={12} style={{ display: 'inline', verticalAlign: '-2px', marginLeft: '4px' }} />
          מבוא
        </span>
        <h2 className="hc-unit-header__title">{intro.title}</h2>
      </div>
      {intro.content.map((block) => (
        <ContentBlockRenderer key={block.id} block={block} />
      ))}
    </section>
  );
};

/* ---- Unit Section ---- */
const UnitSection: React.FC<{ unit: CourseData['units'][number] }> = ({ unit }) => {
  return (
    <section>
      <div className="hc-unit-header">
        <span className="hc-unit-header__number">יחידה {unit.unitNumber}</span>
        <h2 className="hc-unit-header__title">{unit.title}</h2>
        <p className="hc-unit-header__en-title">{unit.englishTitle}</p>
        {unit.introduction && (
          <p className="hc-unit-header__intro">{unit.introduction}</p>
        )}
      </div>

      {unit.topics.map((topic) => (
        <TopicSection key={topic.id} topic={topic} unitNumber={unit.unitNumber} />
      ))}
    </section>
  );
};

/* ---- Topic Section ---- */
const TopicSection: React.FC<{ topic: Topic; unitNumber: number }> = ({ topic, unitNumber }) => {
  return (
    <div className="hc-topic">
      <div className="hc-topic__header">
        <div className="hc-topic__number">
          נושא {unitNumber}.{topic.topicNumber}
        </div>
        <h3 className="hc-topic__title">{topic.title}</h3>
        <div className="hc-topic__en-title">{topic.englishTitle}</div>
      </div>

      {topic.introduction && (
        <p className="hc-topic__intro">{topic.introduction}</p>
      )}

      {/* Topic-level content (some topics have content directly) */}
      {topic.content?.map((block) => (
        <ContentBlockRenderer key={block.id} block={block} />
      ))}

      {/* Subtopics */}
      {topic.subtopics.map((subtopic) => (
        <SubtopicSection key={subtopic.id} subtopic={subtopic} />
      ))}
    </div>
  );
};

/* ---- Subtopic Section ---- */
const SubtopicSection: React.FC<{ subtopic: Subtopic }> = ({ subtopic }) => {
  return (
    <div className="hc-subtopic">
      <div className="hc-subtopic__header">
        <div className="hc-subtopic__number">{subtopic.subtopicNumber}</div>
        <h4 className="hc-subtopic__title">{subtopic.title}</h4>
        <div className="hc-subtopic__en-title">{subtopic.englishTitle}</div>
      </div>

      {subtopic.content.map((block) => (
        <ContentBlockRenderer key={block.id} block={block} />
      ))}
    </div>
  );
};

/* ---- References Section ---- */
const ReferencesSection: React.FC = () => {
  return (
    <div className="hc-references">
      <h3 className="hc-references__title">מקורות</h3>
      <ol className="hc-references__list">
        {course.references.map((ref) => (
          <li key={ref.id} className="hc-references__item">
            <a
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hc-references__link"
            >
              {ref.text}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default HydrotherapyCoursePage;
