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
    <div className={cn("bg-parchment-light/80 backdrop-blur-sm rounded-sm border border-ink overflow-hidden mb-8 shadow-none", className)}>
      <div className="bg-parchment-dark p-4 border-b border-ink flex items-center gap-3">
        {Icon && (
          <div className="p-2 border border-ink rounded-full text-ink bg-transparent">
            <Icon size={24} strokeWidth={1.5} />
          </div>
        )}
        <div className="flex-1">
          <h2 className="text-xl font-serif font-bold text-ink">{title}</h2>
          <p className="text-sm text-ink-light font-serif italic">{description}</p>
        </div>
      </div>

      {instructions && (
        <div className="bg-sanguine/5 px-4 py-2 border-b border-sanguine/20 flex items-start gap-2 text-sm text-sanguine font-serif">
          <Info size={16} className="mt-0.5 shrink-0 text-sanguine" />
          <p>{instructions}</p>
        </div>
      )}

      <div className="p-4 sm:p-6">
        {children}
      </div>
    </div>
  );
};
