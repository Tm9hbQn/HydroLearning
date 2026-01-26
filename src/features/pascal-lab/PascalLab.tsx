import React, { useState, useMemo } from 'react';
import { ArrowDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/Card';
import { Slider } from '../../components/ui/Slider';

export const PascalLab = () => {
  const { t } = useTranslation();
  const [waterLevel, setWaterLevel] = useState(0);
  const RHO = 1000;
  const G = 9.81;

  const landmarks = useMemo(() => [
    { name: t('pascal_lab.landmarks.ankles'), h: 0.1 },
    { name: t('pascal_lab.landmarks.knees'), h: 0.5 },
    { name: t('pascal_lab.landmarks.pelvis'), h: 0.9 },
    { name: t('pascal_lab.landmarks.chest'), h: 1.4 }
  ], [t]);

  return (
    <Card
      title={t('pascal_lab.title')}
      description={t('pascal_lab.description')}
      icon={ArrowDown}
      instructions={t('pascal_lab.instructions')}
    >
      <div className="flex flex-row gap-6 h-[350px] items-center">

        {/* Controls - Slider Centered */}
        <div className="h-[200px] flex flex-col items-center justify-center bg-slate-50 rounded-xl p-2 border border-slate-200 shadow-inner w-16 shrink-0 relative">
           <div className="text-[10px] font-bold text-blue-800 mb-2">2.0m</div>
           <Slider
            vertical
            min={0}
            max={2}
            step={0.05}
            value={waterLevel}
            onChange={(e) => setWaterLevel(parseFloat(e.target.value))}
          />
          <div className="text-[10px] font-bold text-slate-500 mt-2">0m</div>

          {/* Moving Label */}
          <div
            className="absolute right-full mr-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded shadow-md pointer-events-none transition-all whitespace-nowrap z-50"
            style={{ top: `${100 - (waterLevel/2)*80 - 10}%` }}
          >
             {waterLevel.toFixed(2)}m
          </div>
        </div>

        {/* Visualization Area */}
        <div className="relative flex-1 border border-slate-200 rounded-xl overflow-hidden bg-white h-full">

          {/* Water Layer */}
          <div
            className="absolute bottom-0 left-0 right-0 bg-blue-400/30 transition-all duration-100 ease-out border-t border-blue-500 shadow-lg z-10"
            style={{ height: `${(waterLevel / 2.1) * 100}%` }}
          />

          {/* Water Surface Label - Moved out to be above body */}
          <div
            className="absolute right-2 text-[10px] font-bold text-blue-700 bg-white/80 px-1 rounded-b z-50 transition-all duration-100 ease-out"
            style={{ bottom: `${(waterLevel / 2.1) * 100}%` }}
          >
            {t('pascal_lab.water_surface')}
          </div>

          <svg viewBox="0 0 200 400" className="absolute bottom-0 left-1/2 -translate-x-1/2 h-full w-full max-w-[300px] z-20">
            {/* Body Outline */}
            <g fill={waterLevel > 0.1 ? "#f1f5f9" : "#ffffff"} stroke="#334155" strokeWidth="2">
              <path d="M100,50 C115,50 120,65 120,80 L135,100 L130,200 L125,280 L135,380 L100,380 L100,280 L100,380 L65,380 L75,280 L70,200 L65,100 L80,80 C80,65 85,50 100,50 Z" />
              <circle cx="100" cy="40" r="25" fill="#f1f5f9" stroke="#334155" strokeWidth="2" />
            </g>

            {/* Internal Flow Indicator */}
            {waterLevel > 0.3 && (
               <g className="opacity-70">
                 <defs>
                   <linearGradient id="flowGrad" x1="0" x2="0" y1="1" y2="0">
                     <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                     <stop offset="100%" stopColor="#3b82f6" stopOpacity="1" />
                   </linearGradient>
                 </defs>
                 <g className="animate-flow-up">
                    <path d="M95,370 L95,150" stroke="url(#flowGrad)" strokeWidth="4" strokeLinecap="round" strokeDasharray="5,5" />
                    <path d="M105,370 L105,150" stroke="url(#flowGrad)" strokeWidth="4" strokeLinecap="round" strokeDasharray="5,5" />
                 </g>

                 <path d="M100,360 L100,340" stroke="#2563eb" strokeWidth="2" markerEnd="url(#blueArrow)" className="animate-bounce-slight" />
                 <path d="M100,280 L100,260" stroke="#2563eb" strokeWidth="2" markerEnd="url(#blueArrow)" className="animate-bounce-slight" style={{animationDelay: '0.2s'}} />
                 <path d="M100,200 L100,180" stroke="#2563eb" strokeWidth="2" markerEnd="url(#blueArrow)" className="animate-bounce-slight" style={{animationDelay: '0.4s'}} />
               </g>
            )}

            {/* Pressure Arrows */}
            {landmarks.map((mark, index) => {
              const svgY = 380 - (mark.h / 2.2) * 360;
              const depth = waterLevel - mark.h;
              const isCovered = depth > 0;
              const currentPressure = isCovered ? Math.round(RHO * G * depth) : 0;
              const strokeWidth = isCovered ? Math.min(8, 2 + currentPressure / 3000) : 0;

              // אורך החץ קבוע יחסית, אבל רק אם מכוסה
              const arrowLength = 40;

              return isCovered && (
                <g key={index}>
                  <line x1={40 - arrowLength} y1={svgY} x2={60} y2={svgY} stroke="#ef4444" strokeWidth={strokeWidth} strokeLinecap="round" markerEnd="url(#redArrow)" />
                  <line x1={160 + arrowLength} y1={svgY} x2={140} y2={svgY} stroke="#ef4444" strokeWidth={strokeWidth} strokeLinecap="round" markerEnd="url(#redArrow)" />

                  <g transform={`translate(165, ${svgY + 5})`}>
                    <rect x="0" y="-10" width="55" height="14" rx="4" fill="#ef4444" opacity="0.9" />
                    <text x="27" y="0" fontSize="10" fill="white" textAnchor="middle" fontWeight="bold">
                      {currentPressure.toLocaleString()} Pa
                    </text>
                  </g>
                </g>
              );
            })}

            <defs>
              <marker id="redArrow" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
                <path d="M0,0 L4,2 L0,4" fill="#ef4444" />
              </marker>
              <marker id="blueArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6" fill="#2563eb" />
              </marker>
            </defs>
          </svg>
        </div>
      </div>

      <div className="mt-4 flex gap-4 text-xs text-slate-600 justify-center">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>{t('pascal_lab.legend.external')}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>{t('pascal_lab.legend.internal')}</span>
        </div>
      </div>
    </Card>
  );
};
