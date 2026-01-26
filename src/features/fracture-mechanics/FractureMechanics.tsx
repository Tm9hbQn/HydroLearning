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
        <div className="flex gap-1 justify-center bg-slate-100 p-1 rounded-lg">
           {(['torsion', 'compression', 'tension', 'shear'] as const).map(ft => (
               <button
                key={ft}
                onClick={() => { setForceType(ft); setForceVal(0); }}
                className={cn(
                    "flex-1 py-2 text-xs rounded-md",
                    forceType === ft ? 'bg-white shadow text-blue-700 font-bold' : 'text-slate-500'
                )}
                >
                 {t(`fracture_mechanics.force_types.${ft}`)}
               </button>
           ))}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm text-blue-800 text-center">
            <strong>{t('fracture_mechanics.force_source_label')}</strong> {t(`fracture_mechanics.force_sources.${forceType}`)}
        </div>

        {/* Visual + Status */}
        <div className="flex flex-col items-center">
            <div className="relative w-40 h-56 perspective-1000 flex justify-center items-center mb-2">
                {/* Bone Cylinder */}
                <div className="w-24 h-48 bg-slate-50 border-x-2 border-slate-300 relative overflow-hidden transition-transform duration-100 origin-center shadow-lg z-10">
                    <div className="absolute inset-0 w-full h-full opacity-40"
                         style={{
                            backgroundImage: 'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)',
                            backgroundSize: '20px 20px',
                            transform: getTransform(),
                            transformOrigin: 'center'
                         }}
                    />
                    <div style={getFractureStyle()}></div>
                </div>
                {/* Force Arrows */}
                {forceType === 'shear' && <div className="absolute top-1/2 -left-6 text-3xl font-bold text-slate-600">→</div>}
                {forceType === 'torsion' && <div className="absolute -top-6 text-3xl text-slate-600">↻</div>}
                {forceType === 'torsion' && <div className="absolute -bottom-6 text-3xl text-slate-600">↺</div>}
                {forceType === 'compression' && <div className="absolute -top-6 text-3xl text-slate-600">↓</div>}
                {forceType === 'compression' && <div className="absolute -bottom-6 text-3xl text-slate-600">↑</div>}
                {forceType === 'tension' && <div className="absolute -top-6 text-3xl text-slate-600">↑</div>}
                {forceType === 'tension' && <div className="absolute -bottom-6 text-3xl text-slate-600">↓</div>}
            </div>

            {/* Status Bar */}
            <div className={cn(
                "w-full max-w-xs p-2 rounded text-center text-sm font-bold transition-all border",
                isBroken ? 'bg-red-100 border-red-300 text-red-700' : 'bg-green-50 border-green-200 text-green-700'
            )}>
                {isBroken ? t('fracture_mechanics.status.broken') : t('fracture_mechanics.status.stable')}
            </div>
            {/* Clinical Note */}
            <div className="text-xs text-slate-500 mt-2 p-2 bg-slate-50 rounded border border-slate-100 w-full text-center min-h-[3em]">
                {t(`fracture_mechanics.clinical_notes.${forceType}`)}
            </div>
        </div>

        {/* Slider */}
        <div className="mt-2">
            <label className="block text-center mb-1 text-slate-700 font-medium text-sm">{t('fracture_mechanics.force_intensity')}</label>
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
