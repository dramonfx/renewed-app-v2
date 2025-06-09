
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

/**
 * Custom hook to fetch section data by slug
 * @param {string} slug - The section slug to fetch
 * @returns {Object} { data, loading, error }
 */
export function useSection(slug) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSection() {
      if (!slug) {
        setError('No section slug provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data: section, error: sectionError } = await supabase
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
        let audioUrl = null;
        if (section.audio_file_path) {
          const { data: audioData, error: audioError } = await supabase.storage
            .from('book-assets')
            .createSignedUrl(section.audio_file_path, 60 * 60);
          
          if (audioError) {
            console.error('Audio Signed URL Error:', audioError.message);
          } else {
            audioUrl = audioData.signedUrl;
          }
        }

        // Fetch markdown content if text file exists
        let markdownContent = 'Text content not available for this section.';
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

        setData({
          ...section,
          audioUrl,
          markdownContent
        });
      } catch (err) {
        setError(err.message);
        console.error('Error fetching section:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchSection();
  }, [slug]);

  return { data, loading, error };
}
