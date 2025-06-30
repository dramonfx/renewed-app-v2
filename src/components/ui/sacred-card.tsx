import React from 'react';
import { cn } from '../../lib/utils';

export interface SacredCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'minimal';
}

export const SacredCard = React.forwardRef<HTMLDivElement, SacredCardProps>(
  ({ className, children, variant = 'default', ...props }, ref) => {
    const baseClasses = "rounded-2xl border transition-all duration-300";
    
    const variantClasses = {
      default: "bg-white/10 backdrop-blur-md border-white/20 shadow-2xl hover:bg-white/15 hover:border-white/30",
      elevated: "bg-white/15 backdrop-blur-lg border-white/25 shadow-3xl hover:bg-white/20 hover:border-white/35",
      minimal: "bg-white/5 backdrop-blur-sm border-white/10 shadow-lg hover:bg-white/10 hover:border-white/20"
    };

    return (
      <div
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

SacredCard.displayName = "SacredCard";