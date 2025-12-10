import React, { useState } from 'react';
import { Menu, X, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLessonStore } from '../../store/useLessonStore';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { lessonData, activeSectionId, setActiveSectionId } = useLessonStore();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // If no data, just render children (loading/error states handled by page)
  if (!lessonData) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans bg-slate-50" dir="rtl">

      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-sm shadow-md">🌊</div>
           <h1 className="font-bold text-slate-800">HydroLearning</h1>
        </div>
        <button onClick={toggleSidebar} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 right-0 z-40 w-64 bg-white border-l border-gray-200 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:w-80 md:h-screen md:sticky md:top-0 md:block
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="h-full flex flex-col overflow-y-auto">
          <div className="p-6 border-b hidden md:block">
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
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {lessonData.sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                   setActiveSectionId(section.id);
                   closeSidebar();
                   window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-full text-right px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
                  activeSectionId === section.id
                    ? 'bg-sky-50 text-sky-700 font-bold border-r-4 border-sky-500'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-sky-600 border-r-4 border-transparent'
                }`}
              >
                <span>{section.title}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t text-center text-xs text-slate-400 md:hidden">
            <Link to="/admin">ניהול מערכת</Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  );
};
