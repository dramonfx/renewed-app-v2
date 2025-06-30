export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface SacredComponentProps extends BaseComponentProps {
  variant?: 'default' | 'elevated' | 'minimal';
}