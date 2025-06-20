
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

/**
 * Custom hook to fetch audio tracks from sections with signed URLs
 * @param {boolean} fetchAll - Whether to fetch all sections or specific ones
 * @returns {Object} { data, loading, error }
 */
export function useAudioTracks(fetchAll = true) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAudioTracks() {
      try {
        setLoading(true);
        setError(null);

        const { data: sectionsData, error: sectionsError } = await supabase
          .from('sections')
          .select('id, title, slug, order, audio_file_path')
          .order('order', { ascending: true });

        if (sectionsError) {
          throw new Error(sectionsError.message);
        }

        let fetchedTracks = [];
        if (sectionsData) {
          for (const section of sectionsData) {
            if (section.audio_file_path) {
              const { data: signedUrlData, error: audioError } = await supabase.storage
                .from('book-assets')
                .createSignedUrl(section.audio_file_path, 60 * 60);
              
              if (audioError) {
                console.error(`Error creating signed URL for audio ${section.audio_file_path}:`, audioError.message);
                fetchedTracks.push({ 
                  id: section.id, 
                  title: section.title, 
                  slug: section.slug || String(section.id), 
                  audioUrl: null 
                });
              } else {
                fetchedTracks.push({ 
                  id: section.id, 
                  title: section.title, 
                  slug: section.slug || String(section.id), 
                  audioUrl: signedUrlData.signedUrl 
                });
              }
            } else {
              fetchedTracks.push({ 
                id: section.id, 
                title: section.title, 
                slug: section.slug || String(section.id), 
                audioUrl: null 
              });
            }
          }
        }

        setData(fetchedTracks);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching audio tracks:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAudioTracks();
  }, [fetchAll]);

  return { data, loading, error };
}
