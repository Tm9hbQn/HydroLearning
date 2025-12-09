import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DynamicRenderer } from '../components/DynamicRenderer';
import { LessonData } from '../types';
import { Loader2, Settings, Menu, X } from 'lucide-react';

export const LessonViewer: React.FC = () => {
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [activeSection, setActiveSection] = useState<string>('intro');
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    <div className="min-h-screen flex flex-col md:flex-row font-sans relative" dir="rtl">

      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 sticky top-0 z-30 flex items-center justify-between">
         <button
           onClick={() => setIsSidebarOpen(true)}
           className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg"
         >
            <Menu size={24} />
         </button>

         <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">🌊</div>
            <span className="font-black text-slate-800">HydroLearning</span>
         </div>

         <Link to="/admin" className="p-2 text-slate-400 hover:text-sky-600">
             <Settings size={20} />
         </Link>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 right-0 w-80 bg-white border-l border-gray-200 z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen md:sticky md:top-0 overflow-y-auto
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="p-6 border-b md:border-b-0">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-sky-100">🌊</div>
              <div>
                <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none">HydroLearning</h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">המדריך המקצועי</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
               <Link to="/admin" className="p-2 text-slate-400 hover:text-sky-600 transition-colors hidden md:block" title="ניהול מערכת">
                  <Settings size={20} />
               </Link>

               {/* Close button for mobile */}
               <button
                 onClick={() => setIsSidebarOpen(false)}
                 className="md:hidden p-2 text-slate-400 hover:text-red-500"
               >
                 <X size={20} />
               </button>
            </div>
          </div>

          <nav className="space-y-2">
            {lessonData.sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                   setActiveSection(section.id);
                   setIsSidebarOpen(false); // Close sidebar on selection (mobile)
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
      <main className="flex-1 bg-slate-50 relative w-full">
        <div className="max-w-4xl mx-auto p-5 md:p-12 pb-24">

          {/* Header for Desktop (hidden on mobile since we have the sticky header) */}
          <header className="mb-10 pb-4 border-b border-gray-200 hidden md:block">
             <div className="flex items-center justify-between">
                <div>
                   <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-3">{currentSection.title}</h2>
                   <p className="text-xl text-slate-500 font-light">{lessonData.description}</p>
                </div>
             </div>
          </header>

          {/* Mobile Title (since we hid the big header) */}
          <div className="md:hidden mb-6">
              <h2 className="text-2xl font-black text-slate-800 mb-2">{currentSection.title}</h2>
              <p className="text-sm text-slate-500">{lessonData.description}</p>
          </div>

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
