import React from 'react';

interface PainCycleProps {
  title: string;
  description: string;
}

export const PainCycleDiagram: React.FC<PainCycleProps> = ({ title, description }) => {
  const steps = [
    { icon: '⚡', label: 'כאב', sub: 'הטריגר הראשוני', color: 'text-red-400' },
    { icon: '🔒', label: 'כיווץ הגנתי', sub: 'Muscle Spasm', color: 'text-yellow-400' },
    { icon: '🩸', label: 'איסכמיה', sub: 'ירידה באספקת דם', color: 'text-orange-400' },
    { icon: '☣️', label: 'תוצרי דלקת', sub: 'הצטברות פסולת', color: 'text-purple-400' }
  ];

  return (
    <div className="my-8" dir="rtl">
       <h3 className="text-2xl font-bold text-slate-800 mb-6">{title}</h3>

       <div className="relative bg-slate-800 text-white p-8 rounded-3xl overflow-hidden">
         {/* Background Effect */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 pointer-events-none"></div>

         <div className="grid md:grid-cols-4 gap-4 text-center relative z-10">
           {steps.map((step, idx) => (
             <React.Fragment key={idx}>
               <div className="bg-slate-700 p-4 rounded-xl border border-slate-600 flex flex-col items-center justify-center min-h-[140px]">
                 <div className="text-3xl mb-2">{step.icon}</div>
                 <div className={`font-bold ${step.color} mb-1`}>{step.label}</div>
                 <div className="text-xs text-slate-400">{step.sub}</div>
               </div>

               {/* Arrow for desktop */}
               {idx < steps.length - 1 && (
                 <div className="hidden md:flex items-center justify-center text-2xl text-slate-500">
                   ➜
                 </div>
               )}

                {/* Arrow for mobile (vertical) - actually let's just let grid handle layout, maybe add arrow div if needed but simple grid is usually fine for mobile */}
                {idx < steps.length - 1 && (
                   <div className="md:hidden flex justify-center text-slate-500 py-2">
                       ↓
                   </div>
                )}
             </React.Fragment>
           ))}
         </div>

         <div className="mt-8 bg-sky-900/50 p-4 rounded-xl border border-sky-500/30 text-sm text-sky-100">
            <strong>ההתערבות הטיפולית:</strong> {description}
         </div>
       </div>
    </div>
  );
};
