import React, { useState } from 'react';
import { Bone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/Card';
import { Slider } from '../../components/ui/Slider';
import { cn } from '../../lib/utils';

export const FractureMechanics = () => {
  const { t } = useTranslation();
  const [forceVal, setForceVal] = useState(0);
  const [forceType, setForceType] = useState<'torsion' | 'compression' | 'tension' | 'shear'>('torsion');
  const isBroken = forceVal > 85;

  const getTransform = () => {
    const val = forceVal / 2;
    switch(forceType) {
      case 'torsion': return `skewX(${val/2}deg)`;
      case 'compression': return `scaleY(${1 - forceVal/400}) scaleX(${1 + forceVal/600})`;
      case 'tension': return `scaleY(${1 + forceVal/400}) scaleX(${1 - forceVal/600})`;
      case 'shear': return `translateX(${val/4}px)`;
      default: return '';
    }
  };

  const getFractureStyle = (): React.CSSProperties => {
      if (!isBroken) return { opacity: 0 };
      const base: React.CSSProperties = { opacity: 1, position: 'absolute', backgroundColor: 'red', boxShadow: '0 0 10px red' };

      switch(forceType) {
          case 'torsion': return { ...base, width: '140%', height: '4px', top: '50%', left: '-20%', transform: 'rotate(-45deg)' };
          case 'compression': return { ...base, width: '100%', height: '100%', top: 0, left: 0, background: 'radial-gradient(circle, transparent 30%, rgba(255,0,0,0.5) 90%)' };
          case 'tension': return { ...base, width: '100%', height: '4px', top: '50%', left: 0 };
          case 'shear': return { ...base, width: '100%', height: '4px', top: '50%', left: 0 };
          default: return {};
      }
  };

  return (
    <Card
      title={t('fracture_mechanics.title')}
      description={t('fracture_mechanics.description')}
      icon={Bone}
      instructions={t('fracture_mechanics.instructions')}
    >
      <div className="flex flex-col gap-4">
        {/* Force Selection */}
        <div className="flex gap-1 justify-center bg-ink/5 p-1 rounded-sm border border-ink/10">
           {(['torsion', 'compression', 'tension', 'shear'] as const).map(ft => (
               <button
                key={ft}
                onClick={() => { setForceType(ft); setForceVal(0); }}
                className={cn(
                    "flex-1 py-2 text-xs rounded-sm font-serif",
                    forceType === ft ? 'bg-ink shadow-none text-parchment font-bold' : 'text-ink hover:bg-ink/10'
                )}
                >
                 {t(`fracture_mechanics.force_types.${ft}`)}
               </button>
           ))}
        </div>

        {/* Info Box */}
        <div className="bg-parchment-dark p-3 rounded-sm border border-ink/20 text-sm text-ink text-center font-serif">
            <strong>{t('fracture_mechanics.force_source_label')}</strong> {t(`fracture_mechanics.force_sources.${forceType}`)}
        </div>

        {/* Visual + Status */}
        <div className="flex flex-col items-center">
            <div className="relative w-40 h-56 perspective-1000 flex justify-center items-center mb-2">
                {/* Bone Cylinder */}
                <div className="w-24 h-48 bg-parchment-light border-x-2 border-ink relative overflow-hidden transition-transform duration-100 origin-center shadow-none z-10">
                    <div className="absolute inset-0 w-full h-full opacity-40"
                         style={{
                            backgroundImage: 'linear-gradient(#2b2118 1px, transparent 1px), linear-gradient(90deg, #2b2118 1px, transparent 1px)',
                            backgroundSize: '20px 20px',
                            transform: getTransform(),
                            transformOrigin: 'center'
                         }}
                    />
                    <div style={getFractureStyle()}></div>
                </div>
                {/* Force Arrows */}
                {forceType === 'shear' && <div className="absolute top-1/2 -left-6 text-3xl font-bold text-ink">→</div>}
                {forceType === 'torsion' && <div className="absolute -top-6 text-3xl text-ink">↻</div>}
                {forceType === 'torsion' && <div className="absolute -bottom-6 text-3xl text-ink">↺</div>}
                {forceType === 'compression' && <div className="absolute -top-6 text-3xl text-ink">↓</div>}
                {forceType === 'compression' && <div className="absolute -bottom-6 text-3xl text-ink">↑</div>}
                {forceType === 'tension' && <div className="absolute -top-6 text-3xl text-ink">↑</div>}
                {forceType === 'tension' && <div className="absolute -bottom-6 text-3xl text-ink">↓</div>}
            </div>

            {/* Status Bar */}
            <div className={cn(
                "w-full max-w-xs p-2 rounded-sm text-center text-sm font-bold transition-all border font-mono",
                isBroken ? 'bg-sanguine/10 border-sanguine text-sanguine' : 'bg-ink/5 border-ink/20 text-ink'
            )}>
                {isBroken ? t('fracture_mechanics.status.broken') : t('fracture_mechanics.status.stable')}
            </div>
            {/* Clinical Note */}
            <div className="text-xs text-ink-light mt-2 p-2 bg-parchment-dark rounded-sm border border-ink/10 w-full text-center min-h-[3em] font-serif italic">
                {t(`fracture_mechanics.clinical_notes.${forceType}`)}
            </div>
        </div>

        {/* Slider */}
        <div className="mt-2">
            <label className="block text-center mb-1 text-ink font-medium text-sm font-serif">{t('fracture_mechanics.force_intensity')}</label>
            <Slider
                min={0}
                max={100}
                value={forceVal}
                onChange={(e) => setForceVal(parseFloat(e.target.value))}
            />
        </div>
      </div>
    </Card>
  );
};
