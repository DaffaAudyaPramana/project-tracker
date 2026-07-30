import * as React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  showText?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, showText = false, ...props }, ref) => {
    const clampedValue = Math.min(100, Math.max(0, value));

    return (
      <div className="flex items-center gap-2 w-full">
        <div
          ref={ref}
          className={cn(
            'relative h-2.5 w-full overflow-hidden rounded-full bg-secondary',
            className
          )}
          {...props}
        >
          <div
            className={cn(
              'h-full w-full flex-1 transition-all duration-300',
              clampedValue === 100
                ? 'bg-emerald-500'
                : clampedValue > 40
                ? 'bg-blue-500'
                : 'bg-amber-500'
            )}
            style={{ transform: `translateX(-${100 - clampedValue}%)` }}
          />
        </div>
        {showText && (
          <span className="text-xs font-semibold w-10 text-right text-muted-foreground">
            {clampedValue}%
          </span>
        )}
      </div>
    );
  }
);
Progress.displayName = 'Progress';

export { Progress };
