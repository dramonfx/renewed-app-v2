'use client';
import React, { forwardRef } from 'react';

interface SacredInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  multiline?: boolean;
  error?: boolean;
  label?: string;
}

// Simple className utility function
const cn = (...classes: (string | object | undefined)[]) => {
  return classes
    .filter(Boolean)
    .map(cls => {
      if (typeof cls === 'object' && cls !== null) {
        return Object.entries(cls)
          .filter(([_, value]) => Boolean(value))
          .map(([key]) => key)
          .join(' ');
      }
      return cls;
    })
    .join(' ');
};

const SacredInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, SacredInputProps>(
  ({ className, multiline = false, error = false, label, ...props }, ref) => {
    const Component = multiline ? 'textarea' : 'input';
    
    return (
      <div className="w-full">
        {label && (
          <label className="sacred-label">
            {label}
          </label>
        )}
        <Component
          ref={ref as any}
          className={cn(
            'sacred-input',
            {
              'error': error,
              'min-h-[80px] resize-none': multiline,
            },
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

SacredInput.displayName = 'SacredInput';

export default SacredInput;