import React from 'react';
import { Unit } from '../../types/content';
import { BlockFactory } from './BlockFactory';

interface UnitRendererProps {
  unit: Unit;
}

export const UnitRenderer: React.FC<UnitRendererProps> = ({ unit }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-serif text-slate-800 mb-6">{unit.title}</h2>
      <div className="space-y-6">
        {unit.blocks.map(block => (
          <BlockFactory key={block.id} block={block} />
        ))}
      </div>
    </div>
  );
};
