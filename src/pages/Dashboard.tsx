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
      <div className="bg-parchment-dark border border-ink border-r-4 border-r-sanguine shadow-none rounded-sm p-6 mb-10">
        <h2 className="font-serif font-bold text-xl text-ink mb-2">{t('common.welcome_title')}</h2>
        <p className="text-ink/80 leading-relaxed font-serif">
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
