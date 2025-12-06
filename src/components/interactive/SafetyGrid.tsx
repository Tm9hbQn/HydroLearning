import React, { useState } from 'react';

export const SafetyGrid = ({ items }: any) => {
  const [filter, setFilter] = useState<'all' | 'absolute' | 'relative'>('all');

  return (
    <div dir="rtl">
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'absolute', 'relative'].map(f => (
          <button key={f} onClick={() => setFilter(f as any)}
            className={`px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap transition ${filter === f ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-800'}`}>
            {f === 'all' ? 'הכל' : f === 'absolute' ? 'אסור מוחלט' : 'זהירות נדרשת'}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.filter((i: any) => filter === 'all' || i.type === filter).map((item: any, idx: number) => (
          <div key={idx} className={`p-4 rounded-xl border-r-4 ${item.type === 'absolute' ? 'border-red-500 bg-red-50' : 'border-yellow-400 bg-yellow-50'}`}>
            <div className="flex justify-between mb-1"><span className="text-xs font-bold px-2 py-1 rounded bg-white/60">{item.type === 'absolute' ? 'אסור מוחלט' : 'זהירות'}</span></div>
            <h4 className="font-bold text-slate-800">{item.title}</h4>
            <p className="text-sm text-slate-700 mt-1">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
