import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const Admin: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
           <h1 className="text-3xl font-black text-slate-800">ניהול מערכת (Admin)</h1>
           <Link to="/" className="flex items-center gap-2 text-sky-600 hover:text-sky-800 font-bold">
              <span>חזרה ללומדה</span>
              <ArrowLeft size={20} />
           </Link>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
           <p className="text-xl text-slate-600 mb-4">ברוכים הבאים לממשק הניהול.</p>
           <p className="text-slate-500">
             כאן תוכלו לערוך את תוכני השיעורים, לנהל משתמשים ולצפות בנתונים.
             (הפונקציונליות עדיין בפיתוח)
           </p>

           <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 hover:border-sky-300 transition cursor-pointer">
                 <h3 className="font-bold text-lg mb-2 text-slate-800">עריכת שיעורים</h3>
                 <p className="text-slate-500 text-sm">עריכת קבצי ה-JSON של השיעורים</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 hover:border-sky-300 transition cursor-pointer">
                 <h3 className="font-bold text-lg mb-2 text-slate-800">ניהול מדיה</h3>
                 <p className="text-slate-500 text-sm">העלאה וניהול של תמונות וקבצים</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
