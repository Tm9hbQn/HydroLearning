import React from 'react';
import { CardItem } from '../../types';
import { History, Star, Heart, Droplet, Thermometer } from 'lucide-react';
import clsx from 'clsx';

const iconMap: Record<string, any> = {
  history: History,
  star: Star,
  heart: Heart,
  droplet: Droplet,
  thermometer: Thermometer
};

interface InfoCardGridProps {
  columns: number;
  items: CardItem[];
}

export const InfoCardGrid: React.FC<InfoCardGridProps> = ({ columns, items }) => {
  return (
    <div className={clsx(
      "grid gap-4",
      columns === 2 ? "md:grid-cols-2" : "md:grid-cols-3"
    )} dir="rtl">
      {items.map((item, idx) => {
        const Icon = item.icon ? iconMap[item.icon] : null;
        const borderColor = item.borderColor || 'gray';

        return (
          <div key={idx} className={clsx(
            "bg-white p-6 rounded-2xl shadow-sm border border-slate-100",
            // We use dynamic styles for border color simulation via Tailwind classes is tricky without safelist,
            // so we will use inline style or map specific classes.
            // Let's map specific border classes as per the content we saw.
             borderColor === 'blue' && "border-r-4 border-r-blue-500",
             borderColor === 'green' && "border-r-4 border-r-green-500",
             borderColor === 'red' && "border-r-4 border-r-red-500",
             borderColor === 'yellow' && "border-r-4 border-r-yellow-500",
             borderColor === 'purple' && "border-r-4 border-r-purple-500",
          )}>
            <div className="flex items-center gap-2 mb-2">
              {Icon && <Icon className={clsx(
                 "w-5 h-5",
                 borderColor === 'blue' && "text-blue-500",
                 borderColor === 'green' && "text-green-500",
                 borderColor === 'red' && "text-red-500",
                 borderColor === 'yellow' && "text-yellow-500",
                 borderColor === 'purple' && "text-purple-500",
              )} />}
              <h4 className="font-bold text-slate-800">{item.title}</h4>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{item.content}</p>
          </div>
        );
      })}
    </div>
  );
};
