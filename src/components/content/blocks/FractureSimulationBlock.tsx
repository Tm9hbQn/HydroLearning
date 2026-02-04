import React from 'react';
import { ContentBlock } from '../../../types/content';
import { FractureMechanics } from '../../../features/fracture-mechanics/FractureMechanics';

export const FractureSimulationBlock: React.FC<{ block: ContentBlock }> = ({ block }) => {
  const initialForceType = block.props?.initialForceType;
  return (
    <div className="my-6">
       <FractureMechanics initialForceType={initialForceType} />
    </div>
  );
};
