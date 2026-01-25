import React, { useState } from 'react';
import { Wind } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/Card';
import { Slider } from '../../components/ui/Slider';
import { cn } from '../../lib/utils';

export const DragForceSim = () => {
  const { t } = useTranslation();
  const [speed, setSpeed] = useState(1);
  const [shape, setShape] = useState<'knife' | 'open'>('knife');

  const area = shape === 'knife' ? 1 : 3.5;
  const constant = 0.5;
  const resistance = 0.5 * constant * area * Math.pow(speed, 2);
  const maxResistance = 0.5 * constant * 3.5 * Math.pow(10, 2);
  const gaugePercent = Math.min((resistance / maxResistance) * 100, 100);

  const getEffortLabel = () => {
    if (gaugePercent < 20) return t('drag_force.effort.light');
    if (gaugePercent < 50) return t('drag_force.effort.medium');
    if (gaugePercent < 80) return t('drag_force.effort.high');
    return t('drag_force.effort.max');
  };

  return (
    <Card
      title={t('drag_force.title')}
      description={t('drag_force.description')}
      icon={Wind}
      instructions={t('drag_force.instructions')}
    >
      <div className="flex flex-col gap-4">

        {/* Top: Shape Selection (Compact) */}
        <div>
           <label className="text-xs font-bold text-slate-500 mb-2 block">{t('drag_force.surface_area')}</label>
           <div className="flex gap-4">
            <button
              onClick={() => setShape('knife')}
              className={cn(
                "flex-1 p-2 rounded-lg border-2 transition-all flex flex-row items-center justify-center gap-2",
                shape === 'knife' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500'
              )}
            >
              <div className="w-6 h-1 bg-current rounded-full rotate-45"></div>
              <span className="text-sm font-bold">{t('drag_force.knife_hand')}</span>
            </button>
            <button
              onClick={() => setShape('open')}
              className={cn(
                "flex-1 p-2 rounded-lg border-2 transition-all flex flex-row items-center justify-center gap-2",
                shape === 'open' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500'
              )}
            >
              <div className="w-6 h-6 bg-current rounded-md"></div>
              <span className="text-sm font-bold">{t('drag_force.open_hand')}</span>
            </button>
           </div>
        </div>

        {/* Speed Slider */}
        <div className="mt-2">
            <label className="text-sm font-medium text-slate-700 mb-2 block flex justify-between">
            <span>{t('drag_force.velocity')}</span>
            <span className="font-bold">{speed} {t('drag_force.mps')}</span>
            </label>
            <Slider
              min={1}
              max={10}
              step={0.5}
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
            />
        </div>

        {/* Unified Visual & Gauge Container */}
        <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
            {/* Gauge Header */}
            <div className="bg-white p-4 border-b border-slate-100 flex justify-between items-start min-h-[5rem]">
                 <div>
                    <div className="text-xs text-slate-500 font-bold mb-1">{t('drag_force.resistance_gauge')}</div>
                    <div className="text-lg font-bold text-slate-800">
                        {resistance.toFixed(1)} <span className="text-sm font-normal text-slate-500">{t('drag_force.newton')}</span>
                    </div>
                 </div>
                 <div className="text-xs font-medium bg-slate-100 px-2 py-1 rounded text-slate-600 max-w-[50%] text-left">
                   {getEffortLabel()}
                 </div>
            </div>

            {/* Gauge Bar */}
            <div className="h-4 bg-slate-200 relative">
                <div
                  className={cn(
                    "h-full transition-all duration-300 ease-out",
                    gaugePercent < 30 ? 'bg-green-500' : gaugePercent < 70 ? 'bg-yellow-500' : 'bg-red-600'
                  )}
                  style={{ width: `${gaugePercent}%` }}
                />
            </div>

            {/* Visual Animation Area */}
            <div className="relative h-48 flex items-center justify-center bg-slate-50 overflow-hidden">
                {/* Hand */}
                <div
                  className={cn(
                    "transition-all duration-300 transform bg-white border-4 border-slate-700 flex items-center justify-center shadow-lg z-10 rounded-xl",
                    shape === 'knife' ? 'scale-x-50 w-24' : 'scale-100 w-24'
                  )}
                  style={{ height: '6rem' }}
                >
                    <span className="text-4xl">✋</span>
                </div>

                {/* Resistance Bars (Placeholders + Fill) */}
                <div className="absolute top-0 bottom-0 -right-4 flex flex-col justify-center gap-2 z-0 w-1/2 pr-6">
                    {[...Array(6)].map((_, i) => (
                       <div key={i} className="h-2 w-full bg-slate-200 rounded-l-full shadow-inner overflow-hidden">
                           {/* Inner Fill - Exact correlation to gauge percent */}
                           <div
                             className="h-full bg-red-500 transition-all duration-300 rounded-l-full"
                             style={{
                               width: `${Math.max(0, (gaugePercent - (i * 15)) * 6.6)}%`, // Staggered fill but full bars
                               opacity: 0.8
                             }}
                           />
                       </div>
                    ))}
                    <div className="absolute bottom-2 right-6 text-xs font-bold text-red-500">{t('drag_force.drag_force')}</div>
                </div>
            </div>
        </div>
      </div>
    </Card>
  );
};
