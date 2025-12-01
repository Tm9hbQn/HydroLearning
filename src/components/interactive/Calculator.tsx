import { useState } from 'react';

export const Calculator = ({ title, labels }: any) => {
  const [weight, setWeight] = useState(80);
  const [depth, setDepth] = useState(0.1);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center" dir="rtl">
      <h4 className="font-bold text-sky-700 mb-4">{title}</h4>
      <div className="flex flex-col md:flex-row items-center gap-4 w-full justify-center">
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1">{labels.input}</label>
          <input type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} className="w-full p-3 bg-slate-50 rounded-lg font-bold text-center border" />
        </div>
        <div className="text-sky-300 text-2xl">←</div>
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1">{labels.factor}</label>
          <select value={depth} onChange={e => setDepth(Number(e.target.value))} className="w-full p-3 bg-slate-50 rounded-lg text-sm border">
            <option value={0.1}>צוואר (10%)</option>
            <option value={0.3}>חזה (30%)</option>
            <option value={0.5}>מותן (50%)</option>
          </select>
        </div>
        <div className="text-sky-300 text-2xl">←</div>
        <div className="bg-sky-50 p-4 rounded-xl text-center w-full md:w-40 border border-sky-100">
          <div className="text-3xl font-black text-sky-600">{(weight * depth).toFixed(1)}</div>
          <div className="text-xs font-bold text-sky-400">{labels.output}</div>
        </div>
      </div>
    </div>
  );
};
