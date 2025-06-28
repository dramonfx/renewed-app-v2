
// Core Book Content Types - Aligned with "RENEWED: The New Man Story"
export interface BookSection {
  id: string
  slug: string
  title: string
  description: string
  content: string
  order: number
  category: 'prologue' | 'introduction' | 'foundations' | 'principles' | 'conclusion'
  sectionType: 'intro' | 'principle' | 'exercise' | 'teaching'
  principleNumber?: number // For the 30 Key Principles (1-30)
  scriptureReferences: string[]
  exerciseTemplate?: ExerciseTemplate
  audioUrl?: string
  audioTitle?: string
  audioDuration?: number
  readingTime?: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

// Two Kingdoms Framework - Core to the teaching
export interface ExerciseTemplate {
  id: string
  sectionId: string
  kingdomOfGod: string[] // Kingdom of God/Heaven principles
  kingdomOfWorld: string[] // Kingdom of ? principles
  scriptureReference: string
  instructions: string
  reflectionQuestions: string[]
}

// The 30 Key Principles Structure
export interface KeyPrinciple {
  id: string
  number: number // 1-30
  title: string
  slug: string
  description: string
  content: string
  scriptureReferences: string[]
  exerciseTemplate: ExerciseTemplate
  audioUrl?: string
  isPublished: boolean
}

export interface CreateSectionData {
  slug: string
  title: string
  description: string
  content: string
  order: number
  category: 'prologue' | 'introduction' | 'foundations' | 'principles' | 'conclusion'
  sectionType: 'intro' | 'principle' | 'exercise' | 'teaching'
  principleNumber?: number
  scriptureReferences: string[]
  exerciseTemplate?: Omit<ExerciseTemplate, 'id' | 'sectionId'>
  audioUrl?: string
  audioTitle?: string
  audioDuration?: number
  readingTime?: number
  isPublished?: boolean
}

export interface UpdateSectionData extends Partial<CreateSectionData> {
  id: string
}

// API Response Types
export interface ApiResponse<T> {
  data?: T
  error?: string
  success: boolean
}

export interface SectionsResponse extends ApiResponse<BookSection[]> {}
export interface SectionResponse extends ApiResponse<BookSection> {}
export interface PrinciplesResponse extends ApiResponse<KeyPrinciple[]> {}

// Audio Player Types
export interface AudioTrack {
  id: string
  title: string
  url: string
  duration?: number
  sectionId: string
}

export interface AudioPlayerState {
  isPlaying: boolean
  currentTrack?: AudioTrack
  currentTime: number
  duration: number
  volume: number
}

// Content Categories - Aligned with book structure
export const CONTENT_CATEGORIES = [
  'prologue',
  'introduction', 
  'foundations',
  'principles',
  'conclusion'
] as const

export type ContentCategory = typeof CONTENT_CATEGORIES[number]

export const SECTION_TYPES = [
  'intro',
  'principle', 
  'exercise',
  'teaching'
] as const

export type SectionType = typeof SECTION_TYPES[number]

// Two Kingdoms Framework - Core spiritual concepts
export const KINGDOM_OF_GOD_TRAITS = [
  'Love',
  'Joy', 
  'Peace',
  'Patience',
  'Kindness',
  'Goodness',
  'Faithfulness',
  'Gentleness',
  'Self-Control',
  'Power (from God)',
  'Tree of Life'
] as const

export const KINGDOM_OF_WORLD_TRAITS = [
  'Fear',
  'Condemnation',
  'Anxious',
  'Tree of Knowledge of Good and Evil',
  'Death',
  'Natural',
] as const

// Journey Progress Types
export interface UserProgress {
  userId: string
  sectionId: string
  isCompleted: boolean
  lastAccessedAt: string
  timeSpent: number
  exerciseCompleted?: boolean
  reflectionNotes?: string
}
