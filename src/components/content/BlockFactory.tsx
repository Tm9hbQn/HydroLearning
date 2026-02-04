import React from 'react';
import { ContentBlock } from '../../types/content';
import { TextBlock } from './blocks/TextBlock';
import { FractureSimulationBlock } from './blocks/FractureSimulationBlock';
import { ImageBlock } from './blocks/ImageBlock';

interface BlockFactoryProps {
  block: ContentBlock;
}

export const BlockFactory: React.FC<BlockFactoryProps> = ({ block }) => {
  switch (block.type) {
    case 'text':
      return <TextBlock block={block} />;
    case 'simulation_fracture':
      return <FractureSimulationBlock block={block} />;
    case 'image':
      return <ImageBlock block={block} />;
    default:
      return (
        <div className="p-4 border border-red-200 bg-red-50 text-red-600 rounded">
          Unknown block type: {block.type}
        </div>
      );
  }
};
