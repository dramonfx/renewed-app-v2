
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { mockSections } from '@/lib/mockData';

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
    // Simplified approach: return hardcoded working data for development
    async function fetchAudioTracks() {
      try {
        setLoading(true);
        setError(null);

        // Check if we're using mock data (development mode)
        const isUsingMockData = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        if (isUsingMockData) {
          // Use hardcoded working data for development
          const workingAudioUrl = "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//OEZAAAAAGkAAAAAAAAA0gAAAAATEFN//OEZAMAAAGkAAAAAAAAA0gAAAAARTMu//OEZAYAAAGkAAAAAAAAA0gAAAAAOTku//OEZAkAAAGkAAAAAAAAA0gAAAAANVVV";
          
          const mockTracks = Object.values(mockSections)
            .sort((a, b) => a.order - b.order)
            .map(section => ({
              id: section.id,
              title: section.title,
              slug: section.slug || String(section.id),
              audioUrl: workingAudioUrl
            }));

          setData(mockTracks);
        } else {
          // Use real Supabase for production
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
        }
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
