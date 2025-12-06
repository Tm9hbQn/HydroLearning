import React from 'react';
import clsx from 'clsx';

interface TextBlockProps {
  content: string;
  title?: string;
  style?: 'standard' | 'warning';
}

export const TextBlock: React.FC<TextBlockProps> = ({ content, title, style = 'standard' }) => {
  return (
    <div className={clsx(
      "mb-6",
      style === 'warning' && "bg-red-50 p-6 rounded-2xl border border-red-100"
    )} dir="rtl">
      {title && <h3 className={clsx(
        "text-2xl font-bold mb-4",
        style === 'warning' ? "text-red-900" : "text-slate-800"
      )}>{title}</h3>}
      <p className={clsx(
        "leading-relaxed",
        style === 'warning' ? "text-red-900 font-medium" : "text-slate-700"
      )}>
        {content}
      </p>
    </div>
  );
};
