import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Droplets, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/Card';

export const FluidJourney = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);

  // Corrected Coordinates for Zoom
  const getTransform = () => {
      switch(step) {
          case 0: return "scale(1) translate(0, 0)";
          case 1: return "scale(1) translate(0, 0)";
          case 2: return "scale(1) translate(0, 0)";
          case 3: return "translate(0px, 50px) scale(2.5)"; // Target Heart (50,50)
          case 4: return "translate(0px, 70px) scale(2)"; // Upper Body
          case 5: return "translate(0px, 0px) scale(1)"; // Reset
          default: return "scale(1) translate(0, 0)";
      }
  };

  const steps = [
    { title: t('fluid_journey.steps.0.title'), text: t('fluid_journey.steps.0.text') },
    { title: t('fluid_journey.steps.1.title'), text: t('fluid_journey.steps.1.text') },
    { title: t('fluid_journey.steps.2.title'), text: t('fluid_journey.steps.2.text') },
    { title: t('fluid_journey.steps.3.title'), text: t('fluid_journey.steps.3.text') },
    { title: t('fluid_journey.steps.4.title'), text: t('fluid_journey.steps.4.text') },
    { title: t('fluid_journey.steps.5.title'), text: t('fluid_journey.steps.5.text') }
  ];

  const handleNext = () => step < 5 ? setStep(step + 1) : setStep(0);
  const handlePrev = () => step > 0 && setStep(step - 1);

  return (
    <Card
      title={t('fluid_journey.title')}
      description={t('fluid_journey.description')}
      icon={Droplets}
      instructions={t('fluid_journey.instructions')}
    >
      <div className="flex flex-col h-[500px]">

        {/* Info Header */}
        <div className="mb-2 shrink-0">
            <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded mb-2 inline-block">
                {t('fluid_journey.step_counter', { current: step, total: 5 })}
            </span>
            <h3 className="font-bold text-slate-800 text-lg mb-1">{steps[step].title}</h3>
            <p className="text-sm text-slate-600 min-h-[3.5rem] leading-snug">{steps[step].text}</p>
        </div>

        {/* Animation Canvas */}
        <div className="flex-1 bg-slate-900 rounded-xl relative overflow-hidden border border-slate-700 w-full mb-4">

           <svg viewBox="0 0 100 200" className="w-full h-full">

              <g
                style={{ transform: getTransform(), transformOrigin: 'center center' }}
                className="transition-transform duration-1000 ease-in-out"
              >
                {/* Background */}
                <rect x="-100" y={step >= 1 ? "-100" : "200"} width="300" height="400" fill="#3b82f6" opacity="0.3" className="transition-all duration-1000" />

                <g fill="#1e293b" stroke="#475569" strokeWidth="1">
                   <path d="M50,10 C60,10 65,20 65,25 L75,35 L70,90 L80,190 L50,190 L50,100 L50,190 L20,190 L30,90 L25,35 L35,25 C35,20 40,10 50,10 Z" />
                </g>

                {/* Step 1: Pressure - Harmonious independent movement, not touching body */}
                {step === 1 && (
                    <g>
                        {/* Left Arrows (Move Left <-> Right) */}
                        <g className="animate-squeeze-right-harmonious">
                          <path d="M5,180 L20,180" stroke="#ef4444" strokeWidth="2" markerEnd="url(#redArrowSmall)" />
                          <path d="M5,120 L20,120" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#redArrowSmall)" />
                        </g>
                        {/* Right Arrows (Move Right <-> Left) */}
                        <g className="animate-squeeze-left-harmonious">
                          <path d="M95,180 L80,180" stroke="#ef4444" strokeWidth="2" markerEnd="url(#redArrowSmall)" />
                          <path d="M95,120 L80,120" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#redArrowSmall)" />
                        </g>
                        <g transform="translate(50, 160)">
                            <rect x="-10" y="-4" width="20" height="6" rx="2" fill="rgba(0,0,0,0.5)" />
                            <text x="0" y="0" fill="white" fontSize="8" textAnchor="middle" dominantBaseline="middle">{t('fluid_journey.labels.water_pressure')}</text>
                        </g>
                    </g>
                )}

                {/* Step 2: Venous Return */}
                {step === 2 && (
                   <g>
                      <path d="M35,180 L40,60" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,2" className="animate-[dash_1s_linear_infinite]" />
                      <path d="M65,180 L60,60" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,2" className="animate-[dash_1s_linear_infinite]" />

                      <g transform="translate(50, 100)">
                         <rect x="-12" y="-4" width="24" height="6" rx="2" fill="rgba(0,0,0,0.5)" />
                         <text x="0" y="0" fill="white" fontSize="7" textAnchor="middle" dominantBaseline="middle" fontWeight="bold">{t('fluid_journey.labels.blood_rise')}</text>
                      </g>
                   </g>
                )}

                {/* Step 3: Heart with Veins & Internal Arrows */}
                <g transform="translate(50,50)">
                    {/* Veins Entering */}
                    <path d="M-15,10 Q-10,5 -8,5" stroke="#60a5fa" strokeWidth="3" fill="none" markerEnd="url(#blueArrowSmall)" />
                    <path d="M15,10 Q10,5 8,5" stroke="#60a5fa" strokeWidth="3" fill="none" markerEnd="url(#blueArrowSmall)" />
                    <text x="0" y="-8" fontSize="6" fill="#60a5fa" textAnchor="middle" fontWeight="bold">ורידים</text>

                    {/* Animated Flow into Heart */}
                    {step === 3 && (
                       <g>
                         <circle cx="-12" cy="8" r="1" fill="#fff" className="animate-flow-in-left" />
                         <circle cx="12" cy="8" r="1" fill="#fff" className="animate-flow-in-right" />
                       </g>
                    )}

                    {/* Heart Shape */}
                    <path d="M0,5 Q-5,0 -10,5 T0,15 T10,5 Q5,0 0,5" fill="#ef4444"
                          transform={step === 3 ? "scale(1.3)" : "scale(1)"}
                          className="transition-transform duration-1000" />

                    {step === 3 && (
                        <g>
                            {/* Internal Arrows Pointing Out */}
                            <path d="M-2,5 L-5,5" stroke="white" strokeWidth="0.5" markerEnd="url(#whiteArrowSmall)" />
                            <path d="M2,5 L5,5" stroke="white" strokeWidth="0.5" markerEnd="url(#whiteArrowSmall)" />

                        </g>
                    )}
                </g>

                {/* Step 4: Hormones */}
                {step === 4 && (
                   <g>
                      <circle cx="50" cy="15" r="4" fill="#fcd34d" opacity="0.8" />

                      <g transform="translate(68, 16)">
                          <rect x="-8" y="-2" width="16" height="4" rx="1" fill="rgba(255,255,255,0.9)" />
                          <text x="0" y="0.5" fill="#f87171" fontSize="6" fontWeight="bold" textAnchor="middle">{t('fluid_journey.labels.adh_down')}</text>
                      </g>
                      <line x1="50" y1="15" x2="60" y2="16" stroke="white" strokeWidth="0.2" />

                      <g transform="translate(68, 51)">
                          <rect x="-8" y="-2" width="16" height="4" rx="1" fill="rgba(255,255,255,0.9)" />
                          <text x="0" y="0.5" fill="#4ade80" fontSize="6" fontWeight="bold" textAnchor="middle">{t('fluid_journey.labels.anp_up')}</text>
                      </g>
                      <line x1="55" y1="50" x2="60" y2="51" stroke="white" strokeWidth="0.2" />
                   </g>
                )}

                {/* Step 5: Diuresis */}
                {step === 5 && (
                   <g>
                      <ellipse cx="40" cy="80" rx="4" ry="6" fill="#f59e0b" />
                      <ellipse cx="60" cy="80" rx="4" ry="6" fill="#f59e0b" />

                      <g transform="translate(30, 80)">
                          <rect x="-10" y="-2" width="20" height="4" rx="1" fill="rgba(0,0,0,0.6)" />
                          <text x="0" y="0.5" fill="white" fontSize="6" textAnchor="middle">{t('fluid_journey.labels.kidney_filter')}</text>
                      </g>

                      <path d="M45,100 Q50,115 55,100 Z" fill="#facc15" className="animate-pulse" />

                      <g transform="translate(50, 115)">
                          <rect x="-8" y="-2" width="16" height="4" rx="1" fill="rgba(0,0,0,0.6)" />
                          <text x="0" y="0.5" fill="#facc15" fontSize="6" textAnchor="middle" fontWeight="bold">{t('fluid_journey.labels.diuresis')}</text>
                      </g>

                      <path d="M40,85 L48,100 M60,85 L52,100" stroke="#facc15" strokeWidth="1" strokeDasharray="1,1" className="animate-[dash_0.5s_linear_infinite]" />
                   </g>
                )}

              </g>

              <defs>
                  <marker id="redArrowSmall" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto"><path d="M0,0 L4,2 L0,4" fill="#ef4444" /></marker>
                  <marker id="blueArrowSmall" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto"><path d="M0,0 L4,2 L0,4" fill="#60a5fa" /></marker>
                  <marker id="whiteArrowSmall" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto"><path d="M0,0 L4,2 L0,4" fill="white" /></marker>
              </defs>
           </svg>
        </div>

        {/* Big Buttons at Bottom */}
        <div className="flex gap-4 mt-auto">
             <button
               onClick={handlePrev}
               disabled={step === 0}
               className="flex-1 py-4 bg-blue-100 text-blue-800 rounded-xl font-bold text-lg hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
             >
               <ChevronRight /> {t('fluid_journey.buttons.prev')}
             </button>

             <button
               onClick={handleNext}
               className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg flex justify-center items-center gap-2"
             >
               {step === 5 ? t('fluid_journey.buttons.restart') : t('fluid_journey.buttons.next')} {step === 5 ? <RotateCcw size={20}/> : <ChevronLeft />}
             </button>
        </div>

      </div>
    </Card>
  );
};
