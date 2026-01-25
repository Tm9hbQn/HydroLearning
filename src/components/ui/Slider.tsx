import React from 'react';
import { cn } from '../../lib/utils';

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  vertical?: boolean;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, vertical = false, ...props }, ref) => {
    return (
      <input
        type="range"
        ref={ref}
        className={cn(
          "appearance-none bg-slate-200 rounded-full cursor-pointer accent-blue-600 opacity-80 hover:opacity-100 transition-opacity",
          vertical ? "h-full w-2" : "w-full h-2",
          className
        )}
        style={vertical ? {
          writingMode: 'vertical-lr',
          direction: 'rtl',
          WebkitAppearance: 'slider-vertical'
        } : undefined}
        {...props}
      />
    );
  }
);

Slider.displayName = 'Slider';
