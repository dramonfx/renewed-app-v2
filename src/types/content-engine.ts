export interface ContentEngineItem {
  id: string;
  principle_number: number;
  title: string;
  content: string;
  section: string;
  kingdom: 'light' | 'darkness';
  order_index: number;
  audio_url?: string;
  visual_elements?: Record<string, any>;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  principle_number: number;
  completed: boolean;
  completion_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ContentSection {
  name: string;
  title: string;
  description: string;
  principles: ContentEngineItem[];
}

export interface TwoKingdomsFramework {
  light: ContentEngineItem[];
  darkness: ContentEngineItem[];
}

export type ContentEngineSection = 'foundations' | 'identity' | 'purpose' | 'relationships' | 'victory';

export interface ContentEngineStats {
  totalPrinciples: number;
  completedPrinciples: number;
  progressPercentage: number;
  currentSection: ContentEngineSection;
  nextPrinciple?: ContentEngineItem;
}