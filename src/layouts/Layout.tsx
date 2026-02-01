import React from 'react';
import { Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-parchment text-ink font-sans pb-12" dir="rtl">
      <header className="bg-parchment/95 backdrop-blur-sm sticky top-0 z-50 border-b-2 border-ink shadow-none">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-serif font-bold text-ink">{t('common.title')}</h1>
            <p className="text-xs text-ink-light mt-1 font-mono tracking-wide">{t('common.subtitle')}</p>
          </div>
          <div className="bg-transparent border-2 border-sanguine text-sanguine p-2 rounded-full">
            <Activity size={24} strokeWidth={2.5} />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {children}
        <div className="text-center text-ink-light text-sm py-8 border-t border-ink/20 mt-8 font-mono">
           {t('common.footer')}
        </div>
      </main>
    </div>
  );
};
