// =============================================================================
// COMPREHENSIVE TYPE DEFINITIONS FOR RENEWED APPLICATION
// =============================================================================

// =============================================================================
// USER AND AUTHENTICATION TYPES
// =============================================================================

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name?: string;
  avatar_url?: string;
  spiritual_journey_stage?: 'seeker' | 'learner' | 'practitioner' | 'teacher';
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: any }>;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// =============================================================================
// AUDIO AND MEDIA TYPES
// =============================================================================

export interface AudioTrack {
  id: string;
  title: string;
  url: string;
  duration: number;
  section_id: string;
  order_index: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface AudioPlayerState {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLoading: boolean;
  error: string | null;
}

export interface PlaylistItem {
  id: string;
  track: AudioTrack;
  played: boolean;
  bookmarked: boolean;
}

export interface AudioContextType {
  state: AudioPlayerState;
  playTrack: (track: AudioTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  nextTrack: () => void;
  previousTrack: () => void;
}

// =============================================================================
// JOURNAL AND MINDSET TYPES
// =============================================================================

export type MindsetType = 'natural' | 'transition' | 'spiritual';

export interface JournalEntry {
  id: string;
  user_id: string;
  title?: string;
  content: string;
  mindset: MindsetType;
  tags: string[];
  reflection_type: string;
  created_at: string;
  updated_at: string;
}

// =============================================================================
// DEEP REFLECTION TYPES
// =============================================================================

export interface DeepReflection {
  id: string;
  user_id: string;
  section_id: string;
  section_title: string;
  audio_title?: string;
  audio_timestamp: number;
  answer_text: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  formatted_timestamp?: string;
}

export interface CreateDeepReflectionRequest {
  section_id: string;
  section_title: string;
  audio_title?: string;
  audio_timestamp: number;
  answer_text: string;
  tags?: string[];
}

export interface DeepReflectionStats {
  total_reflections: number;
  reflections_this_week: number;
  reflections_this_month: number;
  sections_with_reflections: number;
  average_reflection_length: number;
  first_reflection?: string;
  latest_reflection?: string;
}

export interface JournalStats {
  totalEntries: number;
  naturalMindEntries: number;
  transitionEntries: number;
  spiritualMindEntries: number;
  averageEntriesPerWeek: number;
  currentStreak: number;
  longestStreak: number;
}

export interface ReflectionType {
  id: string;
  name: string;
  description: string;
  prompt: string;
  color: string;
}

// =============================================================================
// CONTENT AND BOOK TYPES
// =============================================================================

export interface BookSection {
  id: string;
  title: string;
  slug: string;
  content: string;
  description?: string;
  order: number;
  category?: string;
  sectionType?: string;
  principleNumber?: number;
  scriptureReferences?: string[];
  audioUrl?: string | null;
  audioTitle?: string;
  audioDuration?: number;
  readingTime?: number;
  isPublished?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSectionData {
  slug: string;
  title: string;
  description?: string;
  content: string;
  order?: number;
  category?: string;
  sectionType?: string;
  principleNumber?: number;
  scriptureReferences?: string[];
  audioUrl?: string;
  audioTitle?: string;
  audioDuration?: number;
  readingTime?: number;
  isPublished?: boolean;
}

export interface UpdateSectionData extends Partial<CreateSectionData> {
  id: string;
}

export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  author: string;
  cover_image_url?: string;
  sections: BookSection[];
  total_chapters: number;
  created_at: string;
  updated_at: string;
}

export interface ReadingProgress {
  id: string;
  user_id: string;
  section_id: string;
  progress_percentage: number;
  last_position: number;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

// =============================================================================
// ONBOARDING AND ASSESSMENT TYPES
// =============================================================================

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: string;
  order_index: number;
  required: boolean;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'scale' | 'text' | 'boolean';
  options?: string[];
  required: boolean;
}

export interface AssessmentResponse {
  question_id: string;
  response: string | number | boolean;
}

export interface UserAssessment {
  id: string;
  user_id: string;
  responses: AssessmentResponse[];
  spiritual_profile: string;
  recommendations: string[];
  completed_at: string;
}

export interface SpiritualIntention {
  id: string;
  title: string;
  description: string;
  category: 'growth' | 'healing' | 'understanding' | 'practice';
}

// =============================================================================
// COMPONENT PROP INTERFACES
// =============================================================================

export interface AudioPlayerProps {
  track?: AudioTrack;
  autoPlay?: boolean;
  showControls?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  className?: string;
}

export interface JournalEditorProps {
  entry?: JournalEntry;
  onSave: (entry: Partial<JournalEntry>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  className?: string;
}

export interface MindsetSelectorProps {
  value: MindsetType;
  onChange: (mindset: MindsetType) => void;
  disabled?: boolean;
  className?: string;
}

export interface MindsetBadgeProps {
  mindset: MindsetType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface SacredButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error }>;
}

// =============================================================================
// HOOK RETURN TYPES
// =============================================================================

export interface UseAudioPlayerReturn {
  state: AudioPlayerState;
  play: (track?: AudioTrack) => void;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  togglePlayPause: () => void;
}

export interface UseLoginReturn {
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

export interface UseSectionReturn {
  section: BookSection | null;
  loading: boolean;
  error: string | null;
  updateProgress: (progress: number) => Promise<void>;
  markComplete: () => Promise<void>;
}

export interface UseDeepReflectionReturn {
  reflections: DeepReflection[];
  loading: boolean;
  error: string | null;
  createReflection: (data: CreateDeepReflectionRequest) => Promise<{ success: boolean; error?: string }>;
  deleteReflection: (id: string) => Promise<{ success: boolean; error?: string }>;
  getReflectionsBySection: (sectionId: string) => Promise<DeepReflection[]>;
  hasReflections: boolean;
  stats: DeepReflectionStats | null;
  refreshReflections: () => Promise<void>;
}

// =============================================================================
// API REQUEST/RESPONSE TYPES
// =============================================================================

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

export interface CreateJournalEntryRequest {
  title?: string;
  content: string;
  mindset: MindsetType;
  tags?: string[];
  reflection_type: string;
}

export interface UpdateJournalEntryRequest extends Partial<CreateJournalEntryRequest> {
  id: string;
}

export interface JournalEntriesResponse {
  entries: JournalEntry[];
  total: number;
  page: number;
  limit: number;
}

export interface AudioTracksResponse {
  tracks: AudioTrack[];
  total: number;
}

export interface SectionsResponse {
  data?: BookSection[];
  error?: string;
  success: boolean;
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// =============================================================================
// NEXT.JS SPECIFIC TYPES
// =============================================================================

export interface PageParams {
  params: { [key: string]: string | string[] };
  searchParams: { [key: string]: string | string[] | undefined };
}

export interface ApiRouteParams {
  params: { [key: string]: string };
}

// =============================================================================
// ERROR TYPES
// =============================================================================

export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
  context?: Record<string, any>;
}

export interface FormValidationError {
  field: string;
  message: string;
}

// =============================================================================
// ENVIRONMENT AND CONFIGURATION TYPES
// =============================================================================

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export interface AppConfig {
  supabase: SupabaseConfig;
  environment: 'development' | 'staging' | 'production';
  features: {
    journaling: boolean;
    audioPlayer: boolean;
    onboarding: boolean;
  };
}
