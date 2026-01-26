import React, { useState } from 'react';
import { Activity, Eye, Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/Card';
import { cn } from '../../lib/utils';

const STAGES = ['normal', 'degeneration', 'bulge', 'extrusion', 'sequestration'] as const;

export const DiscHerniationTool = () => {
  const { t } = useTranslation();
  const [stage, setStage] = useState<typeof STAGES[number]>('normal');
  const [view, setView] = useState<'top' | 'side'>('top');

  const colors = {
    vertebra: "#e2e8f0",
    annulus: "#94a3b8",
    nucleus: "#ef4444",
    nerve: "#fbbf24",
    pain: "#facc15"
  };

  const isPain = stage === 'extrusion' || stage === 'sequestration';

  const renderTopView = () => (
    <svg viewBox="0 0 200 150" className="w-full h-full">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <pattern id="degenPattern" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="4" fill="#cbd5e1"/>
            <path d="M0 4L4 0M-1 1L1 -1M3 5L5 3" stroke="#94a3b8" strokeWidth="0.5"/>
        </pattern>
      </defs>

      {/* Nerve Root */}
      <path d="M160,20 Q180,75 160,130" fill="none" stroke={isPain ? colors.pain : colors.nerve} strokeWidth={isPain ? 10 : 6} className={isPain ? "animate-pulse" : ""} filter={isPain ? "url(#glow)" : ""} />

      {/* Vertebra */}
      <path d="M40,30 C10,50 10,100 40,120 C70,140 130,140 160,120 C190,100 190,50 160,30 C130,10 70,10 40,30 Z" fill={colors.vertebra} stroke="#475569" strokeWidth="2" />

      {/* Annulus - Dynamic Shape for Bulge */}
      {stage === 'bulge' ? (
          <path d="M50,40 C30,55 30,95 50,110 C70,125 130,135 150,110 C165,95 165,55 150,40 C130,15 70,25 50,40 Z" fill={colors.annulus} stroke="#64748b" strokeWidth="1" />
      ) : (
          <path d="M50,40 C30,55 30,95 50,110 C70,125 120,125 140,110 C160,95 160,55 140,40 C120,25 70,25 50,40 Z" fill={stage === 'degeneration' ? "url(#degenPattern)" : colors.annulus} stroke="#64748b" strokeWidth="1" />
      )}

      {/* Nucleus Logic */}
      {stage === 'normal' && <circle cx="95" cy="75" r="20" fill={colors.nucleus} opacity="0.8" />}

      {stage === 'degeneration' && <path d="M80,65 Q95,60 110,65 Q115,80 100,85 Q85,90 80,65" fill="#475569" opacity="0.8" />}

      {stage === 'bulge' && (
         <ellipse cx="105" cy="75" rx="25" ry="20" fill={colors.nucleus} opacity="0.8" />
      )}

      {stage === 'extrusion' && <path d="M85,65 Q110,65 115,75 Q155,80 160,95 Q140,100 110,90 Q85,85 85,65" fill={colors.nucleus} />}

      {stage === 'sequestration' && (
        <g>
          <path d="M85,65 Q110,65 115,75 Q110,80 105,80 Q100,85 110,90 Q85,85 85,65" fill={colors.nucleus} />
          <path d="M150,95 Q160,95 155,105 Q150,110 145,100 Z" fill={colors.nucleus} transform="rotate(20 150 100)"/>
        </g>
      )}
    </svg>
  );

  const renderSideView = () => (
    <svg viewBox="0 0 200 150" className="w-full h-full">
      <rect x="160" y="10" width="10" height="130" fill={isPain ? colors.pain : colors.nerve} className={isPain ? "animate-pulse" : ""} />

      <path d="M40,20 L150,20 L150,50 L40,50 Z" fill={colors.vertebra} stroke="#475569" strokeWidth="2" />
      <path d="M40,100 L150,100 L150,130 L40,130 Z" fill={colors.vertebra} stroke="#475569" strokeWidth="2" />

      {/* Disc Base */}
      {stage === 'degeneration' ? (
         <rect x="45" y="60" width="100" height="30" fill="url(#degenPattern)" rx="5" stroke="#64748b" />
      ) : (
         <rect x="45" y="55" width="100" height="40" fill={colors.annulus} rx="5" stroke="#64748b" />
      )}

      {/* Nucleus Logic */}
      {stage === 'normal' && <ellipse cx="95" cy="75" rx="20" ry="10" fill={colors.nucleus} opacity="0.8" />}

      {stage === 'degeneration' && <ellipse cx="95" cy="75" rx="18" ry="6" fill="#475569" opacity="0.8" />}

      {stage === 'bulge' && (
          <g>
             <ellipse cx="105" cy="75" rx="22" ry="12" fill={colors.nucleus} opacity="0.8" />
             <path d="M145,55 Q160,75 145,95 Z" fill={colors.annulus} />
          </g>
      )}

      {stage === 'extrusion' && (
        <g>
          <ellipse cx="90" cy="75" rx="15" ry="10" fill={colors.nucleus} />
          <path d="M100,68 L160,70 L165,75 L160,80 L100,82" fill={colors.nucleus} />
        </g>
      )}

      {stage === 'sequestration' && (
        <g>
          <ellipse cx="90" cy="75" rx="15" ry="10" fill={colors.nucleus} />
          <circle cx="155" cy="90" r="6" fill={colors.nucleus} />
        </g>
      )}
    </svg>
  );

  return (
    <Card
      title={t('disc_herniation.title')}
      description={t('disc_herniation.description')}
      icon={Activity}
      instructions={t('disc_herniation.instructions')}
    >
      <div className="flex flex-col items-center">

        {/* Controls */}
        <div className="flex gap-2 mb-2 bg-slate-100 p-1 rounded-lg w-full justify-center">
          <button
            onClick={() => setView('top')}
            className={cn(
                "flex-1 flex justify-center items-center gap-2 px-3 py-1 rounded-md text-sm",
                view === 'top' ? 'bg-white shadow text-blue-600' : 'text-slate-500'
            )}
            >
                <Eye size={16} /> {t('disc_herniation.view.top')}
            </button>
          <button
            onClick={() => setView('side')}
            className={cn(
                "flex-1 flex justify-center items-center gap-2 px-3 py-1 rounded-md text-sm",
                view === 'side' ? 'bg-white shadow text-blue-600' : 'text-slate-500'
            )}
            >
                <Layers size={16} /> {t('disc_herniation.view.side')}
            </button>
        </div>

        {/* Viewer */}
        <div className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col justify-between h-[300px] relative">
            <div className="flex-1 flex justify-center items-center">
                {view === 'top' ? renderTopView() : renderSideView()}
            </div>

            <div className="bg-slate-900/80 rounded-lg p-2 flex flex-wrap gap-3 justify-center text-[11px] text-slate-300 w-full mt-2">
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-slate-200 rounded-sm"></div>{t('disc_herniation.legend.vertebra')}</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-slate-400 rounded"></div>{t('disc_herniation.legend.annulus')}</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-full"></div>{t('disc_herniation.legend.nucleus')}</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>{t('disc_herniation.legend.nerve')}</div>
            </div>
        </div>

        <div className="my-4 text-center h-14 w-full px-4 flex items-center justify-center bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-slate-700 font-medium text-sm">
            {t(`disc_herniation.stage_descriptions.${stage}`)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center w-full">
          {STAGES.map(s => (
            <button
                key={s}
                onClick={() => setStage(s)}
                className={cn(
                    "px-2 py-1 text-xs rounded-full border",
                    stage === s ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-600'
                )}
            >
                {t(`disc_herniation.stages.${s}`)}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
};
