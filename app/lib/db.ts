import { supabase } from './supabase'
import type { BookSection, CreateSectionData, UpdateSectionData, ExerciseTemplate } from './types'

// Mock data for development/testing when Supabase is not available
// Updated to match the authentic RENEWED content structure
const mockSections: BookSection[] = [
  {
    id: '1',
    slug: 'prologue',
    title: 'Prologue',
    description: 'The foundational introduction to discovering your spiritual identity through The New Man Story.',
    content: `The straightforward yet insightful exercise template contained in this guidebook has been refined over many years with one clear objective: to help individuals navigate through spiritual principles that unlock the understanding of their spiritual identity. Through iterations and refinements, this template has evolved to its current form, offering a structured approach to unveil the spiritual truths that enable us to tell "The New Man Story."

"Therefore, if anyone is in Christ, he is a new creation. The old has passed away; behold, the new has come." — 2 Corinthians 5:17

This guidebook is more than just a simple read. As you work through the template, you'll have the opportunity to record the principles you discover, allowing the narrative of your renewed self to unfold.`,
    order: 1,
    category: 'prologue',
    sectionType: 'intro',
    scriptureReferences: ['2 Corinthians 5:17', 'Galatians 6:8', 'Romans 12:2', 'Matthew 6:10'],
    readingTime: 3,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '0',
    slug: '00_prologue',
    title: 'Prologue',
    description: 'The foundational introduction to discovering your spiritual identity through The New Man Story.',
    content: `The straightforward yet insightful exercise template contained in this guidebook has been refined over many years with one clear objective: to help individuals navigate through spiritual principles that unlock the understanding of their spiritual identity. Through iterations and refinements, this template has evolved to its current form, offering a structured approach to unveil the spiritual truths that enable us to tell "The New Man Story."

"Therefore, if anyone is in Christ, he is a new creation. The old has passed away; behold, the new has come." — 2 Corinthians 5:17

This guidebook is more than just a simple read. As you work through the template, you'll have the opportunity to record the principles you discover, allowing the narrative of your renewed self to unfold.`,
    order: 0,
    category: 'prologue',
    sectionType: 'intro',
    scriptureReferences: ['2 Corinthians 5:17', 'Galatians 6:8', 'Romans 12:2', 'Matthew 6:10'],
    readingTime: 3,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    slug: 'principle-1-the-fruit',
    title: 'The Fruit',
    description: 'Understanding how our internal spiritual state manifests as external fruit in our lives.',
    content: `Every tree is known by its fruit. In the spiritual realm, the fruit we bear in our lives directly reflects the kingdom from which we are operating. This principle is foundational to understanding spiritual transformation.

When we operate from the Kingdom of God/Heaven, we naturally produce the fruit of the Spirit: love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, and self-control.

"'Either make the tree good and its fruit good, or make the tree bad and its fruit bad, for the tree is known by its fruit.'" — Matthew 12:33`,
    order: 2,
    category: 'principles',
    sectionType: 'principle',
    principleNumber: 1,
    scriptureReferences: ['Matthew 12:33', 'Galatians 5:22-23', 'Matthew 7:16-20'],
    readingTime: 6,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    slug: 'principle-2-can-a-dead-man-tell-his-story',
    title: 'Can a Dead Man Tell His Story?',
    description: 'Exploring the concept of spiritual death and resurrection in our daily experience.',
    content: `This provocative question strikes at the heart of spiritual identity. In the natural realm, a dead man cannot tell his story. But in the spiritual realm, we are called to die to our old nature so that Christ might live through us.

"I have been crucified with Christ. It is no longer I who live, but Christ who lives in me. And the life I now live in the flesh I live by faith in the son of God, who loved me and gave himself for me." — Galatians 2:20

The question becomes: Which man is telling your story today? The dead man of the old nature, or the living Christ expressing through your renewed mind?`,
    order: 3,
    category: 'principles',
    sectionType: 'principle',
    principleNumber: 2,
    scriptureReferences: ['Galatians 2:20', 'Romans 6:6', '2 Corinthians 5:17'],
    readingTime: 5,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    slug: 'kingdoms-who-is-on-first',
    title: 'Kingdoms: Who\'s On First: Natural or Spiritual?',
    description: 'Introducing the fundamental Two Kingdoms Framework that forms the foundation of spiritual transformation.',
    content: `The exercise template contrasts two kingdoms:

**Kingdom of God/Heaven** (Right Column):
The kingdom where we aspire to be, guided by the principles we uncover. The primary list consists of the nine characteristic traits of the fruit of the Spirit found in Galatians 5:22-23:
- Love, Joy, Peace, Patience, Kindness, Goodness, Faithfulness, Gentleness, Self-Control

**Kingdom of ?** (Left Column):
This represents the kingdom where many find themselves operating, often without realizing it.

"But it is not the spiritual that is first but the natural, and then the spiritual." — 1 Corinthians 15:46`,
    order: 4,
    category: 'foundations',
    sectionType: 'exercise',
    scriptureReferences: ['1 Corinthians 15:46', 'Galatians 5:22-23'],
    readingTime: 5,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// Check if we're in a testing/demo environment
const isTestingMode = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('demo') || 
                     process.env.NODE_ENV === 'development'

export async function getAllSections(): Promise<BookSection[]> {
  if (isTestingMode) {
    return mockSections.filter(section => section.isPublished)
      .sort((a, b) => a.order - b.order)
  }

  try {
    const { data, error } = await supabase
      .from('book_sections')
      .select('*')
      .eq('is_published', true)
      .order('order', { ascending: true })

    if (error) {
      console.error('Supabase error, falling back to mock data:', error)
      return mockSections.filter(section => section.isPublished)
        .sort((a, b) => a.order - b.order)
    }

    // Transform the data to match our interface
    return data.map(section => ({
      id: section.id,
      slug: section.slug,
      title: section.title,
      description: section.description,
      content: section.content,
      order: section.order,
      category: section.category,
      sectionType: section.section_type,
      principleNumber: section.principle_number,
      scriptureReferences: section.scripture_references || [],
      audioUrl: section.audio_url,
      audioTitle: section.audio_title,
      audioDuration: section.audio_duration,
      readingTime: section.reading_time,
      isPublished: section.is_published,
      createdAt: section.created_at,
      updatedAt: section.updated_at
    }))
  } catch (error) {
    console.error('Database connection error, using mock data:', error)
    return mockSections.filter(section => section.isPublished)
      .sort((a, b) => a.order - b.order)
  }
}

export async function getSectionBySlug(slug: string): Promise<BookSection | null> {
  if (isTestingMode) {
    return mockSections.find(section => 
      section.slug === slug && section.isPublished
    ) || null
  }

  try {
    const { data, error } = await supabase
      .from('book_sections')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()

    if (error) {
      console.error('Supabase error, falling back to mock data:', error)
      const mockSection = mockSections.find(s => s.slug === slug)
      return mockSection || null
    }

    return {
      id: data.id,
      slug: data.slug,
      title: data.title,
      description: data.description,
      content: data.content,
      order: data.order,
      category: data.category,
      sectionType: data.section_type,
      principleNumber: data.principle_number,
      scriptureReferences: data.scripture_references || [],
      audioUrl: data.audio_url,
      audioTitle: data.audio_title,
      audioDuration: data.audio_duration,
      readingTime: data.reading_time,
      isPublished: data.is_published,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }
  } catch (error) {
    console.error('Database connection error, using mock data:', error)
    const mockSection = mockSections.find(s => s.slug === slug)
    return mockSection || null
  }
}

export async function getPrinciplesByCategory(category: string): Promise<BookSection[]> {
  if (isTestingMode) {
    return mockSections.filter(s => s.category === category && s.isPublished)
      .sort((a, b) => a.order - b.order)
  }

  try {
    const { data, error } = await supabase
      .from('book_sections')
      .select('*')
      .eq('category', category)
      .eq('is_published', true)
      .order('order', { ascending: true })

    if (error) {
      console.error('Supabase error, falling back to mock data:', error)
      return mockSections.filter(s => s.category === category && s.isPublished)
        .sort((a, b) => a.order - b.order)
    }

    return data.map(section => ({
      id: section.id,
      slug: section.slug,
      title: section.title,
      description: section.description,
      content: section.content,
      order: section.order,
      category: section.category,
      sectionType: section.section_type,
      principleNumber: section.principle_number,
      scriptureReferences: section.scripture_references || [],
      audioUrl: section.audio_url,
      audioTitle: section.audio_title,
      audioDuration: section.audio_duration,
      readingTime: section.reading_time,
      isPublished: section.is_published,
      createdAt: section.created_at,
      updatedAt: data.updated_at
    }))
  } catch (error) {
    console.error('Database connection error, using mock data:', error)
    return mockSections.filter(s => s.category === category && s.isPublished)
      .sort((a, b) => a.order - b.order)
  }
}

export async function getExerciseTemplate(sectionId: string): Promise<ExerciseTemplate | null> {
  try {
    const { data, error } = await supabase
      .from('exercise_templates')
      .select('*')
      .eq('section_id', sectionId)
      .single()

    if (error) {
      console.error('Error fetching exercise template:', error)
      return null
    }

    return {
      id: data.id,
      sectionId: data.section_id,
      kingdomOfGod: data.kingdom_of_god || [],
      kingdomOfWorld: data.kingdom_of_world || [],
      scriptureReference: data.scripture_reference,
      instructions: data.instructions,
      reflectionQuestions: data.reflection_questions || []
    }
  } catch (error) {
    console.error('Error fetching exercise template:', error)
    return null
  }
}

export async function createSection(sectionData: CreateSectionData): Promise<BookSection | null> {
  try {
    const { data, error } = await supabase
      .from('book_sections')
      .insert({
        slug: sectionData.slug,
        title: sectionData.title,
        description: sectionData.description,
        content: sectionData.content,
        order: sectionData.order,
        category: sectionData.category,
        section_type: sectionData.sectionType,
        principle_number: sectionData.principleNumber,
        scripture_references: sectionData.scriptureReferences,
        audio_url: sectionData.audioUrl,
        audio_title: sectionData.audioTitle,
        audio_duration: sectionData.audioDuration,
        reading_time: sectionData.readingTime,
        is_published: sectionData.isPublished ?? true
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating section:', error)
      return null
    }

    return {
      id: data.id,
      slug: data.slug,
      title: data.title,
      description: data.description,
      content: data.content,
      order: data.order,
      category: data.category,
      sectionType: data.section_type,
      principleNumber: data.principle_number,
      scriptureReferences: data.scripture_references || [],
      audioUrl: data.audio_url,
      audioTitle: data.audio_title,
      audioDuration: data.audio_duration,
      readingTime: data.reading_time,
      isPublished: data.is_published,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }
  } catch (error) {
    console.error('Error creating section:', error)
    return null
  }
}

// Legacy compatibility - export class for existing code
export class ContentService {
  static getAllSections = getAllSections
  static getSectionBySlug = getSectionBySlug
  static createSection = createSection
}

export { supabase }