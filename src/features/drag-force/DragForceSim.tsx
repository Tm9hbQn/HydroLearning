import React, { useState } from 'react';
import { Wind } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/Card';
import { Slider } from '../../components/ui/Slider';
import { Button } from '../../components/ui/Button';
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
           <label className="text-xs font-bold text-ink-light mb-2 block font-mono">{t('drag_force.surface_area')}</label>
           <div className="flex gap-4">
            <Button
              onClick={() => setShape('knife')}
              variant={shape === 'knife' ? 'primary' : 'outline'}
              className="flex-1 gap-2"
            >
              <div className="w-6 h-1 bg-current rounded-full rotate-45"></div>
              <span className="text-sm font-bold">{t('drag_force.knife_hand')}</span>
            </Button>
            <Button
              onClick={() => setShape('open')}
              variant={shape === 'open' ? 'primary' : 'outline'}
              className="flex-1 gap-2"
            >
              <div className="w-6 h-6 bg-current rounded-md border border-current"></div>
              <span className="text-sm font-bold">{t('drag_force.open_hand')}</span>
            </Button>
           </div>
        </div>

        {/* Speed Slider */}
        <div className="mt-2">
            <label className="text-sm font-medium text-ink mb-2 block flex justify-between font-serif">
            <span>{t('drag_force.velocity')}</span>
            <span className="font-bold font-mono">{speed} {t('drag_force.mps')}</span>
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
        <div className="mt-4 border border-ink rounded-sm overflow-hidden bg-parchment">
            {/* Gauge Header */}
            <div className="bg-parchment-dark p-4 border-b border-ink flex justify-between items-start min-h-[5rem]">
                 <div>
                    <div className="text-xs text-ink-light font-bold mb-1 font-mono">{t('drag_force.resistance_gauge')}</div>
                    <div className="text-lg font-bold text-ink font-serif">
                        {resistance.toFixed(1)} <span className="text-sm font-normal text-ink-light font-sans">{t('drag_force.newton')}</span>
                    </div>
                 </div>
                 <div className="text-xs font-medium bg-ink/10 border border-ink/20 px-2 py-1 rounded-sm text-ink max-w-[50%] text-left font-mono">
                   {getEffortLabel()}
                 </div>
            </div>

            {/* Gauge Bar */}
            <div className="h-4 bg-ink/10 relative border-b border-ink">
                <div
                  className={cn(
                    "h-full transition-all duration-300 ease-out border-r border-ink",
                    gaugePercent < 30 ? 'bg-ink/40' : gaugePercent < 70 ? 'bg-ink/60' : 'bg-sanguine'
                  )}
                  style={{ width: `${gaugePercent}%` }}
                />
            </div>

            {/* Visual Animation Area */}
            <div className="relative h-48 flex items-center justify-center bg-parchment overflow-hidden">
                {/* Hand */}
                <div
                  className={cn(
                    "transition-all duration-300 transform bg-parchment-light border-2 border-ink flex items-center justify-center shadow-none z-10 rounded-sm",
                    shape === 'knife' ? 'scale-x-50 w-24' : 'scale-100 w-24'
                  )}
                  style={{ height: '6rem' }}
                >
                    <span className="text-4xl grayscale opacity-80">✋</span>
                </div>

                {/* Resistance Bars (Placeholders + Fill) */}
                <div className="absolute top-0 bottom-0 -right-4 flex flex-col justify-center gap-2 z-0 w-1/2 pr-6">
                    {[...Array(6)].map((_, i) => (
                       <div key={i} className="h-2 w-full bg-ink/5 border border-ink/10 rounded-l-sm overflow-hidden">
                           {/* Inner Fill - Exact correlation to gauge percent */}
                           <div
                             className="h-full bg-sanguine transition-all duration-300 rounded-l-sm"
                             style={{
                               width: `${Math.max(0, (gaugePercent - (i * 15)) * 6.6)}%`, // Staggered fill but full bars
                               opacity: 0.8
                             }}
                           />
                       </div>
                    ))}
                    <div className="absolute bottom-2 right-6 text-xs font-bold text-sanguine font-mono">{t('drag_force.drag_force')}</div>
                </div>
            </div>
        </div>
      </div>
    </Card>
  );
};
