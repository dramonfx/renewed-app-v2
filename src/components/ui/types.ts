// src/components/ui/types.ts
import { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, HTMLAttributes } from 'react';

// SacredButton types
export type ButtonVariant = 'primary' | 'gold' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface SacredButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

// SacredCard types
export type CardVariant = 'glass' | 'heavy' | 'solid';

export interface SacredCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: CardVariant;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

// SacredInput types
export interface SacredInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  type?: string;
  className?: string;
  showPasswordToggle?: boolean;
}
