// @ts-nocheck
import { supabase } from './supabaseClient';
import type { BookSection, CreateSectionData, UpdateSectionData, ExerciseTemplate } from './types';

// Mock data for development/testing when Supabase is not available
// Updated to match the authentic RENEWED content structure
const mockSections: BookSection[] = [
  {
    id: '1',
    slug: 'prologue',
    title: 'Prologue',
    description:
      'The foundational introduction to discovering your spiritual identity through The New Man Story.',
    content: `The straightforward yet insightful exercise template contained in this guidebook has been refined over many years with one clear objective: to help individuals navigate through spiritual principles that unlock the understanding of their spiritual identity.`,
    order: 1,
    category: 'prologue',
    sectionType: 'intro',
    scriptureReferences: ['2 Corinthians 5:17', 'Galatians 6:8'],
    readingTime: 3,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function getAllSections(): Promise<BookSection[]> {
  try {
    const { data, error } = await supabase
      .from('book_sections')
      .select('*')
      .eq('is_published', true)
      .order('order', { ascending: true });

    if (error) {
      console.error('Supabase error, falling back to mock data:', error);
      return mockSections;
    }

    return data.map((section) => ({
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
      updatedAt: section.updated_at,
    }));
  } catch (error) {
    console.error('Database connection error, using mock data:', error);
    return mockSections;
  }
}

export async function getSectionBySlug(slug: string): Promise<BookSection | null> {
  try {
    const { data, error } = await supabase
      .from('book_sections')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error) {
      const mockSection = mockSections.find((s) => s.slug === slug);
      return mockSection || null;
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
      updatedAt: data.updated_at,
    };
  } catch (error) {
    const mockSection = mockSections.find((s) => s.slug === slug);
    return mockSection || null;
  }
}

export async function createSection(data: CreateSectionData): Promise<BookSection | null> {
  try {
    const newSection = {
      slug: data.slug,
      title: data.title,
      description: data.description || '',
      content: data.content,
      order: data.order || 999,
      category: data.category || 'general',
      section_type: data.sectionType || 'content',
      principle_number: data.principleNumber,
      scripture_references: data.scriptureReferences || [],
      audio_url: data.audioUrl,
      audio_title: data.audioTitle,
      audio_duration: data.audioDuration,
      reading_time: data.readingTime || 5,
      is_published: data.isPublished ?? true,
    };

    const { data: result, error } = await supabase
      .from('book_sections')
      .insert(newSection)
      .select()
      .single();

    if (error) {
      console.error('Error creating section:', error);
      return null;
    }

    return {
      id: result.id,
      slug: result.slug,
      title: result.title,
      description: result.description,
      content: result.content,
      order: result.order,
      category: result.category,
      sectionType: result.section_type,
      principleNumber: result.principle_number,
      scriptureReferences: result.scripture_references || [],
      audioUrl: result.audio_url,
      audioTitle: result.audio_title,
      audioDuration: result.audio_duration,
      readingTime: result.reading_time,
      isPublished: result.is_published,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    };
  } catch (error) {
    console.error('Database connection error creating section:', error);
    return null;
  }
}

// ContentService object for API consistency
export const ContentService = {
  getAllSections,
  getSectionBySlug,
  createSection,
};

export { supabase };
