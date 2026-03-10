import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Activity, Home, Wrench } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';

export const Layout: React.FC = () => {
  const { t } = useTranslation();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
      isActive
        ? 'bg-blue-100 text-blue-700'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
    );

  return (
    <div className="min-h-screen bg-surface-bg text-slate-800 font-sans pb-12" dir="rtl">
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <NavLink to="/" className="flex items-center gap-2">
              <div className="bg-blue-600 text-white p-2 rounded-full shadow-md shadow-blue-200">
                <Activity size={20} />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">{t('common.title')}</h1>
                <p className="text-[11px] text-slate-500">{t('common.subtitle')}</p>
              </div>
            </NavLink>
          </div>
          <nav className="flex items-center gap-1">
            <NavLink to="/" end className={navLinkClass}>
              <Home size={16} />
              <span className="hidden sm:inline">{t('common.nav_home')}</span>
            </NavLink>
            <NavLink to="/tools" className={navLinkClass}>
              <Wrench size={16} />
              <span className="hidden sm:inline">{t('common.nav_tools')}</span>
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Outlet />
        <footer className="text-center text-slate-400 text-sm py-8 border-t border-slate-200 mt-8">
          {t('common.footer')}
        </footer>
      </main>
    </div>
  );
};
