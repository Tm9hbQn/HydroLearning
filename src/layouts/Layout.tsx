import React from 'react';
import { Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12" dir="rtl">
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">{t('common.title')}</h1>
            <p className="text-xs text-slate-500 mt-1">{t('common.subtitle')}</p>
          </div>
          <div className="bg-blue-600 text-white p-2.5 rounded-full shadow-md shadow-blue-200">
            <Activity size={24} />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {children}
        <div className="text-center text-slate-400 text-sm py-8 border-t border-slate-200 mt-8">
           {t('common.footer')}
        </div>
      </main>
    </div>
  );
};
