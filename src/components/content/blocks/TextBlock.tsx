import React from 'react';
import { ContentBlock } from '../../../types/content';

export const TextBlock: React.FC<{ block: ContentBlock }> = ({ block }) => {
  return (
    <div className="prose prose-slate max-w-none">
       {block.title && <h3 className="text-xl font-bold mb-2 font-serif text-slate-800">{block.title}</h3>}
       <p className="text-lg leading-relaxed text-slate-700 whitespace-pre-line">{block.content}</p>
    </div>
  );
};
