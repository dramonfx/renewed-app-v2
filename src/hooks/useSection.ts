
// src/hooks/useSection.ts
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { UseSectionReturn, SectionWithContent } from './types';

/**
 * Custom hook to fetch section data by slug
 */
export function useSection(slug: string | null): UseSectionReturn {
  const [data, setData] = useState<SectionWithContent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSection(): Promise<void> {
      if (!slug) {
        setError('No section slug provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data: section, error: sectionError } = await (supabase as any)
          .from('sections')
          .select('*')
          .eq('slug', slug)
          .single();

        if (sectionError) {
          throw new Error(sectionError.message);
        }

        if (!section) {
          throw new Error('Section not found');
        }

        // Fetch audio signed URL if audio file exists
        let audioUrl: string | null = null;
        if (section.audio_file_path) {
          const { data: audioData, error: audioError } = await supabase.storage
            .from('book-assets')
            .createSignedUrl(section.audio_file_path, 60 * 60);
          
          if (audioError) {
            console.error('Audio Signed URL Error:', audioError.message);
          } else if (audioData) {
            audioUrl = audioData.signedUrl;
          }
        }

        // Fetch markdown content if text file exists
        let markdownContent: string = 'Text content not available for this section.';
        if (section.text_file_path && section.text_file_path.endsWith('.md')) {
          const { data: blobData, error: mdFileDownloadError } = await supabase.storage
            .from('book-assets')
            .download(section.text_file_path);
          
          if (mdFileDownloadError) {
            console.error('Markdown File Download Error:', mdFileDownloadError.message);
            markdownContent = `Could not load text content. Error: ${mdFileDownloadError.message}`;
          } else if (blobData) {
            try {
              markdownContent = await blobData.text();
            } catch (e) {
              console.error('Markdown File Conversion Error:', e);
              markdownContent = 'Error processing text content.';
            }
          }
        } else if (section.text_file_path) {
          markdownContent = 'Content is not in Markdown format or path is incorrect.';
          console.warn("Text file is not a .md file, plain text rendering might occur or fail if expecting markdown.");
        }

        const sectionWithContent: SectionWithContent = {
          ...section,
          audioUrl,
          markdownContent,
          // Ensure all required BookSection properties are present
          audio_tracks: section.audio_tracks || [],
          estimated_reading_time: section.estimated_reading_time || 0,
          created_at: section.created_at || new Date().toISOString(),
          updated_at: section.updated_at || new Date().toISOString(),
        };

        setData(sectionWithContent);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        console.error('Error fetching section:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchSection();
  }, [slug]);

  return { data, loading, error };
}
