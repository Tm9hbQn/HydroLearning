import React from 'react';
import { Info, LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CardProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  instructions?: string;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  icon: Icon,
  instructions,
  children,
  className
}) => {
  return (
    <div className={cn("bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden mb-8", className)}>
      <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center gap-3">
        {Icon && (
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            <Icon size={24} />
          </div>
        )}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>

      {instructions && (
        <div className="bg-yellow-50 px-4 py-2 border-b border-yellow-100 flex items-start gap-2 text-sm text-yellow-800">
          <Info size={16} className="mt-0.5 shrink-0 text-yellow-600" />
          <p>{instructions}</p>
        </div>
      )}

      <div className="p-4 sm:p-6">
        {children}
      </div>
    </div>
  );
};
