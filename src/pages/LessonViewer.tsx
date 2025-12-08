import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DynamicRenderer } from '../components/DynamicRenderer';
import { LessonData } from '../types';
import { Loader2, Settings } from 'lucide-react';

export const LessonViewer: React.FC = () => {
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [activeSection, setActiveSection] = useState<string>('intro');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use import.meta.env.BASE_URL to handle deployment on subpaths (e.g. GitHub Pages)
    const baseUrl = import.meta.env.BASE_URL.endsWith('/')
      ? import.meta.env.BASE_URL
      : import.meta.env.BASE_URL + '/';

    fetch(`${baseUrl}data/lesson-01.json`)
      .then(res => res.json())
      .then(data => {
        setLessonData(data);
        if (data.sections.length > 0) {
          setActiveSection(data.sections[0].id);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load lesson data", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-sky-600" />
      </div>
    );
  }

  if (!lessonData) {
    return <div className="p-10 text-center text-red-500">שגיאה בטעינת הנתונים. אנא נסה לרענן.</div>;
  }

  const currentSection = lessonData.sections.find(s => s.id === activeSection) || lessonData.sections[0];

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans" dir="rtl">

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-80 bg-white border-l border-gray-200 flex-shrink-0 z-20 md:h-screen md:sticky md:top-0 overflow-y-auto">
        <div className="p-6 border-b md:border-b-0">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-sky-100">🌊</div>
              <div>
                <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none">HydroLearning</h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">המדריך המקצועי</p>
              </div>
            </div>

            <Link to="/admin" className="p-2 text-slate-400 hover:text-sky-600 transition-colors" title="ניהול מערכת">
               <Settings size={20} />
            </Link>
          </div>

          <nav className="space-y-2">
            {lessonData.sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                   setActiveSection(section.id);
                   window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-full text-right px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
                  activeSection === section.id
                    ? 'bg-sky-50 text-sky-700 font-bold border-r-4 border-sky-500'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-sky-600 border-r-4 border-transparent'
                }`}
              >
                <span>{section.title}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-slate-50 relative">
        <div className="max-w-4xl mx-auto p-5 md:p-12 pb-24">

          {/* Header for Mobile/Desktop */}
          <header className="mb-10 pb-4 border-b border-gray-200">
             <div className="flex items-center justify-between">
                <div>
                   <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-3">{currentSection.title}</h2>
                   <p className="text-xl text-slate-500 font-light">{lessonData.description}</p>
                </div>
             </div>
          </header>

          {/* Dynamic Engine */}
          <DynamicRenderer components={currentSection.components} />

          {/* Navigation Footer */}
          <div className="mt-16 pt-8 border-t border-slate-200 flex justify-between">
             {(() => {
                const currentIndex = lessonData.sections.findIndex(s => s.id === activeSection);
                const prev = lessonData.sections[currentIndex - 1];
                const next = lessonData.sections[currentIndex + 1];

                return (
                  <>
                    <div>
                      {prev && (
                        <button
                          onClick={() => {
                            setActiveSection(prev.id);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold transition"
                        >
                          <span>→</span>
                          <span>{prev.title}</span>
                        </button>
                      )}
                    </div>
                    <div>
                      {next && (
                        <button
                          onClick={() => {
                             setActiveSection(next.id);
                             window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-600 text-white shadow-md shadow-sky-200 hover:bg-sky-700 font-bold transition"
                        >
                          <span>{next.title}</span>
                          <span>←</span>
                        </button>
                      )}
                    </div>
                  </>
                );
             })()}
          </div>

        </div>
      </main>
    </div>
  );
}
