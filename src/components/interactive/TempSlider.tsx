import { useState } from 'react';

export const TempSlider = ({ min, max, default: def }: any) => {
  const [val, setVal] = useState(def);

  const getInfo = (v: number) => {
    if (v <= 20) return { color: 'text-blue-600', effect: 'כיווץ כלי דם, אלחוש (סטימולנטי)', use: 'התאוששות ספורט, מצב אקוטי' };
    if (v <= 29) return { color: 'text-sky-500', effect: 'שמירה על טונוס, מניעת חימום', use: 'שחייה, טרשת נפוצה (MS)' };
    if (v <= 36) return { color: 'text-amber-500', effect: 'איזון תרמי, הרפיה מתונה', use: 'שיקום כללי, הליוויק, ילדים' };
    return { color: 'text-red-500', effect: 'סדציה (הרגעה), הרחבת כלי דם', use: 'כאב כרוני, ספא, וואטסו' };
  };

  const info = getInfo(val);

  return (
    <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 relative overflow-hidden" dir="rtl">
      <div className="flex justify-between items-end mb-6">
        <h4 className="font-bold text-slate-600">סרגל טמפרטורות</h4>
        <span className={`text-5xl font-black ${info.color}`}>{val}°C</span>
      </div>
      <input type="range" min={min} max={max} value={val} onChange={(e) => setVal(Number(e.target.value))} className="w-full mb-8 h-2 bg-gradient-to-l from-red-500 via-yellow-400 to-blue-500 rounded-lg appearance-none cursor-pointer" />
      <div className="grid md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl">
        <div><div className="text-xs font-bold text-slate-400">אפקט פיזיולוגי</div><div className="font-bold text-slate-700">{info.effect}</div></div>
        <div><div className="text-xs font-bold text-slate-400">שימושים</div><div className="font-bold text-slate-700">{info.use}</div></div>
      </div>
    </div>
  );
};
