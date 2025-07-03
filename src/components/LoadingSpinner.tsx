// src/components/LoadingSpinner.tsx
'use client';

import { LoadingSpinnerProps } from '@/types';

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

interface LoadingSpinnerComponentProps {
  size?: SpinnerSize;
  className?: string;
}

interface LoadingOverlayProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerComponentProps> = ({
  size = 'md',
  className = '',
}) => {
  const sizeClasses: Record<SpinnerSize, string> = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <div
      className={`inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite] ${sizeClasses[size]} ${className}`}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-3">
        <LoadingSpinner size="lg" className="text-brand-blue-medium" />
        <p className="text-brand-text-muted text-sm font-medium">{message}</p>
      </div>
    </div>
  );
};

// Export prop types
export type { LoadingSpinnerComponentProps, LoadingOverlayProps, SpinnerSize };
