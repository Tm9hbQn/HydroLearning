import React from 'react';
import { ContentBlock } from '../../../types/content';

export const ImageBlock: React.FC<{ block: ContentBlock }> = ({ block }) => {
  return (
    <figure className="my-6">
      <img
        src={block.content}
        alt={block.title || 'Course image'}
        className="rounded-lg shadow-sm border border-slate-200 w-full object-cover"
      />
      {block.title && <figcaption className="mt-2 text-sm text-slate-500 text-center">{block.title}</figcaption>}
    </figure>
  );
};
