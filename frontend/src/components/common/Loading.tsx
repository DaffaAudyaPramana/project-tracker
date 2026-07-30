import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Loader2 className={`animate-spin text-primary ${sizeClasses[size]}`} />
      {text && <p className="mt-2 text-sm text-muted-foreground font-medium">{text}</p>}
    </div>
  );
};

export const PageLoader: React.FC = () => {
  return (
    <div className="flex min-h-[400px] w-full items-center justify-center">
      <LoadingSpinner size="lg" text="Loading content..." />
    </div>
  );
};
