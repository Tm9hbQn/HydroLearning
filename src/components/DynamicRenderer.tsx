import React from 'react';
import { ComponentModel } from '../types';
import { TextBlock } from './content/TextBlock';
import { InfoCardGrid } from './content/InfoCardGrid';
import { TempSlider } from './interactive/TempSlider';
import { Calculator } from './interactive/Calculator';
import { SafetyGrid } from './interactive/SafetyGrid';
import { ProcessSteps } from './content/ProcessSteps';
import { PainCycleDiagram } from './interactive/PainCycleDiagram';

export const DynamicRenderer: React.FC<{ components: ComponentModel[] }> = ({ components }) => {
  return (
    <div className="space-y-8">
      {components.map((comp, idx) => {
        switch (comp.type) {
          case 'text-block': return <TextBlock key={idx} {...comp} />;
          case 'info-card-grid': return <InfoCardGrid key={idx} {...comp} />;
          case 'temp-slider': return <TempSlider key={idx} {...comp} />;
          case 'calculator': return <Calculator key={idx} {...comp} />;
          case 'safety-grid': return <SafetyGrid key={idx} {...comp} />;
          case 'process-steps': return <ProcessSteps key={idx} {...comp} />;
          case 'pain-cycle-diagram': return <PainCycleDiagram key={idx} {...comp} />;
          default: return <div key={idx} className="text-red-500">Unknown component</div>;
        }
      })}
    </div>
  );
};
