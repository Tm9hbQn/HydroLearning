import React from 'react';

interface ProcessStepsProps {
  steps: {
    title: string;
    description: string;
  }[];
}

export const ProcessSteps: React.FC<ProcessStepsProps> = ({ steps }) => {
  return (
    <div className="space-y-8 relative pl-4 md:pl-0 mt-8 mb-8" dir="rtl">
      {/* Vertical line for desktop */}
      <div className="absolute right-[19px] top-0 bottom-0 w-0.5 bg-slate-200 hidden md:block"></div>

      {steps.map((step, idx) => (
        <div key={idx} className="relative md:pr-12">
           {/* Circle Number */}
          <div className="hidden md:flex absolute right-0 top-0 w-10 h-10 bg-sky-600 rounded-full items-center justify-center text-white font-bold z-10 shadow-sm border-2 border-white">
            {idx + 1}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative">
             {/* Mobile number indicator inside card */}
            <span className="md:hidden inline-block bg-sky-100 text-sky-800 text-xs font-bold px-2 py-1 rounded mb-2">שלב {idx + 1}</span>
            <h3 className="font-bold text-lg text-slate-800 mb-2">{step.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {step.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
