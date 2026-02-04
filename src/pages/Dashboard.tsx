import React from 'react';
import { useTranslation } from 'react-i18next';
import { PascalLab } from '../features/pascal-lab/PascalLab';
import { DragForceSim } from '../features/drag-force/DragForceSim';
import { DiscHerniationTool } from '../features/disc-herniation/DiscHerniationTool';
import { FractureMechanics } from '../features/fracture-mechanics/FractureMechanics';
import { FluidJourney } from '../features/fluid-journey/FluidJourney';

export const Dashboard = () => {
  console.log("Dashboard component rendering...");
  const { t } = useTranslation();

  return (
    <div>
      <div className="bg-white border-r-4 border-blue-500 shadow-sm rounded-lg p-6 mb-10">
        <h2 className="font-bold text-lg text-slate-800 mb-2">{t('common.welcome_title')}</h2>
        <p className="text-slate-600 leading-relaxed">
          {t('common.welcome_desc')}
        </p>
      </div>

      <div className="flex flex-col">
        <PascalLab />
        <DragForceSim />
        <DiscHerniationTool />
        <FractureMechanics />
        <FluidJourney />
      </div>
    </div>
  );
};
