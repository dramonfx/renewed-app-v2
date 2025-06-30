export type CardVariant = 'glass' | 'enhanced' | 'heavy' | 'solid';

export interface SacredCardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  [key: string]: any;
}

export interface SacredButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  [key: string]: any;
}

export interface OnboardingData {
  selectedMind?: string;
  assessmentAnswers?: Record<string, any>;
  selectedPath?: string;
  intentions?: string[];
  [key: string]: any;
}

export interface OnboardingStepProps {
  onNext: (data?: any) => void;
  onBack?: () => void;
  data?: OnboardingData;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'scale' | 'choice' | 'text';
  options?: string[];
  scaleRange?: [number, number];
  scaleLabels?: [string, string];
}

export interface SpiritualPath {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  features: string[];
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface SacredIntention {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'peace' | 'growth' | 'purpose' | 'healing' | 'wisdom' | 'love';
}
