import React, { useEffect } from 'react';
import { DynamicRenderer } from '../components/DynamicRenderer';
import { Loader2, AlertCircle } from 'lucide-react';
import { useLessonStore } from '../store/useLessonStore';
import { fetchLessonData } from '../services/lessonService';
import { Layout } from '../components/layout/Layout';

export const LessonViewer: React.FC = () => {
  const {
    lessonData,
    activeSectionId,
    isLoading,
    error,
    setLessonData,
    setActiveSectionId,
    setLoading,
    setError
  } = useLessonStore();

  useEffect(() => {
    const loadData = async () => {
      // Avoid reloading if we already have data (unless we want to force refresh)
      // For now, let's load if empty.
      if (lessonData) return;

      setLoading(true);
      try {
        const data = await fetchLessonData();
        setLessonData(data);
        // Set initial section if not set
        if (data.sections.length > 0 && !activeSectionId) {
          setActiveSectionId(data.sections[0].id);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load lesson");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [lessonData, activeSectionId, setLessonData, setActiveSectionId, setLoading, setError]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-sky-600" />
          <p className="text-slate-500 font-medium">טוען שיעור...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border-t-4 border-red-500">
           <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
              <AlertCircle size={32} />
           </div>
           <h2 className="text-xl font-bold text-slate-800 mb-2">שגיאה בטעינת השיעור</h2>
           <p className="text-slate-600 mb-6">{error}</p>
           <button
             onClick={() => window.location.reload()}
             className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition w-full"
           >
             נסה שוב
           </button>
        </div>
      </div>
    );
  }

  if (!lessonData) {
    return null; // Should not happen given loading/error states
  }

  const currentSection = lessonData.sections.find(s => s.id === activeSectionId) || lessonData.sections[0];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-5 md:p-12 pb-24">
          {/* Section Header */}
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
                const currentIndex = lessonData.sections.findIndex(s => s.id === activeSectionId);
                const prev = lessonData.sections[currentIndex - 1];
                const next = lessonData.sections[currentIndex + 1];

                return (
                  <>
                    <div>
                      {prev && (
                        <button
                          onClick={() => {
                            setActiveSectionId(prev.id);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold transition"
                        >
                          <span>→</span>
                          <span className="hidden md:inline">{prev.title}</span>
                          <span className="md:hidden">הקודם</span>
                        </button>
                      )}
                    </div>
                    <div>
                      {next && (
                        <button
                          onClick={() => {
                             setActiveSectionId(next.id);
                             window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-600 text-white shadow-md shadow-sky-200 hover:bg-sky-700 font-bold transition"
                        >
                          <span className="hidden md:inline">{next.title}</span>
                          <span className="md:hidden">הבא</span>
                          <span>←</span>
                        </button>
                      )}
                    </div>
                  </>
                );
             })()}
          </div>
      </div>
    </Layout>
  );
};
