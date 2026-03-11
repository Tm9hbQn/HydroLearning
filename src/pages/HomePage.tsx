import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowDown, Wind, Activity, Bone, Droplets, ArrowLeft, BookOpen } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  'arrow-down': ArrowDown,
  'wind': Wind,
  'activity': Activity,
  'bone': Bone,
  'droplets': Droplets,
  'book-open': BookOpen,
};

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  blue:   { bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-700',   icon: 'text-blue-600' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', icon: 'text-purple-600' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', icon: 'text-orange-600' },
  green:  { bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-700',  icon: 'text-green-600' },
};

interface TopicItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
}

const TopicCard: React.FC<{ topic: TopicItem }> = ({ topic }) => {
  const colors = COLOR_MAP[topic.color] ?? COLOR_MAP.blue;
  const Icon = ICON_MAP[topic.icon];

  return (
    <Link
      to={topic.route}
      className={`block rounded-xl border ${colors.border} ${colors.bg} p-5 transition-all hover:shadow-md hover:-translate-y-0.5 group`}
    >
      <div className="flex items-start gap-3">
        {Icon && (
          <div className={`p-2 rounded-lg bg-white/70 ${colors.icon} shrink-0`}>
            <Icon size={22} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className={`font-bold text-base ${colors.text} mb-1`}>{topic.title}</h3>
          <p className="text-sm text-slate-600 leading-relaxed">{topic.description}</p>
        </div>
        <ArrowLeft size={18} className={`${colors.icon} opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1`} />
      </div>
    </Link>
  );
};

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const topics = t('topics', { returnObjects: true }) as TopicItem[];
  const paragraphs = t('home.intro_paragraphs', { returnObjects: true }) as string[];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-bl from-brand-800 via-brand-600 to-blue-500 text-white py-12 px-4 -mx-4 -mt-8 mb-8 rounded-b-3xl">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3 leading-tight">
            {t('home.hero_title')}
          </h1>
          <p className="text-blue-100 text-lg">
            {t('home.hero_subtitle')}
          </p>
        </div>
      </section>

      {/* Intro Paragraphs */}
      <section className="mb-10">
        {Array.isArray(paragraphs) && paragraphs.map((text, i) => (
          <p key={i} className="text-slate-700 leading-relaxed mb-4 text-base">
            {text}
          </p>
        ))}
      </section>

      {/* Topics Grid */}
      <section>
        <h2 className="font-serif text-2xl font-bold text-slate-900 mb-6">
          {t('home.topics_heading')}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.isArray(topics) && topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
